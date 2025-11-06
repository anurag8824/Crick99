import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import React from "react";
import "./ClientLedger.css"; // Import the CSS file
import { green } from "@mui/material/colors";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAppSelector } from "../../../redux/hooks";
import User from "../../../models/User";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { useNavigate, useParams } from "react-router-dom";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";

interface LedgerEntry {
  settled: any;
  ChildId: string;
  username: string;
  commissionlega: number;
  commissiondega: number;
  money: number;
  narration: string;
  _id: string;
  user: any;
}

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
}

const LedgerC = (dataid: any) => {
  console.log(dataid, "data in all client ledger");
  //   const [tableData, setTableData] = React.useState<LedgerItem[]>([

  const userState = useAppSelector<{ user: User }>(selectUserData);
  console.log(userState);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<GroupedEntry | null>(
    null
  );
  const [inputAmount, setInputAmount] = React.useState<number>(0);
  const [remark, setRemark] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<"lena" | "dena" | null>(
    null
  );

  const [lena, setLena] = React.useState<any[]>([]);
  const [dena, setDena] = React.useState<any[]>([]);
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

  const grandTotals = {
    lena: lenaTotals.final,
    dena: denaTotals.final,
  };
  const processLedgerData = (
    data: any[][]
  ): { lenaArray: any[]; denaArray: any[] } => {
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
      {
        username: string;
        cname: string;
        match: number;
        session: number;
        matchCom: number;
        sessionCom: number;
        upDownShare: number;
        positive: number;
        negative: number;
      }
    > = {};
    flatData.forEach((entry: any) => {
      if (!entry.settled) {
        const id = entry.ChildId;
        const username = entry.username;
        const cname = entry.cname;
        const isFancy = entry.Fancy;
        const money = Number(entry.money) || 0;
        const fammount = Number(entry.fammount) || 0;
        const commissiondega = Number(entry.commissiondega) || 0;
        const updown = Number(entry.umoney) || 0;

        if (!activeMap[id]) {
          activeMap[id] = {
            username,
            cname,
            match: 0,
            session: 0,
            matchCom: 0,
            sessionCom: 0,
            upDownShare: 0,
            positive: 0,
            negative: 0,
          };
        }

        // ✅ Divide match vs fancy (session)
        if (isFancy) {
          activeMap[id].session += fammount || money;
          activeMap[id].sessionCom += commissiondega;
        } else {
          activeMap[id].match += money;
          activeMap[id].matchCom += commissiondega;
        }

        // ✅ up/down share
        activeMap[id].upDownShare += updown;

        // ✅ Positive/Negative calc (for previous flow)
        const commission =
          userState.user.role === "dl" ? entry.commissiondega : 0;
        const adjustedMoney = entry.money - commission;

        if (adjustedMoney > 0) {
          activeMap[id].positive += Math.abs(adjustedMoney);
        } else {
          activeMap[id].negative += Math.abs(adjustedMoney);
        }
      }
    });

    const lenaArray: any[] = [];
    const denaArray: any[] = [];

    Object.entries(activeMap).forEach(
      ([
        ChildId,
        {
          username,
          cname,
          match,
          session,
          matchCom,
          sessionCom,
          upDownShare,
          positive,
          negative,
        },
      ]) => {
        const rawAmount = positive - negative;
        const settledAmount = settledMap[ChildId] || 0;
        const netFinal = rawAmount + settledAmount;

        const totalAmt = match + session;
        const totalCom = matchCom + sessionCom;
        const netAmt = totalAmt - totalCom;
        const finalBalance = netAmt + upDownShare;

        const baseData = {
          ChildId,
          agent: username,
          cname,
          match,
          session,
          totall: totalAmt,
          mCom: matchCom,
          sCom: sessionCom,
          tCom: totalCom,
          gTotal: netAmt,
          upDownShare,
          balance: finalBalance,
          settled: settledAmount,
          final: netFinal,
        };

        if (netFinal >= 0) {
          lenaArray.push(baseData);
        } else {
          lenaArray.push(baseData);
        }
      }
    );

    return { lenaArray, denaArray };
  };
  const settlementButton = async (id: any) => {
    // console.log(id,"chid from settlementButtonx")
    const data: any = { ChildId: id };
    await betService.postsettelement(data);
  };

  // const sendId = useParams().pid;
  const sendId = dataid?.dataid;

  console.log(sendId, "sendid ");

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!sendId) return;

    betService
      .pponeledger(sendId)
      .then((res: AxiosResponse<{ data: LedgerEntry[][] }>) => {
        console.log(res, "Ledger data response agenttt");
        const usert: any = res.data.data[2];
        if (usert?.user?.role === "user") {
          return;
        }
        console.log(usert.user.role, "role");
        const { lenaArray, denaArray } = processLedgerData(res.data.data);
        setLena(lenaArray);
        setDena(denaArray);
        console.log(res, "Processed ledger data 222");
      });
  }, [sendId, navigate]);

  console.log(lena, "le nan dattata");

  return (
    <>
      <div className="ledger-container">
        <div className="justify-content-between align-items-start">
          <div className="childdiv1 w-100">
            <div className=" overflow-auto">
              <table className="ledger-table">
                <thead className="small hiddedn">
                  <tr role="row ">
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small ng-binding sorting_disabled"
                    >
                      Client
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      M.AMT
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      S.AMT
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      TOT.AMT
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      M.COM
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      S.COM
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      TOT.COM
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      NET.AMT
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      SHR.AMT
                    </th>
                    <th
                      className="navbar-bet99 text-dark pt-2 pb-2 small sorting_disabled"
                    >
                      FINAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lena?.map((row, index) => (
                    <>
                        <tr key={row.ChildId}>
                          <td className="">
                            {row.agent}
                          </td>

                          <td className="ng-scope">
                            <span
                              className={
                                row.match < 0 ? "text-danger" : "text-success"
                              }
                            >
                              {`${row?.match?.toFixed(2)}`}
                            </span>
                          </td>

                          <td>{row.session}</td>
                          <td>{row.totall}</td>
                          <td>{row.mCom}</td>
                          <td>{row.sCom}</td>
                          <td>{row.tCom}</td>
                          <td>{row.gTotal}</td>
                          <td>{row.upDownShare}</td>
                          <td>{row.balance}</td>
                        </tr>
                        <LedgerC dataid={row.ChildId} />
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LedgerC;
