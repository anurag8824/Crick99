import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DisplayMatchBets from "./DisplayMatchBets";
import DisplaySessionBets from "./DisplaySessionBets";

const MatchSessionBets = () => {
    const navigate = useNavigate();
    const mid = useParams().id;
  return (
    <div>
      <div style={{ padding: "12px" }} className="container-fluid p-md-4 mt-3">
        <div className=" md:mb-40 mb-2 ">
          <div className="card mb-2">
            <div
              style={{ background: "#0f2327" }}
              className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
            >
              <span className="text-lg font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
              Match & Session Bet Details MatchCode : {mid}
              </span>
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="btn bg-primary text-white"
              >
                <span>Back</span>
              </button>
            </div>
          </div>


          <div className="md:flex grid gap-2 md:mb-40 mb-2 overflow-x-scroll ">
            <div className="match-session-page ">
            <DisplayMatchBets/>
            </div>
            <div className="match-session-page">
            <DisplaySessionBets />
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default MatchSessionBets;
