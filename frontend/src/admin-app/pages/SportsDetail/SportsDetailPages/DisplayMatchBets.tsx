import React from "react";
import accountService from "../../../../services/account.service";
import { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { dateFormat } from "../../../../utils/helper";
import moment from "moment";
import { isMobile } from "react-device-detect";
import UserService from "../../../../services/user.service";

// const isMobile = true;
//

interface LedgerItem {
  parentName: string;
  updown?: number;
  profit?: number;
}

interface MatchItem {
  marketName: any;
  parentNameStr: any;
  volume: any;
  profitLoss: any;
  matchDateTime: any;
  isBack: any;
  selectionId: any;
  ledgers: LedgerItem[];
  name: string;
  client: any;
  amount: any;
  rate: any;
  action: any;
  userName: any;
  userIp: any;
  stack: any;
  odds: any;
  betClickTime: any;
  selectionName: any;
  matchedDate: any;
  resultstring: any;
}

type GroupedLedger = {
  username: string;
  cname: string;
  ss: number;

  matchPlusMinus: number;
  sessionPlusMinus: number;
  matchcommision: number;
  fancycommmision: number;
};

type FinalLedgerRow = {
  client: string;
  match: number;
  session: number;
  total: number;
  mCom: number;
  sCom: number;
  tCom: number;
  gTotal: number;
  upDownShare: number;
  balance: number;
  // finalLedger: any;
};

interface ReportModalProps {
  data: any; // or be more specific if you know the type, e.g., `string` or `User`
}

const DisplayMatchBets = () => {
  const [marketData, setmarketData] = React.useState<MatchItem[]>([]);
  const [marketonlymatch, setMarketonlymatch] = React.useState<MatchItem[]>([]);
  const [marketonlyf, setMarketonlyf] = React.useState<MatchItem[]>([]);

  const [marketData2, setmarketData2] = React.useState<MatchItem[]>([]);
  const [sendid, setSendid] = React.useState(null);
  const [stack, setStack] = React.useState<any[]>([]);

  const [filteredBets, setFilteredBets] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<string[]>([]);
  const [markets, setMarkets] = React.useState<string[]>([]);
  const [selectedUserM, setSelectedUserM] = React.useState("All Users");
  const [selectedMarket, setSelectedMarket] = React.useState("All Markets");
  const [totalPLByTeam, setTotalPLByTeam] = React.useState<
    Record<string, number>
  >({});

  const maid = useParams().id;

  React.useEffect(() => {
    accountService.matchdetail().then((res: AxiosResponse) => {
      // console.log(res, "marketffffff data");
      const allms = res.data.data.matches;

      const filtered = allms.filter((m: any) => m.matchId == maid);
      console.log(filtered, "filttreddd");

      const matchBets = filtered[0].bets.filter(
        (b: any) => b.bet_on === "MATCH_ODDS" && b.marketName === "Bookmaker"
      );
      console.log(matchBets, "book aker bets");
      setMarketonlymatch(matchBets);

      // Unique users and markets
      const uniqueUsers: any = Array.from(
        new Set(matchBets.map((b: { userName: any }) => b.userName))
      );
      const uniqueMarkets: any = Array.from(
        new Set(matchBets.map((b: { marketName: any }) => b.marketName))
      );
      setUsers(uniqueUsers);
      setMarkets(uniqueMarkets);

      setFilteredBets(matchBets);

      // Compute default total PL by team
      const plByTeam: Record<string, number> = {};
      matchBets.forEach(
        (b: { selectionName: string | number; profitLoss: number }) => {
          if (!plByTeam[b.selectionName]) plByTeam[b.selectionName] = 0;
          plByTeam[b.selectionName] += b.profitLoss;
        }
      );
      setTotalPLByTeam(plByTeam);

      const bmbetf = filtered[0].bets.filter(
        (b: any) => b.bet_on !== "MATCH_ODDS" && b.marketName !== "Bookmaker"
      );

      setMarketonlyf(bmbetf);

      const runners = matchBets[0]?.runners || [];
      console.log(runners, "mathced bets");

      const result = runners.map((runner: any) => {
        const { selectionId, runnerName } = runner;

        // Step 4: Filter bets for this selectionId
        const matchedBets = matchBets.filter(
          (bet: any) => bet.selectionId === selectionId
        );

        // Match bets for opposite team
        const oppositeBets = matchBets.filter(
          (bet: any) => bet.selectionId !== selectionId
        );

        // Step 5: Sum up the stack values
        // const totalStack = matchedBets.reduce(
        //   (sum: number, bet: any) => sum + (bet.stack || 0),
        //   0
        // );

        console.log(matchedBets, "matched bets for this selection");

        const totalStack = matchedBets?.reduce(
          (sum: number, bet: any) =>
            sum +
            (bet?.isBack
              ? -((bet?.stack || 0) * (1 - bet?.odds))
              : (bet?.stack || 0) * (1 - bet?.odds)),
          0
        );

        const oppositeProfitLoss = oppositeBets.reduce(
          (sum: number, bet: any) =>
            sum + (bet?.isBack ? -bet?.stack || 0 : bet?.stack || 0),
          0
        );

        console.log(totalStack, "sum of stack");

        // Step 6: Return structured object
        return {
          selectionId,
          runnerName,
          totalStack,
          profitLoss: oppositeProfitLoss,
        };
      });

      console.log(result, "resulllttttt");
      setStack(result);

      setmarketData(filtered[0].bets);

      setmarketData2(filtered);
    });
  }, [maid]);

  // Update filtered bets and total PL when dropdown changes
  React.useEffect(() => {
    let filtered = marketonlymatch;

    if (selectedUserM !== "All Users") {
      filtered = filtered.filter((b) => b.userName === selectedUserM);
    }

    if (selectedMarket !== "All Markets") {
      filtered = filtered.filter((b) => b.marketName === selectedMarket);
    }

    setFilteredBets(filtered);

    // Update total PL by selectionName (Team)
    const plByTeam: Record<string, number> = {};
    filtered.forEach((b) => {
      if (!plByTeam[b.selectionName]) plByTeam[b.selectionName] = 0;
      plByTeam[b.selectionName] += b.profitLoss;
    });
    setTotalPLByTeam(plByTeam);

    // Update markets dropdown for selected user
    if (selectedUserM !== "All Users") {
      const uniqueMarkets = Array.from(
        new Set(filtered.map((b) => b.marketName))
      );
      setMarkets(uniqueMarkets);
    } else {
      const uniqueMarkets = Array.from(
        new Set(marketonlymatch.map((b) => b.marketName))
      );
      setMarkets(uniqueMarkets);
    }
  }, [selectedUserM, selectedMarket, marketonlymatch]);

  // console.log(marketData, "fmsjnsdjfksgdfjgksd");

  const [ledgerData, setLedgerData] = React.useState([]);

  const userState = useAppSelector(selectUserData);
  console.log(userState, "isususus");

  const [shared, setShared] = React.useState<any>();

  React.useEffect(() => {
    // const userState = useAppSelector<{ user: User }>(selectUserData);
    const username: any = userState?.user?.username;

    console.log(username, "testagentmaster");
    UserService.getParentUserDetail(username).then(
      (res: AxiosResponse<any>) => {
        console.log(res, "check balance for parent");
        const thatb = res.data?.data[0];
        // setDetail(thatb)
        // setNewbalance(thatb.balance.balance);
        setShared(thatb?.share);
      }
    );
  }, [userState]);

  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);

  const [optionuser, setOptionuser] = React.useState<string>("all");

  const [searchTerm, setSearchTerm] = React.useState("");

  const [ledgerTotal, setLedgerTotal] = React.useState<any>({});

  const showModal = (username: string) => {
    setSelectedUser(username);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const filteredLedgerData = ledgerData.filter((row: any) => {
    const matchOptionUser = optionuser === "all" || row.client === optionuser;
    const matchSearch = row.client
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchOptionUser && matchSearch;
  });

  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: "12px" }} className="container-fluid p-md-4 mt-3">
        <div className=" md:mb-40 mb-2 ">
          <div className="card md:mt-0 ">

