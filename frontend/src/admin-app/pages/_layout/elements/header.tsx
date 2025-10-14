// import React from 'react'

// import { Tree } from 'antd'
// import axios, { AxiosResponse } from 'axios'
// import Drawer from 'react-modern-drawer'
// import 'react-modern-drawer/dist/index.css'
// import ISport from '../../../../models/ISport'
// import User, { RoleType } from '../../../../models/User'
// import { CustomLink, useNavigateCustom } from '../../../../pages/_layout/elements/custom-link'
// import { logout, selectUserData, userUpdate } from '../../../../redux/actions/login/loginSlice'
// import { selectSportList } from '../../../../redux/actions/sports/sportSlice'
// import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
// import casinoService from '../../../../services/casino.service'
// import sportsService from '../../../../services/sports.service'
// import userService from '../../../../services/user.service'
// import CustomAutoComplete from '../../../components/CustomAutoComplete'
// import Marqueemessge from './welcome'
// import { DataNode } from 'antd/es/tree'

// const Header = () => {
//   const userState = useAppSelector<{ user: User }>(selectUserData)
//   const dispatch = useAppDispatch()

//   const navigate = useNavigateCustom()

//   const [showMenu, setShowMenu] = React.useState<boolean>(false)
//   const [treeData, setTreeData] = React.useState<any>([])
//   const [expanded, setExpanded] = React.useState<string[]>([])

//   const sportsList = useAppSelector(selectSportList)

//   const [userMessage, setUserMessage] = React.useState<string>('')

//   const [isOpen, setIsOpen] = React.useState(false)
//   const [gameList, setGameList] = React.useState([])

//   React.useEffect(() => {
//     axios.get(`adminMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
//       setUserMessage(res.data.message)
//     })
//   }, [])

//   React.useEffect(() => {
//     if (gameList.length <= 0)
//       casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
//         setGameList(res.data.data)
//       })
//   }, [])

//   const toggleDrawer = () => {
//     setIsOpen((prevState) => !prevState)
//     setTreeData(
//       sportsList.sports.map((sport: ISport) => ({ title: sport.name, key: sport.sportId })),
//     )
//   }

//   const logoutUser = (e: any) => {
//     e.preventDefault()
//     dispatch(userUpdate({} as User))
//     setTimeout(() => {
//       dispatch(logout())
//       navigate.go('/login')
//     }, 1)
//   }

//   const onSuggestionsFetchRequested = ({ value }: any) => {
//     return userService.getUserListSuggestion({ username: value })
//   }

//   const onSelectUser = (user: any) => {
//     navigate.go(`/list-clients/${user.username}?search=true`)
//   }

//   const selectExpend = (item: any) => {
//     if (item.matchId) {
//       setIsOpen(false)
//       window.location.href = `/admin/odds/${item.matchId}`
//     }
//   }

//   const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
//     list.map((node) => {
//       if (node.key === key) {
//         return {
//           ...node,
//           children,
//         }
//       }
//       if (node.children) {
//         return {
//           ...node,
//           children: updateTreeData(node.children, key, children),
//         }
//       }
//       return node
//     })

//   const onLoadData = (data: any) => {
//     if (data.matchId) {
//       selectExpend(data)
//       return Promise.resolve()
//     }
//     return sportsService.getSeriesWithMatch(data.key).then((series: any) => {
//       const items = series.data.data.map((series: any) => {
//         const { id, name } = series.competition
//         const matchNodes = series.matches.map((match: any) => {
//           return {
//             key: match.event.id,
//             title: match.event.name,
//             matchId: match.event.id,
//           }
//         })
//         return {
//           key: id,
//           title: name,
//           children: matchNodes,
//         }
//       })
//       setTreeData((origin: any) => {
//         return updateTreeData(origin, data.key, items)
//       })

//       return items
//     })
//   }

//   return (
//     <>
//       <header>
//         <div className='header-bottom'>
//           <div className='container-fluid'>
//             <CustomLink to={'/'} className='logo'>
//               <img src='/imgs/logo.png' />
//             </CustomLink>
//             <div className='side-menu-button' onClick={toggleDrawer}>
//               <div className='bar1' />
//               <div className='bar2' />
//               <div className='bar3' />
//             </div>
//             <nav className='navbar navbar-expand-md btco-hover-menu'>
//               <div className='collapse navbar-collapse'>
//                 <ul className='list-unstyled navbar-nav'>
//                   <li className='nav-item'>
//                     <CustomLink to={'/list-clients'}>
//                       <b>List of clients</b>
//                     </CustomLink>
//                   </li>

//                   <li className='nav-item'>
//                     <CustomLink to={'/market-analysis'}>
//                       <b>Market Analysis</b>
//                     </CustomLink>
//                   </li>
//                   <li className='nav-item dropdown'>
//                     <a>
//                       <b>Reports</b> <i className='fa fa-caret-down' />
//                     </a>
//                     <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
//                       <li>
//                         <CustomLink to='/accountstatement' className='dropdown-item'>
//                           <b>{"Account's Statement"}</b>
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink to='/unsettledbet' className='dropdown-item'>
//                           <b>Current Bets</b>
//                         </CustomLink>
//                       </li>
//                       {userState?.user?.role === RoleType.admin && (
//                         <li>
//                           <CustomLink to='/unsettledbet/deleted' className='dropdown-item'>
//                             <b>Deleted Bets</b>
//                           </CustomLink>
//                         </li>
//                       )}
//                       {/* <li>
//                         <a href='greport.html' className='dropdown-item'>
//                           <b>General Report</b>
//                         </a>
//                       </li> */}
//                       <li>
//                         <CustomLink to='/game-reports' className='dropdown-item'>
//                           <b>Game Reports</b>
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink to='/profitloss' className='dropdown-item'>
//                           <b>Profit And Loss</b>
//                         </CustomLink>
//                       </li>
//                     </ul>
//                   </li>
// {/*
//                   <li className='nav-item dropdown'>
//                     <a>
//                       <b>Transactions</b> <i className='fa fa-caret-down' />
//                     </a>
//                     <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
//                       <li>
//                         <CustomLink to='/depositstatement' className='dropdown-item'>
//                           <b>{"Deposit"}</b>
//                         </CustomLink>
//                       </li>
//                       <li>
//                         <CustomLink to='/withdrawstatement' className='dropdown-item'>
//                           <b>Withdraw</b>
//                         </CustomLink>
//                       </li>
//                     </ul>
//                   </li> */}
//                   <li className='nav-item dropdown'>
//                     <a>
//                       <b>Live Casino</b> <i className='fa fa-caret-down' />
//                     </a>
//                     <ul
//                       className='dropdown-menu'
//                       aria-labelledby='navbarDropdownMenuLink'
//                       style={{ height: '400px', overflowY: 'scroll' }}
//                     >
//                       {gameList?.length > 0 &&
//                         gameList.map((Item: any, key: number) => {
//                           return (
//                             <li key={key}>
//                               <CustomLink to={`/casino/${Item.slug}`} className='dropdown-item'>
//                                 <b>{Item.title}</b>
//                               </CustomLink>
//                             </li>
//                           )
//                         })}
//                     </ul>
//                   </li>

