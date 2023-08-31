import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Loader from "../../assets/giphy.gif";
import "./signup.css";
import Messages from "../constants/messages.js";
import $ from "jquery";

const Login = () => {
  const navigate = useNavigate();
  const [admin_id, setAdmin_id] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState(false);
  console.log("admin_id", admin_id);
  console.log("email", email);
  console.log("password", password);

  var PASSWORD_PATTERN = /(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z].{6,}/;
  var EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const hidemsg = (hide) => {
    $("#" + hide).html("");
  };

  const HandleValidation_Register = () => {
    if ($("#admin_id").val() === "") {
      $("#admin_id_error").html(Messages.admin_id_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#admin_id_error").html("");
    }

    if ($("#email").val() === "") {
      setErrors(true);
      $("#email_error").html(Messages.email_msg);
    } else {
      setErrors(false);
      $("#email_error").html("");
    }

    if ($("#password").val() === "") {
      setErrors(true);
      $("#password_error").html(Messages.pass_msg);
    } else {
      setErrors(false);
      $("#password_error").html("");
    }
  };

  const loginformsubmit = async (e) => {
    e.preventDefault();
    HandleValidation_Register();
    if (admin_id != "" && email != "" && password != "") {
      // setLoader(true);
      const formData = new FormData();
      formData.append("admin_id", admin_id);
      formData.append("email", email);
      formData.append("password", password);
      const res = await axios.post("http://localhost:1100/login", formData);
      // console.log(res);
      if (res.data.success === "yes") {
        console.log("login", res);
        localStorage.setItem("user_id", res.data.data.id);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("first_name", res.data.data.first_name);
        localStorage.setItem("last_name", res.data.data.last_name);
        localStorage.setItem("city", res.data.data.city);
        localStorage.setItem("admin_id", res.data.data.admin_id);
        localStorage.setItem("device_token", res.data.data.device_token);

        NotificationManager.success("login successfully");
        setTimeout(() => {
          // setLoader(false);
          navigate("/Home");
          window.location.reload();
        }, 1200);

        // window.location.reload();
      } else {
        NotificationManager.error("Enter Correct Log in Details");
        setLoader(false);
        console.log("heyy");
      }
    } else {
      NotificationManager.error("Kindly Enter all Details.");
      console.log("heyy");
      setLoader(false);
    }
  };

  const signup = async (e) => {
    navigate("/signup");
    // window.location.reload();
  };

  useEffect(() => {
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
  }, []);

  return (
    <>
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={Loader}
            width="360px"
            alt=""
            height="350px"
            margin="40px 40px"
            className="mt-5 mb-5"
          />
        </div>
      ) : (
        <div className="alldivs">
          <div className="leftsidelogin"></div>
          <div className="loginmaindiv">
            <div className="logincontent">
              <h2 className="loginhere">Log In Here</h2>
              <form onSubmit={loginformsubmit}>
                <div className="formfields">
                  <span
                    style={{
                      width: "70%",
                      fontSize: "16px",
                      marginLeft: "15%",
                      marginBottom: "15px",
                    }}
                    className="loginspan"
                  >
                    <Form.Control
                      size="lg"
                      name="admin_id"
                      type="text"
                      id="admin_id"
                      onKeyDown={() => {
                        hidemsg("admin_id_error");
                      }}
                      onChange={(e) => setAdmin_id(e.target.value)}
                      className="input-field"
                      placeholder="Enter Admin id"
                    />
                    <span id="admin_id_error" className="text-danger"></span>
                  </span>
                  <span
                    style={{
                      width: "70%",
                      fontSize: "16px",
                      marginLeft: "15%",
                      marginBottom: "15px",
                    }}
                  >
                    <Form.Control
                      size="lg"
                      name="admin_id"
                      type="text"
                      id="email"
                      onKeyDown={() => {
                        hidemsg("email_error");
                      }}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="Enter Email Id"
                    />
                    <span id="email_error" className="text-danger"></span>
                  </span>
                  <span
                    style={{
                      width: "70%",
                      fontSize: "16px",
                      marginLeft: "15%",
                      marginBottom: "15px",
                    }}
                  >
                    <Form.Control
                      size="lg"
                      name="admin_id"
                      type="text"
                      id="password"
                      onKeyDown={() => {
                        hidemsg("password_error");
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter Password"
                    />
                    <span id="password_error" className="text-danger"></span>
                  </span>
                </div>
                <div className="loginsubmitbtn">
                  <button className="loginbtn">Submit</button>
                </div>
              </form>

              <br />
              <h5
              className="donthaveacc"
                onClick={() => {
                  signup();
                }}
                style={{
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Did not have an account?{" "}
                <b>
                  {" "}
                  <a style={{ color: "blue", cursor: "pointer" }}>
                    {" "}
                    &nbsp;SignUp
                  </a>
                </b>
              </h5>
            </div>
            <NotificationContainer />
          </div>
          <div className="rightsidelogin"></div>
        </div>
      )}
      <NotificationContainer />
    </>
  );
};

export default Login;
