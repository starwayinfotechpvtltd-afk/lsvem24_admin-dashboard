import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupAdmin } from "../store/admin/admin.action";
import LoginImg from "../../assets/images/login2.jpg";
import Logo from "../../assets/images/appLogo.png";
import Input from "../extra/Input";
import Button from "../extra/Button";
import { projectName } from "../../util/config";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
    code: "",
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Registration button clicked");
    if (!email || !password || !newPassword || newPassword !== password) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      // if (!code) error.code = "Purchase code is required !";
      if (!newPassword) error.newPassword = "Confirm password is required !";
      if (newPassword !== password)
        error.newPassword = "Doesn't match password to confirm password !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        newPassword,
        password,
      };

      console.log(login);

      try {
        setLoading(true); // ✅ disable button immediately
        await dispatch(signupAdmin(login, navigate)); // ✅ wait for API
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ enable again only after API finishes
      }
    }
    console.log("Button Clicked");
  };

  const [type, setType] = useState("text");
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  return (
    <>
      {/* <div className="login-page-content">
        <div className="bg-login">
          <div className="login-page-box">
            <div className="row">
              <div className="col-12 col-md-6 right-login-img d-flex justify-content-center">
                <img src={LoginImg} style={{ width: "414px" }} />
              </div>
              <div className="col-12 col-md-6 text-login">
                <div className="heading-login">
                  <img src={Logo} />
                  <h6>{projectName}</h6>
                </div>
                <div className="login-left-form">
                  <span>Welcome back !!!</span>
                  <h5>Sign up</h5>
                  <Input
                    label={`Email`}
                    id={`loginEmail`}
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
                  />
                  <Input
                    label={`Password`}
                    id={`loginPassword`}
                    type={`password`}
                    value={password}
                    className={`form-control`}
                    errorMessage={error.password && error.password}
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
                  />
                  <Input
                    label={`Confirm Password`}
                    id={`confirmPassword`}
                    type={`password`}
                    value={newPassword}
                    className={`form-control`}
                    errorMessage={error.newPassword && error.newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          newPassword: `Confirm Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          newPassword: "",
                        });
                      }
                    }}
                  />
                  <Input
                    label={`Purachse Code`}
                    id={`loginpurachse Code`}
                    type={`text`}
                    value={code}
                    errorMessage={error.code && error.code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          code: `code Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          code: "",
                        });
                      }
                    }}
                  />

                  <div
                    className="d-flex justify-content-center w-100"
                    style={{ width: "400px" }}
                  >
                    <Button
                      btnName={"Sign Up"}
                      newClass={"login-btn ms-2"}
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className=" d-flex " style={{ height: "100vh" }}>
        <div className=" d-md-block d-none  w-100 px-5">
          <img src={LoginImg} alt="Login" className=" w-100 h-100" />
        </div>
        <div className=" w-100 px-5">
          <div className="align-items-center d-flex h-100 justify-content-center w-100">
            <div className="w-62">
              <div>
                <img
                  src={Logo}
                  alt="Logo"
                  className="mb-2"
                  height={75}
                  width={100}
                />
              </div>
              <h2 className="fw-semibold">Sign Up to your account</h2>
              <p className="text-secondary">
                Let's connect, chat, and spark real connections. Enter your
                credentials to continue your journey on {projectName}.
              </p>
              <Input
                label={`Email`}
                placeholder={"Enter Email"}
                id={`loginEmail`}
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
              />
              <div className="custom-input">
                <label>Password</label>
                <div className="input-group">
                  <input
                    type={type}
                    value={password}
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
                  />
                  <span
                    className="input-group-text border border-start-0"
                    id="basic-addon2"
                  >
                    {type === "password" ? (
                      <IconEye
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    ) : (
                      <IconEyeOff
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    )}
                  </span>
                </div>
                <p className="errorMessage">
                  {error.password && error.password}
                </p>
              </div>
              <div className="custom-input">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={type}
                    value={newPassword}
                    className="form-control border border-end-0 password-input"
                    placeholder="Enter Confirm Password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          newPassword: `Confirm Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          newPassword: "",
                        });
                      }
                    }}
                  />
                  <span
                    className="input-group-text border border-start-0"
                    id="basic-addon2"
                  >
                    {type === "password" ? (
                      <IconEye
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    ) : (
                      <IconEyeOff
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    )}
                  </span>
                </div>
                <p className="errorMessage">
                  {error.newPassword && error.newPassword}
                </p>
              </div>

              {/* <Input
                label={`Purchase Code`}
                id={`loginpurchase Code`}
                type={`text`}
                placeholder={"Enter purchase code"}
                value={code}
                errorMessage={error.code && error.code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      code: `code Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      code: "",
                    });
                  }
                }}
              /> */}
              <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
                {/* <Button
                  btnName={loading ? "Loading..." : "Submit"}
                  newClass={"login-btn  login w-100 py-2 fw-medium"}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ backgroundColor: "#FE0952", }}
                /> */}
                <button
                  className="themeBtn text-center login-btn login w-100 py-2 fw-medium"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
              <div className="mt-3 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
