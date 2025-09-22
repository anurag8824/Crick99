import React from "react";
import { isMobile } from "react-device-detect";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { IFancy } from "../../../../models/IFancy";
import IMatch from "../../../../models/IMatch";
import LFancy from "../../../../models/LFancy";
import { RoleType } from "../../../../models/User";
import {
  betPopup,
  selectMarketBook,
  setBookFancy,
} from "../../../../redux/actions/bet/betSlice";
import { selectLoader } from "../../../../redux/actions/common/commonSlice";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { selectCurrentMatch } from "../../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";
import Limitinfo from "../../../CasinoList/component/_common/limitinfo";
import PnlCalculate from "../pnl-calculate";
import { OddsType } from "../../../../models/IMarket";
import { Modal } from "react-bootstrap";

// const isMobile = true

export const FancyList = React.memo(
  ({
    fancies,
    fancyUpdate,
  }: {
    fancies: LFancy[];
    fancyUpdate: Record<string, IFancy>;
  }) => {
    const userState = useAppSelector(selectUserData);
    console.log(userState, "isuyererer in fancylist"); // Debugging user state

    const loading = useAppSelector(selectLoader);
    const dispatch = useAppDispatch();
    const getCurrentMatch: IMatch = useAppSelector(selectCurrentMatch);
    const getMarketBook: any = useAppSelector(selectMarketBook);

    // const [lim , setLim] = React.useState<any>()
    // setLim(userState.user)
    // console.log(userState,"isuyererer")

    const onBet = (isBack = false, market: any) => {
      if (userState.user.role !== RoleType.user) return false;

      if (market.BackPrice1 === 0 && isBack) return false;
      if (market.LayPrice1 === 0 && !isBack) return false;

      const ipAddress = authService.getIpAddress();
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: isBack ? market.BackPrice1 : market.LayPrice1,
            volume: isBack ? market.BackSize1 : market.LaySize1,
            marketId: market.marketId,
            marketName: "Fancy",
            matchId: market.matchId,
            selectionName: market.RunnerName,
            selectionId: market.SelectionId,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? market.BackPrice1 : market.LayPrice1,
            eventId: market.sportId,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: getCurrentMatch.name,
            betOn: IBetOn.FANCY,
            gtype: market.gtype,
            oppsiteVol: isBack ? market.LaySize1 : market.BackSize1,
            oddsType: OddsType.F,
          },
        })
      );
    };

    // console.log(fancies.length,"hello world in this fancylist")
    const [showladder, setShowladder] = React.useState(false)


      const handleCloseLadder = () => setShowladder(false)
      const handleShowLadder = () => setShowladder(true)
    

    const showAllLadder = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (userState.user.role !== RoleType.user) {
        setShowladder(!showladder)
        return
      }
      // navigate.go('/unsettledbet')
    }
  

    return (
      <><div className="table-body">
        {/* <div>Hello world this debug side</div> */}
        {fancies?.length > 0 &&
          fancies.map((fancy: LFancy) => {
            if (!fancy?.active) return null;
            let updatedFancy: IFancy = {} as IFancy;
            if (fancyUpdate[fancy.marketId]) {
              updatedFancy = fancyUpdate[fancy.marketId];
            }
            //  console.log("hello world i am inside mmap function")
            // if (updatedFancy.LayPrice1 === undefined) return null
            return (
              <div key={fancy._id}>
                <div className="fancy-tripple fancy-tripple-box">
                  <div
                    data-title={updatedFancy.GameStatus || fancy.GameStatus}
                    className={`table-row ${fancy.isSuspend || updatedFancy.GameStatus
                        ? "suspended"
                        : ""}`}
                  >
                    <div
                      className="float-left country-name box-6"
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <p className="m-b-0">
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "black",
                            width: "100%", // taaki space-between kaam kare
                          }}
                        >
                          {/* LEFT SIDE */}
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span style={{ fontSize: "13px", fontWeight: "500", textTransform: "uppercase" }}>{fancy.fancyName}</span>
                            <Limitinfo
                              nameString={fancy.marketId}
                              min={userState?.user?.userSetting?.[2]?.minBet ??
                                "N/A"}
                              max={userState?.user?.userSetting?.[2]?.maxBet ??
                                "N/A"} />
                          </div>

                          {/* RIGHT SIDE */}
                          {/* <button  onClick={() => setShowladder(!showladder)}>
                            <img
                              src="/imgs/ladder.svg"
                              style={{ height: "20px" }} />
                          </button> */}
                        </span>
                        {getMarketBook && (
                          <span
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.preventDefault();

                              dispatch(
                                setBookFancy({
                                  matchId: fancy.matchId,
                                  selectionId: updatedFancy.SelectionId,
                                  marketName: fancy.fancyName,
                                })
                              );
                            } }
                            className={getMarketBook[fancy.marketId] >= 0
                              ? "green"
                              : "red"}
                          >
                            {getMarketBook[fancy.marketId]}
                          </span>
                        )}
                        {/* {updatedFancy?.rem && <p className='tx-red'>{updatedFancy?.rem}</p>} */}
                      </p>

                      <span className="">
                        {" "}
                        <PnlCalculate
                          marketId={fancy.marketId}
                          selectionId={updatedFancy.SelectionId} />
                      </span>
                    </div>

                    <div
                      className={`${isMobile ? "box-2" : "box-2"} lay float-left text-center`}
                      onClick={() => onBet(false, { ...fancy, ...updatedFancy })}
                    >
                      <span className="odd d-block">
                        {updatedFancy.LayPrice1 ? updatedFancy.LayPrice1 : "0"}
                      </span>{" "}
                      <span>{updatedFancy.LaySize1}</span>
                    </div>
                    <div
                      className={`${isMobile ? "box-2" : "box-2"} back float-left text-center`}
                      onClick={() => onBet(true, { ...fancy, ...updatedFancy })}
                    >
                      <span className="odd d-block">
                        {updatedFancy.BackPrice1
                          ? updatedFancy.BackPrice1
                          : "0"}
                      </span>{" "}
                      <span>{updatedFancy.BackSize1}</span>
                    </div>
                  </div>
                </div>
                {updatedFancy.rem && (
                  <div className="table-remark text-right">
                    <p className="m-b-0">{updatedFancy.rem}</p>
                  </div>
                )}
              </div>
            );
          })}{" "}
        {!loading && fancies?.length <= 0 && (
          <div key={0}>
            <div className="fancy-tripple bg-gray text-center p10">
              No Real time Fancy Found
            </div>
          </div>
        )}
        {loading && (
          <div key={0} className="text-center m-1">
            <i className="mx-5 fas fa-spinner fa-spin"></i>
          </div>
        )}
      </div>
      
      <Modal show={showladder} onHide={handleCloseLadder} size={'lg'}>
          <Modal.Header closeButton>
            <Modal.Title>Ladder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Ladder</div>
          </Modal.Body>
          <div
    style={{
      backgroundColor: "",
      width: "100%",
      padding: "10px",
      textAlign: "right"
    }}
  >
    <button onClick={handleCloseLadder} className="text-center text-white w-100 rounded-3" style={{marginTop: "15px", background: "rgb(15, 35, 39)"}}><div>Close</div></button>
  </div>
        </Modal></>
    );
  }
);
