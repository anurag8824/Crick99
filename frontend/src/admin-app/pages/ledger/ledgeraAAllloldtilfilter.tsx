
// import React, { useEffect, useState } from "react";
// import betService from "../../../services/bet.service";
// import { AxiosResponse } from "axios";
// import { useAppSelector } from "../../../redux/hooks";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";
// import { useNavigate } from "react-router-dom";
// import "./ClientLedger.css";

// interface LedgerEntry {
//   settled: boolean;
//   ChildId: string;
//   username: string;
//   commissionlega: number;
//   commissiondega: number;
//   money: number;
//   narration: string;
//   cname: string;
//   _id: string;
//   Fancy?: boolean;
//   fammount?: number;
//   umoney?: number;
//   user?: any;
// }

// interface GroupedEntry {
//   agent: string;
//   amount: number;
//   settled: number;
//   final: number;
//   ChildId: string;
//   cname: string;
//   match?: number;
//   session?: number;
//   mCom?: number;
//   sCom?: number;
//   tCom?: number;
//   gTotal?: number;
//   upDownShare?: number;
//   balance?: number;
// }

// interface LedgerNodeProps {
//   parentId?: string;
//   level?: number;
// }

// const RecursiveLedger: React.FC<LedgerNodeProps> = ({ parentId, level = 0 }) => {
//   const userState = useAppSelector(selectUserData);
//   const [entries, setEntries] = useState<GroupedEntry[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const processLedgerData = (data: LedgerEntry[][]): GroupedEntry[] => {
//     const flatData = data[0] || [];

//     const settledMap: Record<string, number> = {};
//     flatData.forEach((entry) => {
//       if (entry.settled) {
//         if (!settledMap[entry.ChildId]) settledMap[entry.ChildId] = 0;
//         settledMap[entry.ChildId] += entry.money;
//       }
//     });

//     const activeMap: Record<
//       string,
//       {
//         username: string;
//         cname: string;
//         match: number;
//         session: number;
//         matchCom: number;
//         sessionCom: number;
//         upDownShare: number;
//         positive: number;
//         negative: number;
//       }
//     > = {};

//     flatData.forEach((entry) => {
//       if (!entry.settled) {
//         const id = entry.ChildId;
//         if (!activeMap[id]) {
//           activeMap[id] = {
//             username: entry.username,
//             cname: entry.cname,
//             match: 0,
//             session: 0,
//             matchCom: 0,
//             sessionCom: 0,
//             upDownShare: 0,
//             positive: 0,
//             negative: 0,
//           };
//         }

//         const money = Number(entry.money) || 0;
//         const fammount = Number(entry.fammount) || 0;
//         const commissiondega = Number(entry.commissiondega) || 0;
//         const updown = Number(entry.umoney) || 0;

//         if (entry.Fancy) {
//           activeMap[id].session += fammount || money;
//           activeMap[id].sessionCom += commissiondega;
//         } else {
//           activeMap[id].match += money;
//           activeMap[id].matchCom += commissiondega;
//         }

//         activeMap[id].upDownShare += updown;
//       }
//     });

//     const result: GroupedEntry[] = [];

//     Object.entries(activeMap).forEach(
//       ([
//         ChildId,
//         { username, cname, match, session, matchCom, sessionCom, upDownShare },
//       ]) => {
//         const totalAmt = match + session;
//         const totalCom = matchCom + sessionCom;
//         const netAmt = totalAmt - totalCom;
//         const finalBalance = netAmt + upDownShare;
//         const settled = settledMap[ChildId] || 0;
//         const final = finalBalance + settled;

//         result.push({
//           ChildId,
//           agent: `${username} (${cname})`,
//           cname,
//           amount: totalAmt,
//           settled,
//           final,
//           match,
//           session,
//           mCom: matchCom,
//           sCom: sessionCom,
//           tCom: totalCom,
//           gTotal: netAmt,
//           upDownShare,
//           balance: finalBalance,
//         });
//       }
//     );

//     return result;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res: AxiosResponse<{ data: any[][] }> = parentId
//           ? await betService.pponeledger(parentId)
//           : await betService.oneledger();

