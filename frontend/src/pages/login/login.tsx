import React from "react";
import User from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginAction } from "../../redux/actions/login/login.action";
import { selectUserData } from "../../redux/actions/login/loginSlice";
import { useWebsocketUser } from "../../context/webSocketUser";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { isMobile } from "react-device-detect";
import api from "../../utils/api";
import SubmitButton from "../../components/SubmitButton";
import "./login.css";
import { toast } from "react-toastify";

// const isMobile = true


const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    isDemo: false,
  });

  const [isDemoLogin, setIsDemoLogin] = React.useState(false); // Track Demo Login
  const [captcha, setCaptcha] = React.useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = React.useState("");
  const [captchaVerified, setCaptchaVerified] = React.useState(false);
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
      localStorage.setItem("login-session", userState.user.sessionId);
      toast.success("Login Successful!", {theme:"colored"});

    
      if (
        userState.user.role &&
        ["admin", "1", "2", "3"].includes(userState.user.role)
      ) {
        return navigate.go("/");
      }

      return isMobile ? navigate.go("/rules") : navigate.go("/rules");
    }
  }, [userState]);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  const handleSubmitDemoLogin = () => {
    const loginFormNew = { ...loginForm, isDemo: true };
    setLoginForm(loginFormNew);
    setIsDemoLogin(true);
  };


  const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaInput(e.target.value);
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaVerified(false);
    setCaptchaError("");
  };

  const handleVerifyCaptcha = () => {
    if (captchaInput === captcha) {
      setCaptchaVerified(true);
      setCaptchaError("");
      toast.success("Captcha matched!", { theme: "colored" });
    } else {
      setCaptchaVerified(false);
      setCaptchaError("Captcha not matched");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // // Captcha validation on Sign In
    // if (!captchaInput) {
    //   setCaptchaError("Please enter captcha");
    //   return;
    // }
    // if (captchaInput !== captcha) {
    //   setCaptchaError("Captcha not matched");
    //   return;
    // }
    // setCaptchaError(""); // clear error if matched
    dispatch(loginAction(loginForm));
    setIsDemoLogin(false);
  };




  return (
    <div>
      <div className="login">
        <div style={{width:"420px"}} className="loginInner1">
          <div className="log-logo d-none m-b-24 text-center">
            <img src="/imgs/logo.png" className="logo-login" />
          </div>
          <div style={{marginTop:"30%"}} className="featured-box-login featured-box-secundary default">
            <div className="log-logo m-b-20 text-center">
              <img src="/imgs/logo.png" className="logo-login m-b-20" />
            </div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              role='form'
              autoComplete='off'
              method='post'
            >
              <label htmlFor="username" className="form-label">Username</label>
              <div className='form-group m-b-20'>
              
                
                <i className='fa fa-user text-light'></i>
                <input
                  name='username'
                  placeholder='Enter your username'
                  type='text'
                  className='form-control custom-input2'
                  style={{ padding: ".375rem 2.75rem" }}
                  aria-required='true'
                  aria-invalid='false'
                  onChange={handleForm}
                  required={!isDemoLogin} 
                />
                <small className='text-danger' style={{ display: 'none' }}></small>
              </div>
              <label htmlFor="username" className="form-label">Password</label>

              <div className='form-group m-b-20'>
                <input
                  name='password'
                  placeholder='Enter your password'
                  type='password'
                  className='form-control custom-input2'
                  style={{ padding: ".375rem 2.75rem" }}
                  aria-required='true'
                  aria-invalid='false'
                  onChange={handleForm}
                  required={!isDemoLogin} 
                />
                <i className='fa fa-lock text-light'></i>
                {userState.error ? (
                  <small className='text-danger'>{userState.error}</small>
                ) : (
                  ''
                )}
              </div>


              {/* CAPTCHA Section */}
          <div className="form-group d-none m-b-20">
            <label className="form-label">Captcha</label>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "10px",
                userSelect: "none",
                backgroundImage: "linear-gradient(45deg, #f3f3f3 25%, transparent 25%, transparent 50%, #f3f3f3 50%, #f3f3f3 75%, transparent 75%, transparent)",
                backgroundSize: "20px 20px",
                letterSpacing: "3px",
                fontFamily: "Arial, sans-serif",
                color: "#333",
                borderRadius: "4px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                
              }}
            >
              {captcha}
            </div>
            <button type="button" style={{backgroundColor:"#212529"}} className="btn btn-sm w-100 btn-secondary text-center mb-2" onClick={handleRefreshCaptcha}>
              Refresh Captcha
             
            </button>

            <label className="form-label">Enter Captcha</label>
            <input
              type="text"
              placeholder="Enter captcha here"
              className="form-control custom-input2"
              value={captchaInput}
              onChange={handleCaptchaInput}
              // required
            />
            {captchaError && <small className="text-danger d-block mt-1">{captchaError}</small>}
          </div>



              <div className='form-group text-center mb-0'>
                <SubmitButton type='submit' className='btn btn-submit bg-dark text-white btn-login mb-10'>
                  Sign In
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin '></i>
                  ) : (
                    <i style={{left:"215px"}} className='ml-2 fa fa-arrow-right '></i>
                  )}
                </SubmitButton>
                <SubmitButton type='submit' onClick={() => handleSubmitDemoLogin()} className='btn bg-dark text-white btn-submit btn-login mb-10'>
                 Demo Login 
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin'></i>
                  ) : (
                    <i style={{top:"51px" ,left:"230px"}} className='ml-2 fa fa-arrow-right  '></i>
                  )}
                </SubmitButton>
                <small className='recaptchaTerms'>
               <span className='text-danger'>  Note: This website is not for Indian Territory</span> <br/>
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/privacy'
                  >
                    Privacy Policy
                  </a>{' '}
                  
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/terms'
                  >
                    Terms of Service
                  </a>{' '}
                 
                </small>
              </div>
              <div className='mt-2 text-center download-apk'></div>
            </form>

          
          </div>
        </div>
      </div>
      {/* <section className="footer footer-login"><div className="footer-top"><div className="footer-links"><nav className="navbar navbar-expand-sm"><ul className="navbar-nav"><li className="nav-item"><a className="nav-link" href="/terms-and-conditions" target="_blank"> Terms and Conditions </a></li><li className="nav-item"><a className="nav-link" href="/responsible-gaming" target="_blank"> Responsible Gaming </a></li></ul></nav></div><div className="support-detail"><h2>24X7 Support</h2><p></p></div><div className="social-icons-box"></div></div></section> */}
    </div>
  );
};

export default Login;
