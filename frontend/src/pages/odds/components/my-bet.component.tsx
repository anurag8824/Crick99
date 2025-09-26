import moment from 'moment'
import React from 'react'
import { useWebsocketUser } from '../../../context/webSocketUser'
import IBet from '../../../models/IBet'
import { RoleType } from '../../../models/User'
import { selectPlaceBet, setBetCount, setbetlist, setBookMarketList } from '../../../redux/actions/bet/betSlice'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { selectCurrentMatch } from '../../../redux/actions/sports/sportSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import betService from '../../../services/bet.service'
import { betDateFormat } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice'
import { useLocation } from 'react-router-dom'

const MyBetComponent = () => {
  const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([])
  const getPlaceBet = useAppSelector(selectPlaceBet)
  const getCurrentMatch = useAppSelector(selectCurrentMatch)
  const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch)
  const userState = useAppSelector(selectUserData)
  const { socketUser } = useWebsocketUser()
  const dispatch = useAppDispatch()
  const [betRefresh, setRefreshStatus] = React.useState<any>(false)
  const location = useLocation();
  React.useEffect(() => {
    // console.log(getCurrentMatch,"hello world here is Match id")
    console.log(getCasinoCurrentMatch?.match_id," getCasinoCurrentMatch hello world here is Match id")

    if (getCurrentMatch && getCurrentMatch.matchId && location.pathname.includes('/odds') || getCasinoCurrentMatch && getCasinoCurrentMatch.match_id) {
      const dataMatchId: any = getCurrentMatch && getCurrentMatch.matchId && location.pathname.includes('/odds') ? getCurrentMatch.matchId : (getCasinoCurrentMatch && getCasinoCurrentMatch?.event_data?.match_id ? getCasinoCurrentMatch?.event_data?.match_id : 0)
      console.log("hello world match")
      betService
        .getBets(dataMatchId)
        .then((bets) => {
          console.log(bets.data,"chech bet data")
          bets && bets.data && bets.data.data && setMyAllBet(bets.data.data.bets)
          dispatch(setbetlist(bets.data.data.bets))
          dispatch(setBookMarketList(bets.data.data.odds_profit))
          dispatch(setBetCount(bets.data.data.bets.length))
        })
        .catch((e) => {
          console.log(e.stack)
        })
    }
  }, [getCurrentMatch, getCasinoCurrentMatch, betRefresh])

  React.useEffect(() => {
    if (getPlaceBet.bet.marketId) {
      //setMyAllBet([{ ...getPlaceBet.bet }, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true)
    }
  }, [getPlaceBet.bet])

  React.useEffect(() => {
    socketUser.on('placedBet', (bet: IBet) => {
      ///setMyAllBet([bet, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true)
    })
    return () => {
      socketUser.off('placedBet')
    }
  }, [getMyAllBet])

  // React.useEffect(() => {
  //   socketUser.on('betDelete', ({ betId }) => {
  //     ///setMyAllBet(getMyAllBet.filter((bet: IBet) => bet._id !== betId))
  //     setRefreshStatus(betRefresh ? false : true)
  //     ///dispatch(setBookMarketList({}))
  //   })
  //   return () => {
  //     socketUser.off('betDelete')
  //   }
  // }, [getMyAllBet])

  console.log(getMyAllBet,"get my all bets")

  return (
    <div>
    <div className='' style={{overflowX:"scroll"}}>
      <table className='table table-striped table-hover'>
        <thead className="bg-info-subtle text-warning">
          <tr>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>#</th>
            {userState.user.role !== RoleType.user && <th style={{background:"#2a3a5a", fontSize:"13px"}} className='text-warning' >Username</th>}
            <th style={{background:"#2a3a5a" , border:"none" , fontSize:"13px"}} className='text-warning text-left'> Runner Name</th>
            <th style={{background:"#2a3a5a" , border:"none" , fontSize:"13px"}} className='text-warning'>Bet Mode</th>

            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Price</th>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Value</th>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Amount</th>
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Profit</th> */}
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Loss</th> */}

            {/* {!isMobile && <th style={{background:"#76d68f"}}> Place Date</th>} */}
            {/* {!isMobile && <th style={{background:"#76d68f"}}> Match Date</th>} */}
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Status</th> */}
            {userState.user.role !== RoleType.user && <th  style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} > Date</th>}
          </tr>
        </thead>
        <tbody className='text-white'>
          {getMyAllBet?.filter((b:any)=>b.bet_on !== "MATCH_ODDS")?.map((bet: IBet, index: number , ) => (
            <tr className={bet.isBack ? 'back' : 'lay'} key={bet._id}>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'> {index + 1} </td>
              {userState.user.role !== RoleType.user && <td>{bet.userName}</td>}
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'>
                {' '}
                {bet.selectionName}
                {/* {bet.marketName === 'Fancy' && bet.gtype !== 'fancy1' ? bet.volume.toFixed(2) : bet.odds.toFixed(2)}{' '} */}
              </td>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' > {bet.isBack ? "Yes" : "No"} </td>


              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' > { bet.gtype === 'fancy1' ? bet.odds.toFixed(0) : bet?.volume.toFixed(0) }</td>

              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' > { bet.gtype === 'fancy1' ?  bet?.selectionName : bet.odds.toFixed(0) } </td>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'> {bet.stack} </td>


              {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.betClickTime).format(betDateFormat)} </td>
              )}
              {!isMobile && (
                <td className='no-wrap'> {moment(bet.createdAt).format(betDateFormat)} </td>
              )} */}
              {/* <td className='no-wrap text-center' > {bet?.result?.result ? bet?.result?.result  :"-" } </td> */}
              {userState.user.role !== RoleType.user && <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'>{moment.utc(bet.betClickTime).utcOffset('+05:30').format('DD/MM/YYYY hh:mm:ss A')} </td>}
              {/* <td className='no-wrap text-center' > {bet?.status} </td> */}

            </tr>



          ))}
                 

        </tbody>
      </table>
      </div>

      <div>
  <div style={{ backgroundColor: "#0f2326", color: "white", padding: "8px 10px", textAlign: "left", marginTop:"20px", marginBottom:"10px" }}>
    Match Bets
  </div>