//         const usert:any = res.data.data[2];
//         if (usert?.user?.role === "user") {
//           setEntries([]); // stop recursion at user level
//           setLoading(false);
//           return;
//         }

//         const ledgerData = processLedgerData(res.data.data);
//         setEntries(ledgerData);
//       } catch (err) {
//         console.error("Ledger fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [parentId]);

//   if (loading) {
//     return (
//       <tr>
//         <td colSpan={10} style={{ paddingLeft: `${level * 25}px` }}>
//           Loading...
//         </td>
//       </tr>
//     );
//   }

//   return (
//     <>
//       {entries.map((row) => (
//         <React.Fragment key={row.ChildId}>
//           <tr>
//             <td style={{ paddingLeft: `${level * 25}px` }}>{row.agent}</td>
//             <td className={row.match! < 0 ? "text-danger" : "text-success"}>
//     {row.match?.toFixed(2)}
//   </td>

//   <td className={row.session! < 0 ? "text-danger" : "text-success"}>
//     {row.session?.toFixed(2)}
//   </td>

//   <td className={row.amount! < 0 ? "text-danger" : "text-success"}>
//     {row.amount.toFixed(2)}
//   </td>

//   <td className={row.mCom! < 0 ? "text-danger" : "text-success"}>
//     {row.mCom}
//   </td>

//   <td className={row.sCom! < 0 ? "text-danger" : "text-success"}>
//     {row.sCom}
//   </td>

//   <td className={row.tCom! < 0 ? "text-danger" : "text-success"}>
//     {row.tCom}
//   </td>

//   <td className={row.gTotal! < 0 ? "text-danger" : "text-success"}>
//     {row.gTotal}
//   </td>

//   <td className={row.upDownShare! < 0 ? "text-danger" : "text-success"}>
//     {row.upDownShare}
//   </td>

//   <td className={row.balance! < 0 ? "text-danger" : "text-success"}>
//     {row.balance}
//   </td>
//           </tr>

//           {/* Recursive child table rows */}
//           <RecursiveLedger parentId={row.ChildId} level={level + 1} />
//         </React.Fragment>
//       ))}
//     </>
//   );
// };

// const LedgerAllInOne: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="container-fluid p-md-4 mt-3">
//       <div
//         style={{ background: "#0f2327" }}
//         className="bg-grey flex item-center justify-between px-5 py-3 gx-bg-flex"
//       >
//         <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
//           Agent Ledger (Recursive)
//         </span>
//         <button
//           onClick={() => navigate(-1)}
//           type="button"
//           className="btn bg-primary text-white"
//         >
//           Back
//         </button>
//       </div>

//       <div className="childdiv1 w-100 overflow-auto">
//         <table className="ledger-table">
//           <thead>
//             <tr>
//               <th  className="navbar-bet99">Client</th>
//               <th className="navbar-bet99">M.AMT</th>
//               <th className="navbar-bet99">S.AMT</th>
//               <th className="navbar-bet99">TOT.AMT</th>
//               <th className="navbar-bet99">M.COM</th>
//               <th className="navbar-bet99">S.COM</th>
//               <th className="navbar-bet99">TOT.COM</th>
//               <th className="navbar-bet99">NET.AMT</th>
//               <th className="navbar-bet99">SHR.AMT</th>
//               <th className="navbar-bet99">FINAL</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Start recursion from root */}
//             <RecursiveLedger />
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LedgerAllInOne;

import React, { useEffect, useState } from "react";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { useNavigate, useParams } from "react-router-dom";
import "./ClientLedger.css";

interface LedgerEntry {
  settled: boolean;
  ChildId: string;
  username: string;
  commissionlega: number;
  commissiondega: number;
  money: number;
  narration: string;
  cname: string;
  _id: string;
  Fancy?: boolean;
  fammount?: number;
  umoney?: number;
  user?: any;
}

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
  cname: string;
  match?: number;
  session?: number;
  mCom?: number;
  sCom?: number;
  tCom?: number;
  gTotal?: number;
  upDownShare?: number;
  balance?: any;
  role?: string;
}

