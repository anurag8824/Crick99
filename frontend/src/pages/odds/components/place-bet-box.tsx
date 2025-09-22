import React, { MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import{shallowEqual} from "react-redux";
import {
  betPopup,
  selectBetCount,
  selectBetPopup,
  selectPlaceBet,
  setBetCount,
} from '../../../redux/actions/bet/betSlice'
import { IUserBetStake } from '../../../models/IUserStake'
import IBet, { IBetOn, IBetType } from '../../../models/IBet'
import { getPlaceBetAction } from '../../../redux/actions/bet/bet.action'
import { IApiStatus } from '../../../models/IApiStatus'
import { useWebsocketUser } from '../../../context/webSocketUser'
import { OddsType } from '../../../models/IMarket'
import userService from '../../../services/user.service';
import { AxiosResponse } from 'axios';
import { setBalance } from '../../../redux/actions/balance/balanceSlice';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

const PlaceBetBox = ({ stake }: { stake: IUserBetStake }) => {
  console.log(stake,"stake")
  const [betObj, setBetObj] = React.useState<IBet>({} as IBet)
  const betValues = useAppSelector(selectBetPopup,shallowEqual)
  const getPlaceBet = useAppSelector(selectPlaceBet,shallowEqual)
  const betCount = useAppSelector(selectBetCount)
  const { socketUser } = useWebsocketUser()

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    setBetObj({
      ...betValues.betData,
      odds:
        typeof betValues.betData.odds === 'string'
          ? parseFloat(betValues.betData.odds)
          : betValues.betData.odds,
    })
  }, [betValues.betData])

  React.useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      socketUser.emit('place-bet', getPlaceBet.bet)
      // dispatch(setBookMarketList({}))
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }))
      dispatch(setBetCount(betCount + 1))
      userService.getUserBalance().then((res: AxiosResponse) => {
        dispatch(setBalance(res.data.data));
      });
    }
  }, [getPlaceBet.status])


 

  const reset = () => {
    setBetObj({ ...betObj, stack: 0, pnl: 0 })
    dispatch(betPopup({ ...betValues, betData: { ...betValues.betData, stack: 0, pnl: 0 } }))
  }

  const onStack = (stack: number) => {
    const betObjItem = { ...betObj }
    betObjItem.stack = betObjItem.stack + stack
    const calPnl = calculatePnlF(betObjItem)

    betObjItem.pnl = calPnl.pnl
    betObjItem.exposure = calPnl.exposure
    setBetObj(betObjItem)
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }))
  }

  const incrementDecrementOdds = (type = 'inc') => {
    const betObjItem = { ...betObj }

    if (betObjItem.oddsType === OddsType.BM || betObjItem.oddsType === OddsType.F) {
      return true
    }
    switch (type) {
      case 'inc':
        betObjItem.odds = parseFloat((betObjItem.odds + 0.01).toFixed(4))
        break
      case 'dec':
        betObjItem.odds = parseFloat((betObjItem.odds - 0.01).toFixed(4))
        break
    }
    const calPnl = calculatePnlF(betObjItem)
    betObjItem.pnl = calPnl.pnl
    betObjItem.exposure = calPnl.exposure
    betObjItem.type =
      betObjItem.odds !== betObjItem.currentMarketOdds ? IBetType.UnMatch : IBetType.Match
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }))

    setBetObj(betObjItem)
  }

  const calculatePnlF = (betValue: IBet) => {
    let pnl = 0,
      exposure = 0
    if (Object.keys(betValue).length > 0) {
      if (betValue.betOn == IBetOn.MATCH_ODDS || betValue.gtype === 'fancy1') {
        if (betValue.isBack) {
          pnl = betValue.odds * betValue.stack - betValue.stack
          exposure = -1 * betValue.stack
        } else {
          pnl = betValue.stack
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
        }
      } else if (betValue.betOn != IBetOn.CASINO) {
        if (betValue.isBack) {
          pnl = (betValue.volume * betValue.stack) / 100
          exposure = -betValue.stack
        } else {
          exposure = -((betValue.volume * betValue.stack) / 100)
          pnl = betValue.stack
        }
      } else if (betValue.betOn == IBetOn.CASINO) {
        if (betValue.matchId == 33) {
          //// specific condition for cmeter game
          pnl = 0
          exposure = -50 * betValue.stack * 1.0
        } else if (betValue.matchId == 9) {
          //// specific condition for tp1day game
          if (betValue.isBack) {
            pnl = (betValue.odds / 100) * betValue.stack
            exposure = -betValue.stack
          } else {
            pnl = betValue.stack
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
          }
        } else if (betValue.fancystatus == 'yes') {
          //// specific condition for cmeter game
          if (betValue.isBack) {
            pnl = (betValue.volume * betValue.stack) / 100
            exposure = -betValue.stack
          } else {
            exposure = -((betValue.volume * betValue.stack) / 100)
            pnl = betValue.stack
          }
        } else {
          if (betValue.isBack) {
            pnl = betValue.odds * betValue.stack - betValue.stack
            exposure = -1 * betValue.stack
          } else {
            pnl = betValue.stack
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
          }
        }
      }
    }
    return { pnl: parseInt(pnl.toFixed()), exposure: parseInt(exposure.toFixed()) }
  }

  const onChangeStack = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetObj({ ...betObj, stack: parseInt(e.target.value) })
  }

  const onBlurStack = () => {
    onStack(0)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(getPlaceBetAction(betObj))
  }

  // const renderStakeButtons = () => {
  //   const buttons = []
  //   for (let i = 1; i <= 11; i++) {
  //     buttons.push(
  //       <button
  //         key={i}
  //         type='button'
  //         onClick={() => onStack(stake[`value${i}`])}
  //         className='btn btn-secondary m-1 '
  //       >
  //         {stake[`name${i}`]}
  //       </button>,
  //     )
  //   }
  //   return buttons
  // }

  const renderStakeButtons = () => {
    const rows = [];
  
    for (let i = 1; i <= 13; i += 3) {
      rows.push(
        <div className="row justify-content-center" key={`row-${i}`}>
          {[0, 1, 2].map(offset => {
            const index = i + offset;
            if (index > 11 && betValues?.betData?.betOn !== "MATCH_ODDS" )
              { return null }
              if (index > 13) return null;
            return (
              <div className="col-4 d-flex justify-content-center" key={`btn-${index}`}>
                <button
                  type="button"
                  onClick={() => onStack(stake[`value${index}`])}
                  className="btn btn-secondary m-1 w-100"
                >
                  {stake[`name${index}`]}
                </button>
              </div>
            );
          })}
        </div>
      );
    }
  
    return rows;
  };
  



  const [seconds, setSeconds] = React.useState<number>(7);

  React.useEffect(() => {
    if (!betValues.isOpen || betValues.betData?.betOn === "CASINO") return;
    setSeconds(7); // Reset timer to 7 on open

    const interval: NodeJS.Timeout = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop interval
          closeBetPopup(); // Auto-close popup
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [betValues.isOpen, betValues.betData?.betOn]); // Only run on open 

  const closeBetPopup = () => {
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    )
  }
  const onBackDrop = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    )
  }
  //betValues.isOpen 
  console.log(betValues,"hajdd")

  console.log("place bet re render ")
  return (
    <>
      { betValues.isOpen && (
        <>
          <div onClick={onBackDrop} className='backdrop-custom'></div>

          <div style={{position:"fixed",}} className='card m-b-10 place-bet'>
            <div className='card-header d-flex align-items-center justify-content-between'>
              <h6 style={{color:"#ffc107"}} className='card-title d-inline-block '>Place Bet</h6>
            {betValues.betData?.betOn === "CASINO" ? "" :  <div>Timer: {seconds} seconds</div> }
              <span style={{fontSize:"10px"}} className='card-title d-inline-block' onClick={closeBetPopup}>
                Close
              </span>
            </div>
            <div className={`table-responsive ${betObj.isBack ? 'white' : 'white'}`}>
              <form onSubmit={onSubmit}>
                <table className='coupon-table  d-none table table-borderedless'>
                  <thead className=''>
                    <tr>
                      {/* <th style={{ width: '35%', textAlign: 'left' }}>(Bet for)</th> */}
                      <th style={{ width: '25%', textAlign: 'left' }}>Odds</th>
                      <th style={{ width: '15%', textAlign: 'left' }}>Stake</th>
                      <th style={{ width: '15%', textAlign: 'right' }}>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='text-center'>
                        <a onClick={closeBetPopup} className='text-danger d-none'>
                          <i className='fa fa-times' />
                        </a>
                        {betObj.selectionName}
                      </td>
                      <td className='bet-odds '>
                        <div className='form-group'>
                          <input
                            value={parseFloat(betObj?.odds?.toFixed(4)) || ''}
                            type='text'
                            required
                            maxLength={4}
                            readOnly
                            className='amountint'
                            style={{ width: 60, verticalAlign: 'middle' }}
                          />
                          <div className='spinner-buttons  input-group-btn btn-group-vertical'>
                            <button
                              type='button'
                              className='custom-btn-spinner btn btn-xs btn-default'
                              onClick={() => incrementDecrementOdds('inc')}
                            >
                              <i className='fa fa-angle-up' />
                            </button>
                            <button
                              type='button'
                              className='custom-btn-spinner btn btn-xs btn-default'
                              onClick={() => incrementDecrementOdds('dec')}
                            >
                              <i className='fa fa-angle-down' />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className='bet-stakes w-100'>
                        <div className='form-group bet-stake w-100'>
                          <input
                            maxLength={10}
                            required
                            type='number'
                            value={betObj.stack || ''}
                            onBlur={onBlurStack}
                            onChange={onChangeStack}
                            className='w-100 py-3 '
                            style={{fontSize:"20px"}}
                          />
                        </div>
                      </td>
                      <td className='text-right  bet-profit'>{betValues.betData.pnl}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} className='value-buttons px-3 py-2' >
                        {renderStakeButtons()}
                      </td>
                    </tr>
                  </tbody>
                </table>

<div className='px-3 py-2'>
                <div className=" p-2 text-center text-white" style={{ backgroundColor: "#0f2326", borderRadius: "6px" }}>
      <strong>{betObj.selectionName}</strong>
    </div>
    </div>

    <div className="row px-3 py-2 ">
      {/* Left Column */}
      <div className="col-6 d-flex  flex-column align-items-center justify-content-center">
        <span>Price</span>
        <div className="border p-2 rounded-3 w-100 text-center mt-1">{betObj.odds}</div>
      </div>

      {/* Right Column */}
      <div className="col-6 d-flex flex-column align-items-center justify-content-center">
        <span>Size</span>
        <div className="border p-2 rounded-3 w-100 text-center mt-1"> 
           {parseFloat(betObj?.volume?.toFixed(4)) || ''}
           </div>
    
   
      </div>
    </div>

     {/* Stake Section */}
     <div className="text-center">
      <div>Stake</div>
      <div className="borde p-2 mt-1">
        <input
          type="number"
          value={betObj.stack || ''}
          onBlur={onBlurStack}
          onChange={onChangeStack}
          className="form-control text-center"
          style={{ fontSize: "20px" }}
        />
      </div>
    </div>

    <div className='px-3 py-2'>

    <button  type='submit' disabled={getPlaceBet.status === IApiStatus.Loading} className="text-center text-white w-100 rounded-3 py-2" style={{background: "rgb(15, 35, 39)"}}><div>Place Bet {getPlaceBet.status === IApiStatus.Loading ? (
                      <i className='mx-5 fas fa-spinner fa-spin'></i>
                    ) : (
                      ''
                    )}</div></button>
    </div>

      {/* Stake Buttons */}
      <div className="value-buttons px-3 py-2">
      {renderStakeButtons()}
    </div>


  



                <div className='col-md-12 mt-20 d-none justify-content-end d-flex  align-content-center  '>
                  <button
                    onClick={reset}
                    type='button'
                    className='btn btn-sm btn-warning float-left d-flex align-items-center mr-1 '
                  >
                    Cancel <CloseIcon style={{fontSize:"17px",}}   />
                  </button>
                  <button
                    type='submit'
                    disabled={getPlaceBet.status === IApiStatus.Loading}
                    className='btn btn-sm btn-success float-right m-b-j5 d-flex align-items-center'
                  >
                    Submit <DoneIcon style={{fontSize:"17px"}} />
                    {getPlaceBet.status === IApiStatus.Loading ? (
                      <i className='mx-5 fas fa-spinner fa-spin'></i>
                    ) : (
                      ''
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default React.memo(PlaceBetBox)

