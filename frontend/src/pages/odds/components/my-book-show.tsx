import moment from "moment";
import React, { MouseEvent } from "react";
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
import betService from "../../../services/bet.service";
import { betDateFormat } from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import userService from "../../../services/user.service";
import UserService from "../../../services/user.service";


const MyBookShow = () => {
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
      betService
        .getBets(dataMatchId)
        .then((bets) => {
          console.log(bets.data, "chech bet data");
          bets &&
            bets.data &&
            bets.data.data &&
            setMyAllBet(bets.data.data.bets);
          dispatch(setbetlist(bets.data.data.bets));
          dispatch(setBookMarketList(bets.data.data.odds_profit));
          dispatch(setBetCount(bets.data.data.bets.length));
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

  console.log(getMyAllBet, "get my all bets");

  const [bookData, setBookData] = React.useState<any>({});

  const userMap = React.useMemo(() => {
    const map: any = {};
    userList?.items?.forEach((u: any) => {
      map[u.username] = u;
    });
    console.log(map, "user map");
    return map;
  }, [userList]);

  const getLastParent = (clientUsername: string) => {
    let currentUser = userMap[clientUsername];
    let lastUser = currentUser;
  
    while (currentUser && currentUser.parentNameStr) {
      const parent = userMap[currentUser.parentNameStr];
      if (!parent) break;
  
      lastUser = parent;
      currentUser = parent;
    }

    console.log(lastUser, "last user");
  
    return lastUser;
  };

  const applyLastParentShare = (value: number, clientUsername: string) => {
    const lastParent = getLastParent(clientUsername);
  
    if (!lastParent) return value;
  
    const percent =
      (lastParent.pshare || 0) - (lastParent.share || 0);
  
    // ❗ minus nahi, multiply
    return value * (percent / 100);
  };
  
  

  const applyParentShareOldd = (value: number, parentName: string) => {
    let finalValue = value;
    let currentParent = parentName;

    while (currentParent && userMap[currentParent]) {
      const user = userMap[currentParent];
      const percent = (user.pshare || 0) - (user.share || 0);

      finalValue = finalValue - (finalValue * percent) / 100;
      currentParent = user.parentNameStr;
    }

    return finalValue;
  };




  const calculateBook = () => {
    const result: any = {};

    const matchOddsBets = getMyAllBet.filter(
      (b: any) => b.bet_on === "MATCH_ODDS"
    );

    console.log(matchOddsBets, "match odds bets");

    matchOddsBets.forEach((bet: any) => {
      const runners = bet.runners || [];
      const selected = bet.selectionName;

      runners.forEach((runner: any) => {
        let value = 0;

        const isSelected = runner.runnerName === selected;

        if (bet.isBack) {
          if (isSelected) {
            value = bet.stack * (1 - bet.odds);
          } else {
            value = -bet.stack;
          }
        } else {
          if (isSelected) {
            value = bet.stack * (1 - bet.odds);
          } else {
            value = bet.stack;
          }
        }

        // 🔗 Apply parent hierarchy share
       const finalValue = applyLastParentShare(value, bet.parentNameStr);

        // ➕ Sum values
        result[runner.runnerName] = (result[runner.runnerName] || 0) + finalValue;
      });
    });

    setBookData(result);

    console.log("📘 FINAL BOOK:", result);
    return result;
  };

  React.useEffect(() => {
    if (getMyAllBet.length && userList?.items?.length) {
      calculateBook();
    }
  }, [getMyAllBet, userList]);

  const [fancyPercent, setFancyPercent] = React.useState<number>(0);


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
    <div>
      {userState.user.role !== RoleType.user &&
        userState.user.role !== RoleType.admin && (
          <div
            style={{
              // width: "300px",
              // border: "1px solid #ccc",
              borderRadius: "6px",
              // padding: "10px",
              marginTop: "10px",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              <button className="btn bg-primary text-white">My Book</button>
            </div>

            <table style={{ width: "100%", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  {/* <th align="left">Selection</th> */}
                  {/* <th align="right">Amount</th> */}
                </tr>
              </thead>

              <tbody>
                {Object.entries(bookData).map(([selection, value]: any) => (
                  <tr
                    key={selection}
                    style={{ border: "1px solid #f0f0f0", padding: `5px` }}
                  >
                    <td style={{ padding: "5px" }}>{selection}</td>
                    <td
                      align="left"
                      style={{
                        color: value >= 0 ? "red" : "green",
                        fontWeight: 600,
                      }}
                    >
                      {userState?.user?.role == "dl" ? Math.round(value*(shared/100)) : Math.round(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default MyBookShow;