interface LedgerNodeProps {
  parentId?: string;
  level?: number;
}

const RecursiveLedger: React.FC<LedgerNodeProps> = ({ parentId, level = 0 }) => {
  const userState = useAppSelector(selectUserData);
  const [entries, setEntries] = useState<GroupedEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const smatchId = useParams().id;

  const processLedgerData = (data: LedgerEntry[][]): GroupedEntry[] => {

    const flatDatas = data[0] || [];
    const flatData = flatDatas?.filter((entry:any) => entry?.matchId  == smatchId ); // Exclude test entries

    const settledMap: Record<string, number> = {};
    console.log(flatData, "flatData");
    
    flatData.forEach((entry) => {
      if (entry.settled) {
        if (!settledMap[entry.ChildId]) settledMap[entry.ChildId] = 0;
        settledMap[entry.ChildId] += entry.money;
      }
    });

    const activeMap: Record<
      string,
      {
        username: string;
        cname: string;
        role: string;
        match: number;
        session: number;
        matchCom: number;
        sessionCom: number;
        upDownShare: number;
      }
    > = {};

    flatData.forEach((entry) => {
      const id = entry.ChildId;
      // 🔍 Detect role from username text
  let role = "";
  const uname = entry?.username?.toUpperCase() || "";

  if (uname.includes("CL")) role = "CL";
  else if (uname.includes("SA")) role = "SA";
  else if (uname.includes("ADM")) role = "ADM";
  else if (uname.includes("MA")) role = "MA";
  else if (uname.includes("AD")) role = "AD";
  else if (uname.includes("A")) role = "A";  

  

      if (!activeMap[id]) {
        activeMap[id] = {
          username: entry.username,
          cname: entry.cname,
          role,
          match: 0,
          session: 0,
          matchCom: 0,
          sessionCom: 0,
          upDownShare: 0,
        };
      }

      const money = Number(entry?.money) || 0;
      const fammount = Number(entry?.fammount) || 0;
      const commissiondega = Number(entry?.commissionlega) || 0;
      const updown = Number(entry?.umoney) || 0;

      if (entry.Fancy) {
        activeMap[id].session += fammount || money;
        activeMap[id].sessionCom += commissiondega;
      } else {
        activeMap[id].match += money;
        activeMap[id].matchCom += commissiondega;
      }

      activeMap[id].upDownShare += updown;
    });

    const result: GroupedEntry[] = [];

    Object.entries(activeMap).forEach(
      ([
        ChildId,
        { username, cname, match, session, matchCom, sessionCom, upDownShare, role },
      ]) => {
        const totalAmt = match + session;
        const totalCom = matchCom + sessionCom;
        const netAmt = totalAmt - totalCom;
        const finalBalance = netAmt - upDownShare;
        const settled = settledMap[ChildId] || 0;
        const final = finalBalance + settled;

        result.push({
          ChildId,
          agent: `${username} (${cname})`,
          cname,
          amount: totalAmt,
          settled,
          final,
          match,
          session,
          mCom: matchCom,
          sCom: sessionCom,
          tCom: totalCom,
          gTotal: netAmt,
          upDownShare,
          balance: finalBalance.toFixed(2),
          role,
        });
      }
    );

    return result;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res: AxiosResponse<{ data: any[][] }> = parentId
          ? await betService.pponeledger(parentId)
          : await betService.oneledger();

        const usert: any = res.data.data[2];
        if (usert?.user?.role === "user") {
          setEntries([]);
          setLoading(false);
          return;
        }

        const ledgerData = processLedgerData(res.data.data);
        setEntries(ledgerData);
      } catch (err) {
        console.error("Ledger fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId]);

  if (loading) {
    return (
      <tr>
        <td colSpan={10} style={{ paddingLeft: `${level * 25}px` }}>
          Loading...
        </td>
      </tr>
    );
  }



  const clRows = entries.filter((e) => e.role === "CL");

const totals = clRows.reduce(
  (acc, row) => {
    acc.match += row.match || 0;
    acc.session += row.session || 0;
    acc.amount += row.amount || 0;
    acc.mCom += row.mCom || 0;
    acc.sCom += row.sCom || 0;
    acc.tCom += row.tCom || 0;
    acc.gTotal += row.gTotal || 0;
    acc.upDownShare += row.upDownShare || 0;
    acc.balance += Number(row.balance) || 0;
    return acc;
  },
  {
    match: 0,
    session: 0,
    amount: 0,
    mCom: 0,
    sCom: 0,
    tCom: 0,
    gTotal: 0,
    upDownShare: 0,
    balance: 0,
  }
);

console.log(totals, "totals");


  // 🎨 Color map by role
  const roleColors: Record<string, string> = {
    SA: "#ff7b7b",   // soft red
  A: "#6edb8c",    // fresh light green
  ADM: "#b58bff",  // light violet / lavender
  AD: "#f6a5d8",   // light pink
  MA: "#7bbcff",   // sky blue
  };




  console.log(entries, "entries at level", level);

  // return (
  //   <>
  //     {entries.map((row) => {
  //       // If not CL, show simple centered color row
  //       if (row.role !== "CL") {
  //         return (
  //           <React.Fragment key={row.ChildId}>
  //             <tr>
  //               <td
  //                 colSpan={10}
  //                 style={{
  //                   textAlign: "center",
  //                   background: roleColors[row.role!] || "#333",
                
  //                   fontWeight: "bold",
  //                   paddingLeft: `${level * 25}px`,
  //                 }}
  //               >
  //                 {row.agent} — {row.role}
  //               </td>
  //             </tr>

  //             {/* Even non-CL roles can have children */}
  //             <RecursiveLedger parentId={row.ChildId} level={level + 1} />
  //           </React.Fragment>
  //         );
  //       }

  //       // CL role → show full row
  //       return (
  //         <React.Fragment key={row.ChildId}>
  //           <tr>
  //             <td style={{ paddingLeft: `${level * 25}px` }}>{row.agent}</td>

  //             <td className={row.match! < 0 ? "text-danger" : "text-success"}>
  //               {row.match?.toFixed(2)}
  //             </td>

  //             <td className={row.session! < 0 ? "text-danger" : "text-success"}>
  //               {row.session?.toFixed(2)}
  //             </td>

  //             <td className={row.amount! < 0 ? "text-danger" : "text-success"}>
  //               {row.amount.toFixed(2)}
  //             </td>

  //             <td className={row.mCom! < 0 ? "text-danger" : "text-success"}>
  //               {row.mCom}
  //             </td>

  //             <td className={row.sCom! < 0 ? "text-danger" : "text-success"}>
  //               {row.sCom}
  //             </td>

  //             <td className={row.tCom! < 0 ? "text-danger" : "text-success"}>
  //               {row.tCom}
  //             </td>

  //             <td className={row.gTotal! < 0 ? "text-danger" : "text-success"}>
  //               {row.gTotal}
  //             </td>

  //             <td
  //               className={
  //                 row.upDownShare! < 0 ? "text-danger" : "text-success"
  //               }
  //             >
  //               {row.upDownShare}
  //             </td>

  //             <td className={row.balance! < 0 ? "text-danger" : "text-success"}>
  //               {row.balance}
  //             </td>
  //           </tr>

  //           {/* Recursive child ledger */}
  //           <RecursiveLedger parentId={row.ChildId} level={level + 1} />
  //         </React.Fragment>
  //       );
  //     })}
  //   </>
  // );
  return (
    <>
      {entries.map((row) => {
        // If not CL, show simple colored row and recurse deeper
        if (row.role !== "CL") {
          return (
            <React.Fragment key={row.ChildId}>
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    background: roleColors[row.role!] || "#333",
                    fontWeight: "bold",
                    paddingLeft: `${level * 25}px`,
                  }}
                >
                  {row.agent} — {row.role}
                </td>
              </tr>
  
              {/* Even non-CL roles can have children */}
              <RecursiveLedger parentId={row.ChildId} level={level + 1} />
            </React.Fragment>
          );
        }

        
  
        return null;
      })}
  
      {/* 🧾 If this level has any CL rows, show its own header + rows */}
      {entries.some((r) => r.role === "CL") && (
        <>
          <tr>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              Client
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              M.AMT
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              S.AMT
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              TOT.AMT
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              M.COM
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              S.COM
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              TOT.COM
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              NET.AMT
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              SHR.AMT
            </th>
            <th className="navbar-bet99" style={{ background: "#0f2327", color: "white" }}>
              FINAL
            </th>
          </tr>
  
          {entries
            ?.filter((row) => row.role == "CL")
            .map((row) => (
              <React.Fragment key={row.ChildId}>
                <tr>
                  <td style={{ paddingLeft: `${level * 25}px` }}>{row.agent}</td>
  
                  <td className={row.match! < 0 ? "text-danger" : "text-success"}>
                    {row.match?.toFixed(2)}
                  </td>
                  <td className={row.session! < 0 ? "text-danger" : "text-success"}>
                    {row.session?.toFixed(2)}
                  </td>
                  <td className={row.amount! < 0 ? "text-danger" : "text-success"}>
                    {row.amount.toFixed(2)}
                  </td>
                  <td className={row.mCom! < 0 ? "text-danger" : "text-success"}>{row.mCom}</td>
                  <td className={row.sCom! < 0 ? "text-danger" : "text-success"}>{row.sCom}</td>
                  <td className={row.tCom! < 0 ? "text-danger" : "text-success"}>{row.tCom}</td>
                  <td className={row.gTotal! < 0 ? "text-danger" : "text-success"}>{row.gTotal}</td>
                  <td className={row.upDownShare! < 0 ? "text-danger" : "text-success"}>
                    {row.upDownShare}
                  </td>
                  <td className={row.balance! < 0 ? "text-danger" : "text-success"}>
                    {row.balance}
                  </td>
                </tr>
               
  
                {/* Recursive call for any children of this CL (rare but allowed) */}
                <RecursiveLedger parentId={row.ChildId} level={level + 1} />
              </React.Fragment>
            ))}


{clRows.length > 0 && (
  <tr style={{ background: "#1b3a3oof", fontWeight: "bkkold" }}>
    <td style={{ color: "whitke" }}>TOTAL</td>

    <td className={totals.match < 0 ? "text-danger" : "text-success"}>
      {totals.match.toFixed(2)}
    </td>

    <td className={totals.session < 0 ? "text-danger" : "text-success"}>
      {totals.session.toFixed(2)}
    </td>

    <td className={totals.amount < 0 ? "text-danger" : "text-success"}>
      {totals.amount.toFixed(2)}
    </td>

    <td className={totals.mCom < 0 ? "text-danger" : "text-success"}>
      {totals.mCom.toFixed(2)}
    </td>

    <td className={totals.sCom < 0 ? "text-danger" : "text-success"}>
      {totals.sCom.toFixed(2)}
    </td>

    <td className={totals.tCom < 0 ? "text-danger" : "text-success"}>
      {totals.tCom.toFixed(2)}
    </td>

    <td className={totals.gTotal < 0 ? "text-danger" : "text-success"}>
      {totals.gTotal.toFixed(2)}
    </td>

    <td className={totals.upDownShare < 0 ? "text-danger" : "text-success"}>
      {totals.upDownShare.toFixed(2)}
    </td>

    <td className={totals.balance < 0 ? "text-danger" : "text-success"}>
      {totals.balance.toFixed(2)}
    </td>
  </tr>
)}




        </>
      )}
    </>
  );
  
};

const LedgerAllInOneOLLDDD: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-md-4 mt-3">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey flex item-center justify-between px-5 py-3 gx-bg-flex"
      >
        <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
          Agent Ledger
        </span>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn bg-primary text-white"
        >
          Back
        </button>
      </div>

      <div className="childdiv1 w-100 overflow-auto">
        <table className="ledger-table">
      
          <tbody>
            <RecursiveLedger />
          </tbody>
        </table>
      </div>
    </div>

    
  );
};

export default LedgerAllInOneOLLDDD;







