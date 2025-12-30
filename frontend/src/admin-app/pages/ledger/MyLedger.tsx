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



 
const getProcessedRowsolddd = () => {
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

  const getProcessedRowsjustoldd = () => {
    let balance = 0;
  
    // Step 1: Filter and prepare relevant items
    const filtered = tableData.filter((item: any) => {
      const isSettled = item.settled === true;
      const isChildMatch = item.ChildId === userState.user._id;
      return !isSettled || (isSettled && isChildMatch);
    });
  
    // Step 2: Group by (ChildId + narration + sign)
    const groupedMap = new Map();
  
    filtered.forEach((item: any) => {
      // const sign = item.umoney >= 0 ? "positive" : "negative";
      // const key = `${item.ChildId}_${item.matchId}`;  old key

      const key =
      item.Fancy === false
        ? `${item.ChildId}_CASINO`
        : `${item.ChildId}_${item.matchId}`;
  
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { ...item }); // clone item
      } else {
        const existing = groupedMap.get(key);
        // Sum umoney and money
        existing.umoney += item.umoney;
        existing.money += item.money;
        existing.updown += item.updown;
        // Keep latest date
        if (new Date(item.createdAt) > new Date(existing.createdAt)) {
          existing.createdAt = item.createdAt;
          existing.narration = item.narration;
        }
        groupedMap.set(key, existing);
      }
    });
  
    const groupedData = Array.from(groupedMap.values());
  
    // Step 3: Compute running balance and processed rows
    const result: {
      id: string;
      credit: number;
      debit: number;
      balance: number;
      narration: string;
      date: string;
      Fancy: any;
    }[] = [];
  
    groupedData.forEach((item: any) => {
      const money = item.umoney;
      const credit = money > 0 ? money : 0;
      const debit = money < 0 ? money : 0; // keep negative
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
    });
  
    return result.reverse(); // latest first
  };

  const getDateKey = (date: string) =>
    new Date(date).toISOString().split("T")[0];
  

  const getProcessedRows = () => {
    let balance = 0;
  
    // Step 1: Filter
    const filtered = tableData.filter((item: any) => {
      const isSettled = item.settled === true;
      const isChildMatch = item.ChildId === userState.user._id;
      return !isSettled || (isSettled && isChildMatch);
    });
  
    // Step 2: Grouping
    const groupedMap = new Map<string, any>();
  
    filtered.forEach((item: any) => {
      // 🔑 Fancy false → ek hi Casino group
      const dateKey = getDateKey(item.createdAt);

      const keyoldd =
        item.Fancy === false
          ? `${item.ChildId}_CASINO_${dateKey}`
          : `${item.ChildId}_${item.matchId}`;

          // ✅ GROUP KEY RULE
  const key =
  item.betGame == "CASINO"
    ? `${item.ChildId}_CASINO_${dateKey}`          // casino → date wise
    : `${item.ChildId}_MATCH_${item.matchId}`; 
  
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          ...item,
          narration: item.betGame ? item.betGame === "CASINO" ? "Casino" : item.matchName : item.narration,
        });
      } else {
        const existing = groupedMap.get(key);
  
        // Sum values
        existing.umoney += item.umoney;
        existing.money += item.money;
        existing.updown += item.updown;
  
        // Latest date rakho
        if (new Date(item.createdAt) > new Date(existing.createdAt)) {
          existing.createdAt = item.createdAt;
        }
  
        // 🔒 Fancy false ka narration hamesha Casino

        // if (item.Fancy === false) {
        //   existing.narration = "Casino";
        // }
  
        groupedMap.set(key, existing);
      }
    });
  
    const groupedData = Array.from(groupedMap.values());
  
    // Step 3: Running balance
    const result: {
      id: string;
      credit: number;
      debit: number;
      balance: number;
      narration: string;
      date: string;
      Fancy: any;
    }[] = [];
  
    groupedData.forEach((item: any) => {
      const money = item.umoney;
      const credit = money > 0 ? money : 0;
      const debit = money < 0 ? money : 0;
  
      balance += money;
  
      result.push({
        id: item._id,
        credit,
        debit,
        balance,
        narration: item.betGame ? item.betGame === "CASINO" ? "Casino" : item.matchName : item.narration,
        date: item.createdAt,
        Fancy: item.Fancy,
      });
    });
  
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
                      {/* <th
                        className="p-1 small text-center  no-sort sorting_disabled"
                        style={{
                          width: 97,
                          backgroundColor: "#0f2327",
                          color: "white",
                        }}
                      >
                        Type
                      </th> */}
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
                    {processedRows?.map((row, index) => (
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
                        <td className="small p-1" style={{ zIndex: 2 }}>
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
                        {/* <td className="small p-1 " style={{ zIndex: 2 }}>
                          {row.Fancy ? "Match" : "Casino"}
                        </td> */}
                        <td
                          className={
                            row.narration === "Settlement"
                              ? "bg-yellow-400"
                              : ""
                          }
                        >
                       
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

          </div>

        </div>
      </div>
    </div>
  );
};

export default MyLedger;
