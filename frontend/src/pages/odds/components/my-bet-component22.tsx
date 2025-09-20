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

const MyBetComponent22 = () => {
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

  return (
    <>
      <div
        className="text-center text-white"
        style={{ marginTop: "15px", background: "#535961" }}
      >
        <div>COMPLETED BETS</div>
      </div>

      <div
        className="table-responsive-new"
        style={{ height: "", overflowY: "scroll" }}
      >
        <table className="table coupon-table scorall mybet table-bordered">
          <thead>
            <tr style={{ background: "#76d68f" }}>
              <th style={{ background: "#0f2326", border: "", color: "white" }}>
                #
              </th>
              {userState.user.role !== RoleType.user && (
                <th
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
                className="text-center"
              >
                {" "}
                Runner Name
              </th>
              <th style={{ background: "#0f2326", border: "", color: "white" }}>
                {" "}
                Type
              </th>
              <th style={{ background: "#0f2326", border: "", color: "white" }}>
                {" "}
                Price
              </th>
              <th style={{ background: "#0f2326", border: "", color: "white" }}>
                {" "}
                Value
              </th>
              <th style={{ background: "#0f2326", border: "", color: "white" }}>
                {" "}
                Amount
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center"
              >
                {" "}
                Result
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center"
              >
                Status
              </th>

              {/* {userState.user.role !== RoleType.user && <th style={{background:"#0f2326" , border:"" , color:"white"}}> Status</th>} */}
            </tr>
          </thead>
          <tbody className="scorall">
            {getMyAllBet.map((bet: any, index: number) => (
              <tr
                className={
                  bet.profitLoss?.$numberDecimal < 0
                    ? "bg-danger text-white"
                    : "bg-success"
                }
                key={bet._id}
              >
                <td className="no-wrap"> {index + 1} </td>
                {userState.user.role !== RoleType.user && (
                  <td>{bet.userName}</td>
                )}
                <td className="no-wrap text-center">
                  {" "}
                  {bet.selectionName} /{" "}
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}{" "}
                </td>
                <td className="no-wrap text-center">{bet?.bet_on}</td>
                <td className="no-wrap text-center">
                  {" "}
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}
                </td>
                {/* <td className='no-wrap'>{Math.abs(bet?.profitLoss?.$numberDecimal).toFixed(2)}</td> */}

                <td className="no-wrap text-center">
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.odds
                    : "-"}{" "}
                </td>
                <td className="no-wrap">
                  {Math.abs(Number(bet?.profitLoss?.$numberDecimal)).toFixed(2)}
                </td>

                {/* <td className='no-wrap text-center' > {bet.isBack ? "Yes" : "No"} </td> */}

                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.betClickTime).format(betDateFormat)} </td>
              )} */}
                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.createdAt).format(betDateFormat)} </td>
              )} */}

                <td className="no-wrap text-center">
                  {" "}
                  {bet?.result?.result ? bet?.result?.result : "YES"}{" "}
                </td>
                <td className="no-wrap text-center"> {bet.status} </td>

                {/* {userState.user.role !== RoleType.user && <td className='no-wrap'>{moment.utc(bet.betClickTime).utcOffset('+05:30').format('DD/MM/YYYY hh:mm:ss A')}</td>} */}
              </tr>
            ))}
          </tbody>
        </table>

        
      </div>
    </>
  );
};

export default MyBetComponent22;
