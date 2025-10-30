import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountService from "../../../services/account.service";
import { AxiosResponse } from "axios";
import moment from "moment";

const CasinoBetsWise = () => {
  const { matchName, date, marketId } = useParams<{
    matchName: string;
    date: string;
    marketId: string;
  }>();

  const [bets, setBets] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    accountService.marketcasino().then((res: AxiosResponse) => {
      const allBets = res?.data?.data?.bets.reverse() || [];
      const filtered = allBets.filter((b: any) => {
        const betDate = moment(b.betClickTime).format("YYYY-MM-DD");
        return (
          b.matchName === matchName &&
          betDate === date &&
          b.marketId === marketId
        );
      });
      setBets(filtered);
    });
  }, [matchName, date, marketId]);

  const totalProfitLoss = bets?.reduce((sum, b) => sum + b.profitLoss, 0);


  return (
    <div className="container-fluid p-md-4 mt-3">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey flex item-center justify-between px-3 py-3"
      >
        <span className="text-xl text-white uppercase">
          {matchName} → {marketId}
        </span>
        <button
          onClick={() => navigate(-1)}
          className="btn bg-primary text-white"
        >
          Back
        </button>
      </div>

      <div
          className="mb-3 p-3 rounded"
          style={{ backgroundColor: "#f0f2f5" }}
        >
          <div className="row">
            <div className="col-md-4">
              <div className="statistic">
                <div className="statistic-title fw-semibold mb-1">P/L</div>
                <div
                  className="statistic-content text-success"
                  style={{ color: " rgb(82, 196, 26)" }}
                >
                  <span className="statistic-value">
                  <span
  className={`statistic-value-int font-bold text-xl ${
    totalProfitLoss >= 0 ?  "text-danger" : "text-success"
  }`}
>
  {totalProfitLoss?.toFixed(2)}
</span>

                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="card-content mt-3">
      <div className=" coupon-tableg" style={{ overflowX: "auto" }}>
        <table className="table table-bordered text-center text-nowrap">
          <thead>
            <tr style={{ backgroundColor: "#0f2327", color: "white" }}>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Username</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Selection</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Rate</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Amount</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>PnL</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Status</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {bets?.map((b, i) => (
              <tr key={i}>
                <td>{b.userName} ({b.parentNameStr})</td>
                <td>{b.selectionName}</td>
                <td>{b.odds}</td>
                <td>{b.stack}</td>
                <td className={b.profitLoss >= 0 ?  "text-success" : "text-danger" }>
                  {b.profitLoss.toFixed(2)}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill text-light ${
                      b.profitLoss >= 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {b.profitLoss >= 0 ? "Win" : "Lost"}
                  </span>
                </td>
                <td>{moment(b.betClickTime).format("MM/DD/YYYY h:mm:ss a")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default CasinoBetsWise;
