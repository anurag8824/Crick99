import InputComponent from "./InputComponent";
import React, { ChangeEvent } from "react";
import { toast } from "react-toastify";
import UserService from "../../services/user.service";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { isMobile } from "react-device-detect";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { logout } from "../../redux/actions/login/loginSlice";

import "./changepassword.css";

const ChangePassword = () => {
  const [passobj, setpassobj] = React.useState<any>({});
  const [errorMsg, setErrorMsg] = React.useState({});
  const dispatch = useAppDispatch();

  const navigate = useNavigateCustom();

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const btnObj = { ...passobj };
    btnObj[event.target.name] = event.target.value;
    setpassobj(btnObj);
  };

  const submitHandler = () => {
    const errormsg: any = {};
    if (!passobj["current_password"]) {
      errormsg["current_password"] = "Please Enter Current Password";
    }
    if (!passobj["new_password"]) {
      errormsg["new_password"] = "Please Enter New Password";
    }
    if (!passobj["confirm_password"]) {
      errormsg["confirm_password"] = "Please Enter Confirm Password";
    }
    if (
      passobj["confirm_password"] &&
      passobj["new_password"] &&
      passobj["new_password"] != passobj["confirm_password"]
    ) {
      errormsg["confirm_password"] =
        "New Password and Confirm Password does Not Match";
    }
    if (errormsg && Object.keys(errormsg).length > 0) {
      setErrorMsg(errormsg);
      return;
    }
    UserService.updateuserpassword(passobj)
      .then(() => {
        toast.success("Password Updated Successfully");
        dispatch(logout());
        navigate.go("/login");
      })
      .catch((e) => {
        const error = e.response.data.message;
        setErrorMsg(e.response.data.errors);
        toast.error(error);
      });
  };

  const renderInputBox = (name: string, label: string , placeholder: string) => {
    const rendbox = [];
    rendbox.push(
      <InputComponent
        key={0}
        valName={`${name}`}
        labelName={`${label}`}
        changeHandler={changeHandler}
        errorMsg={errorMsg}
        btnValue={passobj}
        placeholder={placeholder}
      />
    );
    return rendbox;
  };

  return (
    <div style={{justifyContent: "center",
      display: "flex",
  }} className="">
      {/* {mobileSubheader.subheader("Change Passwojrd")} */}
      <div
      style={{width:"50vh"}}
        className={!isMobile ? "col-md-12 mt-4 " : "col-md-12 padding-custom"}
      >
        <div className="back-main-menu my-2">
          <a href="/">BACK TO MAIN MENU</a>
        </div>
        <div className="bg-white">
          <h2 className="text-center py-2">Change Password</h2>
          <div style={{ border: "none"  }}  className="card-body p-2">
            <div className="row row5 mb-1">
              <div className="col-12 col-lg-12 w-full ">
                {renderInputBox("current_password", "Current Password" , "ENTER CURRENT PASSWORD")}
              </div>
            </div>
            <div className="row row5 mb-1">
              <div className="col-12 col-lg-12">
                {renderInputBox("new_password", "New Password" , "ENTER NEW PASSWORD")}
              </div>
              <div className="text-muted small">
                <span>Password must contain:</span>
                <ul className="ps-3" style={{ listStyleType: "disc" }}>
                  <li>At least 8 characters</li>
                  <li>At least one letter</li>
                  <li>At least one number</li>
                </ul>
              </div>
            </div>

            <div className="row row5 mb-1">
              <div className="col-12 col-lg-12">
                {renderInputBox("confirm_password", "Confirm New  Password", "CONFIRM NEW PASSWORD")}
              </div>
            </div>

            <div className="row row5 mt-2">
              <div className="col-12 back-main-menu my-2">
                <button className="back-main-menu " onClick={submitHandler}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
