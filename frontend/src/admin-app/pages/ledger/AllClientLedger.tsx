// import betService from "../../../services/bet.service";
// import { AxiosResponse } from "axios";
// import React from "react";
// import "./ClientLedger.css"; // Import the CSS file
// import { green } from "@mui/material/colors";
// import PaymentsIcon from '@mui/icons-material/Payments';
// import { useAppSelector } from "../../../redux/hooks";
// import User from "../../../models/User";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";
// import { Link } from "react-router-dom";
// import { CustomLink } from "../../../pages/_layout/elements/custom-link";

// interface LedgerEntry {
//   settled: any;
//   ChildId: string;
//   username: string;
//   commissionlega: number;
//   commissiondega: number;
//   money: number;
//   narration: string;
//   _id: string;
// }

// interface GroupedEntry {
//   agent: string;
//   amount: number;
//   settled: number;
//   final: number;
//   ChildId: string;
// }

// const AllClientLedger = () => {
//   //   const [tableData, setTableData] = React.useState<LedgerItem[]>([

//   const userState = useAppSelector(selectUserData);

//   console.log(userState, "fffff")

//   const [showModal, setShowModal] = React.useState(false);
//   const [selectedEntry, setSelectedEntry] = React.useState<GroupedEntry | null>(
//     null
//   );
//   const [inputAmount, setInputAmount] = React.useState<number>(0);
//   const [remark, setRemark] = React.useState<string>("");
//   const [modalType, setModalType] = React.useState<"lena" | "dena" | null>(
//     null
//   );

//   const [lena, setLena] = React.useState<GroupedEntry[]>([]);
//   const [dena, setDena] = React.useState<GroupedEntry[]>([]);
//   const lenaTotals = lena.reduce(
//     (acc, item) => {
//       acc.amount += item.amount;
//       acc.settled += item.settled;
//       acc.final += item.final;
//       return acc;
//     },
//     { amount: 0, settled: 0, final: 0 }
//   );

//   const denaTotals = dena.reduce(
//     (acc, item) => {
//       acc.amount += item.amount;
//       acc.settled += item.settled;
//       acc.final += item.final;
//       return acc;
//     },
//     { amount: 0, settled: 0, final: 0 }
//   );

//   const grandTotals = {
//     lena: lenaTotals.final,
//     dena: denaTotals.final,
//   };
//   const processLedgerData = (
//     data: LedgerEntry[][]
//   ): { lenaArray: GroupedEntry[]; denaArray: GroupedEntry[] } => {

//     // userState.user.role === "admin"

//     // const flatData = [...(data[0] || []), ...(data[1] || [])]; //old wala hai

//     // const flatData = [...(data[0] || []), ...(data[0] || [])]; // ye naye wala hai for other than superadmin

//     const flatData =
//       userState.user.role === "admin"
//         ? data[0] // for admin
//         : data[0]; // for others

//     const settledMap: Record<string, number> = {};
//     flatData.forEach((entry: any) => {
//       if (entry.settled) {
//         if (!settledMap[entry.ChildId]) settledMap[entry.ChildId] = 0;
//         settledMap[entry.ChildId] += Math.abs(entry.money);
//       }
//     });

//     const activeMap: Record<
//       string,
//       { username: string; positive: number; negative: number }
//     > = {};
//     flatData.forEach((entry: any) => {
//       if (!entry.settled) {
//         const id = entry.ChildId;
//         const username = entry.username + " (" + entry.cname + ")";

//         // Compute money based on role
//         // const money = userState.user.role === "dl" ? entry.money - entry.commissiondega : entry.money;

//         const commission = userState.user.role === "dl" ? entry.commissiondega : 0;
//         const money = entry.money - commission;

//         // const money =  entry.money + entry.commissiondega ;

//         if (!activeMap[id]) {
//           activeMap[id] = { username, positive: 0, negative: 0 };
//         }

//         if (money > 0) {
//           activeMap[id].positive += Math.abs(money);
//         } else {
//           activeMap[id].negative += Math.abs(money);
//         }
//       }
//     });

