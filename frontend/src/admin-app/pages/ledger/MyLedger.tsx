import React from "react";
import "./ledger.css";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import TopBackHeader from "../TopBackHeader";

interface LedgerItem {
  _id: string;
  money: number;
  narration: string;
  createdAt: string;
  updown: number;
}
const MyLedger = () => {
  const [tableData, setTableData] = React.useState<LedgerItem[]>([]);
  const userState = useAppSelector(selectUserData);

  console.log(userState, "myledgererr");

  React.useEffect(() => {
    betService.oneledger().then((res: AxiosResponse<any>) => {
      const allData = res.data?.data || [];
      const dataToUse = allData[0]?.length ? allData[0] : allData[1] || [];
      // const dataToUse = allData[1]?.length ? allData[1] : allData[0] || [];
      setTableData(dataToUse);
      // setTabledata(res.data.data);
      console.log(res, "res for lena dena jai hind !");
    });
  }, []);

  const getProcessedRows = () => {
    let balance = 0;
    const result: {
      id: string;
      credit: number;
      debit: number;
      balance: number;
      narration: string;
      date: string;
      Fancy: any;
    }[] = [];

    tableData.forEach((item: any) => {
      const isSettled = item.settled === true;

      const isChildMatch = item.ChildId === userState.user._id;

      if (!isSettled || (isSettled && isChildMatch)) {
        const money = item.umoney;
        const credit = money > 0 ? money : 0;
        const debit = money < 0 ? money : 0; // keep -ve as-is
        balance += money;

        result.push({
          id: item._id,
          credit,
          debit,
          balance,
          narration: item.narration,
          date: item.createdAt,
          Fancy: item.Fancy,
        });
      }
    });

    // Reverse so [0][2] is on top and [0][0] at bottom
    return result.reverse();
  };

  const processedRows = getProcessedRows();
  const finalBalance = processedRows.length > 0 ? processedRows[0].balance : 0;

  let totalLena = 0;
  let totalDena = 0;

  if (finalBalance > 0) {
    totalLena = finalBalance;
  } else if (finalBalance < 0) {
    totalDena = Math.abs(finalBalance);
  }

  //   const totalLena = processedRows.reduce((sum, row) => sum + row.credit, 0);
  // const totalDena = processedRows.reduce((sum, row) => sum + Math.abs(row.debit), 0); // debit might be negative
  // const finalBalancetop = totalLena - totalDena;

  return (
    <div className="body-wrap p-md-4 pt-2">
      <TopBackHeader name="My Ledger" />

      <div>
        <div className="container w-100 mt-2 mb-5">
          <div
            id="ledger_wrapper"
            className="dataTables_wrapper dt-bootstrap4 no-footer"
          >
            <div className="row">
              <div className="col-sm-12 col-md-6"></div>
              <div className="col-sm-12 col-md-6"></div>
            </div>

            <div className="container py-1">
              {/* Desktop aur Mobile dono ke liye */}
              <div className="d-flex flex-column flex-md-row justify-content-between text-center">
                {/* Left + Right on Mobile in first row */}
                <div className="d-flex justify-content-between w-100 w-md-auto mb-2 mb-md-0">
                  <div className="col-6 col-md-4 text-start text-md-center">
                    <span className="text-success  fs-3">
                      Lena: {totalLena.toFixed(0)}
                    </span>
                  </div>
                  <div className="col-6 col-md-4 text-end text-md-center">
                    <span className="text-danger  fs-3">
                      Dena: {totalDena.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Balance row */}
                <div className="col-12 col-md-4 text-center mt-2 mt-md-0">
                  <span
                    className={`fs-3 ${
                      finalBalance >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    Balance: {Math.abs(finalBalance).toFixed(2)} (
                    {finalBalance >= 0 ? "Lena" : "Dena"})
                  </span>
                </div>
              </div>
            </div>

            <div className="row overflow-auto mb-20">
              <div className="col-sm-12">
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
                          minWidth: 170,
                          width: 170,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Date
                      </th>
                      <th
                        className="p-1 small text-center no-sort sorting_disabled"
                        style={{
                          width: 81,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Event Name
                      </th>
                      <th
                        className="p-1 small text-center no-sort sorting_disabled"
                        style={{
                          width: 81,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Credit
                      </th>
                      <th
                        className="p-2 small text-center no-sort sorting_disabled"
                        style={{
                          width: 60,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Ddebit
                      </th>
                      <th
                        className="p-1 small text-center  no-sort sorting_disabled"
                        style={{
                          width: 97,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Balance
                      </th>
                      <th
                        className="p-1 small text-center  no-sort sorting_disabled"
                        style={{
                          width: 97,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Type
                      </th>
                      <th
                        className="p-1 small no-sort sorting_disabled"
                        style={{
                          width: 127,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Remark
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {processedRows.map((row, index) => (
                      <tr
                        key={row.id}
                        role="row"
                        className={index % 2 === 0 ? "even" : "odd"}
                      >
                        <td className="small pl-2 pr-0">
                          {new Date(row.date).toLocaleString("en-US", {
                            month: "short", // Apr
                            day: "2-digit", // 16
                            hour: "2-digit", // 04
                            minute: "2-digit", // 09
                            hour12: true, // PM/AM format
                          })}
                        </td>
                        <td className="small p-1 " style={{ zIndex: 2 }}>
                          {row.narration}
                        </td>
                        <td>
                          <span className="text-success p-1">
                            {row.credit.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className="text-danger p-1">
                            {row.debit.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              row.balance >= 0 ? "text-danger" : "text-danger"
                            }
                          >
                            {row.balance.toFixed(2)}
                          </span>
                        </td>
                        <td className="small p-1 " style={{ zIndex: 2 }}>
                          {row.Fancy ? "Session" : "Match"}
                        </td>
                        <td
                          className={
                            row.narration === "Settlement"
                              ? "bg-yellow-400"
                              : ""
                          }
                        >
                          <span
                            className="badge badge-primary p-1"
                            style={{ fontSize: "xx-small" }}
                          >
                            🏆
                          </span>
                          <span className="small p-0 " style={{ zIndex: 2 }}>
                            {row.narration}
                          </span>
                        </td>
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
            className="row border hidden m-0 mt-2 pb-2 pt-2 w-100"
            style={{
              position: "fixed",
              bottom: 0,
              zIndex: 50,
              left: 0,
              background: "white",
            }}
          >
            <div
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
            </div>
            <div
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
            </div>
            {/* <div className="pt-2 col-5 row-title text-center with-commission">
              TOTAL
            </div>
            <div className="pt-2 pr-1 pl-1 col-7 with-commission btn btn-sm btn-success">
              {(finalBalance).toFixed(2)}
            </div> */}
            <div className="pt-2 col-5 row-title text-center with-commission">
              TOTAL
            </div>
            <div
              className={`pt-2 pr-1 pl-1 col-7 with-commission btn btn-sm ${
                finalBalance >= 0 ? "btn-success" : "btn-danger"
              }`}
            >
              {finalBalance.toFixed(2)}
            </div>
          </div>

          {/* Modal */}
          <div
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLedger;
