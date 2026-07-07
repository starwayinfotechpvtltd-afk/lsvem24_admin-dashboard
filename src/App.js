import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Admin from "./Component/Pages/Admin";
import Login from "./Component/Pages/Login";
import PrivateRoute from "./util/PrivateRoute";
import ForgotPassword from "./Component/Pages/ForgotPassword";
import SetPassword from "./Component/Pages/SetPassword";
import { useDispatch } from "react-redux";
import { LOGIN_ADMIN } from "./Component/store/admin/admin.type";
import axios from "axios";
import Registration from "./Component/Pages/Registration";
import Updatecode from "./Component/Pages/Updatecode";

const backendUrl = process.env.REACT_APP_BACKEND_URI;

function App() {
  const dispatch = useDispatch();

  const key = sessionStorage.getItem("key");
  const token = sessionStorage.getItem("token");

  const [login, setLogin] = useState(undefined);

  useEffect(() => {
    axios
      .get(`${backendUrl}/admin/login`)
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
        setLogin(false);
      });
  }, []);

  useEffect(() => {
    if (!token && !key) return;

    dispatch({
      type: LOGIN_ADMIN,
      payload: token,
    });
  }, [token, key, dispatch]);

  if (login === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/changePassword" element={<SetPassword />} />

        {/* Registration page is the home page */}
        <Route path="/" element={<Registration />} />
        <Route path="/registration" element={<Registration />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Code update page */}
        <Route path="/code" element={<Updatecode />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;