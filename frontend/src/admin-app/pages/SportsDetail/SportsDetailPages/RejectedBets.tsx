import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import accountService from "../../../../services/account.service";
import { AxiosResponse } from "axios";

const DeletedBets = () => {
  const maid = useParams().id;
  const [marketdata, setmarketData] = React.useState<any>([]);

  React.useEffect(() => {
    accountService.matchdetail().then((res: AxiosResponse) => {
      console.log(res, "marketffffff data");
      const allBets = res.data.data.bets;
      const filteredBets = allBets.filter(
        (bet: any) => bet.matchId == maid && bet.status === "deleted" && bet.status === "cancelled"
      );
      console.log(filteredBets, "filterreerre");
      setmarketData(filteredBets);
    });
  }, [maid]);

  const navigate = useNavigate();

  return (
    <div style={{ padding: "12px" }} className="container-fluid p-md-4 mt-3">
     <div
              style={{ background: "#0f2327" }}
              className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
            >
              <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
              REJECTED Bets
              </span>
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="btn bg-primary text-white"
              >
                <span>Back</span>
              </button>
            </div>

            <div style={{background:"#0f2327"}} className="p-2 text-white mt-2 font-bold">Fancy Bets</div>

      <div className="row">
        <div className="col-md-12"  style={{ width: "100%" , overflowX:"scroll" }}>
          <table
            className="table table-striped table-bordered"
           
          >
            <thead>
              <tr>
                <th style={{background:"#0f2327", color:"white"}}   className="pt-2 pb-2">Client</th>
                <th style={{background:"#0f2327", color:"white"}}  className="pt-0 pb-0">Market</th>
                <th style={{background:"#0f2327", color:"white"}}  className="pt-0 pb-0">Team</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Run</th>
                <th style={{background:"#0f2327", color:"white"}} className="text-center pt-0 pb-0">Type</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Amount</th>
                <th style={{background:"#0f2327", color:"white"}}  className="pt-0 pb-0">Result</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Deleted</th>
              </tr>
            </thead>
            <tbody>
              {marketdata?.filter((b:any) => b.bet_on === "FANCY")?.map((bet: any, index: any) => (
                <tr key={index}>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1 small">{bet.userName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.selectionName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.selectionName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.odds}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="text-center p-1">
                    {bet.isBack ? (
                      <button
                        style={{ textAlign: "left", fontSize: "xx-small" }}
                        className="btn-yes btn btn-sm"
                      >
                        YES{" "}
                      </button>
                    ) : (
                      "NO"
                    )}
                  </td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.stack}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.pnl}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" ,fontSize: "xx-small" }} className="p-1">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div style={{background:"#0f2327"}} className="p-2 text-white mt-2 font-bold">Match Bets</div>

      <div className="row">
        <div className="col-md-12" style={{ width: "100%" , overflowX:"scroll" }}>
          <table
            className="table table-striped table-bordered"
           
          >
            <thead>
              <tr>
                <th style={{background:"#0f2327", color:"white"}} className="pt-2 pb-2">Client</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Market</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Team</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Rate</th>
                <th style={{background:"#0f2327", color:"white"}} className="text-center pt-0 pb-0">Type</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Amount</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Result</th>
                <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Deleted</th>
              </tr>
            </thead>
            <tbody>
              {marketdata?.filter((b:any) => b.bet_on === "MATCH_ODDS")?.map((bet: any, index: any) => (
                <tr key={index}>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1 small">{bet.userName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.selectionName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.selectionName}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.odds}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="text-center p-1">
                    {bet.isBack ? (
                      <button
                        style={{ textAlign: "left", fontSize: "xx-small" }}
                        className="btn-yes btn btn-sm"
                      >
                        YES{" "}
                      </button>
                    ) : (
                      "NO"
                    )}
                  </td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.stack}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1">{bet.pnl}</td>
                  <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" ,fontSize: "xx-small" }} className="p-1">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeletedBets;
