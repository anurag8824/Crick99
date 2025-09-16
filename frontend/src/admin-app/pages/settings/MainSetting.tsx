import React from "react";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { useAppSelector } from "../../../redux/hooks";

const MainSetting = () => {
  const userState = useAppSelector(selectUserData);
  console.log(userState, "dffdfdfdf");

  return (
    <div>
      <div className="container-fluid">
        <div className="row row-cols-2 row-cols-lg-5 mt-2 g-3">
          {/* Statements */}
          <div className="col ">
            <CustomLink to={`/accountstatement/${userState?.user?._id}`}>
              <div
                style={{ backgroundColor: "#0f2327", border: "none",color:"white" }}
                className="card text-white py-2 rounded"
              >
                <div className="card-body d-flex justify-content-center">
                  <p
                    className="fs-5 fw-light mb-0"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Statements
                  </p>
                </div>
              </div>
            </CustomLink>
          </div>

          {/* A/c Operations */}
          <div className="col">
            <CustomLink to={`/operation/${userState?.user?.username}`}>
              <div
                style={{ backgroundColor: "#0f2327", border: "none" ,color:"white"}}
                className="card  text-white py-2 rounded"
              >
                <div className="card-body d-flex justify-content-center">
                  <p
                    className="fs-5 fw-light mb-0"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    A/c Operations
                  </p>
                </div>
              </div>
            </CustomLink>
          </div>

          {/* Profit and Loss */}
          <div className="col">
            <CustomLink to="/total-profit">
              <div
                style={{ backgroundColor: "#0f2327", border: "none",color:"white" }}
                className="card  text-white py-2 rounded"
              >
                <div className="card-body d-flex justify-content-center">
                  <p
                    className="fs-5 fw-light mb-0"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Profit and Loss
                  </p>
                </div>
              </div>
            </CustomLink>
          </div>

          {/* Casino Profit & Loss */}
          <div className="col">
            <CustomLink to="/casino-details">
              <div
                style={{ backgroundColor: "#0f2327", border: "none" ,color:"white" }}
                className="card text-white py-2 rounded"
              >
                <div className="card-body d-flex justify-content-center">
                  <p
                    className="fs-5 fw-light mb-0"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Casino Profit &amp; Loss
                  </p>
                </div>
              </div>
            </CustomLink>
          </div>

          {/* Change Password */}
          <div className="col">
            <CustomLink to="/change-password">
              <div
                style={{ backgroundColor: "#0f2327", border: "none",color:"white" }}
                className="card text-white py-2 rounded"
              >
                <div className="card-body d-flex justify-content-center">
                  <p
                    className="fs-5 fw-light mb-0"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Change Password
                  </p>
                </div>
              </div>
            </CustomLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSetting;
