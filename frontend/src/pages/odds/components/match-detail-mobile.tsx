/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react'
import { Tabs, Tab, Modal } from 'react-bootstrap'
import MyBetComponent from './my-bet.component'
import moment from 'moment'
import MatchOdds from './match-odds'
import PlaceBetBox from './place-bet-box'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectBetCount } from '../../../redux/actions/bet/betSlice'
import Fancy from './fancy'
import { useWebsocketUser } from '../../../context/webSocketUser'
import MyBetComponent22 from './my-bet-component22'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import AllEventListInMatch from '../../dashboard/detailallevent'
import { RoleType } from '../../../models/User'

const MatchDetailWrapper = (props: any) => {
  const dispatch = useAppDispatch()
  const betCount = useAppSelector(selectBetCount)
  const [tavstatus, settvstatus] = React.useState<boolean>(false)
  const { socketUser } = useWebsocketUser()
    const userState = useAppSelector(selectUserData)
  

  // React.useEffect(() => {
  //   return () => {
  //     dispatch(setBetCount(0))
  //   }
  // }, [])
const shared = useParams().share

  const [showevent, setShowevent] = React.useState(false)
  const [showallbets, setShowallbets] = React.useState(false)

  const showAllEvent = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (userState.user.role !== RoleType.user) {
        setShowevent(!showevent)
        return
      }
      // navigate.go('/unsettledbet')
    }
  
    const showAllAllbets = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (userState.user.role !== RoleType.user) {
        setShowallbets(!showallbets)
        return
      }
      // navigate.go('/unsettledbet')
    }

    const handleCloseEvent = () => setShowevent(false)
  const handleShowEvent = () => setShowevent(true)

  const handleCloseAllbets = () => setShowallbets(false)
  const handleShowAllbets = () => setShowallbets(true)
  
   


  return (
    <>
      <div className='prelative'>
        <Tabs className='d-none'>
          <Tab eventKey='home' title='ODDS'>
            <div className='game-heading clsforellipse mb-1'>
              <span className='card-header-title giveMeEllipsis'>{props.currentMatch?.name}</span>
              <span className='float-right card-header-date'>
                              { moment(props.currentMatch?.matchDateTime).format('MM/DD/YYYY  h:mm a') }
                
              </span>
            </div>
            {props.scoreBoard()}
            {tavstatus && props.otherTv()}




  
            {(() => {
  const battingFirst =
    props?.matchedMatch?.batting_team === props?.matchedMatch?.team_a_id
      ? {
          short: props?.matchedMatch?.team_a_short,
          img: props?.matchedMatch?.team_a_img,
          score: props?.matchedMatch?.team_a_scores,
          over: props?.matchedMatch?.team_a_over,
          crr: props?.matchedMatch?.curr_rate,
        }
      : {
          short: props?.matchedMatch?.team_b_short,
          img: props?.matchedMatch?.team_b_img,
          score: props?.matchedMatch?.team_b_scores,
          over: props?.matchedMatch?.team_b_over,
          crr: props?.matchedMatch?.curr_rate,
        };

  const battingSecond =
  props?.matchedMatch?.batting_team === props?.matchedMatch?.team_a_id
      ? {
          short: props?.matchedMatch?.team_b_short,
          img: props?.matchedMatch?.team_b_img,
          score: props?.matchedMatch?.team_b_scores,
          over: props?.matchedMatch?.team_b_over,
          crr: props?.matchedMatch?.curr_rate,
        }
      : {
          short: props?.matchedMatch?.team_a_short,
          img: props?.matchedMatch?.team_a_img,
          score: props?.matchedMatch?.team_a_scores,
          over: props?.matchedMatch?.team_a_over,
          crr: props?.matchedMatch?.curr_rate,
        };

  return (
    <div className={`border rounded shadow-sm  mb-3 bg-white ${props?.matchedMatch?.match_id  ? "d-none" : "d-none"}`}>
      {/* Header */}
      <div style={{backgroundColor:"#424242"}} className="d-flex py-2 px-1 justify-content-between align-items-center mb-">
        <h6 className="mb-0 fw-bold  text-white">Match Scorecard</h6>
   
        <span className="badge bg-success">Live</span>
      </div>

      {/* Batting Team (First) */}

      <div className='border-bottom'>
       <div className="d-flex justify-content-between align-items-center py-2 px-2 ">
        <div className="d-flex align-items-center gap-3">
          <img
            src={battingFirst.img}
            alt={battingFirst.short}
            className="rounded-circle border"
            style={{
              width: '45px',
              height: '45px',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <h6 className="mb-0 fw-semibold">{battingFirst?.short}</h6>
        </div>
        <div className='bg-dark text-white p-2 rounded shadow-sm'>{props?.matchedMatch?.first_circle}</div>

        <div className="text-end">
          <h6 className="mb-0 fw-bold">
            {battingFirst.score ? `${battingFirst.score}/${battingFirst.over}` : '--/--'}
          </h6>
          <small className="text-muted">{battingFirst.over} overs</small>

          <div>          
         <small className="text-muted">Crr: {battingFirst.crr}</small>
        </div>

        </div>

       
        
      </div>


      <div className="d-flex flex-wrap justify-content-center pb-1">
  {props?.matchedMatch?.last36ball?.map((ball: any, index: number) =>
    ball ? (
      <div
        key={index}
        className={`d-flex justify-content-center align-items-center  rounded-circle bg-light ${ball === "W" ? "text-danger" : "text-dark"} border`}
        style={{
          width: "24px",
          height: "24px",
          fontSize: "0.75rem",
          fontWeight: "bold",
          marginRight:"2px"
        }}
      >
        {ball}
      </div>
    ) : null
  )}
      </div>

   </div>



      {/* Bowling Team (Second) */}
      <div className="d-flex justify-content-between align-items-center py-2 px-2">
        <div className="d-flex align-items-center gap-3">
          <img
            src={battingSecond.img}
            alt={battingSecond.short}
            className="rounded-circle border"
            style={{
              width: '45px',
              height: '45px',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <h6 className="mb-0 fw-semibold">{battingSecond.short}</h6>
        </div>
        <div className="text-end">
          <h6 className="mb-0 fw-bold">
            {battingSecond.score ? `${battingSecond.score}/${battingSecond.over}` : '--/--'}
          </h6>
          <small className="text-muted">{battingSecond.over} overs</small>
        </div>
      </div>
    </div>
  );
})()}



            {props.t10Tv(250)}

            <div className='markets'>
              {/* Score Component Here */}
              <div className='main-market'>
                {props.markets && <MatchOdds data={props.markets}   userState={userState} shared={shared}  />}
              </div>
            </div>
            <br />
            {props.fancies && props.currentMatch && props.currentMatch.sportId == '4' && (
              <Fragment>
                {/* @ts-expect-error */}
                {<Fancy socketUser={socketUser} fancies={props.fancies} matchId={props.matchId!} />}
              </Fragment>
            )}

             <div style={{background:"none",  border:"none"}} className='card m-b-10 my-bet'>
              <h1 className="section-title text-center">OPEN BETS</h1>
              <div className='card-body'>
                <MyBetComponent />
              </div>
            </div>

            <div className='card m-b-10 my-bet d-none'>
            <h6 className="p-2 w-100 m-0 bg-info text-white text-center">Declared Bets</h6>
              <div className='card-body'>
                <MyBetComponent22 />
              </div>
            </div>
            {props.marketDataList.stake && <PlaceBetBox stake={props.marketDataList.stake} />}

            <div className='text-center'><a   onClick={() => setShowevent(!showevent)} style={{width:"100px"}} className="btn btn-primary btn-sm rounded-3">All Events</a></div>

<div className='text-center'><a   onClick={() => setShowallbets(!showallbets)} style={{width:"100px"}} className="btn btn-primary mt-2 btn-sm rounded-3">Completed Bets</a></div>


          </Tab>
          {/* <Tab eventKey='profile' title={`PLACED BET (${betCount})`}>
            <div className='card m-b-10 my-bet'>
              <div className='card-header'>
                <h6 className='card-title d-inline-block'>My Bet</h6>
              </div>
              <div className='card-body'>
                <MyBetComponent />
              </div>
            </div> 
          </Tab> */}
        </Tabs>
        <div className='csmobileround' style={{ top: '16px' }}>
          <span onClick={() => settvstatus(tavstatus ? false : true)}>
            <i className='fa fa-tv'></i>{' '}
          </span>
        </div>
      </div>

      <Modal show={showevent} onHide={handleCloseEvent} size={'lg'}>
        <Modal.Header closeButton>
          <Modal.Title>All Events</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <AllEventListInMatch />
        </Modal.Body>
      </Modal>

      <Modal show={showallbets} onHide={handleCloseAllbets} size={'lg'}>
        <Modal.Header closeButton>
          <Modal.Title>Completed Bets</Modal.Title>
        </Modal.Header>
        <Modal.Body >
                <MyBetComponent22 />
              
        </Modal.Body>

        <div
    style={{
      backgroundColor: "",
      width: "100%",
      padding: "10px",
      textAlign: "right"
    }}
  >
    <button onClick={handleCloseAllbets} className="text-center text-white w-100 rounded-3" style={{marginTop: "15px", background: "rgb(15, 35, 39)"}}><div>Close</div></button>
  </div>
        
      </Modal>
    </>
  )
}

export default React.memo(MatchDetailWrapper)
