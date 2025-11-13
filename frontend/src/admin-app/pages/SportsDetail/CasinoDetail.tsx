import React from "react";
import accountService from "../../../services/account.service";
import { AxiosResponse } from "axios";
import moment from "moment";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

const CasinoDetail = () => {
  const [casinoData, setCasinoData] = React.useState<any>([]);
  const [openMatch, setOpenMatch] = React.useState<string | null>(null);

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [selectedBets, setSelectedBets] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(false);

  const handleShowBets = (bets: any[]) => {
    setSelectedBets(bets);
    setShowModal(true);
  };

  React.useEffect(() => {
    accountService.marketcasino().then((res: AxiosResponse) => {
      console.log(res, "casinoooo data");
      const allData = res?.data?.data?.bets?.reverse() || [];
      setCasinoData(allData);
    });
  }, []);

  const totalProfitLoss = casinoData?.reduce(
    (sum: any, b: any) => sum + b.profitLoss,
    0
  );

  const groupedData = casinoData.reduce((acc: any, bet: any) => {
    const dateKey = moment(bet.betClickTime).format("YYYY-MM-DD");
    const key = `${bet.matchName}_${dateKey}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bet);
    return acc;
  }, {});

  const [expandedMatches, setExpandedMatches] = React.useState<{
    [key: string]: boolean;
  }>({});

  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: "2" }} className="container-fluid p-md-4 mt-3">
        <div
          style={{ background: "#0f2327" }}
          className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
        >
          <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
            Casino PandL Detail
          </span>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="btn bg-primary text-white"
          >
            <span>Back</span>
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
    totalProfitLoss >= 0 ? "text-danger" : "text-success"
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

        <div className="card-content">
          <div className=" coupon-table" style={{ overflowX: "auto" }}>
            <table className="table table-bordered mb-0 text-nowrap">
              <thead className="table-secondary text-center fs-6">
                <tr>
                  <th
                    className="text-center"
                    style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}
                  >
                    Event Name
                  </th>
                  <th
                    style={{
                      width: "20%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      width: "20%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}
                  >
                    {" "}
                    PnL
                  </th>
                  <th
                    style={{
                      width: "30%",
                      backgroundColor: "#0f2327",
                      color: "white",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groupedData).map(
                  ([key, bets]: [string, any[]], i) => {
                    const [matchName, dateKey] = key.split("_");
                    const totalPnL = bets.reduce(
                      (sum, b) => sum + b.profitLoss,
                      0
                    );
                    const isPositive = totalPnL >= 0;

                    return (
                      <React.Fragment key={i}>
                        <tr>
                          <td className="mb-2 ng-binding p-2 uppercase">{matchName}</td>

                          <td className="p-2">
                            {moment(dateKey).format("MM/DD/YYYY")}
                          </td>

                          <td
                            className={`mb-0 p-2 ${
                              isPositive ? "text-danger" : "text-success"
                            } fw-bold`}
                          >
                            {totalPnL.toFixed(2)}
                          </td>

                          <td
                            className="p-2 hidden "
                            onClick={() =>
                              setOpenMatch(openMatch === key ? null : key)
                            }
                          >
                            {" "}
                            <button className=" text-primary ">
                              {" "}
                              View
                            </button>{" "}
                          </td>

                          <td
                            className="p-2 "
                            // onClick={() =>
                            //   setOpenMatch(openMatch === key ? null : key)
                            // }
                            // onClick={() => navigate(`/casino-detail/${matchName}/${dateKey}`)}
                          >
                            <CustomLink
                              to={`/casino-detail/${matchName}/${dateKey}`}
                              className=" text-primary "
                            >
                              {" "}
                              View
                            </CustomLink>
                          </td>
                        </tr>

                        {openMatch === key && (
                          <tr>
                            <td colSpan={4} className="p-0">
                              <hr className="my-1" />
                              {/* Here combined with the match Id */}
                              <div
                                className="table-responsive"
                                style={{ overflowX: "scroll" }}
                              >
                                <div>
                                  <table className="table table-sm table-striped table-bordered mb-0 text-nowrap">
                                    <thead className="table-secondary text-center fs-6">
                                      <tr>
                                        <th
                                          style={{
                                            backgroundColor: "#0f2327",
                                            color: "white",
                                          }}
                                          className="text-center"
                                        >
                                          Event ID
                                        </th>

                                        <th
                                          style={{
                                            backgroundColor: "#0f2327",
                                            color: "white",
                                          }}
                                        >
                                          Date
                                        </th>
                                        <th
                                          style={{
                                            backgroundColor: "#0f2327",
                                            color: "white",
                                          }}
                                        >
                                          Winner
                                        </th>

                                        <th
                                          style={{
                                            backgroundColor: "#0f2327",
                                            color: "white",
                                          }}
                                        >
                                          PnL
                                        </th>

                                        <th
                                          style={{
                                            backgroundColor: "#0f2327",
                                            color: "white",
                                          }}
                                        >
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(
                                        bets.reduce((acc: any, b: any) => {
                                          const marketKey = b.marketId;
                                          if (!acc[marketKey])
                                            acc[marketKey] = [];
                                          acc[marketKey].push(b);
                                          return acc;
                                        }, {})
                                      ).map(
                                        (
                                          [marketId, marketBets]: [
                                            string,
                                            any[]
                                          ],
                                          j
                                        ) => {
                                          const totalMarketPnL =
                                            marketBets.reduce(
                                              (sum, b) => sum + b.profitLoss,
                                              0
                                            );
                                          const winner =
                                            marketBets[0]?.selectionName || "-";

                                          return (
                                            <tr
                                              key={j}
                                              className="text-center align-middle fs-6"
                                            >
                                              <td className="p-2">
                                                {marketId}
                                              </td>
                                              <td className="p-2">
                                                {moment(
                                                  marketBets[0]?.betClickTime
                                                ).format(
                                                  "MM/DD/YYYY h:mm:ss a"
                                                )}
                                              </td>

                                              <td className="p-2">{winner}</td>
                                              <td
                                                className={
                                                  totalMarketPnL >= 0
                                                    ? "text-success fw-bold p-2"
                                                    : "text-danger fw-bold p-2"
                                                }
                                              >
                                                {totalMarketPnL.toFixed(2)}
                                              </td>
                                              <td className="p-2">
                                                <button
                                                  className="btn btn-sm bg-primary text-white p-1"
                                                  onClick={() =>
                                                    handleShowBets(marketBets)
                                                  }
                                                >
                                                  Show Bets
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ color: "white" }}>
          <Modal.Title style={{ color: "white" }}>Bet Details</Modal.Title>
          <style>
            {`
      .btn-close {
        filter: invert(1); /* makes the close icon white */
      }
    `}
          </style>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-sm table-striped table-bordered text-nowrap">
              <thead className="table-secondary text-center fs-6">
                <tr>
                  <th>Username</th>
                  <th>Selection</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>PnL</th>
                  <th>Status</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {selectedBets.map((b: any, i: number) => (
                  <tr key={i} className="text-center align-middle fs-6">
                    <td>
                      {b.userName} ({b.parentNameStr})
                    </td>
                    <td>{b.selectionName}</td>
                    <td>{b.odds}</td>
                    <td>{b.stack}</td>
                    <td
                      className={
                        b.profitLoss >= 0 ? "text-success" : "text-danger"
                      }
                    >
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
                    <td>
                      {moment(b.betClickTime).format("MM/DD/YYYY h:mm:ss a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CasinoDetail;