//                     <li className='nav-item dropdown'>
//                       <a>
//                         <b>Settings</b> <i className='fa fa-caret-down' />
//                       </a>
//                       <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
//                       {(userState?.user?.role === RoleType.admin) && (<>
//                         <li>
//                           <CustomLink to='/sports-list/active-matches' className='dropdown-item'>
//                             <b>{'Block Markets'}</b>
//                           </CustomLink>
//                         </li>
//                         <li>
//                           <CustomLink to='/messages' className='dropdown-item'>
//                             <b>{'Messages'}</b>
//                           </CustomLink>
//                         </li>
//                         <li>
//                           <CustomLink to={'/sports-list/matches'} className='dropdown-item'>
//                             <b>Add Match List</b>
//                           </CustomLink>
//                         </li>

//                         <li>
//                           <CustomLink to='/casino-list' className='dropdown-item'>
//                             <b>{'Casino List'}</b>
//                           </CustomLink>
//                         </li>
//                       </>
//                       )}

//                       <li>
//                         <CustomLink to='/payment-method' className='dropdown-item'>
//                           <b>{'Payment Method'}</b>
//                         </CustomLink>
//                       </li>

//                       <li>
//                         <CustomLink to='/client-ledger' className='dropdown-item'>
//                           <b>{'Client Ledger'}</b>
//                         </CustomLink>
//                       </li>
//                       </ul>
//                     </li>

//                 </ul>
//               </div>
//             </nav>
//             <ul className='user-search list-unstyled'>
//               <li className='username'>
//                 <span onClick={() => setShowMenu(!showMenu)}>
//                   {userState?.user?.username} <i className='fa fa-caret-down' />
//                 </span>
//                 <ul style={{ display: showMenu ? 'block' : 'none' }}>
//                   <li>
//                     <CustomLink to='/change-password'>
//                       <b>Change Password</b>
//                     </CustomLink>
//                   </li>
//                   <li>
//                     <a onClick={logoutUser} href='#'>
//                       <b>Logout</b>
//                     </a>
//                   </li>
//                 </ul>
//               </li>
//               <li className='search'>
//                 <CustomAutoComplete
//                   onSuggestionsFetchRequested={onSuggestionsFetchRequested}
//                   onSelectUser={onSelectUser}
//                   placeHolder={'All Client'}
//                 />
//                 {/* <input id='tags' type='text' name='list' placeholder='All Client' />
//                 <a id='clientList' data-value='' href='#'>
//                   <i className='fas fa-search-plus' />
//                 </a> */}
//               </li>
//             </ul>
//             <Marqueemessge message={userMessage}></Marqueemessge>
//           </div>
//         </div>
//       </header>
//       <Drawer open={isOpen} onClose={toggleDrawer} direction='left'>
//         <div className='drawer-header'>
//           <img src='/imgs/logo.png' className='wd-100' />
//         </div>
//         <div className='drawer-content'>
//           <Tree
//             loadData={onLoadData}
//             treeData={treeData}
//             onSelect={(selectedKeys, e) => {
//               selectExpend(e.node)
//             }}
//           />
//         </div>
//       </Drawer>
//     </>
//   )
// }
// export default Header

import React from "react";

import { Tree } from "antd";
import axios, { AxiosResponse } from "axios";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import ISport from "../../../../models/ISport";
import User, { RoleName, RoleType } from "../../../../models/User";
import {
  CustomLink,
  useNavigateCustom,
} from "../../../../pages/_layout/elements/custom-link";
import {
  logout,
  selectUserData,
  userUpdate,
} from "../../../../redux/actions/login/loginSlice";
import { selectSportList } from "../../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import casinoService from "../../../../services/casino.service";
import sportsService from "../../../../services/sports.service";
import userService from "../../../../services/user.service";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import Marqueemessge from "./welcome";
import { DataNode } from "antd/es/tree";
import "./header.css";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CasinoIcon from "@mui/icons-material/Casino";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import TvIcon from "@mui/icons-material/Tv";
import { useDrawer } from "../../../../context/DrawerContext";
import betService from "../../../../services/bet.service";

import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import { useParams } from "react-router-dom";
import { Menu } from "@mui/material";


