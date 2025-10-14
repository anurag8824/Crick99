import React from "react";
import "./ledger.css";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { DatePicker } from "antd";

interface LedgerItem {
  commissionlega: number;
  _id: string;
  money: number;
  narration: string;
  username: string;
  createdAt: string;
}
const TotalProfit = () => {
  const [tableData, setTableData] = React.useState<LedgerItem[]>([]);
  const [tableData2, setTableData2] = React.useState([]);

  const [optionuser, setOptionuser] = React.useState<string>("all");
  console.log(optionuser, "optionuser");

  const [totalCommission, setTotalCommission] = React.useState<number>(0);

  React.useEffect(() => {
    betService.oneledger().then((res: AxiosResponse<any>) => {
      const allData = res.data?.data || [];
      // const dataToUse =  allData[1] ? allData[1] : allData[0]  || [];
      const dataToUse = allData[0];

      setTableData2(dataToUse);
      // setTabledata(res.data.data);

      // Filtered data based on selected user
      const filteredData =
        optionuser === "all"
          ? dataToUse
          : dataToUse.filter((item: any) => item.username === optionuser);

      const total = filteredData.reduce((sum: number, item: any) => {
        console.log(sum, item, "sum and item hahahahhahha");
        return sum + item?.profit;
      }, 0);

      console.log(filteredData);

      setTableData(filteredData);

      setTotalCommission(total);

      console.log(res, "res for lena dena jai hind !");
    });
  }, [optionuser]);

  const { RangePicker } = DatePicker;

  return (
    <div className="body-wrap p-md-4 bg-white shadow">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
      >
        <span className="text-3xl font-seminbold text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
          Profit Loss
        </span>
        <CustomLink
          to={"/"}
          type="button"
          className="btn bg-primary text-white"
        >
          <span>Back</span>
        </CustomLink>
      </div>
      <div>
        <div className="container h-full w-100 mt-2 mb-20">
          <div className="text-center mb-4"></div>

          <div className="container py-3">
            <div className="row align-items-start">
              {/* Left Side (Date + Select) */}
              <div className="col-8 col-md-8 d-flex flex-column flex-md-row gap-2">
                <div className="w-100 w-md-auto mb-2 mb-md-0">
                  <RangePicker />
                </div>
                <div className="w-100 w-md-auto">
                  <select
                    id="select-tools-sa"
                    className="form-select"
                    value={optionuser}
                    onChange={(e) => setOptionuser(e.target.value)}
                  >
                    <option value="all">All</option>
                    {Array.from(
                      tableData2
                        .reduce((map: Map<string, any>, row: any) => {
                          if (!map.has(row.username)) {
                            map.set(row.username, row);
                          }
                          return map;
                        }, new Map())
                        .values()
                    ).map((row: any, index) => (
                      <option key={index} value={row.client}>
                        {row.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Side (Total) */}
              <div className="col-2 col-md-4 text-center">
                <div className="d-inline-block">
                  <small className="d-block md:text-2xl text-muted">Total:</small>
                  <span className="fw-semibold text-success">
                    {totalCommission.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            id="ledger_wrapper"
            className="dataTables_wrapper dt-bootstrap4 no-footer"
          >
          

            <div className="row mb-16">
              <div className="col-sm-12 overflow-x-scroll">
                <table
                  className="table table-striped table-bordered LedgerList dataTable no-footer"
                  id="ledger"
                  style={{ minWidth: 700, width: 1110 }}
                  role="grid"
                >
                  <thead className="navbar-bet99 text-dark">
                    <tr role="row">
                      <th
                        className="p-1 pl-2 small sorting_disabled pr-0"
                        style={{
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        DATE
                      </th>
                      <th
                        className="p-1 small no-sort sorting_disabled"
                        style={{
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Event Name
                      </th>
                      <th
                        className="p-1 small text-center no-sort sorting_disabled"
                        style={{
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        CREDIT
                      </th>
                      <th
                        className="p-1 small text-center no-sort sorting_disabled"
                        style={{
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        DEBIT
                      </th>
                      {/* <th
                        className="p-1 small text-center  no-sort sorting_disabled"
                        style={{ width: 97 }}
                      >
                        BALANCE
                      </th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((row: any, index) => (
                      <tr
                        key={row._id}
                        role="row"
                        className={index % 2 === 0 ? "even" : "odd"}
                      >
                        <td className="small pl-2 pr-0">
                          {" "}
                          {new Date(row.createdAt).toLocaleString("en-US", {
                            month: "short", // Apr
                            day: "2-digit", // 16
                            hour: "2-digit", // 04
                            minute: "2-digit", // 09
                            hour12: true, // PM/AM format
                          })}
                        </td>
                        <td>
                          <span
                            className="badge badge-primary p-1"
                            style={{ fontSize: "xx-small" }}
                          >
                            🏆
                          </span>
                          <span className="small p-0" style={{ zIndex: 2 }}>
                            {row.narration}
                          </span>
                        </td>
                        <td>
                          {/* <span className="text-danger">0</span> */}
                          {(row.profit < 0 ? row.profit : 0).toFixed()}
                        </td>
                        <td>
                          <span className="text-success">
                            {(row.profit < 0 ? 0 : row.profit).toFixed()}
                          </span>
                        </td>

                        {/* <td>
                          <span className={"text-danger text-danger"}>
                            {row.profit.toFixed()}
                          </span>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-5"></div>
              <div className="col-sm-12 col-md-7"></div>
            </div>
          </div>

          {/* Fixed Bottom Summary */}
          <div
            className="row border m-0 mt-2 pb-2 pt-2 w-100"
            style={{
              position: "fixed",
              bottom: 0,
              zIndex: 50,
              left: 0,
              background: "white",
            }}
          >
            {/* <div
              className="p-1 col-7 without-commission btn btn-sm btn-danger"
              style={{ display: "none" }}
            >
              <span
                className="badge badge-light"
                style={{
                  position: "relative",
                  bottom: 0,
                  fontSize: "xx-small",
                }}
              >
                (AMT.)
              </span>{" "}
              -13,956
            </div> */}
            {/* <div
              className="p-1 small col-5 without-commission btn btn-sm btn-success"
              style={{ display: "none" }}
            >
              <span
                className="badge badge-light"
                style={{
                  position: "relative",
                  bottom: 0,
                  fontSize: "xx-small",
                }}
              >
                (COMM.)
              </span>{" "}
              14,635
            </div> */}
            {/* <div className="pt-2  col-5 row-title text-center with-commission">
              TOTAL
            </div>
            <div className="pt-2 pr-1 pl-1 col-7 with-commission btn btn-sm btn-success">
              {totalCommission.toLocaleString()}
            </div> */}
          </div>

          {/* Modal */}
          {/* <div
            className="modal fade"
            id="bets-list"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content form-elegant">
                <div className="modal-header text-center pb-0">
                  <h6 style={{ width: "100%" }} className="pt-2">
                    -
                  </h6>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body"></div>
                <div className="modal-footer pt-2 mb-1 text-center">
                  <button
                    type="button"
                    className="btn btn-info"
                    data-dismiss="modal"
                  >
                    Close ❌
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TotalProfit;
