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
import { CustomLink } from "../../_layout/elements/custom-link";
import FilterSection from "./FilterSection";
import MyBetComponent22Admin from "./my-bet-component22-admin";
import { Modal } from "react-bootstrap";
import BetDetailsModal from "./BetDetailsModal";
import { AxiosResponse } from "axios";
import userService from "../../../services/user.service";
import UserService from "../../../services/user.service";


const MyBetComponent22AdminCombined = () => {
  const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([]);

  const getPlaceBet = useAppSelector(selectPlaceBet);
  const getCurrentMatch = useAppSelector(selectCurrentMatch);
  const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const dispatch = useAppDispatch();
  const [betRefresh, setRefreshStatus] = React.useState<any>(false);
  const location = useLocation();

  const [selectedSelection, setSelectedSelection] = React.useState("");

  const handleShowBets = (selectionName:any, bets:any) => {
    setSelectedBets(bets);
    setSelectedSelection(selectionName);
    setShowModal(true);
  };


  const [showModal, setShowModal] = React.useState(false);
const [selectedBets, setSelectedBets] = React.useState([]);

 const [shared, setShared] = React.useState<any>();
   React.useEffect(() => {
      // const userState = useAppSelector<{ user: User }>(selectUserData);
      const username: any = userState?.user?.username;
  
      console.log(username, "testagentmaster");
      UserService.getParentUserDetail(username).then(
        (res: AxiosResponse<any>) => {
          console.log(res, "check balance for parent");
          const thatb = res?.data?.data[0];
          setShared(thatb?.share);
        }
      );
    }, [userState]);

const [fancyPercent, setFancyPercent] = React.useState<number>(0);


const handleShowDetails = (selectionName:any) => {
  const filtered:any = getMyAllBet.filter(b => b.selectionName === selectionName);
  setSelectedBets(filtered);
  setShowModal(true);
};


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
      const pl = Number(bet?.profitLoss?.$numberDecimal) || 0;
      const val = (pl * fancyPercent) / 100;
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
  }, [getMyAllBet,fancyPercent]);

  // Combine bets by selectionName
const combinedBets = React.useMemo(() => {
    const map = new Map<string, any>();
  
    getMyAllBet.forEach((bet:any) => {
      const key = bet.selectionName;
      const profitLoss =   Number(bet?.profitLoss?.$numberDecimal) || 0;
  
      if (map.has(key)) {
        const existing = map.get(key);
        map.set(key, {
          ...existing,
          totalPL: existing.totalPL + profitLoss,
          bets: [...existing.bets, bet],
        });
      } else {
        map.set(key, {
          ...bet,
          totalPL: profitLoss,
          bets: [bet],
        });
      }
    });
  
    return Array.from(map.values());
  }, [getMyAllBet]);



    const [searchObj, setSearchObj] = React.useState({
      username: "",
      type: "",
      search: "",
      status: "",
      page: 1,
    });


   // const [userList, setUserList] = React.useState([]);
    const [userList, setUserList] = React.useState<any>({});
  
    const getList = (obj: {
      username: string;
      type: string;
      search: string;
      status?: string;
      page?: number;
    }) => {
      const fullObj = {
        username: userState?.user?.username,
        type: obj.type,
        search: obj.search,
        status: obj.status ?? "", // fallback to empty string
        page: obj.page ?? 1, // fallback to 1
      };
  
      userService.getUserList(fullObj).then((res: AxiosResponse<any>) => {
        setSearchObj(fullObj); // ✅ Now matches the expected state shape
        console.log(res?.data?.data, "lista i want to render");
        setUserList(res?.data?.data);
      });
    };
  
    React.useEffect(() => {
      getList(searchObj); // Trigger on mount or when searchObj changes
    }, [userState]);

   const userMap = React.useMemo(() => {
      const map: any = {};
      userList?.items?.forEach((u: any) => {
        map[u.username] = u;
      });
      console.log(map, "user map");
      return map;
    }, [userList]);
  
  
  
  
    const getFinalParentPercentForFancy = (bet: any) => {
      // ✅ Only for FANCY bets
      if (bet?.bet_on !== "FANCY") return 0;
    
      let currentUser = userMap[bet.userName];
      let lastUser = currentUser;
    
      while (currentUser && currentUser.parentNameStr) {
        const parent = userMap[currentUser.parentNameStr];
        if (!parent) break;
    
        lastUser = parent;
        currentUser = parent;
      }
    
      if (!lastUser) return 0;
    
      return (lastUser.pshare || 0) - (lastUser.share || 0);
    };
  
    const calculateFancyPercent = () => {
      if (!getMyAllBet?.length) return;
    
      // 🔹 first fancy bet (agar multiple ho to logic change kar sakte ho)
      const fancyBet = getMyAllBet.find(
        (bet: any) => bet.bet_on === "FANCY"
      );
    
      if (!fancyBet) {
        setFancyPercent(0);
        return;
      }
    
      const percent = getFinalParentPercentForFancy(fancyBet);
      setFancyPercent(percent);
    
      // console.log("🎯 FANCY FINAL PERCENT:", percent);
    };
    
    React.useEffect(() => {
      if (userList?.items?.length && getMyAllBet?.length) {
        calculateFancyPercent();
      }
    }, [getMyAllBet, userList]);
  


  

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
                Comm+
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
               Comm -
              </th>
             
            
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
              Winner
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
              PL
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                Action
              </th>

          
            </tr>
          </thead>
          <tbody className="scorall">
            {combinedBets?.map((bet: any, index: number) => (
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
                
                <td
                  className="no-wrap text-center p-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {bet.selectionName}
               
                </td>
                
             

               
              
                <td
                  className="no-wrap px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                 0
                </td>

                <td
                  className="no-wrap px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                 0
                </td>


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
                  className="no-wrap px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {userState?.user?.role == "dl" ?  (
  (parseFloat(bet?.totalPL) * shared) / 100
).toFixed(2) :  (
  (parseFloat(bet?.totalPL) * fancyPercent) / 100
).toFixed(2)}
                </td>
                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#dff512ff" : "#dff512ff",
                    fontSize: "15px",
                  }}
                >
                  <button onClick={() => handleShowDetails(bet.selectionName)}>Show Bets</button>
               
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
                      ? "red"
                      : "green",
                }}
              >
                {Number(totals.plus) + Number(totals.minus)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>


        <BetDetailsModal
  show={showModal}
  onClose={() => setShowModal(false)}
  bets={selectedBets}
/>

     
      </div>
    </>
  );
};

export default MyBetComponent22AdminCombined;
