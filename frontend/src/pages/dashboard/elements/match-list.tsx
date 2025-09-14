import React from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";

import "./matchlist.css";
import axios from "axios";

import LiveTvIcon from '@mui/icons-material/LiveTv';

interface MatchListProps {
  matchList: LMatch[];
  currentMatch: (match: LMatch) => void;
  memoOdds: (marketId: string | null) => React.ReactNode;
}

const MatchList: React.FC<MatchListProps> = ({
  matchList,
  currentMatch,
  memoOdds,
}) => {
  // console.log(matchList, "matchlisy", currentMatch, "currentmatch", memoOdds, "memoodds")

  return (
    <div className="card-content p-1">
      <div className="games-grid">
        <div className="games-list">
          {matchList?.map((match: LMatch, index: number) => {
            const marketId =
              match?.markets && match?.markets?.length > 0
                ? match?.markets[0]?.marketId
                : null;
            return (
              <a key={match.matchId} className="game-card" onClick={() => currentMatch(match)} >
                <div className="game-header2">
                  <div className="game-title">
                    {match.name}
                  </div>
                </div>
                <div
                  className="game-details"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",

                  }}
                >
                  <div>
                    <div className="game-league">{match.name}</div>
                    <div className="game-time">
                      {moment(match?.matchDateTime).format(dateFormat)}
                      
                        {/* img
                        alt="tv"
                        src="https://urbet99.com/images/live-tv.png"
                        style={{ width: "25px" }} */}
                        {/* <LiveTvIcon/> */}
                      
                    </div>
                  </div>
                  <div>
                    {/* <span className="inplay-btn mobile-show">INPLAY</span> */}
                  </div>
                </div>
              </a>


            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MatchList;
