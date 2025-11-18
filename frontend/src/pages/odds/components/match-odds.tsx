/* eslint-disable */
import IMarket, { OddsType } from '../../../models/IMarket'
import React, { MouseEvent } from 'react'
import IRunner from '../../../models/IRunner'
import { SocketContext } from '../../../context/webSocket'
import { AvailableToBackLay } from './available-to-back-lay'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { connect } from 'react-redux'
import PnlCalculate from './pnl-calculate'
// import { checkoddslength } from '../../../utils/helper'
import BookPopup from './fancy/book-popup'
import IMatch from '../../../models/IMatch'
import { setRules } from '../../../redux/actions/common/commonSlice'
import UserBookPopup from './user-book-popup'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import User, { RoleType } from '../../../models/User'
import { useParams } from 'react-router-dom'

interface Props {
  data: IMarket[]
  getMarketBook?: any
  bet?: any
  fancySelectionId?: any
  currentMatch?: IMatch
  setRules: (data: { open: boolean; type: string }) => void
  marketUserBookId?: any
  userState: any
  shared: any
}







class MatchOdds extends React.PureComponent<
  Props,
  {
    runnersData: any
    runnersDataPrev: any
    profitLoss: any
    getMarketBook: any
    remarkMarket: any
    runnersName: Record<string, string>
    mybook: boolean
  }