//     const lenaArray: GroupedEntry[] = [];
//     const denaArray: GroupedEntry[] = [];

//     Object.entries(activeMap).forEach(
//       ([ChildId, { username, positive, negative }]) => {
//         const rawAmount = positive - negative;
//         const settledAmount = settledMap[ChildId] || 0;
//         const netFinal = Math.max(0, Math.abs(rawAmount - settledAmount));
//         // const netFinal = Math.abs(rawAmount - settledAmount);

//         const baseData = {
//           agent: username,
//           amount: Math.abs(rawAmount),
//           settled: settledAmount,
//           final: netFinal,
//           ChildId,
//         };

//         console.log(rawAmount - settledAmount, "raww amountt")

//         if (rawAmount - settledAmount  >= 0) {
//           lenaArray.push(baseData);
//         } else {
//           denaArray.push(baseData);
//         }
//       }
//     );

//     return { lenaArray, denaArray };
//   };

//   const settlementButton = async (id: any) => {
//     // console.log(id,"chid from settlementButtonx")
//     const data: any = { ChildId: id };
//     await betService.postsettelement(data);
//   };

//   React.useEffect(() => {
//     betService
//       .oneledger()
//       .then((res: AxiosResponse<{ data: LedgerEntry[][] }>) => {
//         const { lenaArray, denaArray } = processLedgerData(res.data.data);
//         setLena(lenaArray);
//         setDena(denaArray);
//         console.log(res, "Processed ledger data");
//       });
//   }, [userState]);

//   return (
//     <>
//       <p className="text-center bg-secondary tx-12 text-white p-1">
//         {" "}
//         My Ledger{" "}
//       </p>

//       <div className="ledger-container">
//         <h2 className="ledger-title">All Client Ledger</h2>

//         <>
//           {/* LENA HAI TABLE */}
//           <h3>PAYMENT RECEIVING FROM (LENA HAI)</h3>
//           <div className="table-section overflow-auto">

//             <table className="ledger-table">
//               <thead>
//                 <tr>
//                   <th>AGENT</th>
//                   <th className="final-amount">AMOUNT</th>
//                   <th className="final-amount">SETTLED</th>
//                   <th
//                     style={{ background: "green" }}
//                     className="final-amount text-white bg-final bg-green"
//                   >
//                     FINAL
//                   </th>
//                   <th>ACTION</th>
//                 </tr>
//               </thead>
//               {/* LENA HAI TABLE BODY */}
//               <tbody>
//                 {lena.map((row) => (
//                   <tr key={row.ChildId}>
//                     <td><CustomLink to={`/all-settlement/${row.ChildId}`}>{row.agent}</CustomLink></td>
//                     <td>{row.amount.toFixed(2)}</td>
//                     <td>{row.settled}</td>
//                     <td className="bg-final text-white">{row.final.toFixed(2)}</td>
//                     <td className="small">

//                       <button
//                         onClick={() => {
//                           setSelectedEntry(row);
//                           setInputAmount(0);
//                           setRemark("");
//                           setModalType("lena");
//                           setShowModal(true);
//                         }}
//                         className="btn flex gap-1 align-items-center  btn-warning btn-sm btn-settlement small m-0"
//                       >
//                         < PaymentsIcon />
//                         Settlement
//                       </button>
//                     </td>

//                     {showModal && selectedEntry && (
//                       <div className="modal-overlay">
//                         <div className="modal-content modal-fit-width   p-3">
//                           <h3 className="bg-gray-600 text-white mb-4">
//                             Settle with: <strong>{selectedEntry.agent}</strong>
//                           </h3>