const Header = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const dispatch = useAppDispatch();

  const navigate = useNavigateCustom();

  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [treeData, setTreeData] = React.useState<any>([]);

  const [expanded, setExpanded] = React.useState<string[]>([]);

  const sportsList = useAppSelector(selectSportList);

  const [userMessage, setUserMessage] = React.useState<string>("");

  // const [isOpen, setIsOpen] = React.useState(false);
  // const [isOpen2, setIsOpen2] = React.useState(false);

  const [gameList, setGameList] = React.useState([]);

  // React.useEffect(() => {
  //   axios
  //     .get(`adminMessage.json?v=${Date.now()}`)
  //     .then((res: AxiosResponse) => {
  //       setUserMessage(res.data.message);
  //     });
  // }, []);

  React.useEffect(() => {
    if (gameList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        setGameList(res.data.data);
      });
  }, []);

  const [notice, setNotice] = React.useState<any>();
  React.useEffect(() => {
   betService.getnotice().then((res: AxiosResponse<any>) => {
        setNotice(res.data.data);
      });
  }, []);

  // const toggleDrawer = () => {
  //   setIsOpen((prevState) => !prevState)
  //   // setTreeData(
  //   //   sportsList.sports.map((sport: ISport) => ({ title: sport.name, key: sport.sportId })),
  //   // )
  // }

  // const toggleDrawer = () => {
  //   setIsOpen(!isOpen);
  //   setIsOpen2(!isOpen2);

  //   console.log("CLose");
  // };


  const {  isOpen, isOpen2, toggleDrawer,activeMenu, setActiveMenu } = useDrawer();
  console.log(isOpen, isOpen2,"toggle drawrree")

  const logoutUser = (e: any) => {
    e.preventDefault();
    dispatch(userUpdate({} as User));
    setTimeout(() => {
      dispatch(logout());
      navigate.go("/login");
    }, 1);
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value });
  };

  const onSelectUser = (user: any) => {
    navigate.go(`/list-clients/${user.username}?search=true`);
  };

  const selectExpend = (item: any) => {
    if (item.matchId) {
      // setIsOpen(false);
      window.location.href = `/admin/odds/${item.matchId}`;
    }
  };

  const updateTreeData = (
    list: DataNode[],
    key: React.Key,
    children: DataNode[]
  ): DataNode[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const onLoadData = (data: any) => {
    if (data.matchId) {
      selectExpend(data);
      return Promise.resolve();
    }
    return sportsService.getSeriesWithMatch(data.key).then((series: any) => {
      const items = series.data.data.map((series: any) => {
        const { id, name } = series.competition;
        const matchNodes = series.matches.map((match: any) => {
          return {
            key: match.event.id,
            title: match.event.name,
            matchId: match.event.id,
          };
        });
        return {
          key: id,
          title: name,
          children: matchNodes,
        };
      });
      setTreeData((origin: any) => {
        return updateTreeData(origin, data.key, items);
      });

      return items;
    });
  };

 

  const getRoleOptions = (): { key: RoleType; label: string }[] => {
    const userRole = userState?.user?.role as RoleType;

    const allRoles = {
      admin: "Super Admin",
      sadmin: "Admin",
      suadmin: "Sub Admin",
      smdl: "Master",
      mdl: "Super",
      dl: "Agent",
      user: "Client",
    };

    const roleMap: Record<RoleType, RoleType[]> = {
      [RoleType.admin]: [
        RoleType.sadmin,
        RoleType.suadmin,
        RoleType.smdl,
        RoleType.mdl,
        RoleType.dl,
        RoleType.user,
      ],
      [RoleType.sadmin]: [RoleType.suadmin ,RoleType.smdl, RoleType.mdl,  RoleType.dl, RoleType.user,],
      [RoleType.suadmin]: [RoleType.smdl, RoleType.mdl, RoleType.dl, RoleType.user,],

      [RoleType.smdl]: [RoleType.mdl, RoleType.dl, RoleType.user],
      [RoleType.mdl]: [RoleType.dl, RoleType.user],
      [RoleType.dl]: [RoleType.user],
      [RoleType.user]: [],
    };

    const allowedRoles = roleMap[userRole] || [];

    return allowedRoles.map((key) => ({
      key,
      label: allRoles[key],
    }));
  };


  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOpen2, setDropdownOpen2] = React.useState(false);
  const [dropdownOpen3, setDropdownOpen3] = React.useState(false);
  const [dropdownOpen4, setDropdownOpen4] = React.useState(false);
  const [dropdownOpen5, setDropdownOpen5] = React.useState(false);
  const [dropdownOpen6, setDropdownOpen6] = React.useState(false);
  const [dropdownOpen7, setDropdownOpen7] = React.useState(false);



console.log(activeMenu,"active menu")



  const [searchObj, setSearchObj] = React.useState({
    username: "",
    type: "",
    search: "",
    status: "",
    page: 1,
  });

