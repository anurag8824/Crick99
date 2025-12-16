import React from "react";
import "./ledger.css";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";

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

  const getGroupedProfitData = (data: any[], selectedUser: string) => {
    const map = new Map<string, any>();
  
    data.forEach((item: any) => {
      // user filter
      if (selectedUser !== "all" && item.username !== selectedUser) return;
  
      const key =
        item.Fancy === false
          ? "CASINO"
          : `${item.childId || item.username}_${item.matchId}`;
  
      if (!map.has(key)) {
        map.set(key, {
          ...item,
          narration: item.Fancy === false ? "Casino" : item.narration,
          profit: item.profit || 0,
        });
      } else {
        const existing = map.get(key);
  
        existing.profit += item.profit || 0;
  
        // latest date rakho
        if (new Date(item.createdAt) > new Date(existing.createdAt)) {
          existing.createdAt = item.createdAt;
        }
  
        if (item.Fancy === false) {
          existing.narration = "Casino";
        }
  
        map.set(key, existing);
      }
    });
  
    return Array.from(map.values());
  };
  

  React.useEffect(() => {
    betService.oneledger().then((res: AxiosResponse<any>) => {
      const allData = res.data?.data || [];
      const dataToUse = allData[0] || [];
  
      setTableData2(dataToUse);
  
      const grouped = getGroupedProfitData(dataToUse, optionuser);
  
      const total = grouped.reduce((sum: number, item: any) => {
        return sum + (item.profit || 0);
      }, 0);
  
      setTableData(grouped);
      setTotalCommission(total);
    });
  }, [optionuser]);
  

  const { RangePicker } = DatePicker;
  const navigate = useNavigate()
  
  const formatNarration = (text: string = "") => {
    let t = text.replace(/^\d+/, "").trim();
    if (t.includes("/")) t = t.split("/")[0].trim();
    return t;
  };
  

  return (
    <div className="body-wrap p-md-4 bg-white shadow">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
      >
        <span className="text-3xl font-seminbold text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
          Profit Loss
        </span>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn bg-primary text-white"
        >
          <span>Back</span>
        </button>
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
    {formatNarration(row.narration)}
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
            
           
          </div>

        
          
        </div>
      </div>
    </div>
  );
};

export default TotalProfit;