//                           <div className="form-group">
//                             <label>Settle Amount (Fixed):{modalType}</label>
//                             <input
//                               type="number"
//                               value={selectedEntry.final.toFixed(2)}
//                               readOnly
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>
//                               Settlement Amount (Enter ≤ {selectedEntry.final.toFixed(2)}):
//                             </label>
//                             <input
//                               type="number"
//                               value={inputAmount}
//                               onChange={(e) =>
//                                 setInputAmount(Number( e.target.value))
//                               }
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>Remark:</label>
//                             <input
//                               type="text"
//                               value={remark}
//                               onChange={(e) => setRemark(e.target.value)}
//                             />
//                           </div>

//                           <div className="modal-actions">
//                             <button
//                               className="btn btn-success"
//                               onClick={async () => {
//                                 if (inputAmount > selectedEntry.final) {
//                                   alert(
//                                     "Settlement amount cannot exceed Settle Amount."
//                                   );
//                                   return;
//                                 }

//                                 const data: any = {
//                                   ChildId: selectedEntry.ChildId,
//                                   settleamount: inputAmount,
//                                   remark,
//                                   type:"lena"
//                                 };

//                                 try {
//                                   const response: any = await betService.postsettelement(data);
//                                   console.log(response, "settlement")
//                                   setShowModal(false);
//                                   const res = await betService.oneledger();
//                                   const { lenaArray, denaArray } =
//                                     processLedgerData(res.data.data);
//                                   setLena(lenaArray);
//                                   setDena(denaArray);
//                                 } catch (err) {
//                                   alert("Error during settlement.");
//                                   console.error(err);
//                                 }
//                               }}
//                             >
//                               Submit
//                             </button>
//                             <button className="btn btn-danger" onClick={() => setShowModal(false)}>
//                               Close
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                   </tr>
//                 ))}
//                 <tr className="font-weight-bold bg-light">
//                   <td>LENA HAI</td>
//                   <td>{lenaTotals.amount.toFixed(2)}</td>
//                   <td>{lenaTotals.settled.toFixed(2)}</td>
//                   <td className="bg-final text-white">{lenaTotals.final.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <h3 className="mt-4">PAYMENT PAID TO (DENA HAI)</h3>

//           {/* DENA HAI TABLE */}
//           <div className="table-section overflow-auto">

//             <table className="ledger-table">
//               <thead>
//                 <tr>
//                   <th>AGENT</th>
//                   <th className="final-amount">AMOUNT</th>
//                   <th className="final-amount">SETTLED</th>
//                   <th
//                     style={{ background: "#dc3545" }}
//                     className="final-amount text-white bg-final bg-green"
//                   >
//                     FINAL
//                   </th>
//                   <th>ACTION</th>
//                 </tr>
//               </thead>
//               {/* DENA HAI TABLE BODY */}
//               <tbody>
//                 {dena.map((row) => (
//                   <tr key={row.ChildId}>
//                     <td><CustomLink to={`/all-settlement/${row.ChildId}`}>{row.agent}</CustomLink></td>
//                     <td>{row.amount.toFixed(2)}</td>
//                     <td>{row.settled.toFixed(2)}</td>
//                     <td className="bg-final2 text-white">{row?.final?.toFixed(2)}</td>

//                     <td className="small">

//                       <button

//                         onClick={() => {
//                           setSelectedEntry(row);
//                           setInputAmount(0);
//                           setRemark("");
//                           setModalType("dena");
//                           setShowModal(true);
//                         }}
//                         className="btn flex gap-1 align-items-center  btn-warning btn-sm btn-settlement small m-0"
//                       >
//                         < PaymentsIcon />
//                         Settlement
//                       </button>
//                     </td>

//                     {showModal && selectedEntry && (
//                       <div className="modal-overlay">
//                         <div className="modal-content  modal-fit-width   p-3">
//                           <h3 className="bg-gray-600 text-white mb-4">
//                             Settle with: <strong>{selectedEntry.agent}</strong>
//                           </h3>

