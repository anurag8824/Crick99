import React from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";

interface MatchListProps {
  matchList: LMatch[];
  currentMatch: (match: LMatch) => void;
}

const MatchList2: React.FC<MatchListProps> = ({ matchList, currentMatch }) => {
  return (
    <div className="container-fluid mt-3 mb-4 rounded ">
      {/* Title above table */}
      <div className="p-4  text-left rounded-top" style={{ backgroundColor: "#0f2327" }}>
        <h5 className="m-0 text-light fs-5 ">Active Matches</h5>
      </div>

      <div className="table-responsivke" style={{overflowX:"scroll" , width:"100%" }}>
        <table className="table table-bordered table-striped align-middle text-left">
          <thead style={{ backgroundColor: "#0f2327" , color:"white" }}>
            <tr>
            <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Sr.</th>
              <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Name</th>
              <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Open Date</th>
              <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Compitition</th>
              <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Inplay</th>
              <th style={{ backgroundColor: "#0f2327"  , color:"white"  }}>Details</th>



              {/* <th style={{ backgroundColor: "#0f2327" }}>Declared</th> */}
            </tr>
          </thead>
          <tbody>
            {matchList?.map((match: LMatch , idx) => {
              return (
                <tr
                  key={match.matchId}
                  style={{ cursor: "pointer" }}
                  onClick={() => currentMatch(match)}
                >
                  {/* Match Name */}
                  <td>{idx + 1}</td>
                  <td className="">{match?.name}</td>


                  {/* Match Date */}
                  <td>{moment(match.matchDateTime).format(dateFormat)}</td>
                  <td className="">{match?.name}</td>

                  {/* Status */}
                  <td className="">
                    <span className="text-white fs-6  bg-primary rounded p-2 text-nowrap">
                      {/* <i className="fas fa-circle fa-xs me-1"></i> */}
                      IN PLAY
                    </span>
                  </td>

                  <td className="text-primary fw-bold">Details</td>


                  {/* Declared */}
                  {/* <td>
                    {moment().startOf("day").diff(moment(match.matchDateTime).startOf("day"), "days") >= 1
                      ? "Yes"
                      : "No"}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchList2;
