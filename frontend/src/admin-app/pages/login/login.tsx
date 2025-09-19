import React from "react";
import api from "../../../utils/api";
import { useNavigateCustom } from "../../../pages/_layout/elements/custom-link";
import { useWebsocketUser } from "../../../context/webSocketUser";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import User from "../../../models/User";
import { loginAction } from "../../../redux/actions/login/login.action";
import SubmitButton from "../../../components/SubmitButton";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();

  const navigate = useNavigateCustom();

  const [loginForm, setLoginForm] = React.useState<User>({
    username: "",
    password: "",
    logs: "",
    admin: true,
  });

  // captcha states
  const [captcha, setCaptcha] = React.useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = React.useState("");
  const [captchaError, setCaptchaError] = React.useState("");

  React.useEffect(() => {
    api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
      setLoginForm({ ...loginForm, logs: res.data });
    });
  }, []);

  React.useEffect(() => {
    if (userState.status === "done") {
      const { role, _id } = userState.user;
      socketUser.emit("login", {
        role: userState.user.role,
        sessionId: userState.user.sessionId,
        _id,
      });

      if (
        userState.user.role &&
        ["admin", "1", "2", "3"].includes(userState.user.role)
      ) {
        return navigate.go("/market-analysis");
      }

      return navigate.go("/market-analysis");
    }
  }, [userState]);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaInput(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Captcha validation
    if (!captchaInput) {
      setCaptchaError("Please enter captcha");
      return;
    }
    if (captchaInput !== captcha) {
      setCaptchaError("Captcha not matched");
      return;
    }

    setCaptchaError("");

    dispatch(loginAction(loginForm));
  };

  return (
    <div className="login">
      <div  style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:"#8c9088"


      }}
       className="">
        
        
         
          <div style={{backgroundColor:"white" , width: "550px"}} className="row">
            <div
              className="col-md-6 d-flex flex-column justify-content-center align-items-start p-4"
              style={{ borderRight: "1px solid #ddd" , background:"#0f2327" }}
            >
              <h2 style={{color:"white"}} className="mb-3">Sign In</h2>
              <p style={{color:"white"}} className="mb-4">
                By Signing Up, you can avail full features of our services.
              </p>
              <img
                src="/imgs/logo.png"
                alt="Logo"
                style={{ maxWidth: "200px" }}
              />
            </div>

            <div className="col-md-6 pl-4">
              <div className="featured-box-login featured-box-secundary default log-fld">
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  role="form"
                  autoComplete="off"
                  method="post"
                >
                  <div className="form-group m-b-20">
                    <input
                      name="username"
                      placeholder="User Name"
                      type="text"
                      className="form-control"
                      aria-required="true"
                      aria-invalid="false"
                      onChange={handleForm}
                      required
                    />
                    <small
                      className="text-danger"
                      style={{ display: "none" }}
                    ></small>
                  </div>
                  <div className="form-group m-b-20">
                    <input
                      name="password"
                      placeholder="Password"
                      type="password"
                      className="form-control"
                      aria-required="true"
                      aria-invalid="false"
                      onChange={handleForm}
                      required
                    />
                    {userState.error ? (
                      <small className="text-danger">{userState.error}</small>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* Captcha Section */}
                  <div className="form-group m-b-20">
                    <label className="form-label">Captcha</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #ccc",
                        padding: "10px",
                        fontWeight: "bold",
                        fontSize: "18px",
                        marginBottom: "10px",
                        userSelect: "none",
                        letterSpacing: "3px",
                        fontFamily: "Arial, sans-serif",
                        color: "#333",
                        borderRadius: "4px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span>{captcha}</span>
                      <i
                        className="fa fa-refresh"
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "#333",
                        }}
                        onClick={handleRefreshCaptcha}
                        title="Refresh Captcha"
                      ></i>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter captcha here"
                      className="form-control"
                      value={captchaInput}
                      onChange={handleCaptchaInput}
                    />
                    {captchaError && (
                      <small className="text-danger d-block mt-1">
                        {captchaError}
                      </small>
                    )}
                  </div>

                  <div className="form-group text-center mb-0">
                    <SubmitButton
                    style={{backgroundColor:"#0f2327"}}
                      type="submit"
                      className="btn btn-submit text-white btn-login"
                    >
                      Sign In
                      {userState.status === "loading" ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                       ""
                      )}
                    </SubmitButton>
                  </div>
                  <div className="mt-2 text-center download-apk"></div>
                </form>
              </div>
            </div>
          </div>

     
      </div>
    </div>
  );
};

export default Login;