</div>

{/* <h1 className="section-title text-center">BOOKMAKER BETS</h1> */}

    <div className='' style={{ overflowX:"scroll"}}>

      <table className='table table-striped table-hover'>
        <thead className="bg-info-subtle text-warning">
          <tr>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>#</th>
            {userState.user.role !== RoleType.user && <th style={{background:"#2a3a5a", fontSize:"13px"}} className='text-warning' >Username</th>}
            <th style={{background:"#2a3a5a" , border:"none" , fontSize:"13px"}} className='text-warning text-left'> Runner Name</th>
            <th style={{background:"#2a3a5a" , border:"none" , fontSize:"13px"}} className='text-warning'>Bet Mode</th>

            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Price</th>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Value</th>
            <th style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} className='text-warning'>Bet Amount</th>
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Profit</th> */}
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Loss</th> */}

            {/* {!isMobile && <th style={{background:"#76d68f"}}> Place Date</th>} */}
            {/* {!isMobile && <th style={{background:"#76d68f"}}> Match Date</th>} */}
            {/* <th style={{background:"#2a3a5a" , border:"none"}} className='text-warning'>Bet Status</th> */}
            {userState.user.role !== RoleType.user && <th  style={{background:"#2a3a5a" , border:"none", fontSize:"13px"}} > Date</th>}
          </tr>
        </thead>
        <tbody className='text-white'>
          
                    

                    {getMyAllBet?.filter((b:any)=>b.bet_on === "MATCH_ODDS").map((bet: IBet, index: number , ) => (
            <tr className={bet.isBack ? 'back' : 'lay'} key={bet._id}>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'> {index + 1} </td>
              {userState.user.role !== RoleType.user && <td>{bet.userName}</td>}
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'>
                {' '}
                {bet.selectionName}
                {/* {bet.marketName === 'Fancy' && bet.gtype !== 'fancy1' ? bet.volume.toFixed(2) : bet.odds.toFixed(2)}{' '} */}
              </td>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' > {bet.isBack ? "Lagai" : "Khai"} </td>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' >   {(Number(bet.odds) * 100).toFixed(0)} </td>
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap text-center' > {bet?.selectionName} </td>
              {/* <td className='no-wrap text-center' > {bet.isBack ? "Yes" : "No"} </td> */}
              {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.betClickTime).format(betDateFormat)} </td>
              )}
              {!isMobile && (
                <td className='no-wrap'> {moment(bet.createdAt).format(betDateFormat)} </td>
              )} */}
              <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className='no-wrap'> {bet.stack} </td>
              {/* <td className='no-wrap text-center' > {bet?.result?.result ? bet?.result?.result  :"-" } </td> */}
              {userState.user.role !== RoleType.user && <td className='no-wrap'>{moment.utc(bet.betClickTime).utcOffset('+05:30').format('DD/MM/YYYY hh:mm:ss A')} </td>}
              {/* <td className='no-wrap text-center' > {bet?.status} </td> */}
            </tr>



          ))}
        </tbody>
      </table>
    </div>
      </div>
  )
}

export default MyBetComponent
