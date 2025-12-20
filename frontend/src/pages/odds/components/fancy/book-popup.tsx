import React from 'react'
import ReactModal from 'react-modal'
import bookService from '../../../../services/book.service'
import { AxiosResponse } from 'axios'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks'
import { FancyBook, selectBookFancy, selectPlaceBet, setBetCount, setbetlist, setBookFancy, setBookMarketList } from '../../../../redux/actions/bet/betSlice'
import { selectUserData } from '../../../../redux/actions/login/loginSlice'
import { RoleType } from '../../../../models/User'
import { selectCurrentMatch } from '../../../../redux/actions/sports/sportSlice'
import { selectCasinoCurrentMatch } from '../../../../redux/actions/casino/casinoSlice'
import { useWebsocketUser } from '../../../../context/webSocketUser'
import IBet from '../../../../models/IBet'
import { useLocation } from 'react-router-dom'
import betService from '../../../../services/bet.service'
import userService from '../../../../services/user.service'
import UserService from '../../../../services/user.service'


const BookPopup = () => {
  const bookFancy: FancyBook = useAppSelector(selectBookFancy)
   const userState = useAppSelector(selectUserData)
  console.log(bookFancy,"bookFancy")
  const dispatch = useAppDispatch()
  const [book, setBook] = React.useState<Record<string, number>>({})
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (bookFancy.matchId) {
      bookService.getFancyBook(bookFancy).then((res: AxiosResponse) => {
        setBook(res.data.data)
        setIsOpen(true)
      })
    }
  }, [bookFancy])
  const close = () => {
    dispatch(setBookFancy({} as FancyBook))
    setIsOpen(false)
  }
  console.log(book,"booookss")




//fot the fancy percetnn i want to calcualte

  const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([]);
  const getPlaceBet = useAppSelector(selectPlaceBet);
  const getCurrentMatch = useAppSelector(selectCurrentMatch);
  const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const { socketUser } = useWebsocketUser();
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


  const userMap = React.useMemo(() => {
    const map: any = {};
    userList?.items?.forEach((u: any) => {
      map[u.username] = u;
    });
    console.log(map, "user map");
    return map;
  }, [userList]);




  
  

 





 

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






  return <>

    <ReactModal
      isOpen={isOpen}
      onRequestClose={(e: any) => {
        close()
      }}
      contentLabel='Fancy Book'
      className={'modal-dialog modal-lg'}
      ariaHideApp={false}
    >
      <div className='modal-content '>
        <div className='modal-header'>
          <h5 style={{color:"white"}}>{bookFancy?.marketName}</h5>
          <span onClick={close} className='float-right'>
            X
          </span>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th><div className="rounded fs-5 pl-2 py-2 text-center text-white" style={{ flex: 1, textAlign: 'left' ,background: "rgb(15, 35, 39)" }}>Run</div>
              </th>
              <th>    <div className="rounded fs-5 pl-2 py-2 text-center text-white"  style={{ flex: 1, textAlign: 'right',background: "rgb(15, 35, 39)" }}>Profit</div>
              </th>
            </tr>
          </thead>
          {(Object.keys(book).length > 0 && userState.user.role == RoleType.user) &&
            Object.keys(book).map((itemKey) => (
              <tr key={itemKey} className={book[itemKey] < 0 ? 'lay' : 'back'}>
                <td className='text-center'>{itemKey}</td>
                <td className={`${book[itemKey] < 0 ? 'red' : 'green'} text-center`}>{book[itemKey]}</td>
              </tr>
            ))}
            {(Object.keys(book).length > 0 && userState.user.role !== RoleType.user) &&
            Object.keys(book).map((itemKey) => (
              <tr key={itemKey} className={book[itemKey] < 0 ? 'back' : 'lay'}>
                <td className='text-center'>{itemKey}</td>
                <td className={`${book[itemKey] < 0 ? 'green' : 'red'} text-center`}>MB({userState?.user?.role == "dl" ? - book[itemKey]*shared/100 : - book[itemKey]*fancyPercent/100}),TB({- book[itemKey]})</td>
              </tr>
            ))}
        </table>
      </div>
    </ReactModal>
    </>
}

export default BookPopup
