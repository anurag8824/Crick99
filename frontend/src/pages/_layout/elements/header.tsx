import React, { ChangeEvent, MouseEvent, useRef } from "react";
import User from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  logout,
  selectUserData,
} from "../../../redux/actions/login/loginSlice";
import NavMenu from "./nav-menu";
import {
  hideBalExp,
  HideBalExp,
  selectBalance,
  selectHideBalExp,
  setExposer,
  setSingleBal,
  setCom,
} from "../../../redux/actions/balance/balanceSlice";
import { CustomLink, useNavigateCustom } from "./custom-link";
// import { isMobile } from "react-device-detect";
import Marqueemessge from "../../../admin-app/pages/_layout/elements/welcome";
import NavMobileMenu from "./nav-mobile-menu";
import axios, { AxiosResponse } from "axios";
import { CONSTANTS } from "../../../utils/constants";
import userService from "../../../services/user.service";
import ReactModal from "react-modal";
import { useWebsocketUser } from "../../../context/webSocketUser";
import Rules from "../../Rules/rules";
import { selectRules } from "../../../redux/actions/common/commonSlice";
import AutocompleteComponent from "../../../components/AutocompleteComponent";
import matchService from "../../../services/match.service";
import IMatch from "../../../models/IMatch";
import casinoSlugs from "../../../utils/casino-slugs.json";

import UserService from "../../../services/user.service";
import betService from "../../../services/bet.service";
import VisibilityIcon from "@mui/icons-material/Visibility";