//                           <div className="form-group">
//                             <label>Settle Amount (Fixed):{modalType}</label>
//                             <input
//                               type="number"
//                               value={selectedEntry.final.toFixed(2)}
//                               readOnly
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>
//                               Settlement Amount (Enter ≤ {selectedEntry.final.toFixed(2)}):
//                             </label>
//                             <input
//                               type="number"
//                               value={inputAmount}
//                               onChange={(e) =>
//                               // setInputAmount(Number(e.target.value))
//                               {
//                                 const value = Math.abs(Number(e.target.value)); // ensure it's positive first
//                                 setInputAmount(value);
//                               }
//                               }
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>Remark:</label>
//                             <input
//                               type="text"
//                               value={remark}
//                               onChange={(e) => setRemark(e.target.value)}
//                             />
//                           </div>

//                           <div className="modal-actions">
//                             <button

//                               className="btn btn-success"
//                               onClick={async () => {
//                                 if (inputAmount > selectedEntry.final) {
//                                   alert(
//                                     "Settlement amount cannot exceed Settle Amount."
//                                   );
//                                   return;
//                                 }

//                                 const data: any = {
//                                   ChildId: selectedEntry.ChildId,
//                                   settleamount: inputAmount,
//                                   remark,
//                                   type:"dena"
//                                 };

//                                 try {
//                                   await betService.postsettelement(data);
//                                   setShowModal(false);
//                                   const res = await betService.oneledger();
//                                   const { lenaArray, denaArray } =
//                                     processLedgerData(res.data.data);
//                                   setLena(lenaArray);
//                                   setDena(denaArray);
//                                 } catch (err) {
//                                   alert("Error during settlement.");
//                                   console.error(err);
//                                 }
//                               }}
//                             >
//                               Submit
//                             </button>
//                             <button className="btn btn-danger" onClick={() => setShowModal(false)}>
//                               Close
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </tr>
//                 ))}
//                 <tr className="font-weight-bold bg-light">
//                   <td>DENA HAI</td>
//                   <td>{denaTotals?.amount.toFixed(2)}</td>
//                   <td>{denaTotals?.settled.toFixed(2)}</td>
//                   <td className="bg-final2 text-white">{denaTotals?.final.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </>
//       </div>
//     </>
//   );
// };

// export default AllClientLedger;

import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import React from "react";
import "./ClientLedger.css";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { useNavigate } from "react-router-dom";

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

