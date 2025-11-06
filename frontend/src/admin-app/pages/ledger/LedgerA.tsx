import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import React from "react";
import "./ClientLedger.css";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { useNavigate } from "react-router-dom";
import LedgerC from "./LedgerC";

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

const LedgerA = () => {
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

    const flatDatae =
      userState.user.role === "admin"
        ? data[0] // for admin
        : data[0]; // for others

    const flatData = flatDatae.filter(
      (item: any) => item.matchId == "34912508"
    );
    console.log(flatData, "flatdataallclientledger");

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
          lenaArray.push(baseData);
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
        <div
          style={{ background: "#0f2327" }}
          className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
        >
          <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
            Agent Ledger (Super)
          </span>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="btn bg-primary text-white"
          >
            <span>Back</span>
          </button>
        </div>

        <div className="childdiv1 w-100">
          <div className=" overflow-auto">
            <table className="ledger-table">
             
              <tbody>
                {lena.map((row) => (
                  <>
                    <tr key={row.ChildId}>
                      <td>
                        <span
                          style={{ color: "#1890ff" }}
                          // to={`/all-settlement/${row.ChildId}`}
                        >
                          <i className="fa fa-eye fa-xs"></i> {row.agent}
                        </span>
                      </td>

                    </tr>
                    <LedgerC dataid={row.ChildId} />
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LedgerA;