> {
  static contextType = SocketContext
  context!: React.ContextType<typeof SocketContext>
  constructor(props: Props) {
    super(props)
    const selections: any = {}
    const profitLoss: any = {}
    const remarkMarket: any = {}
    let runnersName: any = {}
    props.data.forEach(async (market: IMarket) => {
      market.runners.forEach((runner: IRunner) => {
        runnersName = {
          ...runnersName,
          [market.marketId]: {
            ...runnersName[market.marketId],
            [runner.selectionId]: runner.runnerName,
          },
        }
        selections[market.marketId] = market
        profitLoss[runner.selectionId] = 0
      })
      remarkMarket[market.marketId] = ''
    })
    this.state = {
      runnersData: selections,
      runnersDataPrev: JSON.parse(JSON.stringify(selections)),
      profitLoss,
      getMarketBook: props.getMarketBook,
      remarkMarket: remarkMarket,
      runnersName: runnersName,
      mybook: true
    }
  }

  componentDidMount(): void {
    this.socketEvents()
  }

  componentWillUnmount(): void {
    this.context.socket.off('getMarketData')
    this.leaveMarketRoom()
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.data !== this.props.data) {
      this.socketEvents()
    }
  }

  socketEvents = () => {
    this.leaveMarketRoom()
    this.joinMarketRoom()
    this.getSocketEvents()
    this.context.socket.on('connect', () => {
      this.joinMarketRoom()
    })
    this.context.socket.on('reconnect', () => {
      this.joinMarketRoom()
    })
  }

  joinMarketRoom = () => {
    if (this.props.currentMatch) {
      this.context.socket.emit('joinRoom', this.props.currentMatch.matchId)
    }
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('joinMarketRoom', market.marketId)
    })
  }

  leaveMarketRoom = () => {
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('leaveRoom', market.marketId)
      this.context.socket.emit('leaveRoom', market.matchId)
    })
  }

  getSocketEvents = () => {
    const handler = (market: IMarket) => {
      this.setState((prev) => ({
        runnersData: { ...prev.runnersData, [market.marketId]: market },
      }))
    }
    this.context.socket.on('getMarketData', handler)
  }

  offplaylimit = (market: any) => {
    const inplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.inPlayBookMaxLimit
        : this.props.currentMatch?.inPlayMaxLimit
    const offplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.offPlayBookMaxLimit
        : this.props.currentMatch?.offPlayMaxLimit
    return this.props.currentMatch?.inPlay ? inplayl : offplayl
  }

 

  handleBookToggle = (value: boolean) => {
    this.setState({ mybook: value });
  };
  


  render(): React.ReactNode {
    const { data, getMarketBook } = this.props
    ///console.log(data)
    const { runnersData } = this.state
    const { mybook } = this.state;

    console.log(runnersData, "kjkjjkjkjkjkjk")


    console.log(getMarketBook, "that vlauesss")

    console.log(this.props.shared, "paresnt sharedddddd")


    console.log(data, "market dataaa")

    const superid1 = data[0]?.marketId + "_" + data[0]?.runners[0]?.selectionId 
    const superid2 = data[0]?.marketId + "_" + data[0]?.runners[1]?.selectionId

    console.log(superid1, superid2 , "superbook1" ,"superbook2")

    const superbook1 = getMarketBook[superid1];
    console.log(superbook1, "this is the value of superbook2");

    const superbook2 = getMarketBook[superid2];
    console.log(superbook2, "this is the value of superbook2");


    return (
      <div className=''>
        {data &&
          data?.filter((market: IMarket) => 
            market.marketName?.toLowerCase() == "bookmaker"
          )?.map((market: IMarket) => {
            const selectionsPrev: any = {}
            const oddsData = runnersData ? runnersData[market.marketId] : null
            // console.log(oddsData,"oddddssss")

            let setVisibleMarketStatus = false
            if (oddsData) {
              setVisibleMarketStatus = !!oddsData?.['runners']?.[0]?.ex
            }
            const classforheadingfirst =
              market.oddsType != OddsType.B ? 'box-6' : 'box-4'
            const classforheading = market.oddsType != OddsType.B ? 'box-2' : 'box-1'
            if (!setVisibleMarketStatus) return null
            return (
              <div style={{ border: "1px", borderColor: "gray", borderStyle: "solid" }} className='' key={market._id}>
                <div className='market-title d-none'>
                  {market.marketName}
                  <a
                    href='#Bookmaker-market'
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      this.props.setRules({
                        open: true,
                        type: market.oddsType === OddsType.BM ? 'Bookmaker' : market.oddsType,
                      })
                    }}
                    className='m-r-5 game-rules-icon'
                  >
                    <span>
                      <i className='fa fa-info-circle float-right' />
                    </span>
                  </a>
                  <span className='float-right m-r-10'>
                    {/* Maximum Bet <span>{this.offplaylimit(market)}</span> */}
                    Maximum Bet <span>{this?.props?.userState?.user?.userSetting ? this?.props?.userState?.user?.userSetting[1]?.maxBet : `${this.offplaylimit(market)}`}</span>


                  </span>
                </div>

        {this?.props?.userState.user.role !== RoleType.user &&  this?.props?.userState.user.role !== RoleType.admin &&       <div className='flex gap-1 mb-1'>
  <button  className='btn bg-primary text-white' onClick={() => this.handleBookToggle(true)}>My Book</button>
  <button className='btn bg-primary text-white'  onClick={() => this.handleBookToggle(false)}>Ttl. Book</button>
</div>}


                <div className='table-header'>
                  <div style={{ fontSize: "12px", backgroundColor: "#0f2326", }} className={`float-left country-name ${classforheadingfirst} min-max`}>
                    <b /><span className='text_blink'>
  Max:
   {/* {
    (() => {
      const value = this?.props?.userState?.user?.userSetting 
        ? this?.props?.userState?.user?.userSetting[1]?.maxBet 
        : this.offplaylimit(market);
      return value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value;
    })()
  } */}300K
</span>


                  </div>
                  {/* {(market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div className='box-1 float-left' style={{backgroundColor:"#76d68f" , borderColor:"#76d68f"}} />
                      <div className='box-1 float-left' style={{backgroundColor:"#76d68f" , borderColor:"#76d68f"}} />
                    </>
                  ) : (
                    ''
                  )} */}
                  {/* {(market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div className='box-1 float-left' style={{backgroundColor:"#76d68f" , borderColor:"#76d68f"}} />
                      <div className='box-1 float-left' style={{backgroundColor:"#76d68f" , borderColor:"#76d68f"}} />
                    </>
                  ) : (
                    ''
                  )} */}

                  <div style={{ backgroundColor: "#0f2326", borderColor: "black", color:"white" }} className={`backk ${classforheading} float-left text-center`}>
                    <b>LAGAI</b>
                  </div>
                  <div style={{ backgroundColor: "#0f2326", borderColor: "black", color:"white" }} className={`layu ${classforheading} float-left text-center`}>
                    <b>KHAI</b>
                  </div>
                  {/* {  (
                    <>
                      <div className='box-1 float-left' />
                      <div className='box-1 float-left' />
                    </>
                  ) } */}
                </div>
                {oddsData &&
                  oddsData?.runners
                    ?.sort((a: any, b: any) => a?.sortPriority - b?.sortPriority)
                    .map((runner: IRunner) => {
                      runner = {
                        ...runner,
                        runnerName: this.state.runnersName?.[market.marketId]?.[runner.selectionId],
                      }
                      return (
                        <div key={runner.selectionId}>
                          <div
                            data-title={runner.status}
                            className={`table-row ${runner.status === 'SUSPENDED' ? 'suspended' : ''
                              }`}
                              style={{ borderBottom: "1px solid #ece1e194"}}
                          >
                            <div className={`  country-name ${classforheadingfirst}`}>
                              <span className='team-name '>
                                <b style={{ color: "black", fontSize:"13px" , fontWeight:"500" }}>{runner.runnerName}</b>
                              </span>

                              <div>

                                {getMarketBook && getMarketBook[`${market.marketId}_${runner.selectionId}`] ? (
                                  <span
                                    
                                    className={
                                      getMarketBook[`${market.marketId}_${runner.selectionId}`] > 0
                                        ? (this?.props?.userState.user.role !== RoleType.user ? 'red' : 'green')
                                        : (this?.props?.userState.user.role !== RoleType.user ? 'green' : 'red')
                                    }
                                  >
                                    
                                    {mybook ? <span>{
                                      this.props.shared
                                        ? (getMarketBook[`${market.marketId}_${runner.selectionId}`] * (this.props.shared / 100)).toLocaleString()
                                        : getMarketBook[`${market.marketId}_${runner.selectionId}`].toLocaleString()
                                    }</span> : <span>{
                                      this.props.shared
                                        ? (getMarketBook[`${market.marketId}_${runner.selectionId}`]).toLocaleString()
                                        : getMarketBook[`${market.marketId}_${runner.selectionId}`].toLocaleString()
                                    }</span>}

                                  </span>
                                ) : (
                                  <span className='' style={{ color: 'black' }}>
                                    {'(0)'}
                                  </span>
                                )}

                                <PnlCalculate
                                  marketId={market.marketId}
                                  selectionId={runner.selectionId}
                                />
                              </div>
                            </div>

                            {/* <div style={{backgroundColor:"#e2dddd" , border:"none"}} className='box-1 float-left border-0' /> */}
                            {/* <div style={{backgroundColor:"#e2dddd" , border:"none"}} className='box-1 float-left border-0' /><div style={{backgroundColor:"#e2dddd" , border:"none"}} className='box-1 float-left border-0' /> */}
                            {/* <div style={{backgroundColor:"#e2dddd" , border:"none"}} className='box-1 float-left border-0' /> */}
                            <AvailableToBackLay
                              selections={runner.ex}
                              selectionsPrev={selectionsPrev}
                              market={market}
                              runner={runner}
                            />
                          </div>
                        </div>
                      )
                    })}
                {this.state.remarkMarket[market.marketId] ? (
                  <div className='table-remark text-right remark'>
                    {this.state.remarkMarket[market.marketId]}
                  </div>
                ) : (
                  ''
                )}
              </div>
            )
          })}
   {this.props.fancySelectionId && <BookPopup />}
        {this.props.marketUserBookId && <UserBookPopup />}
      </div>
    )
  }
}
const mapStateToProps = (state: any) => ({
  bet: state.betReducer.bet,
  getMarketBook: state.betReducer.userBookMarketList && state.betReducer.userBookMarketList,
  fancySelectionId: state.betReducer.fancyMatchAndSelectionId,
  currentMatch: state.sportReducer.currentMatch,
  marketUserBookId: state.betReducer.marketBookAndSelectionId,
})

const actionCreators = {
  betPopup,
  setRules,
}
export default connect(mapStateToProps, actionCreators)(MatchOdds)