// const isMobile = true;
const Header = () => {
  const ref = useRef<any>(null);
  const userState = useAppSelector<{ user: User }>(selectUserData);
  // console.log(userState, "user");
  const balance = useAppSelector(selectBalance);
  const selectHideBal = useAppSelector<HideBalExp>(selectHideBalExp);
  const rules = useAppSelector(selectRules);
  const dispatch = useAppDispatch();

  const navigate = useNavigateCustom();

  const { socketUser } = useWebsocketUser();

  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [showAuto, setShowAuto] = React.useState<boolean>(false);

  const [userMessage, setUserMessage] = React.useState<string>("");

  const [hideExpBal, setHideExpBal] = React.useState<HideBalExp>(
    {} as HideBalExp
  );

  const [isOpen, setIsOpen] = React.useState<any>(false);
  const [isOpenRule, setIsOpenRule] = React.useState<any>(false);
  const [getExposerEvent, setGetExposerEvent] = React.useState<any>([]);

  // React.useEffect(() => {
  //   axios.get(`userMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
  //     setUserMessage(res.data.message)
  //   })
  // }, [])

  console.log("blance is heree", balance);

  React.useEffect(() => {
    setIsOpenRule(rules.open);
  }, [rules]);

  React.useEffect(() => {
    const handlerExposer = ({ exposer, balance, commision }: any) => {
      if (balance !== undefined) dispatch(setSingleBal(balance));
      if (exposer !== undefined) dispatch(setExposer(exposer));
      if (commision !== undefined) dispatch(setCom(commision));
    };
    socketUser.on("updateExposer", handlerExposer);

    return () => {
      socketUser.removeListener("updateExposer", handlerExposer);
    };
  }, [balance]);

  React.useEffect(() => {
    setHideExpBal(selectHideBal);
  }, [selectHideBal]);

  const logoutUser = (e: any) => {
    e.preventDefault();
    dispatch(logout());
    navigate.go("/login");
  };

  const onChangeBalExp = (e: ChangeEvent<HTMLInputElement>) => {
    const expBal = { ...hideExpBal, [e.target.name]: e.target.checked };
    dispatch(hideBalExp(expBal));
    localStorage.setItem(CONSTANTS.HIDE_BAL_EXP, JSON.stringify(expBal));
    setHideExpBal(expBal);
  };

  const getExposer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
    userService.getExposerEvent().then((res: AxiosResponse) => {
      setGetExposerEvent(res.data.data);
    });
  };

  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (showMenu && ref.current && !ref.current.contains(event.target)) {
        closeMenu();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
  };
  const suggestion = ({ value }: any) => {
    return matchService.getMatchListSuggestion({ name: value });
  };

  const onMatchClick = (match: IMatch | null) => {
    if (match) {
      window.location.href = `/odds/${match.matchId}`;
    }
  };

  const [userAlldata, setUserAlldata] = React.useState<{ [key: string]: any }>(
    {}
  );

  React.useEffect(() => {
    if (userState?.user?.username) {
      UserService.getUserDetail(userState?.user?.username).then(
        (res: AxiosResponse<any>) => {
          console.log(res, "ressss for all values");
          const detail = res?.data.data;
          setUserAlldata(detail);
        }
      );
    }
  }, [userState?.user?.username]);

  const [notice, setNotice] = React.useState<any>();
  React.useEffect(() => {
    betService.getnotice().then((res: AxiosResponse<any>) => {
      setNotice(res.data.data);
    });
  }, []);

  return (
    <header className="header">
      <div className="container-fluidu">
        <div className="ro">
          <div className="container-fluid text-white py-2">
            <div className="d-flex align-items-center justify-content-between">
              {/* Left - Logo */}
              <div className="d-flex  justify-content-between align-items-center ">
                <button
                  // onClick={toggleMenu}
                  className="btn btn-primay"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasWithBothOptions"
                  aria-controls="offcanvasWithBothOptions"
                  style={{
                    fontSize: "24px",
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ☰
                </button>
                <CustomLink to="/" className="d-flex align-items-center">
                  <img
                    src="/imgs/logo.png"
                    alt="Logo"
                    className="img-fluid"
                    style={{ maxHeight: "40px", marginTop: "7px" }}
                  />
                </CustomLink>
              </div>

              <div
                className="offcanvas offcanvas-start"
                data-bs-scroll="true"
                tabIndex={-1}
                id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptionsLabel"
                style={{ width: "30vh" }}
              >
                <div className="offcanvas-header bg-theme">
                  <h5
                    className="offcanvas-title"
                    id="offcanvasWithBothOptionsLabel"
                  >
                    <img
                      src="/imgs/logo.png"
                      alt="Logo"
                      className="img-fluid"
                      style={{ maxHeight: "40px", marginTop: "7px" }}
                    />
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body bg-theme text-white">
                  <ul className="list-unstyled  ">
                    {/* In Play */}
                    <li className="mb-4">
                      <a
                        href="/match/4"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-home me-2"></i>
                        In Play
                      </a>
                    </li>

                    {/* Profile */}
                    <li className="mb-4">
                      <a
                        href="/profile"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-user me-2"></i> Profile
                      </a>
                    </li>

                    {/* Statement */}
                    <li className="mb-4">
                      <a
                        href="/accountstatement"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-home me-2"></i> Statement
                      </a>
                    </li>

                    {/* Password */}
                    <li className="mb-4">
                      <a
                        href="/changepassword"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fa fa-key me-2" aria-hidden="true"></i>Password
                      </a>
                    </li>

                    {/* Rules */}
                    <li className="mb-4">
                      <a
                        href="/rules"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas  fa-circle-info me-2"></i> Rules
                      </a>
                    </li>

                    {/* My Ledger */}
                    <li className="mb-4">
                      <a
                        href="/new-accountstatement"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-money-bill me-2"></i> My Ledger
                      </a>
                    </li>

                    {/* Casino */}
                    <li className="mb-4">
                      <a
                        href="/casino-in/live-dmd"
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-play me-2"></i> Casino
                      </a>
                    </li>



                    {/* Logout */}
                    <li className="mb-4">
                      <a
                             onClick={logoutUser}
                        className="d-flex align-items-center nav-link text-white"
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Right Section */}
              <div className="d-flex align-items-center gap-1">
                {/* Coins + Expo */}
                <div
                  style={{ backgroundColor: "#ffffff1a", fontSize: "12px" }}
                  className="d-flex justify-content-between align-items-center rounded-pill px-2 py-1"
                >
                  {/* Coins */}
                  <span className="d-flex align-items-center me-3">
                    <span className="text-success me-1">Coins:</span>
                    <b>
                      {(
                        (balance.balance || 0) - (balance.exposer || 0)
                      ).toFixed(0)}
                    </b>
                  </span>

                  {/* Expo */}
                  {!selectHideBal.exposer && (
                    <span
                      className="d-flex align-items-center "
                      role="button"
                      onClick={getExposer}
                    >
                      <span className="me-1 text-danger">Expo:</span>
                      <b className="d-flex  align-items-center">
                        {balance.exposer > 0 ? balance.exposer?.toFixed(0) : 0}
                        <span className="ms-1">
  <i className="fa fa-eye eye-icon" aria-hidden="true"></i>
</span>
                      </b>
                    </span>
                  )}
                </div>

                {/* Profile */}

                <div className="dropdown">
                  {/* Trigger Button */}
                  <button
                    className="d-flex gap-1 align-items-center rounded-pill px-2 py-2 small border-0 text-white"
                    style={{ backgroundColor: "#ffffff1a" }}
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 496 512"
                      className="d-none d-md-block" 
                      height="22"
                      width="22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
                    </svg>
                    <span>{userState?.user?.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className="dropdown-menu dropdown-menu-end mt-2 shadow rounded-3"
                    aria-labelledby="profileDropdown"
                    style={{ minWidth: "200px" }}
                  >
                    {/* Profile Item */}
                    <div className="dropdown-item d-flex align-items-center gap-3 border-bottom small text-muted">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 496 512"
                        height="16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
                      </svg>
                      <span>{userState?.user?.username}</span>
                    </div>

                    {/* Logout Item */}
                    <button
                      onClick={logoutUser}
                      className="dropdown-item d-flex align-items-center small gap-3 text-danger"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 512 512"
                        height="16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                <div className="dropdown-menu">
                  <div className="dropdown-item user-profile">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 496 512"
                      height="16"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
                    </svg>
                    <span>{userState?.user?.username}</span>
                  </div>
                  <button className="dropdown-item logout-btn">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="16"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <Marqueemessge message={notice?.fnotice || "."} /> */}

          {/* {!isMobile ? <NavMenu /> : <NavMobileMenu />} */}
          {/* {!isMobile ? <NavMenu /> : <NavMenu /> } */}
          {/* {!isMobile ? <NavMenu /> : "fdfdf"} */}
        </div>
      </div>
      <div />
      <div className="modal-market" />

      <ReactModal
        isOpen={isOpen}
        onRequestClose={(e: any) => {
          setIsOpen(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"modal-dialog"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            My Market
            <button
              onClick={() => setIsOpen(false)}
              className="close float-right"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            <table className="reponsive table col-12">
              <tr>
                <th>Event Name</th>
                <th>Total Bets</th>
              </tr>

              {getExposerEvent.map((exposer: any) => {
                let casinoSlug = "";
                if (exposer.sportId == 5000) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  casinoSlug = casinoSlugs?.[exposer?.matchId];
                }
                return (
                  <tr key={exposer.matchName}>
                    <td>
                      <CustomLink
                        onClick={() => {
                          window.location.href =
                            exposer.sportId &&
                            Number.isInteger(+exposer.sportId) &&
                            exposer.sportId != 5000
                              ? `/odds/${exposer._id}`
                              : `/casino/${casinoSlug}/${exposer._id}`;
                          setIsOpen(false);
                        }}
                        to={
                          exposer.sportId &&
                          Number.isInteger(+exposer.sportId) &&
                          exposer.sportId != 5000
                            ? `/odds/${exposer._id}`
                            : `/casino/${casinoSlug}/${exposer._id}`
                        }
                      >
                        {exposer.matchName}
                      </CustomLink>
                    </td>
                    <td>{exposer.myCount}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isOpenRule}
        onRequestClose={(e: any) => {
          setIsOpenRule(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"modal-dialog w-90P"}
        ariaHideApp={false}
      >
        <div
          className="modal-content"
          style={{ height: "90vh", marginTop: "1%" }}
        >
          <div className="modal-header">
            Rules
            <button
              onClick={() => setIsOpenRule(false)}
              className="close float-right"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            <Rules classData={"col-md-12"} />
          </div>
        </div>
      </ReactModal>
    </header>
  );
};
export default Header;