const [userList, setUserList] = React.useState<any>({});

  const getList = (obj: {
    username: string;
    type: string;
    search: string;
    status?: string;
    page?: number;
  }) => {
    const fullObj = {
      username: userState?.user?.username,
      type: obj.type,
      search: obj.search,
      status: obj.status ?? "", // fallback to empty string
      page: obj.page ?? 1, // fallback to 1
    };

    userService.getUserList(fullObj).then((res: AxiosResponse<any>) => {
      setSearchObj(fullObj); // ✅ Now matches the expected state shape
      console.log(res.data.data, "number of lincntedf list number");
      setUserList(res.data.data);
    });
  };

  React.useEffect(() => {
    getList(searchObj); // Trigger on mount or when searchObj changes
  }, [userState]);

  // console.log(
  //   userList?.items?.filter((i: any) => i.role === "user").length,
  //   "← total users with role 'user'"
  // );
  
  return (
    <>
      <header className="">



        <div className="flex newmargin  justify-between md:justify-end p-2  bg-gray-header">
          {/* <div
            className="side-menu-buttonn md:hidden ml-2 "
            onClick={toggleDrawer}
           
          >
          <i className="fa-solid fa-bars text-white"></i>
          </div> */}

          <button
                  // onClick={toggleMenu}
                  className="btn btn-primay side-menu-buttonn md:hidden"
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

          <div
            style={{ marginLeft: "-5rem" }}
            className={`side-menu-buttonn  ${
              !isOpen2 ? "hidden" : "block"
            } font-bold text-white md:hidden`}
            onClick={toggleDrawer}
          >
          <i className="fa-solid fa-bars text-white"></i>
          </div>




          <div className="">
            <ul className="user-searchh flex gap-2  list-unstyled ">
              <li className="username  text-white my-2">
                <span
                  className="bg-gray-500 relative  rounded-sm px-2 py-2"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {userState?.user?.username} <i className="fa fa-caret-down" />
                </span>
                <ul
                  className="mt-2 absolute right-10 z-10  rounded border border-black bg-white px-2 grid py-2 space-y-4 text-black"
                  style={{ display: showMenu ? "block" : "none" }}
                >
                  <li className="   pb-2">
                    <CustomLink className="flex " to="/change-password">
                      <PersonIcon />{" "}
                      <b className="font-normal text-nowrap text-md">
                        Change Password
                      </b>
                    </CustomLink>
                  </li>
                  <li>
                    <a onClick={logoutUser} href="#">
                      <LogoutIcon />
                      <b className="font-normal text-md pl-2">Logout</b>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="search">
                {/* <CustomAutoComplete
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSelectUser={onSelectUser}
                  placeHolder={"All Client"}
                /> */}

                {/* <input id='tags' type='text' name='list' placeholder='All Client' />
                <a id='clientList' data-value='' href='#'>
                  <i className='fas fa-search-plus' />
                </a> */}
              </li>
            </ul>
          </div>
        </div>


        {/* this is the header for the sidebar for the mobile version */}



        <div
                className="offcanvas offcanvas-start"
                data-bs-scroll="true"
                tabIndex={-1}
                id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptionsLabel"
                style={{ width: "35vh" }}
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
                      style={{ maxHeight: "35px", marginTop: "7px" }}
                    />
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                 />
                </div>
                <div className="offcanvas-body bg-theme text-white">
                <ul style={{marginTop:"0"}} className="list-unstyled navbar-nav pl-4 navbar-new grid space-y-4">
                  

                  <li className={`nav-item pl-4   md:w-60 w-fit ${activeMenu === "Dashboard" ? "text-active" : "text-white"}`}>
                    <CustomLink
                      onClick={() => { toggleDrawer(); setActiveMenu("Dashboard");}}
                      className=" gap-2 py-2 flex-row flex  items-center"
                      to={"/market-analysis"}
                    >
                    
                      <img className="h-6 w-auto mr-3 "  src="imgs/layout.png"  />
                      <b className={`text-lg font-medium  ${activeMenu === "Dashboard" ? "text-active" : "text-white"} `}>
                        Dashboard
                      </b>
                    </CustomLink>
                  </li>

                 

                  <li className={` ${activeMenu === "User" ? "bg-active" : ""} nav-item dropdown  group relative`}>
                    <CustomLink
                      to={"/list-clients"}
                      className=" py-2 flex-row flex gap-2 items-center cursor-pointer"
                      onClick={() => {setDropdownOpen(!dropdownOpen); setActiveMenu("User");}}
                     
                    >
                      <i className={`fa fa-angle-down mr-1  ${activeMenu === "User" ? "text-active" : "text-white"}`} />

                      <img className="h-6 w-auto mr-3 "  src="imgs/user.png"  />
                      <b className={`text-lg  font-medium  ${activeMenu === "User" ? "text-active" : "text-white"} `}>
                        {/* {userState?.user?.role  === 'mdl' ? 'Agent Master' : "" } */}
                        {userState?.user?.role === "admin"
                          ? "Super Admin"
                          : userState?.user?.role === "sadmin"
                          ? "Admin"
                          : userState?.user?.role === "suadmin"
                          ? "Sub Admin"
                          : userState?.user?.role === "smdl"
                          ? "Master"
                          : userState?.user?.role === "mdl"
                          ? "Super"
                          : userState?.user?.role === "dl"
                          ? "Agent"
                          : userState?.user?.role === "user"
                          ? "Client"
                          : ""}
                      </b>
                     

                    </CustomLink>

                    { dropdownOpen ? <div  className="dropdown-menuj bg-neutral-700 pl-md-5 mt-2 grid space-y-4   absolutek z-50 hiddenj group-hover:block w-full">
                      {getRoleOptions().map((role) => (
                        <li key={role.key}>
                          <CustomLink
                            to={`/list-clients/${userState?.user?.username}/${role.key}`}
                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                            //  onClick={toggleDrawer}
                            onClick={() => { toggleDrawer(); setDropdownOpen(!dropdownOpen) ; setActiveMenu("User");}}
                            className="dropdown-item hover:bg-gray-400"
                          >
                            <b className=" mobile-style ml-20 text-lg text-white  md:flex md:flex-row flex flex-col text-left gap-1">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              {role.label}
                              {/* ({userList?.items?.filter((i: any) => i.role === `${role.key}`)?.length}) */}
                            </b>
                          </CustomLink>
                        </li>
                      ))}
                    </div> : ""}

                   
                  </li>


                 


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Sports" ? "bg-active" : ""}`}>
                    <a  onClick={() => {setDropdownOpen2(!dropdownOpen2); setActiveMenu("Sports");}} className={`flex py-2 flex-row  gap-2 items-center `}>
                    <i className="fa fa-angle-down mr-1 text-white " />
                     
                    <img style={{transform: "rotate(45deg)"}} className="h-6 w-auto mr-3 "  src="imgs/price-tag.png"  />
                    <b className={`text-lg font-medium ${activeMenu === "Sports" ? "text-active" : "text-white"} `}>
                       Sports Detail
                      </b>{" "}
                    </a>
                   { dropdownOpen2 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 ml-20 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("AG");}}
                          to="/sports-details"
                          className={`dropdown-item ${activeMenu === "AG" ? "bg-active" : ""}`}
                        >
                          <b className="text-lg font-medium text-white">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Active Games
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                          to="/completed-sports-details"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("All");}}
                          className={`dropdown-item ${activeMenu === "FG" ? "bg-active" : ""}`}
                        >
                          <b className="font-medium text-lg  text-white">
                            {/* <ListIcon className="text-yellow-600" /> */}
                           Finished Games
                          </b>
                        </CustomLink>
                      </li>

                     
                     


                    
                      
                      
                    </div> :""}
                  </li>




                  {/* <li className={`nav-item md:pl-5  md:w-60 w-fit ${activeMenu === "Cass" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("Cass");}}

                      className="md:flex gap-2 py-2  md:flex-row flex flex-col items-center"
                        to="/casino-details"
                    >
                       <img className="h-6 w-auto"  src="imgs/compass.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Cass" ? "text-active" : ""} `}>
                       Casino Betting
                      </b>
                    </CustomLink>
                  </li> */}


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Cass" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen5(!dropdownOpen5); setActiveMenu("Cass");}} className={`py-2  flex-row flex  items-center `}>
                    <i className="fa fa-angle-down mr-3 text-white " />
                     
                    <img className="h-6 w-auto mr-3"  src="imgs/compass.png"  />
                    <b className={`text-lg  font-medium  ${activeMenu === "Cass" ? "text-active" : "text-white"} `}>
                    Casino Betting
                      </b>{" "}
                    </a>
                   { dropdownOpen5 ?  <div
                      className="dropdown-menuf bg-neutral-700 ml-20 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("ICN");}}
                          to="/in-play-casino"
                          className={`dropdown-item ${activeMenu === "ICN" ? "bg-active" : ""}`}
                        >
                          <b className="text-lg">
                            {/* <ListIcon className="text-yellow-600" /> */}
                           Inplay Casino
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                           to="/casino-pl"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("CCC");}}
                          className={`dropdown-item ${activeMenu === "CCC" ? "bg-active" : ""}`}
                        >
                          <b className=" text-lg ">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Completed Casino
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                           to="/casino-details"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("CD");}}
                          className={`dropdown-item ${activeMenu === "CD" ? "bg-active" : ""}`}
                        >
                          <b className="text-lg gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Casino Details 
                          </b>
                        </CustomLink>
                      </li>

                    

                     
                     


                    
                      
                      
                    </div> :""}
                  </li>

                  

            

                  


                 

                  

                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Ledger" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen3(!dropdownOpen3); setActiveMenu("Ledger");}} className={` py-2 flex-row flex gap-2 items-center `}>
                    <i className="fa fa-angle-down mr-1 text-white " />
                     
                    <img className="h-6 w-auto mr-3"  src="imgs/copy.png"  />
                    <b className={`text-lg text-xs font-medium  ${activeMenu === "Ledger" ? "text-active" : "text-white"} `}>
                        Ledger
                      </b>{" "}
                    </a>
                   { dropdownOpen3 ?  <div
                      className="dropdown-menuf bg-neutral-700 ml-20 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >

                       <li>
                        <CustomLink
                          to="/total-profit"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("Total");}}
                          className={`dropdown-item ${activeMenu === "Total" ? "bg-active" : ""}`}

                        >
                          <b className=" text-lg ">
                            {/* <ListIcon className="text-yellow-600" /> */}
                             Profit Loss
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("My");}}
                          to="/my-ledger"
                          className={`dropdown-item ${activeMenu === "My" ? "bg-active" : ""}`}
                        >
                          <b className="  text-lg">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {"My Ledger"}
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                          to="/all-settlement"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("All");}}
                          className={`dropdown-item ${activeMenu === "All" ? "bg-active" : ""}`}
                        >
                          <b className=" text-lg">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {" "}
                            {userState?.user?.role === RoleType.dl
                              ? "Client"
                              : "Agent"}{" "}
                            Ledger
                          </b>
                        </CustomLink>
                      </li>

                      

                      <li className="hidden">
                        <CustomLink
                          to="/ledger-client"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("ALedger");}}
                          className={`dropdown-item ${activeMenu === "ALedger" ? "bg-active" : ""}`}
                        >
                          <b className=" text-lg">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {userState?.user?.role === RoleType.dl
                              ? "Client"
                              : "Agent"}{" "}
                            Ledger
                          </b>
                        </CustomLink>
                      </li>

                      {userState?.user?.role === "dl" ? (
                        <li className="hidden">
                          <CustomLink
                          //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("Comm");}}
                            to="/commision-len-den"
                            className={`dropdown-item ${activeMenu === "Comm" ? "bg-active" : ""}`}
                            >
                            <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              {"कमीशन लेन देन"}
                            </b>
                          </CustomLink>
                        </li>
                      ) : (
                        ""
                      )}

                    
                      
                      
                    </div> :""}
                  </li>

                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "CashT" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen6(!dropdownOpen6); setActiveMenu("CashT");}} className={` py-2  flex-row flex gap-2 items-center `}>
                    <i className="fa fa-angle-down mr-1 text-white " />
                     
                    <img className="h-6 w-auto mr-3"  src="imgs/checklist 2.png"  />
                    <b className={`text-lg font-medium  ${activeMenu === "CashT" ? "text-active" : "text-white"} `}>
                    Cash Transaction
                      </b>{" "}
                    </a>
                   { dropdownOpen6 ?  <div
                      className="dropdown-menuf bg-neutral-700 ml-20 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("DCDC");}}
                          to="/client-transactions"
                          className={`dropdown-item ${activeMenu === "DCDC" ? "bg-active" : ""}`}
                        >
                          <b className=" font-medium ">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            (C) Db./Cr. Entry
                          </b>
                        </CustomLink>
                      </li>

                    </div> :""}
                  </li>
                 
                  {userState?.user?.role === "dl" ? ( <li className={`nav-item pl-4  md:w-60 w-fit ${activeMenu === "ComReport" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("ComReport");}}
                      
                      className=" gap-2 py-2 flex-row flex  items-center"
                       to={"/commision-len-den"}
                    >
                        <img className="h-6 w-auto mr-3"  src="imgs/keyboard.png"  />
                      <b className={`md:text-lg text-lg font-medium  ${activeMenu === "ComReport" ? "text-active" : "text-white"} `}>
                       Comm. Report
                      </b>
                    </CustomLink>
                  </li> ) : "" }


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "RPTS" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen7(!dropdownOpen7); setActiveMenu("RPTS");}} className={` py-2  flex-row flex  gap-2 items-center `}>
                    <i className="fa fa-angle-down text-white mr-1 " />
                     
                    <img className="h-6 w-auto mr-3"  src="imgs/report.png"  />
                    <b className={`text-lg  font-medium  ${activeMenu === "RPTS" ? "text-active" : "text-white"} `}>
                    Reports
                      </b>
                    </a>
                   { dropdownOpen7 ?  <div
                      className="dropdown-menuf bg-neutral-700 ml-20 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("Logr");}}
                          to={`/login-report/${userState?.user?._id}`}
                          className={`dropdown-item ${activeMenu === "Logr" ? "bg-active" : ""}`}
                        >
                          <b className="font-medium ">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Login Report
                          </b>
                        </CustomLink>
                      </li>

                     

                    </div> :""}
                  </li>


                  {/* {userState?.user?.role === RoleType.admin &&  (  */}
                    
                    <li className={`nav-item pl-4  md:w-60 w-fit ${activeMenu === "BXPRO99" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("BXPRO99");}}
                      
                      className=" gap-2 py-2 flex-row flex items-center"
                       to={"/main-setting"}
                    >
                          <img className="h-6 w-auto mr-3"  src="imgs/setting.png"  />
                      <b className={`text-lg  font-medium  ${activeMenu === "BXPRO99" ? "text-active" : "text-white"} `}>
                     BXPRO99'Setting
                      </b>
                    </CustomLink>
                  </li>
                
                {/* )} */}
                  {userState?.user?.role === RoleType.admin && (
                    <li className={`nav-item dropdown md:w-60 w-fit ${activeMenu === "Setting" ? "bg-active" : ""}`}>
                      <a onClick={() => {setDropdownOpen4(!dropdownOpen4); setActiveMenu("Setting");}} className="flex py-2  flex-row  gap-1 items-center">
                      <i className="fa fa-angle-down mr-1 text-white " />
                      <img className="h-6 w-auto mr-3"  src="imgs/setting.png"  />

                        <b className={`text-lg t font-medium  ${activeMenu === "Setting" ? "text-active" : "text-white"} `}>
                          Settings
                        </b>{" "}
                      </a>
                     { dropdownOpen4 ? <div
                        className="dropdown-menud bg-none ml-20  pl-md-5 mt-2 grid space-y-4"
                        aria-labelledby="navbarDropdownMenuLink"
                        // style={{background:"#424242"}}
                      >
                        {userState?.user?.role === RoleType.admin && (
                          <>
                            
                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("Adm");}}
                                to={"/matches/4"}
                                className={`dropdown-item ${activeMenu === "Adm" ? "bg-active" : ""}`}
                              >
                                <b className=" text-lg">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  Add Match List
                                </b>
                              </CustomLink>
                            </li>

                            <li>
                              <CustomLink
                                //  onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("CS");}}
                                to='/casino-list'
                                className={`dropdown-item ${activeMenu === "CS" ? "bg-active" : ""}`}
                              >
                                <b className=" text-lg">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  Casino List
                                </b>
                              </CustomLink>
                            </li>


                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                // to="/sports-list/active-matches"
                                onClick={() => {toggleDrawer() ; setActiveMenu("BM");}}
                                to="/active-matches/4"
                                className={`dropdown-item ${activeMenu === "BM" ? "bg-active" : ""}`}
                              >
                                <b className=" text-lg">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  {"Block Markets"}
                                </b>
                              </CustomLink>
                            </li>

                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("DB");}}
                                to="/unsettledbet"
                                className={`dropdown-item ${activeMenu === "DB" ? "bg-active" : ""}`}
                              >
                                <b className="text-lg">
                                  {/* <DeleteIcon className="text-yellow-600" /> */}
                                  Deleted Bets
                                </b>
                              </CustomLink>
                            </li>


                            <li>
                          <CustomLink
                            onClick={toggleDrawer}
                            to="/deleted-bets"
                            className="dropdown-item"
                          >
                            <b className="text-lg">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              Deleted Bet His.
                            </b>
                          </CustomLink>
                        </li>


                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("NC");}}
                                to="/notice"
                                className={`dropdown-item ${activeMenu === "NC" ? "bg-active" : ""}`}
                              >
                                <b className=" text-lg">
                                  {/* <ListIcon className="text-yellow-600" /> */}
                                  Notice
                                </b>
                              </CustomLink>
                            </li>


                            

                           
                          </>
                        )}

                        

                        
                      </div> : ""}
                    </li>
                  )}




                 



                  <li className={`nav-item hidden md:pl-5  md:w-60 w-fit ${activeMenu === "Report" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("Report");}}
                      
                      className="md:flex gap-2 py-2 md:flex-row flex flex-col items-center"
                      to={"/all-client-report"}
                    >
                        <img className="h-6 w-auto"  src="imgs/report.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Report" ? "text-active" : ""} `}>
                        All{" "}
                        {userState?.user?.role === RoleType.dl
                          ? "Client"
                          : "Agent"}{" "}
                        Report
                      </b>
                    </CustomLink>
                  </li>
                </ul>

                </div>
                </div>


        <Marqueemessge  message={notice?.bnotice || "."} />
        <div
       
          className={`top-0 fixed md:block ${
            isOpen ? "block" : "hidden"
          } nine-x-gray text-wrap  z-50 md:w-60	  h-full overflow-y-scroll`}
          id="sidebar"
          // className={`top-0 absolute md:block hidden   z-50 bg-gray-600  md:w-60 min-h-screen`}
        >
          {/* <button
            className="side-menu-buttonn ml-2 text-black absolute top-0 right-1  block md:hidden text-white "
            onClick={toggleDrawer}
          >
            <CloseIcon />
          </button> */}

          <CustomLink to={"/"} className="logo-new navbarbg  -600">
            <img className="" src="/logo.png" />
          </CustomLink>





