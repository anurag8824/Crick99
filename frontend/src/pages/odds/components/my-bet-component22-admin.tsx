import moment from "moment";
import React from "react";
import { useWebsocketUser } from "../../../context/webSocketUser";
import IBet from "../../../models/IBet";
import { RoleType } from "../../../models/User";
import {
  selectPlaceBet,
  setBetCount,
  setbetlist,
  setBookMarketList,
} from "../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { betDateFormat } from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
import { useLocation, useNavigate } from "react-router-dom";
import accountService from "../../../services/account.service";

const MyBetComponent22Admin = () => {
  const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([]);

  const getPlaceBet = useAppSelector(selectPlaceBet);
  const getCurrentMatch = useAppSelector(selectCurrentMatch);
  const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const dispatch = useAppDispatch();
  const [betRefresh, setRefreshStatus] = React.useState<any>(false);
  const location = useLocation();
  React.useEffect(() => {
    // console.log(getCurrentMatch,"hello world here is Match id")
    console.log(
      getCasinoCurrentMatch?.match_id,
      " getCasinoCurrentMatch hello world here is Match id"
    );

    if (
      (getCurrentMatch &&
        getCurrentMatch.matchId &&
        location.pathname.includes("/odds")) ||
      (getCasinoCurrentMatch && getCasinoCurrentMatch.match_id)
    ) {
      const dataMatchId: any =
        getCurrentMatch &&
        getCurrentMatch.matchId &&
        location.pathname.includes("/odds")
          ? getCurrentMatch.matchId
          : getCasinoCurrentMatch && getCasinoCurrentMatch?.event_data?.match_id
          ? getCasinoCurrentMatch?.event_data?.match_id
          : 0;
      console.log("hello world match");
      accountService
        .getBets22(dataMatchId)
        .then((bets) => {
          console.log(bets.data, "chech bet dataggfgf");
          bets &&
            bets.data &&
            bets.data.data &&
            setMyAllBet(bets.data.data.bets);
          // dispatch(setbetlist(bets.data.data.bets))
          // dispatch(setBookMarketList(bets.data.data.odds_profit))
          // dispatch(setBetCount(bets.data.data.bets.length))
        })
        .catch((e) => {
          console.log(e.stack);
        });
    }
  }, [getCurrentMatch, getCasinoCurrentMatch, betRefresh]);

  React.useEffect(() => {
    if (getPlaceBet.bet.marketId) {
      //setMyAllBet([{ ...getPlaceBet.bet }, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true);
    }
  }, [getPlaceBet.bet]);

  React.useEffect(() => {
    socketUser.on("placedBet", (bet: IBet) => {
      ///setMyAllBet([bet, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true);
    });
    return () => {
      socketUser.off("placedBet");
    };
  }, [getMyAllBet]);

  React.useEffect(() => {
    socketUser.on("betDelete", ({ betId }) => {
      ///setMyAllBet(getMyAllBet.filter((bet: IBet) => bet._id !== betId))
      setRefreshStatus(betRefresh ? false : true);
      ///dispatch(setBookMarketList({}))
    });
    return () => {
      socketUser.off("betDelete");
    };
  }, [getMyAllBet]);

  const navigate = useNavigate();

  // totals calculate karne ke liye reduce
  const totals = React.useMemo(() => {
    let plus = 0;
    let minus = 0;

    getMyAllBet.forEach((bet) => {
      //@ts-ignore
      const val = Number(bet?.profitLoss?.$numberDecimal) || 0;
      if (val >= 0) {
        plus += val;
      } else {
        minus += val; // ye negative hoga
      }
    });

    return {
      plus: plus.toFixed(2),
      minus: minus.toFixed(2),
    };
  }, [getMyAllBet]);

  return (
    <>
      <div
        className="d-flelx justify-content-between d-none"
        style={{ fontSize: "13px" }}
      >
        <div>
          <span className="text-success">+{totals.plus}</span>
        </div>
        <div>
          <span className="text-danger">{totals.minus}</span>
        </div>
      </div>

      <div
        className="text-center text-white py-2"
        style={{ marginTop: "25px", background: "#0f2326" }}
      >
        <div style={{ fontSize: "13px" ,color:"white" }}>COMPLETED BETS(Admin)</div>
      </div>

      <div
        className="table-responsive-new"
        style={{ height: "", overflowY: "scroll" }}
      >
        <table className="table coupon-table scorall mybet table-bordered">
          <thead>
            <tr style={{ background: "#76d68f" }}>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                #
              </th>
              {userState.user.role !== RoleType.user && (
                <th
                  className="text-center px-2 py-2"
                  style={{
                    background: "#0f2326",
                    border: "none",
                    color: "white",
                  }}
                >
                  Username
                </th>
              )}
              <th
                style={{ background: "#0f2326", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
                Runner Name
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Type
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Bet Mode
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Price
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Value
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Amount
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
                Result
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                Status
              </th>

              {/* {userState.user.role !== RoleType.user && <th style={{background:"#0f2326" , border:"" , color:"white"}}> Status</th>} */}
            </tr>
          </thead>
          <tbody className="scorall">
            {getMyAllBet.map((bet: any, index: number) => (
              <tr
                style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                key={bet._id}
              >
                <td
                  className="no-wrap p-2 "
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {" "}
                  {index + 1}{" "}
                </td>
                {userState.user.role !== RoleType.user && (
                  <td
                    className="p-1"
                    style={{
                      background: bet.isBack ? "#72BBEF" : "#faa9ba",
                      fontSize: "12px",
                    }}
                  >
                    {bet.userName}({bet?.code})
                  </td>
                )}
                <td
                  className="no-wrap text-center p-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {bet.selectionName}
                  {/* {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}{" "} */}
                </td>
                <td
                  className="no-wrap text-center p-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {bet?.bet_on}
                </td>
                <td
                  className="no-wrap text-center"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {bet.isBack ? "Yes" : "No"}{" "}
                </td>

                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}
                </td>
                {/* <td className='no-wrap'>{Math.abs(bet?.profitLoss?.$numberDecimal).toFixed(2)}</td> */}

                <td
                  className="no-wrap text-center px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.odds
                    : bet.selectionName}{" "}
                </td>
                <td
                  className="no-wrap px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {Math.abs(Number(bet?.profitLoss?.$numberDecimal)).toFixed(2)}
                </td>

                {/* <td className='no-wrap text-center' > {bet.isBack ? "Yes" : "No"} </td> */}

                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.betClickTime).format(betDateFormat)} </td>
              )} */}
                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.createdAt).format(betDateFormat)} </td>
              )} */}

                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "15px",
                  }}
                >
                  {bet.bet_on === "MATCH_ODDS"
                    ? (() => {
                        const market = bet?.result?.[0]; // pehla market object
                        if (market && market.result) {
                          // result value hai -> runnerName find karna
                          const runner = market.runners?.find(
                            (r: any) => r.selectionId === Number(market.result)
                          );
                          return runner ? runner.runnerName : market.result;
                        } else {
                          return "YES"; // agar result hi nahi hai
                        }
                      })()
                    : bet?.result?.result
                    ? bet.result?.result
                    : "YES"}
                </td>
                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "15px",
                  }}
                >
                  {" "}
                  {bet.status}{" "}
                </td>

               
              </tr>
            ))}

            <tr
              className=""
              style={{ fontWeight: "bold", background: "#f0f0f0" }}
            >
              <td
                colSpan={userState.user.role !== RoleType.user ? 4 : 3}
                className="text-center p-2"
              >
                Total Plus Minus
              </td>
              <td
                className="text-center"
                style={{
                  color:
                    Number(totals.plus) + Number(totals.minus) >= 0
                      ? "green"
                      : "red",
                }}
              >
                {Number(totals.plus) + Number(totals.minus)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyBetComponent22Admin;
