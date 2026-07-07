import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as NotificationIcon } from "../../assets/icons/notificationIcon.svg";
import { getProfile } from "../store/admin/admin.action";
import UserImage from "../../assets/images/8.jpg";
import Logo from "../../assets/images/logo.svg";
import { connect, useDispatch, useSelector } from "react-redux";

import { getDefaultCurrency } from "../store/currency/currency.action";
import { projectName } from "../../util/config";
import { IconMenuDeep } from "@tabler/icons-react";

const Navbar = (props) => {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSidebarOpen = () => {
    if (window.matchMedia("(max-width: 992px)").matches) {
      props.setSidebarOpen?.(true);
    }
  };


  useEffect(() => {
    // setTimeout(()=>{
      dispatch(getDefaultCurrency());
    // },1000)
  }, [dispatch]);

  return (
    <>
      <div className="mainNavbar webNav me-4">
        <div className="row">
          <div className="navBox ">
          <div style={{padding : "0px 20px"}}>
            <div
              className="navBar boxBetween px-4 "
              style={{ padding: "10px 0px" }}
            >
              <div
                className="navToggle"
                id={"toggle"}
                onClick={handleSidebarOpen}
              >
               <IconMenuDeep className="text-secondary"/>
              </div>
              <div className="col-4 logo-show-nav">
                <div className="sideBarLogo boxCenter">
                  <Link
                    to={"/admin/mainDashboard"}
                    className="d-flex align-items-center"
                  >
                    <img src={Logo} alt="" width={"40px"} />
                    <span className="fs-3 fw-bold text-black">
                      {projectName}
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-7">
                <div className="navIcons d-flex align-items-center justify-content-end">
                  <div
                    className="pe-4 cursor"
                    style={{ backgroundColor: "inherit", position: "relative" }}
                  ></div>
                  <div className="pe-2" style={{ backgroundColor: "inherit" }}>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        fontWeight: "500",
                      }}
                    >
                      {admin?.name}
                    </span>
                  </div>
                  <div className="cursor">
                    <Link to="/admin/profile" style={{ backgroundColor: "inherit" }}>
                      <img
                        src={admin?.image}
                        alt="admin"
                        width="40px"
                        height="40px"
                        style={{
                            borderRadius: "5px",
                            border: "1px solid white",
                            objectFit: "cover",
                          }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = UserImage;
                        }}
                        className="cursor"
                      />
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProfile,
})(Navbar);
