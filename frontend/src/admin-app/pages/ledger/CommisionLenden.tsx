import React, { useState } from "react";
import "./ClientLedger.css"; // Import the CSS file
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { DatePicker } from "antd";
import TopBackHeader from "../TopBackHeader";

interface CommissionRow {
  name: string;
  cname: string;
  milaCasinoComm: number;
  milaSportsComm: number;
  milaTotalComm: number;
  denaCasinoComm: number;
  denaSportsComm: number;
  denaTotalComm: number;
  date?: string;
}

const CommisionLenden: React.FC = () => {
  const [commissionData, setCommissionData] = useState<CommissionRow[]>([]);
  const [allEntries, setAllEntries] = useState<any[][]>([]);

  const [optionuser, setOptionuser] = React.useState<string>("all");

  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const { RangePicker } = DatePicker;

  React.useEffect(() => {
    betService.oneledger().then((res: AxiosResponse<any>) => {
      console.log(res, "dmbsdbh lena dena");
      const data = res.data.data;
      const processed = processCommissionTable(data);
      setCommissionData(processed);
      setAllEntries(data);
    });
  }, []);

  const processCommissionTable = (data: any[][]): CommissionRow[] => {
    const milaCasinoMap: Record<string, number> = {};
    const milaSportsMap: Record<string, number> = {};
    const denaCasinoMap: Record<string, number> = {};
    const denaSportsMap: Record<string, number> = {};
    const usernameMap: Record<string, string> = {};
    const cnameMap: Record<string, string> = {};

    // const sourceArray = data[0]?.length > 0 ? data[1] : data[1] || [];
    const sourceArray = data[0]?.length > 0 ? data[0] : data[0] || [];

    sourceArray.forEach((entry: any) => {
      const childId = entry.ChildId;
      const isFancy = entry.Fancy === true;

      // const mila = entry.commissionlega || 0;
      // const dena = entry.commissiondega || 0;
      const mila = entry.iscomSet ? 0 : entry.commissionlega || 0;
      const dena = entry.iscomSet ? 0 : entry.commissiondega || 0;

      // Set name based on ParentId match from data[0]
      if (!usernameMap[childId]) {
        const match = data[0]?.find((ref: any) => ref.ParentId === childId);
        usernameMap[childId] = match?.username || entry.username || childId;
      }

      if (!cnameMap[childId]) {
        const match = data[0]?.find((ref: any) => ref.ParentId === childId);
        cnameMap[childId] = match?.cname || entry.cname || childId;
      }

      // Init maps
      if (!milaCasinoMap[childId]) milaCasinoMap[childId] = 0;
      if (!milaSportsMap[childId]) milaSportsMap[childId] = 0;
      if (!denaCasinoMap[childId]) denaCasinoMap[childId] = 0;
      if (!denaSportsMap[childId]) denaSportsMap[childId] = 0;

      // Sort into sports or casino
      if (isFancy) {
        milaSportsMap[childId] += mila;
        denaSportsMap[childId] += dena;
      } else {
        milaCasinoMap[childId] += mila;
        denaCasinoMap[childId] += dena;
      }
    });

    const allChildIds = new Set([
      ...Object.keys(milaCasinoMap),
      ...Object.keys(milaSportsMap),
      ...Object.keys(denaCasinoMap),
      ...Object.keys(denaSportsMap),
    ]);

    let totalMilaCasino = 0;
    let totalMilaSports = 0;
    let totalDenaCasino = 0;
    let totalDenaSports = 0;

    const result: CommissionRow[] = [];

    allChildIds.forEach((id) => {
      const milaCasino = milaCasinoMap[id] || 0;
      const milaSports = milaSportsMap[id] || 0;
      const denaCasino = denaCasinoMap[id] || 0;
      const denaSports = denaSportsMap[id] || 0;

      totalMilaCasino += milaCasino;
      totalMilaSports += milaSports;
      totalDenaCasino += denaCasino;
      totalDenaSports += denaSports;

      result.push({
        name: usernameMap[id] || id,
        cname: cnameMap[id] || id,
        milaCasinoComm: milaCasino,
        milaSportsComm: milaSports,
        milaTotalComm: milaCasino + milaSports,
        denaCasinoComm: denaCasino,
        denaSportsComm: denaSports,
        denaTotalComm: denaCasino + denaSports,
      });
    });

    result.push({
      name: "TOTAL",
      cname: "All",
      milaCasinoComm: totalMilaCasino,
      milaSportsComm: totalMilaSports,
      milaTotalComm: totalMilaCasino + totalMilaSports,
      denaCasinoComm: totalDenaCasino,
      denaSportsComm: totalDenaSports,
      denaTotalComm: totalDenaCasino + totalDenaSports,
    });

    console.log(result, "ressss");

    return result;
  };

  const [rangeValue, setRangeValue] = useState<any>(null);

  const handleDateFilter = () => {
    if (!rangeValue) return;

    const [start, end] = rangeValue;
    const filteredData =
      allEntries[0]?.filter((entry: any) => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= start.toDate() && entryDate <= end.toDate();
      }) || [];

    const updatedCommissionData = processCommissionTable([filteredData]);
    setCommissionData(updatedCommissionData);
  };

  const renderUserDetails = (childId: string) => {
    console.log(childId, "cjhild");
    console.log(allEntries, "allentries");
    const sourceArray =
      allEntries[1]?.length > 0 ? allEntries[0] : allEntries[0] || [];
    console.log(sourceArray, "source array");
    const filtered = sourceArray.filter(
      (item: any) => item.username === childId
    );

    let totalMilaCasino = 0;
    let totalMilaSports = 0;
    let totalDenaCasino = 0;
    let totalDenaSports = 0;

    const rows = filtered.map((item: any, index: number) => {
      const isFancy = item.Fancy === true;
      const mila = item.commissionlega || 0;
      const dena = item.commissiondega || 0;

      if (isFancy) {
        totalMilaSports += mila;
        totalDenaSports += dena;
      } else {
        totalMilaCasino += mila;
        totalDenaCasino += dena;
      }

      return (
        <tr key={index}>
          <td>{new Date(item.createdAt).toLocaleString()}</td>
          <td>{item.narration || "N/A"}</td>
          <td>{!isFancy ? mila.toFixed(2) : "-"}</td>
          <td>{isFancy ? mila.toFixed(2) : "-"}</td>
          <td>{!isFancy ? dena.toFixed(2) : "-"}</td>
          <td>{isFancy ? dena.toFixed(2) : "-"}</td>
        </tr>
      );
    });

    const totalRow = (
      <tr>
        <td colSpan={2}>
          <strong>TOTAL</strong>
        </td>
        <td>{totalMilaCasino.toFixed(2)}</td>
        <td>{totalMilaSports.toFixed(2)}</td>
        <td>{totalDenaCasino.toFixed(2)}</td>
        <td>{totalDenaSports.toFixed(2)}</td>
      </tr>
    );

    return [...rows, totalRow];
  };

  //  date filter in particular user too
  // const renderUserDetails = (childId: string) => {
  //   const sourceArray = allEntries[0] || [];

  //   const filtered = sourceArray.filter((item: any) => {
  //     const matchesUser = item.username === childId;
  //     if (!startDate || !endDate) return matchesUser;

  //     const entryDate = new Date(item.createdAt);
  //     const start = new Date(startDate);
  //     const end = new Date(endDate);
  //     end.setHours(23, 59, 59, 999);

  //     return matchesUser && entryDate >= start && entryDate <= end;
  //   });
  //   ...
  // };

  console.log(commissionData, "commsiondata");

  // const settled = (name:any) =>{
  //   betService.comreset(name).then((res)=>{
  //     console.log(res,"check resetttt")
  //   })
  // }

  const settled = async (name: string) => {
    try {
      const res = await betService.comreset({ name });
      console.log("Reset response:", res);
      if (res.data.status) {
        window.location.reload();
      }
      // Optionally, show success toast or refresh data
    } catch (error) {
      console.error("Reset failed:", error);
      // Optionally, show error toast
    }
  };

  return (
    <div style={{backgroundColor:"white"}} className=" shadow body-wrap p-md-4 pt-2 ">
      <TopBackHeader name="Commission Lenden" />

      <div className="container py-3">
        <div className="row align-items-end">
          {/* Left Side: Date Picker + Client Select */}
          <div className="col-12 col-md-8 d-flex flex-column flex-md-row gap-2">
            {/* RangePicker */}
            <div className="w-100 w-md-auto mb-2 mb-md-0">
              <RangePicker
                className="form-control"
                value={rangeValue}
                onChange={(dates) => setRangeValue(dates)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Client Select */}
            <div className="w-100 w-md-auto mb-2 mb-md-0">
              <select
                id="select-tools-sa"
                className="form-select"
                value={optionuser}
                onChange={(e) => setOptionuser(e.target.value)}
              >
                <option value="all">All Clients</option>
                {commissionData
                  ?.filter(
                    (row, index, self) =>
                      index === self.findIndex((r) => r.name === row.name)
                  )
                  .map((row: any, index) => (
                    <option key={index} value={row.name}>
                      {row.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Right Side: Apply Button */}
          <div className="col-12 col-md-4 d-flex justify-content-start justify-content-md-end mt-2 mt-md-0">
            <button
              style={{ backgroundColor: "rgb(170, 74, 68)" }}
              className="btn bt-primary text-white"
              onClick={handleDateFilter}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="w-100">
        <div className="table-wrapper">
          <table className="commission-table">
            <thead>
              {optionuser === "all" ? (
                <>
                  <tr>
                    <th
                      colSpan={5}
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      Mila Hai
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                      colSpan={5}
                    >
                      Dena Hai
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      M. Comm.
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      S. Comm.
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      {" "}
                      T. Comm.
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      Action
                    </th>

                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      M. Comm.
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      S. Comm.
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      {" "}
                      T. Comm
                    </th>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      Narration
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      M Mila
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      S Mila
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      M Dena
                    </th>
                    <th
                      style={{
                        background: "#0f2327",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      S Dena
                    </th>
                  </tr>
                </>
              )}
            </thead>
            <tbody>
              {optionuser === "all"
                ? commissionData
                    ?.filter(
                      (row, index, self) =>
                        index === self.findIndex((r) => r.name === row.name)
                    )
                    ?.map((row) => (
                      <tr key={row.name}>
                        <td style={{ fontSize: "13px" }} className="">
                          {row.name}
                          {`(${row.cname})`}
                        </td>
                        <td style={{ fontSize: "13px" }} className="">
                          {row.milaCasinoComm.toFixed(2)}
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {row.milaSportsComm.toFixed(2)}
                        </td>

                        <td style={{ fontSize: "13px" }}>
                          {row.milaTotalComm.toFixed(2)}
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {" "}
                          <button
                            onClick={() => settled(row.name)}
                            className="bg-yellow-400 mt-1.5 px-2 py-1.5 rounded-md"
                          >
                            Reset
                          </button>
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {row.denaCasinoComm.toFixed(2)}
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {row.denaSportsComm.toFixed(2)}
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {row.denaTotalComm.toFixed(2)}
                        </td>
                      </tr>
                    ))
                : renderUserDetails(optionuser)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommisionLenden;
