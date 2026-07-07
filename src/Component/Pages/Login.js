import { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import Logo from "../../assets/images/appLogo.png";
import LoginContain from "../../assets/images/LoginContain.png";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../store/admin/admin.action";
import LoginImg from "../../assets/images/login2.jpg";
import { connect, useSelector } from "react-redux";
import { projectName } from "../../util/config";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useDispatch } from "react-redux";

const Login = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.admin.isAuth);

  // Commented out to prevent navigation race condition
  useEffect(() => {
    isAuth && navigate("/admin");
  }, [isAuth]);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    if (!email || !password) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      return setError({ ...error });
    } else {
      console.log("Handle form submit called")
      let login = {
        email,
        password,
      };
      setLoading(true)
      await dispatch(loginAdmin(login, navigate))
        setLoading(false)
      
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const [type, setType] = useState("text")
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  return (
    <>

      <div className=" d-flex " style={{ height: "100vh" }}>
        <div className=" d-md-block d-none  w-100 px-5">
          <img src={LoginImg} alt="Login" className=" w-100 h-100" />
        </div>
        <div className=" w-100 px-5">
          <div className="align-items-center d-flex h-100 justify-content-center w-100">
            <div className="w-62 w-md-100">
              <div>
                <img
                  src={Logo}
                  alt="Logo"
                  className="mb-2"
                  height={75}
                  width={100}
                />
              </div>
              <h2 className="fw-semibold">Login to your account</h2>
              <p className="text-secondary">
                Let's connect, chat, and spark real connections. Enter your
                credentials to continue your journey on {projectName}.
              </p>
              <Input
                label={`Email`}
                name={"email"}
                id={`loginEmail`}
                placeholder={"Enter Email"}
                type={`email`}
                value={email}
                errorMessage={error.email && error.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      email: `Email Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      email: "",
                    });
                  }
                }}
                autoComplete="username"
                onKeyPress={handleKeyPress}
              />
              <div className="custom-input">
                <label >Password</label>
                <div className="input-group">
                  <input
                    type={type}
                    value={password}
                    name="password"
                    className="form-control border border-end-0 password-input"
                    placeholder="Enter Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          password: `Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          password: "",
                        });
                      }
                    }}
                    autoComplete="current-password"
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className="input-group-text border border-start-0 bg-white"
                    id="basic-addon2"
                  >
                    {
                      type === "password" ? (
                        <IconEye onClick={hideShow} className="text-secondary cursor-pointer" />
                      ) : (
                        <IconEyeOff onClick={hideShow} className="text-secondary cursor-pointer" />
                      )
                    }
                  </span>
                </div>
                <p className="errorMessage">
                  {error.password && error.password}
                </p>
              </div>

              <div className="w-100" >
                <h4
                  className="cursor-pointer fs-6 text-end text-secondary"
                  style={{ fontWeight: 500, fontSize: "small" }}
                  onClick={() => navigate("/forgotPassword")}
                >
                  Forgot Password ?
                </h4>
              </div>
              <div className="w-100" >
                <h4
                  className="cursor-pointer fs-6 text-center text-secondary"
                  style={{ fontWeight: 500, fontSize: "small" }}
                  onClick={() => navigate("/register")}
                >
                  Don't have an account?
                </h4>
              </div>
              <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
                <Button
                  btnName={loading ? "Loading..." : "Submit"}
                  newClass={"login-btn  login w-100 py-2 fw-medium"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { loginAdmin })(Login);