<div style={{ background: "#0f2327" }} className="text-white font-bold py-2 text-lg">BOOKMAKER</div>

            <div className="d-flex flex-wrap gap-3 my-3 overflow-auto">
              {Object.entries(totalPLByTeam).map(([team, pl]) => (
                <div
                  key={`team-${team}`}
                  className={`cardd text-white p-3 flex-shrink-0`}
                  style={{
                    minWidth: "200px",
                    backgroundColor: pl < 0 ? "#dc3545" : "#28a745", // red or green
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-chart-column fa-2x me-3"></i>
                    <div>
                      <h1 className="h4 fw-bold mb-2">{pl.toFixed(0)}</h1>
                      <p className="mb-0 fs-5">{team}</p>
                      <small>(0)</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{ background: "#0f2327" }}
              className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
            >
              <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
                Match Bets
              </span>
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="btn bg-primary text-white"
              >
                <span>Back</span>
              </button>
            </div>

            <div className="filters mb-3 d-flex gap-2 flex justify-between p-4 bg-light">
              <select
              style={{background:"#0f2327", color:"white"}}
                value={selectedUserM}
                onChange={(e) => setSelectedUserM(e.target.value)}
                className="rounded p-1"
              >
                <option>All Users</option>
                {users.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <select
               style={{background:"#0f2327", color:"white"}}
               className="rounded p-1"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
              >
                <option>All Markets</option>
                {markets.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div
              style={{ height: "100vh" }}
              className="card-body p-0 overflow-x-scroll overflow-y-scroll"
            >
              <table className="table table-striped table-bordered table-hover">
                <thead className="small">
                  <tr>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-2 pb-2">Client</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Amount</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Rate</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Type</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">PnL</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">OddsType</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Agent</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Team</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">Date</th>
                    <th style={{background:"#0f2327", color:"white"}} className="pt-0 pb-0">IP</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredBets?.map((bet, index) => (
                    <tr key={index}>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="p-1 pt-2 small pr-0">{bet?.userName}</td>
                      <td
                      style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }}
                        className={`pt-2 pb-1 ${
                          bet?.profitLoss < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {bet?.stack}
                      </td>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="pt-2 pb-1">{bet?.odds.toFixed(2)}</td>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="pt-2 pb-1">
                        {bet?.isBack ? (
                          <button
                            className="btn-yes btn btn-sm ng-scope gap-1 d-flex"
                            style={{ fontSize: "xx-small", color: "black" }}
                          >
                            <span
                              className="badge badge-light"
                              style={{ fontSize: "xx-small", color: "black" }}
                            >
                              Lagai
                            </span>
                          </button>
                        ) : (
                          <button
                            className="btn-not btn btn-sm p-1 gap-1 d-flex"
                            style={{ fontSize: "xx-small" }}
                          >
                            <span
                              className="badge badge-light"
                              style={{ fontSize: "xx-small", color: "black" }}
                            >
                              Khai
                            </span>
                          </button>
                        )}
                      </td>

                      {/* <td className="text-center pt-1 pb-1">
              {bet.action === 0 && (
                <button className="btn-yes btn btn-sm p-1" style={{ fontSize: 'xx-small' }}>
                  <span className="badge badge-action" style={{ fontSize: 'xx-small' }}>L</span>
                  <span className="badge badge-light" style={{ fontSize: 'xx-small' }}>{bet.team}</span>
                </button>
              )}
              {bet.action === 1 && (
                <button className="btn-not btn btn-sm p-1" style={{ fontSize: 'xx-small' }}>
                  <span className="badge badge-action" style={{ fontSize: 'xx-small' }}>K</span>
                  <span className="badge badge-light" style={{ fontSize: 'xx-small' }}>{bet.team}</span>
                </button>
              )}
            </td> */}

                      <td
                      style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }}
                        className={`pt-2 pb-1 ${
                          bet?.profitLoss < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {(bet?.profitLoss).toFixed()}
                      </td>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="pt-2 pb-1">{bet?.marketName}</td>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="pt-2 pb-1">{bet?.parentNameStr}</td>
                      <td style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" }} className="pt-2 pb-1">{bet?.selectionName}</td>

                      <td
                        className="pt-2 pb-1 text-nowrap"
                        style={{background : bet.isBack ? "#72BBEF" : "#faa9ba" ,fontSize: "xx-small" }}
                      >
                        {moment(bet?.betClickTime).format(dateFormat)}
                      </td>
                      <td
                      style={{background : bet.isBack ? "#72BBEF" : "#faa9ba",fontSize: "xx-small" }}
                        className="pt-2 pb-1"
                   
                      >
                        {bet?.userIp?.split(":").slice(0, 4).join(":")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayMatchBets;
