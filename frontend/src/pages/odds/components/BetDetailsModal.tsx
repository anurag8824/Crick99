import React, { useMemo, useState } from "react";
import moment from "moment";
import { Modal, Button } from "react-bootstrap"; // using react-bootstrap for modal
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { RoleType } from "../../../models/User";

const BetDetailsModal = ({ show, onClose, bets }: any) => {
  const userState = useAppSelector(selectUserData);

  const [searchUser, setSearchUser] = useState("");
  const [filterSelection, setFilterSelection] = useState("");

  const selectionNames = useMemo(() => {
    const unique = new Set(bets.map((b: any) => b.selectionName));
    return Array.from(unique);
  }, [bets]);

  const filteredBets = useMemo(() => {
    return bets.filter((b: any) => {
      const matchUser = b.userName
        .toLowerCase()
        .includes(searchUser.toLowerCase());
      const matchSel = filterSelection
        ? b.selectionName === filterSelection
        : true;
      return matchUser && matchSel;
    });
  }, [bets, searchUser, filterSelection]);

  return (
    <Modal show={show} onHide={onClose} size="xl" fullscreen>
      <div className="bg-[#0f2326] text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold">Detailed Bets</h4>
          <button
            className="text-white bg-red-600 px-3 py-1 rounded"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 mb-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by Username..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="text-black p-2 rounded w-64"
          />
          <select
            value={filterSelection}
            onChange={(e) => setFilterSelection(e.target.value)}
            className="text-black p-2 rounded w-64"
            style={{borderColor:"#000", border:"1px solid"}}
          >
            <option value="">All Selection Names</option>
            {selectionNames.map((name:any) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Table Section */}
        <div
          className="table-responsive"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <table className="table table-bordered text-white text-center">
            <thead>
              <tr style={{ background: "#76d68f", color: "#000" }}>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>#</th>
                {userState.user.role !== RoleType.user && <th   style={{ background: "#0f2326", border: "", color: "white" }}>Username</th>}
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Runner Name</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Type</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Bet Mode</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Price</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Value</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Amount</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Result</th>
                <th   style={{ background: "#0f2326", border: "", color: "white" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBets.map((bet: any, index: number) => (
                <tr
                  key={index}
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    color: "#000",
                  }}
                >
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }} >{index + 1}</td>
                  {userState.user.role !== RoleType.user && (
                    <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>
                      {bet.userName} ({bet?.code})
                    </td>
                  )}
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>{bet.selectionName}</td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>{bet?.bet_on}</td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>{bet.isBack ? "Yes" : "No"}</td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>
                    {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                      ? bet.volume.toFixed(2)
                      : bet.odds}
                  </td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>
                    {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                      ? bet.odds
                      : bet.selectionName}
                  </td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>{Math.abs(Number(bet?.profitLoss?.$numberDecimal)).toFixed(2)}</td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>
                    {bet.bet_on === "MATCH_ODDS"
                      ? (() => {
                          const market = bet?.result?.[0];
                          if (market && market.result) {
                            const runner = market.runners?.find(
                              (r: any) =>
                                r.selectionId === Number(market.result)
                            );
                            return runner ? runner.runnerName : market.result;
                          } else {
                            return "YES";
                          }
                        })()
                      : bet?.result?.result
                      ? bet.result?.result
                      : "YES"}
                  </td>
                  <td  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}>{bet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default BetDetailsModal;