const AllClientLedger = () => {
  const userState = useAppSelector(selectUserData);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<GroupedEntry | null>(
    null
  );
  const [inputAmount, setInputAmount] = React.useState<number>(0);
  const [remark, setRemark] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<"lena" | "dena" | null>(
    null
  );

  const [lena, setLena] = React.useState<GroupedEntry[]>([]);
  const [dena, setDena] = React.useState<GroupedEntry[]>([]);

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

  React.useEffect(() => {
    betService
      .oneledger()
      .then((res: AxiosResponse<{ data: LedgerEntry[][] }>) => {
        const { lenaArray, denaArray } = processLedgerData(res.data.data);
        setLena(lenaArray);
        setDena(denaArray);
      });
  }, [userState]);

  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: "0" }} className="container-fluid p-md-4 mt-3">
        {!showModal ? (
          <div
            style={{ background: "#0f2327" }}
            className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
          >
            <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
              Agent Ledger
            </span>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="btn bg-primary text-white"
            >
              <span>Back</span>
            </button>
          </div>
        ) : (
          <div
            style={{ background: "#0f2327" }}
            className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
          >
            <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
              Client Transactions
            </span>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="btn bg-primary text-white"
            >
              <span>Back</span>
            </button>
          </div>
        )}

        {!showModal && (
          <div className="parentdiv d-flex flex-column gap-2 flex-md-row justify-content-between align-items-start">
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
                    {lena.map((row) => (
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
                          <button
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("lena");
                              setShowModal(true);
                            }}
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
                          </button>
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
                            <PaymentsIcon /> Settlement
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
                          <button
                            onClick={() => {
                              setSelectedEntry(row);
                              setInputAmount(0);
                              setRemark("");
                              setModalType("dena");
                              setShowModal(true);
                            }}
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
                          </button>
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
                            <PaymentsIcon /> Settlement
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
                            <PaymentsIcon /> Settlement
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
        )}
        {/* SINGLE MODAL OUTSIDE LOOP */}
        {showModal && selectedEntry && (
          <div className="">
            <div className="space-y-8">
  <div className="col-12 mt-4">
    <label htmlFor="advanced_search_client" className="form-label">
      Client <span className="text-danger">*</span>
    </label>
    <input
      type="text"
      id="advanced_search_client"
      className="form-control"
      placeholder="Select User"
      aria-required="true"
      value={selectedEntry.agent}
    />
  </div>

  <div className="col-12">
    <label htmlFor="advanced_search_collection" className="form-label">
      Collection <span className="text-danger">*</span>
    </label>
    <input
      type="text"
      id="advanced_search_collection"
      className="form-control"
      placeholder="CASH A/C"
      readOnly
    />
  </div>

  <div className="col-12">
    <label htmlFor="advanced_search_amount" className="form-label">
      Amount <span className="text-danger">*</span>
    </label>
    <input
      type="number"
      className="form-control"
      value={inputAmount}
      onChange={(e) => setInputAmount(Math.abs(Number(e.target.value)))}
    />
  </div>

  <div className="col-12">
    <label htmlFor="advanced_search_remark" className="form-label">
      Remark <span className="text-danger">*</span>
    </label>
    <input
      type="text"
      className="form-control"
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
    />
  </div>

  <div className="col-12">
    <label htmlFor="advanced_search_paymentType" className="form-label">
      Payment Type <span className="text-danger">*</span>
    </label>
    <select
      id="advanced_search_paymentType"
      className="form-select"
      aria-required="true"
    >
      <option value="">Select PaymentType</option>
      <option value="cash">Cash</option>
      <option value="card">Card</option>
      <option value="upi">UPI</option>
    </select>
  </div>

  <div className="col-12">
    <label htmlFor="advanced_search_date" className="form-label">
      Date <span className="text-danger">*</span>
    </label>
    <input
      type="date"
      id="advanced_search_date"
      className="form-control"
    />
  </div>

  {/* Optional Hidden Fields */}
  <div className="d-none">
    <label>Settle Amount (Fixed): {modalType}</label>
    <input
      type="number"
      value={selectedEntry.final.toFixed(2)}
      readOnly
    />
  </div>

  <div className="d-none">
    <label>Settlement Amount (Enter ≤ {selectedEntry.final.toFixed(2)}):</label>
    <input
      type="number"
      value={inputAmount}
      onChange={(e) =>
        setInputAmount(Math.abs(Number(e.target.value)))
      }
    />
  </div>

  <div className="d-none">
    <label>Remark:</label>
    <input
      type="text"
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
    />
  </div>

  {/* Modal Actions (Buttons) */}
  <div className="modal-actions mt-4">
    <button
      className="btn btn-success"
      onClick={async () => {
        if (!selectedEntry || !modalType) return;

        if (inputAmount > Number(Math.abs(selectedEntry.final).toFixed(2))) {
          alert("Settlement amount cannot exceed Settle Amount.");
          return;
        }

        const settleamount =
          modalType === "lena" ? -Math.abs(inputAmount) : Math.abs(inputAmount);

        const data = {
          ChildId: selectedEntry.ChildId,
          settleamount,
          remark,
          type: modalType,
        };

        try {
          await betService.postsettelement(data);
          setShowModal(false);
          const res = await betService.oneledger();
          const { lenaArray, denaArray } = processLedgerData(res.data.data);
          setLena(lenaArray);
          setDena(denaArray);
        } catch (err) {
          alert("Error during settlement.");
          console.error(err);
        }
      }}
    >
      Submit
    </button>
    <button
      className="btn bg-primary text-white"
      onClick={() => setShowModal(false)}
    >
      Back
    </button>
  </div>
</div>

          </div>
        )}
      </div>
    </>
  );
};

export default AllClientLedger;
