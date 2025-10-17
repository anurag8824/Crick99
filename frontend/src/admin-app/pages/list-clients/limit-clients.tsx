import React, { MouseEvent, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import userService from "../../../services/user.service";
import { AxiosResponse } from "axios";
import User, { RoleType } from "../../../models/User";
import "react-toastify/dist/ReactToastify.css";
import DepositModal from "./modals/DepositModal";
import WithdrawModal from "./modals/WithdrawModal";
import { useWebsocketUser } from "../../../context/webSocketUser";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import Modal from "react-modal";
import { selectLoader } from "../../../redux/actions/common/commonSlice";
import UserService from "../../../services/user.service";
import { toast } from "react-toastify";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const LimitClients = () => {
  const ref: any = React.createRef();
  const userState = useAppSelector(selectUserData);
  const loading = useAppSelector(selectLoader);
  const [page, setPage] = React.useState(1);

  const urole = userState?.user?.role;

  console.log(urole, "remove share");

  const [users, setUserList] = React.useState<{
    items: User[];
    totalPages?: number;
  }>();
  const [usersTotal, setUserListTotal] = React.useState<any>({
    totalcr: 0,
    totalbalance: 0,
    clientpl: 0,
    exposer: 0,
    totalExposer: 0,
    avl: 0,
  });
  const { socketUser } = useWebsocketUser();
  const [userbook, setUserBook] = React.useState<any>(false);
  const { username, search } = useParams();
  const [searchParams] = useSearchParams();
  const [depositUser, setDepositUser] = React.useState<User>({} as User);
  const [userBookData, setUserBookData] = React.useState<any>({});
  const [modalType, setModalType] = React.useState("EXP");
  const [callbacklist, setcallbacklist] = React.useState(false);
  const [txnPassword, setTxnPassword] = React.useState("");
  const [searchClient, setSearchClient] = React.useState("");
  const [debouncedValue, setDebouncedValue] =
    React.useState<string>(searchClient);
  const [selectAll, setSelectAll] = React.useState(false);
  const [activeDeactive, setActiveDeactive] = React.useState(true);

  const [showDialog, setDialog] = React.useState<{
    d?: boolean;
    p?: boolean;
    s?: boolean;
    w?: boolean;
    e?: boolean;
    gs?: boolean;
    dt?: boolean;
  }>({
    d: false,
    p: false,
    s: false,
    w: false,
    e: false,
    gs: false,
    dt: false,
  });

  const [show, setShow] = React.useState(false);

  const [lockshow, setLockshow] = React.useState(false);

  const [searchObj, setSearchObj] = React.useState<any>({
    type: "",
    username: "",
    status: "",
    search: "",
  });

  // const [expandedUserId, setExpandedUserId] = React.useState<string | null>(null); // Track expanded user ID
  const [expandedUserId, setExpandedUserId] = React.useState<string | null>(
    null
  ); // Track expanded user ID

  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  console.log(users, "userdata");
  const newtype = useParams().type;
  console.log(newtype, "newtype get");

  const upper: any = {
    sadmin: { first: "Super", second: "Admin" },
    suadmin: { first: "Admin", second: "SubAdmin" },
    smdl: { first: "SubAdmin", second: "Master" },
    mdl: { first: "Master", second: "Agent" },
    dl: { first: "Super", second: "Agent" },
  }[newtype || "dl"]; // default to 'dl' if undefined

  // console.log(useParams(), "my all params")

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setExpandedUserId(null); // Close modal
      }
    };

    // Add event listener to document
    // document.addEventListener('click', handleOutsideClick);

    // Clean up event listener on unmount
    return () => {
      // document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const roles = React.useMemo(() => {
    const { user } = userState;
    const allOptions = Object.keys(RoleType);
    const startIndex = allOptions.indexOf(user.role!);
    return allOptions.slice(startIndex + 1).filter((role) => role !== "admin");
  }, [userState]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  React.useEffect(() => {
    Modal.setAppElement("body");
    const ac = new AbortController();
    return () => ac.abort();
  }, []);

  React.useEffect(() => {
    setSearchObj({ ...searchObj, username: username! });
  }, [username]);

  React.useEffect(() => {
    const search = searchParams.get("search") ? searchParams.get("search") : "";
    getList({ username: username!, search: search!, type: "" });
    setPage(1);
  }, [username, searchParams.get("search"), callbacklist]);

  React.useEffect(() => {
    clientlistdata(users);
  }, [users]);

  const openModal = (type: string) => {
    const types = { ...showDialog, [type]: true };
    setcallbacklist(false);
    setDialog(types);
  };

  const closeModal = (type: string) => {
    const types = { ...showDialog, [type]: false };
    setDialog(types);
  };

  const getList = (obj: {
    username: string;
    type: string;
    search: string;
    status?: string;
    page?: number;
  }) => {
    if (!obj.page) obj.page = 1;
    userService.getUserList(obj).then((res: AxiosResponse<any>) => {
      setSearchObj(obj);
      console.log(res.data.data.items, "first data ");
      setUserList(res.data.data);
      clientlistdata(res.data.data.items);
    });
  };

  /******** UPDATE LIST DATA ********/

  const updateListUser = (user: User) => {
    getList({ ...searchObj, search: "false" });
  };

  const getclientpl = (row: any) => {
    const clientpl = row.balance?.profitLoss || 0;
    // if (row) {
    //   clientpl = (parseFloat(row?.creditRefrences) - parseFloat(row?.balance?.balance)).toFixed(2)
    // }
    return clientpl;
  };

  const clientlistdata = (userd: any) => {
    let objTotal: any = {
      totalcr: 0,
      totalbalance: 0,
      clientpl: 0,
      exposer: 0,
      totalExposer: 0,
      avl: 0,
    };
    if (userd) {
      userd.items
        ?.filter((user: User) => user.isLogin === activeDeactive)
        ?.map((user: User, index: number) => {
          const balance: any = mainBalance(user);
          const casinoexposer: any =
            user && user.balance && user.balance.casinoexposer
              ? user.balance.casinoexposer
              : 0;
          const exposer: any =
            user && user.balance && user.balance.exposer
              ? user.balance.exposer + +casinoexposer
              : 0 + +casinoexposer;
          const mainbalance: any =
            user && user.balance && user.balance.balance
              ? user.balance.balance
              : 0;
          const totalcr =
            objTotal.totalcr +
            +(user && user.creditRefrences ? user.creditRefrences : 0);
          const totalbalance: number = objTotal.totalbalance + +balance;
          const clientpl: number = objTotal.clientpl + +getclientpl(user);
          const totalExposer: number = objTotal.totalExposer + +exposer;
          const avl: number = objTotal.avl + +(mainbalance - exposer);

          objTotal = {
            ...objTotal,
            ...{ totalbalance, totalcr, clientpl, exposer, totalExposer, avl },
          };
        });
    }
    setUserListTotal(objTotal);
  };

  const mainBalance = (row: any) => {
    // const creditRef = row?.creditRefrences || 0;
    const clientpl = row.balance?.profitLoss || 0;
    const creditRef = row?.balance?.balance || 0;

    // return (parseFloat(creditRef) + +parseFloat(clientpl))?.toFixed(2);
    return parseFloat(creditRef);
  };

  const mainBalanceUser = (row: any) => {
    // const creditRef = row?.creditRefrences || 0;
    const clientpl = row.balance?.profitLoss || 0;
    // const creditRef = row?.balance?.balance + row?.balance?.commision || 0;
    const creditRef = row?.balance?.balance;

    // return (parseFloat(creditRef) + +parseFloat(clientpl))?.toFixed(2);
    return parseFloat(creditRef);
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
      [RoleType.admin]: [RoleType.sadmin],
      [RoleType.sadmin]: [RoleType.suadmin],
      [RoleType.suadmin]: [RoleType.smdl],

      [RoleType.smdl]: [RoleType.mdl],
      [RoleType.mdl]: [RoleType.dl],
      [RoleType.dl]: [RoleType.user],
      [RoleType.user]: [],
    };

    const allowedRoles = roleMap[userRole] || [];

    return allowedRoles.map((key) => ({
      key,
      label: allRoles[key],
    }));
  };

  const unnmae = useParams().username;

  const navigate = useNavigate();

  const getUserDetail = (user: any) => {
    const username = user.username;
    console.log(username, "get user detail");
    UserService.getParentUserDetail(username).then(
      (res: AxiosResponse<any>) => {
        console.log(res.data.data[0], "user detail");
        setDepositUser(res.data.data[0]);
      }
    );
  };

  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);

  const handleAdd = async (user: any) => {
    const inputElement = document.getElementById(
      `amount-${user._id}`
    ) as HTMLInputElement;
    const amountValue = parseFloat(inputElement.value || "0");

    if (!amountValue || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // 🚀 Disable button (start loading)
      setLoadingUserId(user._id);
      // 1️⃣ Get user details
      const username = user.username;
      const res = await UserService.getParentUserDetail(username);
      const depositUser = res.data.data[0];
      console.log(depositUser, "deposit user");

      // 2️⃣ Define validation schema dynamically
      const depositValidationSchema = Yup.object().shape({
        amount:
          depositUser?.role === "admin"
            ? Yup.number()
                .required("Amount is required")
                .transform((value) => (isNaN(value) ? 0 : +value))
                .min(1, "Amount must be at least 1")
            : Yup.number()
                .required("Amount is required")
                .transform((value) => (isNaN(value) ? 0 : +value))
                .min(1, "Amount must be at least 1")
                .max(
                  depositUser?.parentBalance?.balance || 0,
                  `Max ${depositUser?.parentBalance?.balance || 0} limit`
                ),
      });

      // 3️⃣ Validate the amount before calling API
      await depositValidationSchema.validate({ amount: amountValue });

      // 2️⃣ Prepare form data
      const formData = {
        transactionPassword: "123456",
        amount: amountValue,
        userId: depositUser?._id,
        parentUserId:
          depositUser?.role === "admin"
            ? depositUser?._id
            : depositUser?.parentId,
        balanceUpdateType: "D", // Deposit
      };

      // 3️⃣ Call API to update balance
      await UserService.updateDepositBalance(formData);

      // ✅ Success message
      toast.success("Limit Update Successfully");

      // 4️⃣ Clear input field after success
      inputElement.value = "";
      window.location.reload();
    } catch (error: any) {
      if (error.name === "ValidationError") {
        toast.error(error.message); // Yup validation error
      } else {
        console.error(error);
        toast.error("Failed to update balance");
      }
    } finally {
      // ✅ Re-enable button
      setLoadingUserId(null);
    }
  };

  const handleMinus = async (user: any) => {
    const inputElement = document.getElementById(
      `amount-${user._id}`
    ) as HTMLInputElement;
    const amountValue = parseFloat(inputElement.value || "0");

    if (!amountValue || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // 🚀 Disable button (start loading)
      setLoadingUserId(user._id);
      // 1️⃣ Get user details
      const username = user.username;
      const res = await UserService.getParentUserDetail(username);
      const depositUser = res.data.data[0];
      console.log(depositUser, "withdraw user");

      // 2️⃣ Define validation schema dynamically
      const depositValidationSchema = Yup.object().shape({
        amount:
          depositUser?.role === "admin"
            ? Yup.number()
                .required("Amount is required")
                .transform((value) => (isNaN(value) ? 0 : +value))
                .min(1, "Amount must be at least 1")
            : Yup.number()
                .required("Amount is required")
                .transform((value) => (isNaN(value) ? 0 : +value))
                .min(1, "Amount must be at least 1")
                .max(
                  depositUser?.balance?.balance,
                  `Max ${depositUser?.balance?.balance} limit`
                ),
      });

      // 3️⃣ Validate the amount before calling API
      await depositValidationSchema.validate({ amount: amountValue });

      // 2️⃣ Prepare form data
      const formData = {
        transactionPassword: "123456",
        amount: amountValue,
        userId: depositUser?._id,
        parentUserId:
          depositUser?.role === "admin"
            ? depositUser?._id
            : depositUser?.parentId,
        balanceUpdateType: "W", // Withdraw
      };

      // 3️⃣ Call API to update balance
      await UserService.updateDepositBalance(formData);

      // ✅ Success message
      toast.success("Limit Update Successfully");

      // 4️⃣ Clear input field after success
      inputElement.value = "";
      window.location.reload();
    } catch (error: any) {
      if (error.name === "ValidationError") {
        toast.error(error.message); // Yup validation error
      } else {
        console.error(error);
        toast.error("Failed to update balance");
      }
    } finally {
      // ✅ Re-enable button
      setLoadingUserId(null);
    }
  };

  return (
    <>
      <div style={{}} className="container-fluid">
        <div className="row">
          <div className="col-md-12 main-container">
            <div className="listing-grid">
              <div className="detail-row ">
                <div className=" row">
                  <div
                    style={{ background: "#0f2327" }}
                    className="bg-grey flex item-center justify-between px-5 py-3 gx-bg-flex"
                  >
                    <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
                      Update Limit
                    </span>
                    <button
                      onClick={() => navigate(-1)}
                      type="button"
                      className="btn bg-primary text-white"
                    >
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{ overflowY: "scroll", paddingBottom: "50vh" }}
                className="table-responsive data-table "
                ref={ref}
              >
                <table
                  id="clientListTable"
                  className="table table-striped  table-bordered  "
                  style={{ width: "100%", borderWidth: "none" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{ backgroundColor: "#0f2327", color: "white" }}
                      >
                        Name
                      </th>
                      <th
                        style={{ backgroundColor: "#0f2327", color: "white" }}
                      >
                        Code
                      </th>

                      <th
                        style={{ backgroundColor: "#0f2327", color: "white" }}
                      >
                        C.Chip
                      </th>

                      <th
                        style={{ backgroundColor: "#0f2327", color: "white" }}
                      >
                        Add/Minus Limit
                      </th>

                      <th
                        style={{ backgroundColor: "#0f2327", color: "white" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ marginBottom: "87px" }}>
                    {users?.items
                      ?.sort((a: User, b: User) => {
                        //@ts-ignore
                        return (b.isLogin === true) - (a.isLogin === true);
                      })
                      ?.map((user: User, index: number) => {
                        const shouldFilterByType =
                          newtype && newtype.trim() !== "";
                        if (shouldFilterByType && user.role !== newtype) {
                          return null;
                        }
                        return (
                          <tr key={user._id}>
                            <td>{user?.code}</td>
                            <td>{user?.username}</td>

                            {urole === "dl" || newtype === "user" ? (
                              <td>{mainBalanceUser(user).toFixed(2)}</td>
                            ) : (
                              <td>{mainBalance(user).toFixed(2)}</td>
                            )}

                            <td>
                              <input
                                type="number"
                                className="text-right maxlength10 py-2 border form-control"
                                id={`amount-${user._id}`}
                                min={0}
                                step="0.01"
                                placeholder="Enter Amount"
                              />
                            </td>

                            <td className="">
                              <button
                                onClick={() => handleAdd(user)}
                                className="btn bg-success text-white mr-2"
                                disabled={loadingUserId === user._id}
                              >
                                + Add
                               
                              </button>
                              <button
                                onClick={() => handleMinus(user)}
                                className="btn bg-danger text-white"
                                disabled={loadingUserId === user._id}
                              >
                                
                                  - Minus
                                
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <DepositModal
              showDialog={showDialog.d!}
              closeModal={(status: string, balance: any) => {
                closeModal(status);
                updateListUser({ ...depositUser });
              }}
              depositUser={depositUser}
            />

            <WithdrawModal
              showDialog={showDialog.w!}
              closeModal={(status: string, balance: any) => {
                closeModal(status);
                updateListUser({ ...depositUser });
              }}
              userDetails={depositUser}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default LimitClients;
