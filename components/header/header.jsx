import React, { useEffect, useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AiOutlineLogout } from "react-icons/ai";
import "./header.css";
import recyclbin from "../../assets/filled bin.PNG";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Loader from "../../assets/giphy.gif";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const logout = async(e) => {
    e.preventDefault();
    NotificationManager.success("logout successfully");
    setLoader(true);
    var admin_id = localStorage.getItem("admin_id")
    var user_id = localStorage.getItem("user_id");
    var data = {
      admin_id: admin_id,
      user_id: user_id,
    };
    const res = await axios.post(
      "http://localhost:1100/logout",
      data
    );
    if (res.data.success === "yes") {
    localStorage.removeItem("user_id");
    localStorage.removeItem("last_name");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("selectedcustomer");
    localStorage.removeItem("selectedrecyclecustomer");
    localStorage.removeItem("first_name");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("city");
    localStorage.removeItem("selectedduepaymentcustomer");
    localStorage.removeItem("device_token");
    window.location.href = "/";
    setTimeout(() => {
      setLoader(false);
    }, 1200);
  }
  };
  return (
    <>
      <div>
        {loader ? (
          <div
            style={{
              display: "flex",
              height:"800px",
              justifyContent: "center",
              alignItems: "center",
              position:"relative",
              bottom:"80px",
              // opacity:"50%"
            }}
          >
            <img
              src={Loader}
              width="400px"
              alt=""
              height="400px"
              margin="60px 40px"
              className="mt-5 mb-5"
            />
          </div>
        ) : (
          <div>
            <Navbar expand="lg" className="bg-body-tertiary navbr">
              <Container>
                <Navbar.Brand href="#home" className="Brand">
                  SHUBH <span style={{ color: "#0a0a0a" }}>LAXMI</span>
                </Navbar.Brand>
              </Container>
              <div className="bottomsection">
                <img
                  src={recyclbin}
                  className="recyclebin"
                  onClick={() => {
                    window.location.href = "/recyclebin";
                  }}
                />
              </div>
              <div className="logout">
                <AiOutlineLogout onClick={logout} />
              </div>
            </Navbar>
          </div>
        )}
        <NotificationContainer />
      </div>
      <NotificationContainer />
    </>
  );
};

export default Header;
