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
  crole: any;
}

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
  Crole : any;
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

    const flatDataMain =
      userState.user.role === "admin"
        ? data[0] // for admin
        : data[0]; // for others

       // ✅ REMOVE entries with ChildId null / undefined
const flatData = flatDataMain.filter(
  (entry: any) => entry.ChildId !== null && entry.ChildId !== undefined
);


    const settledMap: Record<string, number> = {};
    flatData.forEach((entry: any) => {
      if (entry.settled) {
        if (!settledMap[entry.ChildId]) settledMap[entry.ChildId] = 0;
        settledMap[entry.ChildId] += entry.money;
      }
    });

    const activeMap: Record<
      string,
      { username: string; positive: number; negative: number , crole:any }
    > = {};
    flatData.forEach((entry: any) => {
      if (!entry.settled) {
        const id = entry.ChildId;
        const username = entry.username + " (" + entry.cname + ")";
        const crole = entry.crole;

        // Compute money based on role
        // const money = userState.user.role === "dl" ? entry.money - entry.commissiondega : entry.money;

        const commission =
          userState.user.role === "dl" ? entry.commissiondega : 0;
        const money = entry.money - commission;

        // const money =  entry.money + entry.commissiondega ;

        if (!activeMap[id]) {
          activeMap[id] = { username, positive: 0, negative: 0 , crole};
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
      ([ChildId, { username, positive, negative , crole  }]) => {
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
          Crole : crole
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
      })
      .catch((err) => {
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
  const handleDelete = (id: any) => {
    console.log("delete clicked", id);
    betService
      .deleteledgerentry(id)
      .then((res: AxiosResponse<{ data: any }>) => {
        console.log("Deleted successfully", res);
        // Refresh data after deletion
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error deleting entry", err);
      });
  };
  return (
    <div className="container-fluid ">
      <div className="row row-center">
        <div className="col col-xs-24 col-lg-24">
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
                    <div className="col-12 col-md-6 col-lg-4 d-none">
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
                            modalType === "Payment Liya"
                              ? -Math.abs(inputAmount)
                              : Math.abs(inputAmount);

                          const data: any = {
                            ChildId: selectedClient.ChildId,
                            settleamount,
                            remark,
                            type: modalType,
                            urole: selectedClient.Crole
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
                          } finally {
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
                            Number(selectedClient?.amount || 0) +
                            Number(selectedClient?.settled || 0)
                          ).toFixed(2)}
                          {Number(selectedClient?.amount || 0) +
                            Number(selectedClient?.settled || 0) <
                          0
                            ? "(Dena)"
                            : "(Lena)"}
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

                  {loading ? (
                    <div
                      style={{
                        minHeight: "60vh",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                      }}
                      className="text-center py-5"
                    >
                      <img src="/imgs/loading.svg" width={50} />
                    </div>
                  ) : (
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
                                item.betGame == "CASINO"
                                  ? "CASINO"
                                  : item?.matchName;
                              const dateKey =
                                betGroup === "CASINO"
                                  ? new Date(item.createdAt)
                                      .toISOString()
                                      .split("T")[0]
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
                            const finalList = [
                              ...groupedList,
                              ...withoutMatchId,
                            ];

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

                            console.log(finalList, "finanalslsi");

                            // 🧾 Step 6: Render table
                            return (
                              <tbody>
                                {finalList
                                  ?.reverse()
                                  ?.map((row: any, index: number) => (
                                    <tr
                                      key={row._id || index}
                                      role="row"
                                      className={
                                        index % 2 === 0 ? "even" : "odd"
                                      }
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
                                           {row?.betGame ? row?.betGame == "CASINO" 
                                            ? "CASINO"
                                            : row?.matchName : row?.narration}
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

                                      {row?.settletype ? (
                                        <td
                                          className="small p-1"
                                          style={{ zIndex: 2 }}
                                        >
                                          <button
                                            onClick={() =>
                                              handleDelete(row?._id)
                                            }
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      ) : (
                                        "-"
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            );
                          })()}
                        </table>
                        {selectedClient ? (
                          ""
                        ) : (
                          <div className="text-center">Select user</div>
                        )}
                      </div>
                    </div>
                  )}
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
