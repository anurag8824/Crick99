import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountService from "../../../services/account.service";
import { AxiosResponse } from "axios";
import moment from "moment";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";

const CasinoKeyWise = () => {
  const { matchName, date } = useParams<{ matchName: string; date: string }>();
  const [bets, setBets] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    accountService.marketcasino().then((res: AxiosResponse) => {
      const allBets = res?.data?.data?.bets.reverse() || [];
      // Filter by matchName and date
      const filtered = allBets.filter((b: any) => {
        const betDate = moment(b.betClickTime).format("YYYY-MM-DD");
        return b.matchName === matchName && betDate === date;
      });
      setBets(filtered);
    });
  }, [matchName, date]);


  const totalProfitLoss = bets?.reduce((sum, b) => sum + b.profitLoss, 0);

  // Group by marketId
  const groupedByMarket = bets.reduce((acc: any, b: any) => {
    if (!acc[b.marketId]) acc[b.marketId] = [];
    acc[b.marketId].push(b);
    return acc;
  }, {});

  return (
    <div className="container-fluid p-md-4 mt-3">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey flex item-center justify-between px-3 py-3"
      >
        <span className="text-xl text-white">
          {matchName} ({moment(date).format("MM/DD/YYYY")})
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
    totalProfitLoss >= 0 ?   "text-danger" : "text-success"
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
                    }}>Market ID</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Date</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Selection</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>PnL</th>
              <th style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByMarket).map(([marketId, marketBets]: any, i) => {
              const totalPnL = marketBets.reduce(
                (sum: number, b: any) => sum + b.profitLoss,
                0
              );
              const winner = marketBets[0]?.selectionName || "-";

              return (
                <tr key={i}>
                  <td>{marketId}</td>
                  <td>
                    {moment(marketBets[0]?.betClickTime).format(
                      "MM/DD/YYYY h:mm:ss a"
                    )}
                  </td>
                  <td>{winner}</td>
                  <td className={totalPnL >= 0 ? "text-danger" : "text-success"}>
                    {totalPnL.toFixed(2)}
                  </td>
                  <td>
                    <CustomLink
                    to={`/casino-detail/${matchName}/${date}/${marketId}`}
                      className="btn btn-sm bg-primary text-white"
                    //   onClick={() =>
                    //     navigate(`/casino-detail/${matchName}/${date}/${marketId}`)
                    //   }
                    >
                      Show Bets
                    </CustomLink>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default CasinoKeyWise;
