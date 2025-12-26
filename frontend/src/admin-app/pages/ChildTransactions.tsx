import React from "react";
import { CustomLink } from "../../pages/_layout/elements/custom-link";
import { useNavigate, useParams } from "react-router-dom";
import TopBackHeader from "./TopBackHeader";
import { useAppSelector } from "../../redux/hooks";
import { selectUserData } from "../../redux/actions/login/loginSlice";
import betService from "../../services/bet.service";
import { AxiosResponse } from "axios";
import e from "express";

interface LedgerEntry {
  settled: any;
  ChildId: string;
  username: string;
  commissionlega: number;
  commissiondega: number;
  money: number;
  narration: string;
  cname: string;
  _id: string;
}

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
}

const ChildTransactions = () => {
  const userState = useAppSelector(selectUserData);
    const [loading, setLoading] = React.useState(false);
  

  const [showModal, setShowModal] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<GroupedEntry | null>(
    null
  );
  const [inputAmount, setInputAmount] = React.useState<number>(0);
  const [remark, setRemark] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<string>("");

  const [modalTypeF, setModalTypeF] = React.useState(""); // All / Payment Diya / Payment Liya

  const [lena, setLena] = React.useState<GroupedEntry[]>([]);
  const [dena, setDena] = React.useState<GroupedEntry[]>([]);

  const [listData, setListData] = React.useState<any[]>([]);

  const lenaTotals = lena.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.settled += item.settled;
      acc.final += item.final;
      return acc;
    },
    { amount: 0, settled: 0, final: 0 }
  );

  const denaTotals = dena.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.settled += item.settled;
      acc.final += item.final;
      return acc;
    },
    { amount: 0, settled: 0, final: 0 }
  );

  const processLedgerData = (
    data: LedgerEntry[][]
  ): { lenaArray: GroupedEntry[]; denaArray: GroupedEntry[] } => {
    // userState.user.role === "admin"

    // const flatData = [...(data[0] || []), ...(data[1] || [])]; //old wala hai

    // const flatData = [...(data[0] || []), ...(data[0] || [])]; // ye naye wala hai for other than superadmin

    const flatData =
      userState.user.role === "admin"
        ? data[0] // for admin
        : data[0]; // for others

    const settledMap: Record<string, number> = {};
    flatData.forEach((entry: any) => {
      if (entry.settled) {
        if (!settledMap[entry.ChildId]) settledMap[entry.ChildId] = 0;
        settledMap[entry.ChildId] += entry.money;
      }
    });

    const activeMap: Record<
      string,
      { username: string; positive: number; negative: number }
    > = {};
    flatData.forEach((entry: any) => {
      if (!entry.settled) {
        const id = entry.ChildId;
        const username = entry.username + " (" + entry.cname + ")";

        // Compute money based on role
        // const money = userState.user.role === "dl" ? entry.money - entry.commissiondega : entry.money;

        const commission =
          userState.user.role === "dl" ? entry.commissiondega : 0;
        const money = entry.money - commission;

        // const money =  entry.money + entry.commissiondega ;

        if (!activeMap[id]) {
          activeMap[id] = { username, positive: 0, negative: 0 };
        }

        if (money > 0) {
          activeMap[id].positive += Math.abs(money);
        } else {
          activeMap[id].negative += Math.abs(money);
        }
      }
    });

    const lenaArray: GroupedEntry[] = [];
    const denaArray: GroupedEntry[] = [];

    Object.entries(activeMap).forEach(
      ([ChildId, { username, positive, negative }]) => {
        const rawAmount = positive - negative;
        console.log(positive, negative, rawAmount, username);
        const settledAmount = settledMap[ChildId] || 0;
        // const netFinal = Math.max(0, Math.abs(rawAmount  + settledAmount));
        const netFinal = rawAmount + settledAmount;

        console.log(netFinal, settledAmount, "GHJK", username);
        const baseData = {
          agent: username,
          amount: rawAmount,
          settled: settledAmount,
          final: netFinal,
          ChildId,
        };

        console.log(rawAmount - settledAmount, "raww amountt");

        if (netFinal >= 0) {
          lenaArray.push(baseData);
        } else {
          denaArray.push(baseData);
        }
      }
    );

    return { lenaArray, denaArray };
  };

  const [selectedClient, setSelectedClient] = React.useState<any>();

  const [selectedClientList, setSelectedClientList] = React.useState<any>();
  const [hasDefaultSet, setHasDefaultSet] = React.useState(false); // NEW FLAG

  const [selectedClientListFiltered, setSelectedClientListFiltered] =
   React.useState<any>();

  const ctid = useParams().id;

  const sendId = useParams().pid;

  React.useEffect(() => {
    setLoading(true); 
    betService
      .pponeledger(sendId)
      .then((res: AxiosResponse<{ data: LedgerEntry[][] }>) => {
        setListData(res?.data?.data[0]);
        const { lenaArray, denaArray } = processLedgerData(res?.data?.data);
        setLena(lenaArray);
        setDena(denaArray);
      }).catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // 👈 stop loading
      });
  }, [userState, ctid, sendId]);

  const combined = [...lena, ...dena];

  // 🔥 Yeh effect ab data load hone ke baad trigger hoga
  React.useEffect(() => {
    if (!ctid || combined.length === 0 || listData.length === 0) return;

    // ✅ sirf tabhi default set karo jab user ne khud select nahi kiya ho
    if (!hasDefaultSet) {
      const defaultClient = combined?.find((item) => item.ChildId === ctid);
      const defaultList = listData?.filter((item) => item.ChildId === ctid);

      setSelectedClient(defaultClient);
      setSelectedClientList(defaultList);
      setSelectedClientListFiltered(defaultList);
      setHasDefaultSet(true); // ab dobara set nahi hoga
    }
  }, [ctid, combined, listData, sendId]);

  console.log("Combined Data:", combined);

  console.log("Matched Data:", selectedClient);

  const handleSelectChange = (e: any) => {
    const selectedId = e.target.value;
    const newClient = combined?.find((item) => item.ChildId === selectedId);
    setSelectedClient(newClient);

    const newClientList = listData?.filter(
      (item) => item.ChildId === selectedId
    );
    setSelectedClientList(newClientList);
    setSelectedClientListFiltered(newClientList);

    // ✅ user ne khud change kiya, to default set flag true rakho
    setHasDefaultSet(true);
  };

  // 🎯 Step 4: Filter logic when modalType changes
  React.useEffect(() => {
    if (!selectedClientList) return;

    if (modalTypeF === "" || modalTypeF === "All") {
      // Show all if "All" selected
      setSelectedClientListFiltered(selectedClientList);
    } else {
      // Filter by settletype
      const filtered = selectedClientList.filter(
        (item: any) => item.settletype === modalTypeF
      );
      setSelectedClientListFiltered(filtered);
    }
  }, [modalTypeF, selectedClientList]);

  console.log(selectedClientList, "selelcteddClient list");

  const navigate = useNavigate();
    const handleDelete = (id:any) =>{
      console.log("delete clicked" , id);
      betService.deleteledgerentry(id).then((res: AxiosResponse<{ data: any }>) => {
        console.log("Deleted successfully", res);
        // Refresh data after deletion
        window.location.reload();
        
        
       
      }).catch((err) => {
        console.error("Error deleting entry", err);
      });
  
  
    }
  return (
    <div className="container-fluid ">
      <div className="row row-center">
        <div className="col col-xs-24 col-lg-24">
          <div className="parentdiv d-none d-flexx flex-column gap-2 flex-md-row justify-content-between align-items-start">
            <div className="childdiv1 w-100">
              <div
                style={{ backgroundColor: "#10bf35" }}
                className="py-2 my-2 rounded-3 "
              >
                <span className="flex mx-3 text-white justify-between text-2xl">
                  <div className="justify-content-start ">Lena </div>{" "}
                  <div className="justify-content-end">
                    {lenaTotals.amount.toFixed(2)}
                  </div>
                </span>
              </div>
              <div className=" overflow-auto">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th style={{ background: "#0f2327", color: "white" }}>
                        User Details{" "}
                      </th>
                      <th
                        style={{ background: "#0f2327", color: "white" }}
                        className="final-amount"
                      >
                        Balance
                      </th>
                      {/* <th className="final-amount">SETTLED</th> */}
                      <th
                        className="final-amount text-white bg-final bg-green"
                        style={{ background: "#0f2327", color: "white" }}
                      >
                        <span>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            height="25"
                            width="25"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                          </svg>
                        </span>
                      </th>
                      {/* <th>ACTION</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {lena?.map((row) => (
                      <tr key={row.ChildId}>
                        <td>
                          <CustomLink
                            style={{ color: "#1890ff" }}
                            to={`/all-settlement/${row.ChildId}`}
                          >
                            <i className="fa fa-eye fa-xs"></i> {row.agent}
                          </CustomLink>
                        </td>
                        <td>{(row.amount - row.settled).toFixed(2)}</td>
                        {/* <td>{row.settled.toFixed(2)}</td> */}
                        <td className="">
                          <CustomLink
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("lena");
                              setShowModal(true);
                            }}
                            to={`/client-transactions/${row?.ChildId}`}
                          >
                            <span>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 512 512"
                                height="25"
                                width="25"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                              </svg>
                            </span>
                          </CustomLink>
                        </td>
                        <td className="hidden">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("lena");
                              setShowModal(true);
                            }}
                          >
                            Settlement
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-weight-bold d-none bg-light">
                      <td>LENA HAI</td>
                      <td>{lenaTotals.amount.toFixed(2)}</td>
                      <td>{lenaTotals.settled.toFixed(2)}</td>
                      <td className="bg-final text-white">
                        {lenaTotals.final.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="childdiv2 w-100">
              <div
                style={{ backgroundColor: "#de4d4d" }}
                className="py-2 my-2 rounded-3 "
              >
                <span className="flex mx-3 text-white justify-between text-2xl">
                  <div className="justify-content-start ">Dena </div>{" "}
                  <div className="justify-content-end">
                    {denaTotals.amount.toFixed(2)}
                  </div>
                </span>
              </div>
              <div className="overflow-auto">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th style={{ background: "#0f2327", color: "white" }}>
                        User Details{" "}
                      </th>
                      <th
                        style={{ background: "#0f2327", color: "white" }}
                        className="final-amount"
                      >
                        Balance
                      </th>
                      {/* <th className="final-amount">SETTLED</th> */}
                      <th
                        className="final-amount text-white bg-final bg-green"
                        style={{ background: "#0f2327", color: "white" }}
                      >
                        <span>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            height="25"
                            width="25"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                          </svg>
                        </span>
                      </th>
                      {/* <th>ACTION</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {dena.map((row) => (
                      <tr key={row.ChildId}>
                        <td>
                          <CustomLink
                            style={{ color: "#1890ff" }}
                            to={`/all-settlement/${row.ChildId}`}
                          >
                            <i className="fa fa-eye fa-xs"></i> {row.agent}
                          </CustomLink>
                        </td>
                        <td>{(row.amount - row.settled).toFixed(2)}</td>
                        {/* <td>{row.settled.toFixed(2)}</td> */}
                        {/* <td className="bg-final2 text-white">
                    {row.final.toFixed(2)}
                  </td> */}
                        <td className="">
                          <CustomLink
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("dena");
                              setShowModal(true);
                              navigate(`/client-transactions/${row.ChildId}`);
                            }}
                            to={`/client-transactions/${row.ChildId}`}
                          >
                            <span>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 512 512"
                                height="25"
                                width="25"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                              </svg>
                            </span>
                          </CustomLink>
                        </td>
                        <td className="hidden">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("dena");
                              setShowModal(true);
                            }}
                          >
                            Settlement
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-weight-bold hidden bg-light">
                      <td>DENA HAI</td>
                      <td>{denaTotals.amount.toFixed(2)}</td>
                      <td>{denaTotals.settled.toFixed(2)}</td>
                      <td className="bg-final2 text-white">
                        {denaTotals.final.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="childdiv3 w-100">
              <div
                style={{ backgroundColor: "#5cb5f5" }}
                className="py-2 my-2 rounded-3 "
              >
                <span className="flex mx-3 text-white justify-between text-2xl">
                  <div className="justify-content-start ">Clear </div>{" "}
                  <div className="justify-content-end">
                    {denaTotals.amount.toFixed(2)}
                  </div>
                </span>
              </div>

              <div className="overflow-auto">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th style={{ background: "#0f2327", color: "white" }}>
                        User Details{" "}
                      </th>
                      <th
                        style={{ background: "#0f2327", color: "white" }}
                        className="final-amount"
                      >
                        Balance
                      </th>
                      {/* <th className="final-amount">SETTLED</th> */}
                      <th
                        className="final-amount text-white bg-final bg-green"
                        style={{ background: "#0f2327", color: "white" }}
                      >
                        <span>
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            height="25"
                            width="25"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                          </svg>
                        </span>
                      </th>
                      {/* <th>ACTION</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {dena?.map((row) => (
                      <tr key={row.ChildId}>
                        <td>
                          <CustomLink
                            style={{ color: "#1890ff" }}
                            to={`/all-settlement/${row.ChildId}`}
                          >
                            <i className="fa fa-eye fa-xs"></i> {row.agent}
                          </CustomLink>
                        </td>
                        <td>{row.amount.toFixed(2)}</td>
                        {/* <td>{row.settled.toFixed(2)}</td> */}
                        {/* <td className="bg-final2 text-white">
                    {row.final.toFixed(2)}
                  </td> */}
                        <td className="">
                          <span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 512 512"
                              height="25"
                              width="25"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M327.027 65.816L229.79 128.23l9.856 5.397 86.51-55.53 146.735 83.116-84.165 54.023 4.1 2.244v6.848l65.923-42.316 13.836 7.838-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l64.633-41.487 15.127 8.57-79.76 51.195v11.723l100.033-64.21-24.828-14.062 24.827-15.937-24.828-14.064 24.827-15.937-23.537-13.333 23.842-15.305-166.135-94.106zm31.067 44.74c-21.038 10.556-49.06 12.342-68.79 4.383l-38.57 24.757 126.903 69.47 36.582-23.48c-14.41-11.376-13.21-28.35 2.942-41.67l-59.068-33.46zM227.504 147.5l-70.688 46.094 135.61 78.066 1.33-.85c2.5-1.61 6.03-3.89 10.242-6.613 8.42-5.443 19.563-12.66 30.674-19.86 16.002-10.37 24.248-15.72 31.916-20.694L227.504 147.5zm115.467 1.17a8.583 14.437 82.068 0 1 .003 0 8.583 14.437 82.068 0 1 8.32 1.945 8.583 14.437 82.068 0 1-.87 12.282 8.583 14.437 82.068 0 1-20.273 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.237zm-218.423 47.115L19.143 263.44l23.537 13.333-23.842 15.305 24.828 14.063-24.828 15.938 24.828 14.063-24.828 15.938 166.135 94.106L285.277 381.8V370.08l-99.433 63.824L39.11 350.787l14.255-9.15 131.608 74.547L285.277 351.8V340.08l-99.433 63.824L39.11 320.787l14.255-9.15 131.608 74.547L285.277 321.8V310.08l-99.433 63.824L39.11 290.787l13.27-8.52 132.9 75.28 99.997-64.188v-5.05l-5.48-3.154-93.65 60.11-146.73-83.116 94.76-60.824-9.63-5.543zm20.46 11.78l-46.92 30.115c14.41 11.374 13.21 28.348-2.942 41.67l59.068 33.46c21.037-10.557 49.057-12.342 68.787-4.384l45.965-29.504-123.96-71.358zm229.817 32.19c-8.044 5.217-15.138 9.822-30.363 19.688-11.112 7.203-22.258 14.42-30.69 19.873-4.217 2.725-7.755 5.01-10.278 6.632-.09.06-.127.08-.215.137v85.924l71.547-48.088v-84.166zm-200.99 17.48a8.583 14.437 82.068 0 1 8.32 1.947 8.583 14.437 82.068 0 1-.87 12.28 8.583 14.437 82.068 0 1-20.27 1.29 8.583 14.437 82.068 0 1 .87-12.28 8.583 14.437 82.068 0 1 11.95-3.236z"></path>
                            </svg>
                          </span>
                        </td>
                        <td className="hidden">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("dena");
                              setShowModal(true);
                            }}
                          >
                            Settlement
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-weight-bold hidden bg-light">
                      <td>DENA HAI</td>
                      <td>{denaTotals.amount.toFixed(2)}</td>
                      <td>{denaTotals.settled.toFixed(2)}</td>
                      <td className="bg-final2 text-white">
                        {denaTotals.final.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="card card-bordered gx-card">
              <div className="card-body">
                <TopBackHeader name="Client Transactions" />
                <div className="gx-px-2 gx-pt-3 gx-bg-flex">
                  <form id="advanced_search" className="row g-3">
                    {/* Client */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_client"
                        className="form-label"
                      >
                        Client <span className="text-danger">*</span>
                      </label>
                      <select
                        id="advanced_search_client"
                        className="form-control"
                        value={selectedClient ? selectedClient.ChildId : ""}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select User</option>
                        {combined.map((item, index) => (
                          <option key={index} value={item.ChildId}>
                            {item.agent}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Collection */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_collection"
                        className="form-label"
                      >
                        Collection <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="advanced_search_collection"
                        className="form-control"
                        placeholder="CASH"
                        readOnly
                        disabled
                      />
                    </div>

                    {/* Date */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_date"
                        className="form-label"
                      >
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="advanced_search_date"
                        className="form-control"
                        value={new Date().toISOString().split("T")[0]}
                        readOnly
                        disabled
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_amount"
                        className="form-label"
                      >
                        Amount <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputAmount}
                        className="form-control"
                        onChange={(e) =>
                          setInputAmount(Math.abs(Number(e.target.value)))
                        }
                      />
                    </div>

                    {/* Payment Type */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_paymentType"
                        className="form-label"
                      >
                        Payment Type <span className="text-danger">*</span>
                      </label>
                      <select
                        id="advanced_search_paymentType"
                        className="form-select"
                        aria-required="true"
                        value={modalType}
                        onChange={(e) => setModalType(e.target.value)}
                      >
                        <option value="">Select Payment Type</option>
                        <option value="Payment Diya">Payment Diya</option>
                        <option value="Payment Liya">Payment Liya</option>
                      </select>
                    </div>

                    {/* Remark */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_remark"
                        className="form-label"
                      >
                        Remark <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="advanced_search_remark"
                        className="form-control"
                        placeholder="Remark"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                      <button
                        disabled={loading} 
                        className="btn btn-success"
                        onClick={async () => {
                          if (!selectedClient) return;

                          if (
                            inputAmount >
                            Number(Math.abs(selectedClient.final).toFixed(2))
                          ) {
                            console.log(
                              inputAmount,
                              Math.abs(selectedClient.final),
                              "account statements settelements"
                            );
                            alert(
                              "Settlement amount cannot exceed Settle Amount."
                            );
                            return;
                          }

                          const settleamount =
                            modalType === "lena"
                              ? -Math.abs(inputAmount)
                              : Math.abs(inputAmount);

                          const data: any = {
                            ChildId: selectedClient.ChildId,
                            settleamount,
                            remark,
                            type: modalType,
                          };

                          try {
                            setLoading(true);
                            await betService.postsettelement(data);
                            setShowModal(false);
                            const res = await betService.oneledger();
                            const { lenaArray, denaArray } = processLedgerData(
                              res.data.data
                            );
                            setLena(lenaArray);
                            setDena(denaArray);
                          } catch (err) {
                            alert("Error during settlement.");
                            console.error(err);
                          }finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? "Processing..." : "Submit"}
                      </button>
                    </div>
                  </form>

                  {/* === CLIENT DETAILS SECTION === */}
                  {selectedClient && (
                    // <div className="col-12 mt-3 hiddden">
                    //   <div className="border p-3 rounded">
                    //     <div>
                    //       <strong>Client Name:</strong> {selectedClient.agent}
                    //     </div>
                    //     <div>
                    //       <strong>Amount:</strong> {selectedClient.amount}
                    //     </div>
                    //     <div>
                    //       <strong>Final:</strong> {selectedClient.final}
                    //     </div>
                    //     <div>
                    //       <strong>Settled:</strong> {selectedClient.settled}
                    //     </div>
                    //   </div>
                    // </div>

                    <div className="rows d-flex g-2 p-3 mb-3  rounded bg-light">
                      <div className="col-4 col-md-4">
                        <span
                          className={`fw-bold ${
                            selectedClient?.settled < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          Dena {selectedClient?.settled.toFixed()}
                        </span>
                      </div>
                      <div className="col-4 col-md-4">
                        <span
                          className={`fw-bold ${
                            selectedClient?.amount < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          Lena {selectedClient?.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-4 col-md-4">
                        <span
                          className={`fw-bold ${
                            selectedClient?.amount - selectedClient?.settled < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          Balance{" "}
                          {(
                            selectedClient?.amount - selectedClient?.settled
                          ).toFixed(2)}
                          {selectedClient?.amount - selectedClient?.settled < 0
                            ? "(Lena)"
                            : "(Dena)"}
                          {/* {(
                            Math.abs(selectedClient?.amount) +
                            Math.abs(selectedClient?.settled)
                          ).toFixed()} */}
                        </span>
                      </div>
                    </div>
                  )}

<div className="col-12 col-md-6 col-lg-4 mb-4">
                    <label
                      htmlFor="advanced_search_paymentType"
                      className="form-label"
                    >
                      Payment Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-required="true"
                      value={modalTypeF}
                      onChange={(e) => setModalTypeF(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="Payment Diya">Payment Diya</option>
                      <option value="Payment Liya">Payment Liya</option>
                    </select>
                  </div>

                  {loading ? <div style={{
    minHeight: "60vh",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
  }} className="text-center py-5">
    
    <img src='/imgs/loading.svg' width={50} />
  </div>
                 :
                  <div className="row overflow-auto mb-20">
                    <div className="col-sm-12">
                      <table
                        className="table table-striped table-bordered LedgerList dataTable no-footer"
                        id="ledger"
                        style={{ minWidth: 700, width: 1110 }}
                        role="grid"
                      >
                         <thead className="navbar-bet99 text-dark">
                          <tr role="row">
                            <th
                              className="p-1 pl-2 small sorting_disabled pr-0"
                              style={{
                                minWidth: 170,
                                width: 170,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Date
                            </th>
                            <th
                              className="p-1 small text-center no-sort sorting_disabled"
                              style={{
                                width: 81,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Description
                            </th>
                            <th
                              className="p-1 small text-center no-sort sorting_disabled"
                              style={{
                                width: 81,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Credit
                            </th>
                            <th
                              className="p-2 small text-center no-sort sorting_disabled"
                              style={{
                                width: 60,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Debit
                            </th>
                            {/* <th
                        className="p-1 small text-center  no-sort sorting_disabled"
                        style={{
                          width: 97,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Balance
                      </th> */}
                            <th
                              className="p-1 small text-center  no-sort sorting_disabled"
                              style={{
                                width: 97,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Payment Type
                            </th>
                            <th
                              className="p-1 small no-sort sorting_disabled"
                              style={{
                                width: 127,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Remark
                            </th>

                            <th
                              className="p-1 small no-sort sorting_disabled"
                              style={{
                                width: 127,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Balance
                            </th>

                            <th
                              className="p-1 small no-sort sorting_disabled"
                              style={{
                                width: 127,
                                backgroundColor: "#0f2327",
                                color: "white",
                              }}
                            >
                              Done
                            </th>
                          </tr>
                        </thead>

                        <tbody className="hidden">
                          {selectedClientList
                            ?.reduce((acc: any[], row: any, index: number) => {
                              // calculate previous cumulative balance
                              const prevBalance =
                                acc.length > 0
                                  ? acc[acc.length - 1].balance
                                  : 0;

                              // calculate commission
                              const commission =
                                userState?.user?.role === "dl"
                                  ? row?.commissiondega || 0
                                  : 0;

                              // money after commission
                              const money = (row?.money || 0) - commission;

                              // new cumulative balance
                              const newBalance = prevBalance + money;

                              // push with balance
                              acc.push({ ...row, balance: newBalance });

                              return acc;
                            }, [])
                            ?.reverse()
                            ?.map((row: any, index: any) => (
                              <tr
                                key={row.id}
                                role="row"
                                className={index % 2 === 0 ? "even" : "odd"}
                              >
                                <td className="small pl-2 pr-0">
                                  {new Date(row.updatedAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short", // Apr
                                      day: "2-digit", // 16
                                      hour: "2-digit", // 04
                                      minute: "2-digit", // 09
                                      hour12: true, // PM/AM format
                                    }
                                  )}
                                </td>
                                <td
                                  className="small p-1 "
                                  style={{ zIndex: 2 }}
                                >
                                  CASH
                                </td>
                                <td>
                                  <span className="text-successr p-1">
                                    {row?.money > 0
                                      ? row?.money?.toFixed(2)
                                      : 0}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-dangerr p-1">
                                    {row?.money < 0
                                      ? row?.money?.toFixed(2)
                                      : 0}
                                  </span>
                                </td>
                                {/* <td>
                          <span
                            className={
                              row?.balance >= 0 ? "text-danger" : "text-danger"
                            }
                          >
                            {row?.balance?.toFixed(2)}
                          </span>
                        </td> */}
                                <td
                                  className="small p-1 "
                                  style={{ zIndex: 2 }}
                                >
                                  {row?.settletype}
                                </td>
                                <td
                                  className={
                                    row?.narration === "Settlement"
                                      ? "bg-yellow-400"
                                      : ""
                                  }
                                >
                                  <span
                                    className="badge badge-primary p-1"
                                    style={{ fontSize: "xx-small" }}
                                  >
                                    🏆
                                  </span>
                                  <span
                                    className="small p-0 "
                                    style={{ zIndex: 2 }}
                                  >
                                    {row?.narration}
                                  </span>
                                </td>
                                <td
                                  className="small p-1 "
                                  style={{ zIndex: 2 }}
                                >
                                  SELF
                                </td>
                              </tr>
                            ))}
                        </tbody>

{/*                         
                        {(() => {
                          // 🧠 Step 1: Group by matchId
                          const groupedMap = new Map();

                          selectedClientListFiltered?.forEach((item: any) => {
                            const key = item.matchId; // grouping key

                            if (!groupedMap.has(key)) {
                              groupedMap.set(key, { ...item }); // clone first one
                            } else {
                              const existing = groupedMap.get(key);

                              // 🔢 Sum money
                              existing.money += item.money;

                              // 🔢 Optionally sum commission too (if needed)
                              existing.commissiondega =
                                (existing.commissiondega || 0) +
                                (item.commissiondega || 0);

                              // 🕓 Keep latest date + narration reference
                              if (
                                new Date(item.createdAt) >
                                new Date(existing.createdAt)
                              ) {
                                existing.createdAt = item.createdAt;
                                existing.narration = item.narration;
                              }

                              groupedMap.set(key, existing);
                            }
                          });

                          // Convert map → array
                          const groupedList = Array.from(groupedMap.values());

                          // 🧮 Step 2: Calculate balances safely
                          const balanceArray =
                            groupedList?.reduce((acc: number[], row: any) => {
                              const prevBalance =
                                acc.length > 0 ? acc[acc.length - 1] : 0;
                              const commission =
                                userState?.user?.role === "dl"
                                  ? row?.commissiondega || 0
                                  : 0;
                              const money = (row?.money || 0) - commission;
                              const newBalance = prevBalance + money;
                              acc.push(newBalance);
                              return acc;
                            }, []) || [];

                          // 🔁 Step 3: Reverse only balances
                          const reversedBalances = [
                            ...(balanceArray || []),
                          ].reverse();

                          // 🧾 Step 4: Render table
                          return (
                            <tbody>
                              {groupedList
                                ?.reverse()
                                ?.map((row: any, index: number) => (
                                  <tr
                                    key={row._id || index}
                                    role="row"
                                    className={index % 2 === 0 ? "even" : "odd"}
                                  >
                                    <td className="small pl-2 pr-0">
                                      {new Date(row.updatedAt).toLocaleString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        }
                                      )}
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      CASH
                                    </td>

                                    <td>
                                      <span className="text-success p-1">
                                        {row.money > 0
                                          ? row.money.toFixed(2)
                                          : 0}
                                      </span>
                                    </td>

                                    <td>
                                      <span className="text-danger p-1">
                                        {row.money < 0
                                          ? row.money.toFixed(2)
                                          : 0}
                                      </span>
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      {row?.settletype || ""}
                                    </td>

                                    <td
                                      className={
                                        row?.narration === "Settlement"
                                          ? "bg-yellow-400"
                                          : ""
                                      }
                                    >
                                      <span
                                        className="badge badge-primary p-1"
                                        style={{ fontSize: "xx-small" }}
                                      >
                                        🏆
                                      </span>
                                      <span
                                        className="small p-0"
                                        style={{ zIndex: 2 }}
                                      >
                                        {row?.narration}
                                      </span>
                                    </td>

                                    ✅ Reversed balance display
                                    <td
                                      className={`fw-bold ${
                                        reversedBalances[index] < 0
                                          ? "text-danger"
                                          : "text-success"
                                      }`}
                                    >
                                      {reversedBalances[index]?.toFixed(2)}
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      SELF
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          );
                        })()} */}

{(() => {
                          // 🧠 Step 1: Split data — with & without matchId
                          const withMatchId =
                            selectedClientListFiltered?.filter(
                              (x: any) => x.matchId
                            ) || [];
                          const withoutMatchId =
                            selectedClientListFiltered?.filter(
                              (x: any) => !x.matchId
                            ) || [];

                          // 🧠 Step 2: Group "withMatchId" items
                          const groupedMap = new Map();

                         

                          withMatchId.forEach((item: any) => {
                            const betGroup =
                            item.betGame == "CASINO" ? "CASINO" : item?.matchName;
                            const dateKey =
                            betGroup === "CASINO"
                              ? new Date(item.createdAt).toISOString().split("T")[0]
                              : "";

                              const matchKey = item.matchId || "NO_MATCH";

                            const key = `${betGroup}|${matchKey}|${dateKey}`;

                            if (!groupedMap.has(key)) {
                              groupedMap.set(key, { ...item });
                            } else {
                              const existing = groupedMap.get(key);

                              // 🔢 Sum money + commission
                              existing.money += item.money;
                              existing.commissiondega =
                                (existing.commissiondega || 0) +
                                (item.commissiondega || 0);

                              // 🕓 Keep latest narration & date
                              if (
                                new Date(item.createdAt) >
                                new Date(existing.createdAt)
                              ) {
                                existing.createdAt = item.createdAt;
                                existing.narration = item.narration;
                              }

                              groupedMap.set(key, existing);
                            }
                          });

                          // Convert grouped map → array
                          const groupedList = Array.from(groupedMap.values());

                          // 🧩 Step 3: Merge grouped + ungrouped
                          const finalList = [...groupedList, ...withoutMatchId];

                          // 🧮 Step 4: Calculate balances safely
                          const balanceArray =
                            finalList?.reduce((acc: number[], row: any) => {
                              const prevBalance =
                                acc.length > 0 ? acc[acc.length - 1] : 0;
                              const commission =
                                userState?.user?.role === "dl"
                                  ? row?.commissiondega || 0
                                  : 0;
                              const money = (row?.money || 0) - commission;
                              const newBalance = prevBalance + money;
                              acc.push(newBalance);
                              return acc;
                            }, []) || [];

                          // 🔁 Step 5: Reverse only balances
                          const reversedBalances = [
                            ...(balanceArray || []),
                          ].reverse();

                          console.log(finalList,"finanalslsi")

                          // 🧾 Step 6: Render table
                          return (
                            <tbody>
                              {finalList
                                ?.reverse()
                                ?.map((row: any, index: number) => (
                                  <tr
                                    key={row._id || index}
                                    role="row"
                                    className={index % 2 === 0 ? "even" : "odd"}
                                  >
                                    <td className="small pl-2 pr-0">
                                      {new Date(row.updatedAt).toLocaleString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        }
                                      )}
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      CASH
                                    </td>

                                    <td>
                                      <span className="text-successss p-1">
                                        {row.money > 0
                                          ? row.money.toFixed(2)
                                          : 0}
                                      </span>
                                    </td>

                                    <td>
                                      <span className="text-dangerrrr p-1">
                                        {row.money < 0
                                          ? row.money.toFixed(2)
                                          : 0}
                                      </span>
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      {row?.settletype || "-"}
                                    </td>

                                    <td
                                      className={
                                        row?.narration === "Settlement"
                                          ? "bg-yellow-400"
                                          : ""
                                      }
                                    >
                                     
                                      <span
                                        className="small p-0"
                                        style={{ zIndex: 2 }}
                                      >
                                        {row?.betGame == "CASINO" ? "CASINO" :row?.matchName}
                                      </span>
                                    </td>

                                    {/* ✅ Reversed balance display */}
                                    <td
                                      className={`fw-bold ${
                                        reversedBalances[index] < 0
                                          ? "text-dangffer"
                                          : "text-succffess"
                                      }`}
                                    >
                                      {reversedBalances[index]?.toFixed(2)}
                                    </td>

                                    <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                      SELF
                                    </td>


                                   {row?.settletype ?  <td
                                      className="small p-1"
                                      style={{ zIndex: 2 }}
                                    >
                                     <button onClick={() => handleDelete(row?._id)}>Delete</button> 
                                    </td> : "-"}
                                  </tr>
                                ))}
                            </tbody>
                          );
                        })()}

                      </table>
                      {selectedClient ? "" : <div className="text-center">Select user</div>}
                    </div>
                  </div> }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildTransactions;