{/* this is the header for the sidebar for the desktop version */}
          <div className="md:block hidden">
            <nav className="navbar navbar-expand btco-hover-menu ">
              <div className="collapse navbar-collapse">
                <ul className="list-unstyled navbar-nav md:pl-4 navbar-new grid space-y-4">
                  

                  <li className={`nav-item md:pl-5   md:w-60 w-fit ${activeMenu === "Dashboard" ? "text-active" : "text-white"}`}>
                    <CustomLink
                      onClick={() => { toggleDrawer(); setActiveMenu("Dashboard");}}
                      className="md:flex gap-2 py-2 md:flex-row flex flex-col items-center"
                      to={"/market-analysis"}
                    >
                    
                      <img className="h-6 w-auto"  src="imgs/layout.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Dashboard" ? "text-active" : "text-white"} `}>
                        Dashboard
                      </b>
                    </CustomLink>
                  </li>

                 

                  <li className={` ${activeMenu === "User" ? "bg-active" : ""} nav-item dropdown  md:w-60 group relative`}>
                    <CustomLink
                      to={"/list-clients"}
                      className="md:flex py-2  md:flex-row flex flex-col gap-2 items-center cursor-pointer"
                      onClick={() => {setDropdownOpen(!dropdownOpen); setActiveMenu("User");}}
                     
                    >
                      <i className={`fa fa-angle-down hide-on-mobile ${activeMenu === "User" ? "text-active" : "text-white"}`} />

                      <img className="h-6 w-auto"  src="imgs/user.png"  />
                      <b className={`md:text-lg  text-xs font-medium  ${activeMenu === "User" ? "text-active" : "text-white"} `}>
                        {/* {userState?.user?.role  === 'mdl' ? 'Agent Master' : "" } */}
                        {userState?.user?.role === "admin"
                          ? "Super Admin"
                          : userState?.user?.role === "sadmin"
                          ? "Admin"
                          : userState?.user?.role === "suadmin"
                          ? "Sub Admin"
                          : userState?.user?.role === "smdl"
                          ? "Master"
                          : userState?.user?.role === "mdl"
                          ? "Super"
                          : userState?.user?.role === "dl"
                          ? "Agent"
                          : userState?.user?.role === "user"
                          ? "Client"
                          : ""}
                      </b>
                     

                    </CustomLink>

                    { dropdownOpen ? <div  className="dropdown-menuj bg-neutral-700 pl-md-5 mt-2 grid space-y-4   absolutek z-50 hiddenj group-hover:block w-full">
                      {getRoleOptions().map((role) => (
                        <li key={role.key}>
                          <CustomLink
                            to={`/list-clients/${userState?.user?.username}/${role.key}`}
                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                            //  onClick={toggleDrawer}
                            onClick={() => { toggleDrawer(); setDropdownOpen(!dropdownOpen) ; setActiveMenu("User");}}
                            className="dropdown-item hover:bg-gray-400"
                          >
                            <b className=" mobile-style md:text-lg text-xs text-white  md:flex md:flex-row flex flex-col items-center gap-1">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              {role.label}
                              {/* ({userList?.items?.filter((i: any) => i.role === `${role.key}`)?.length}) */}
                            </b>
                          </CustomLink>
                        </li>
                      ))}
                    </div> : ""}

                   
                  </li>


                  {/* <li className={`nav-item md:pl-5  md:w-60 w-fit ${activeMenu === "Sports" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setDropdownOpen2(!dropdownOpen2) ;  setActiveMenu("Sports");}}

                      className="md:flex gap-2 py-2  md:flex-row flex flex-col items-center"
                        to="/sports-details"
                    >
                      <img style={{transform: "rotate(45deg)"}} className="h-6 w-auto "  src="imgs/price-tag.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Sports" ? "text-active" : ""} `}>
                        Sport's Betting
                      </b>
                    </CustomLink>
                  </li> */}


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Sports" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen2(!dropdownOpen2); setActiveMenu("Sports");}} className={`md:flex py-2  md:flex-row flex flex-col gap-2 items-center `}>
                    <i className="fa fa-angle-down hide-on-mobile text-white " />
                     
                    <img style={{transform: "rotate(45deg)"}} className="h-6 w-auto "  src="imgs/price-tag.png"  />
                    <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Sports" ? "text-active" : "text-white"} `}>
                       Sports Detail
                      </b>{" "}
                    </a>
                   { dropdownOpen2 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("AG");}}
                          to="/sports-details"
                          className={`dropdown-item ${activeMenu === "AG" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex flex-col items-center gap-1 text-white">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Active Games
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                          to="/completed-sports-details"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("All");}}
                          className={`dropdown-item ${activeMenu === "FG" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex flex-col items-center gap-1 text-white">
                            {/* <ListIcon className="text-yellow-600" /> */}
                           Finished Games
                          </b>
                        </CustomLink>
                      </li>

                     
                     


                    
                      
                      
                    </div> :""}
                  </li>




                  {/* <li className={`nav-item md:pl-5  md:w-60 w-fit ${activeMenu === "Cass" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("Cass");}}

                      className="md:flex gap-2 py-2  md:flex-row flex flex-col items-center"
                        to="/casino-details"
                    >
                       <img className="h-6 w-auto"  src="imgs/compass.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Cass" ? "text-active" : ""} `}>
                       Casino Betting
                      </b>  
                    </CustomLink>
                  </li> */}


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Cass" ? "bg-active" : ""}`}>
                    <a   onClick={(e) => {setDropdownOpen5(!dropdownOpen5); setActiveMenu("Cass");}} className={`md:flex py-2  md:flex-row flex flex-col gap-2 items-center `}>
                    <i className="fa fa-angle-down hide-on-mobile text-white " />
                     
                    <img className="h-6 w-auto"  src="imgs/compass.png"  />
                    <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Cass" ? "text-active" : "text-white"} `}>
                    Casino Betting
                      </b>{" "}
                    </a>
                   { dropdownOpen5 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("ICN");}}
                          to="/in-play-casino"
                          className={`dropdown-item ${activeMenu === "ICN" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                           Inplay Casino
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                           to="/casino-pl"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("CCC");}}
                          className={`dropdown-item ${activeMenu === "CCC" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex flex-col items-center gap-1 text-white">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Completed Casino
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                           to="/casino-details"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("CD");}}
                          className={`dropdown-item ${activeMenu === "CD" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Casino Details 
                          </b>
                        </CustomLink>
                      </li>


                     
                     


                    
                      
                      
                    </div> :""}
                  </li>

                  

            

                  


                 

                  

                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "Ledger" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen3(!dropdownOpen3); setActiveMenu("Ledger");}} className={`md:flex py-2  md:flex-row flex flex-col gap-2 items-center `}>
                    <i className="fa fa-angle-down hide-on-mobile text-white " />
                     
                    <img className="h-6 w-auto"  src="imgs/copy.png"  />
                    <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Ledger" ? "text-active" : "text-white"} `}>
                        Ledger
                      </b>{" "}
                    </a>
                   { dropdownOpen3 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >

                       <li>
                        <CustomLink
                          to="/total-profit"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("Total");}}
                          className={`dropdown-item ${activeMenu === "Total" ? "bg-active" : ""}`}

                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                             Profit Loss
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("My");}}
                          to="/my-ledger"
                          className={`dropdown-item ${activeMenu === "My" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex flex-col text-white items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {"My Ledger"}
                          </b>
                        </CustomLink>
                      </li>

                      <li>
                        <CustomLink
                          to="/all-settlement"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("All");}}
                          className={`dropdown-item ${activeMenu === "All" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex text-white flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {" "}
                            {userState?.user?.role === RoleType.dl
                              ? "Client"
                              : "Agent"}{" "}
                            Ledger
                          </b>
                        </CustomLink>
                      </li>

                      

                      <li className="hidden">
                        <CustomLink
                          to="/ledger-client"
                          // onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("ALedger");}}
                          className={`dropdown-item ${activeMenu === "ALedger" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            {userState?.user?.role === RoleType.dl
                              ? "Client"
                              : "Agent"}{" "}
                            Ledger
                          </b>
                        </CustomLink>
                      </li>

                      {userState?.user?.role === "dl" ? (
                        <li className="hidden">
                          <CustomLink
                          //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                          onClick={() => {toggleDrawer() ; setActiveMenu("Comm");}}
                            to="/commision-len-den"
                            className={`dropdown-item ${activeMenu === "Comm" ? "bg-active" : ""}`}
                            >
                            <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              {"कमीशन लेन देन"}
                            </b>
                          </CustomLink>
                        </li>
                      ) : (
                        ""
                      )}

                    
                      
                      
                    </div> :""}
                  </li>

                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "CashT" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen6(!dropdownOpen6); setActiveMenu("CashT");}} className={`md:flex py-2  md:flex-row flex flex-col gap-2 items-center `}>
                    <i className="fa fa-angle-down hide-on-mobile text-white " />
                     
                    <img className="h-6 w-auto"  src="imgs/checklist 2.png"  />
                    <b className={`md:text-lg text-xs font-medium  ${activeMenu === "CashT" ? "text-active" : "text-white"} `}>
                    Cash Transaction
                      </b>{" "}
                    </a>
                   { dropdownOpen6 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("DCDC");}}
                          to="/client-transactions"
                          className={`dropdown-item ${activeMenu === "DCDC" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row flex text-white flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            (C) Debit/Credit Entry
                          </b>
                        </CustomLink>
                      </li>

                    </div> :""}
                  </li>
                 
                  {userState?.user?.role === "dl" ? ( <li className={`nav-item md:pl-5  md:w-60 w-fit ${activeMenu === "ComReport" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("ComReport");}}
                      
                      className="md:flex gap-2 py-2 md:flex-row flex flex-col items-center"
                       to={"/commision-len-den"}
                    >
                        <img className="h-6 w-auto"  src="imgs/keyboard.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "ComReport" ? "text-active" : "text-white"} `}>
                       Comm. Report
                      </b>
                    </CustomLink>
                  </li> ) : "" }


                  <li className={`nav-item dropdown  md:w-60 ${activeMenu === "RPTS" ? "bg-active" : ""}`}>
                    <a   onClick={() => {setDropdownOpen7(!dropdownOpen7); setActiveMenu("RPTS");}} className={`md:flex py-2  md:flex-row flex flex-col gap-2 items-center `}>
                    <i className="fa fa-angle-down text-white hide-on-mobile " />
                     
                    <img className="h-6 w-auto"  src="imgs/report.png"  />
                    <b className={`md:text-lg text-xs font-medium  ${activeMenu === "RPTS" ? "text-active" : "text-white"} `}>
                    Reports
                      </b>
                    </a>
                   { dropdownOpen7 ?  <div
                      className="dropdown-menuf bg-neutral-700 pl-md-5 mt-2 grid space-y-4"
                      aria-labelledby="navbarDropdownMenuLink"
                      // style={{background:"#424242"}}
                    >
                      <li>
                        <CustomLink
                        //  onClick={() => setDropdownOpen3(!dropdownOpen3)}
                        onClick={() => {toggleDrawer() ; setActiveMenu("Logr");}}
                        to={`/login-report/${userState?.user?._id}`}
                          className={`dropdown-item ${activeMenu === "Logr" ? "bg-active" : ""}`}
                        >
                          <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                            {/* <ListIcon className="text-yellow-600" /> */}
                            Login Report
                          </b>
                        </CustomLink>
                      </li>

                      

                    </div> :""}
                  </li>


                  {/* {userState?.user?.role === RoleType.admin &&  (  */}
                    
                    <li className={`nav-item md:pl-5  md:w-60 w-fit ${activeMenu === "BXPRO99" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("BXPRO99");}}
                      
                      className="md:flex gap-2 py-2 md:flex-row flex flex-col items-center"
                       to={"/main-setting"}
                    >
                          <img className="h-6 w-auto"  src="imgs/setting.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "BXPRO99" ? "text-active" : "text-white"} `}>
                     BXPRO99'Setting
                      </b>
                    </CustomLink>
                  </li>
                
                {/* )} */}
                  {userState?.user?.role === RoleType.admin && (
                    <li className={`nav-item dropdown md:w-60 w-fit ${activeMenu === "Setting" ? "bg-active" : ""}`}>
                      <a onClick={() => {setDropdownOpen4(!dropdownOpen4); setActiveMenu("Setting");}} className="md:flex py-2  md:flex-row flex flex-col gap-1 items-center">
                      <i className="fa fa-angle-down hide-on-mobile text-white " />
                      <img className="h-6 w-auto"  src="imgs/setting.png"  />

                        <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Setting" ? "text-active" : "text-white"} `}>
                          Settings
                        </b>{" "}
                      </a>
                     { dropdownOpen4 ? <div
                        className="dropdown-menud bg-none  pl-md-5 mt-2 grid space-y-4"
                        aria-labelledby="navbarDropdownMenuLink"
                        // style={{background:"#424242"}}
                      >
                        {userState?.user?.role === RoleType.admin && (
                          <>
                            
                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("Adm");}}
                                to={"/matches/4"}
                                className={`dropdown-item ${activeMenu === "Adm" ? "bg-active" : ""}`}
                              >
                                <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col gap-1 items-center">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  Add Match List
                                </b>
                              </CustomLink>
                            </li>

                            <li>
                              <CustomLink
                                //  onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("CS");}}
                                to='/casino-list'
                                className={`dropdown-item ${activeMenu === "CS" ? "bg-active" : ""}`}
                              >
                                <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col gap-1 items-center">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  Casino List
                                </b>
                              </CustomLink>
                            </li>


                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                // to="/sports-list/active-matches"
                                onClick={() => {toggleDrawer() ; setActiveMenu("BM");}}
                                to="/active-matches/4"
                                className={`dropdown-item ${activeMenu === "BM" ? "bg-active" : ""}`}
                              >
                                <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col gap-1 items-center">
                                  {/* <TuneIcon className="text-yellow-600" /> */}
                                  {"Block Markets"}
                                </b>
                              </CustomLink>
                            </li>

                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("DB");}}
                                to="/unsettledbet"
                                className={`dropdown-item ${activeMenu === "DB" ? "bg-active" : ""}`}
                              >
                                <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                                  {/* <DeleteIcon className="text-yellow-600" /> */}
                                  Deleted Bets
                                </b>
                              </CustomLink>
                            </li>


                            <li>
                          <CustomLink
                            onClick={toggleDrawer}
                            to="/deleted-bets"
                            className="dropdown-item"
                          >
                            <b className=" md:text-lg text-xs md:flex md:flex-row flex text-white flex-col items-center gap-1">
                              {/* <ListIcon className="text-yellow-600" /> */}
                              Deleted Bets His
                            </b>
                          </CustomLink>
                        </li>


                            <li>
                              <CustomLink
                                // onClick={() => setDropdownOpen4(!dropdownOpen4)}
                                onClick={() => {toggleDrawer() ; setActiveMenu("NC");}}
                                to="/notice"
                                className={`dropdown-item ${activeMenu === "NC" ? "bg-active" : ""}`}
                              >
                                <b className=" md:text-lg text-xs md:flex md:flex-row text-white flex flex-col items-center gap-1">
                                  {/* <ListIcon className="text-yellow-600" /> */}
                                  Notice
                                </b>
                              </CustomLink>
                            </li>


                            

                           
                          </>
                        )}

                        

                        
                      </div> : ""}
                    </li>
                  )}




                 



                  <li className={`nav-item hidden md:pl-5  md:w-60 w-fit ${activeMenu === "Report" ? "bg-active" : ""} `}>
                    <CustomLink
                      // onClick={toggleDrawer}
                      onClick={() => { toggleDrawer(); setActiveMenu("Report");}}
                      
                      className="md:flex gap-2 py-2 md:flex-row flex flex-col items-center"
                      to={"/all-client-report"}
                    >
                        <img className="h-6 w-auto"  src="imgs/report.png"  />
                      <b className={`md:text-lg text-xs font-medium  ${activeMenu === "Report" ? "text-active" : ""} `}>
                        All{" "}
                        {userState?.user?.role === RoleType.dl
                          ? "Client"
                          : "Agent"}{" "}
                        Report
                      </b>
                    </CustomLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* <Marqueemessge message={userMessage}></Marqueemessge> */}
      </header>

      
    </>
  );
};
export default Header;
