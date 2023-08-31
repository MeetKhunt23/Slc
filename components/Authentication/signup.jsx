import React, {useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./signup.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import $ from "jquery";
import {
  NotificationContainer,    
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
// import Messages from "../constants/messages.js";
import Messages from "../constants/messages.js";
import Loader from "../../assets/loadder.gif";
import signupimg from "../../assets/zac-wolff-_z1Q2qVIqMI-unsplash.jpg"

const Signup = () => {
  const navigate = useNavigate();
  const [admin_id, setAdmin_id] = useState("");
  const [f_name, setF_name] = useState("");
  const [l_name, setL_name] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopname, setShopname] = useState({});
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState(true);
  const [loader, setLoader] = useState(false);

  var PASSWORD_PATTERN = /(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z].{6,}/;
  var EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var NUMBER_PATTERN =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var sha512 = require("js-sha512");

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

    if ($("#f_name").val() === "") {
      $("#first_name_error").html(Messages.first_name_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#first_name_error").html("");
    }

    if ($("#l_name").val() === "") {
      $("#last_name_error").html(Messages.last_name_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#last_name_error").html("");
    }

    if ($("#shopname").val() === "") {
        $("#shopname_error").html(Messages.Shopname_msg);
        setErrors(true);
      } else {
        setErrors(false);
        $("#shopname_error").html("");
      }

      if ($("#city").val() === "") {
        $("#cityname_error").html(Messages.cityname_msg);
        setErrors(true);
      } else {
        setErrors(false);
        $("#cityname_error").html("");
      }

    if ($("#number").val() === "") {
      $("#number_error").html(Messages.number_msg);
      setErrors(true);
    } else if (!NUMBER_PATTERN.test($("#number").val())) {
      setErrors(true);
      $("#number_error").html(Messages.valid_number_msg);
    } else {
      setErrors(false);
      $("#number_error").html("");
    }

    if ($("#email").val() === "") {
      setErrors(true);
      $("#email_error").html(Messages.email_msg);
    } else if (!EMAIL_PATTERN.test($("#email").val())) {
      setErrors(true);
      $("#email_error").html(Messages.email_valid_msg);
    } else {
      setErrors(false);
      $("#email_error").html("");
    }

    if ($("#password").val() === "") {
      setErrors(true);
      $("#password_error").html(Messages.pass_msg);
    } else if ($("#password").val().match(PASSWORD_PATTERN) === null) {
      setErrors(true);
      $("#password_error").html(Messages.pass_valid_msg);
    } else {
      setErrors(false);
      $("#password_error").html("");
    }

  };

  const formsubmit = async (e) => {
    e.preventDefault();
    HandleValidation_Register();
    // checkValidation();
    if (errors == false) {
      const formData = new FormData();
      formData.append("admin_id", admin_id);
      formData.append("first_name", f_name);
      formData.append("last_name", l_name);
      formData.append("contact", contact);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("shopname", shopname);
      formData.append("city", city);

      setLoader(true);

      const res = await axios.post("http://localhost:1100/signup", formData);
      console.log(res);
      console.log(res.data.success);
      console.log(res.data.message);
      if (res.data.success === "yes") {
        localStorage.setItem("user_id", res?.data?.data.user_id);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("first_name", res.data.data.first_name);
        localStorage.setItem("last_name", res.data.data.last_name);
        localStorage.setItem("device_token", res.data.data.device_token);
        NotificationManager.success("You are Signed in successfully");
        setTimeout(() => {
          setLoader(false);
          navigate("/");
          window.location.reload();
        }, 1200);
      } else if (res.data.message === "Mobile number already exists") {
        $("#number_error").html(Messages.mobile_exist_already);
        setLoader(false);
        NotificationManager.error("Mobile Number Allready Exists");
      } else if (res.data.message === "Email already exists") {
        $("#email_error").html(Messages.email_exist_already);
        setLoader(false);
        NotificationManager.error("Email Id Allready Exists");
      } else {
        setLoader(false);
        NotificationManager.error("Enter All Details Required.");
      }
    }
    else{
        NotificationManager.error("Please Enter all details.")
    }
  };


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
        <div className="leftside"></div>
        <div className="maindiv">
          <h2 className="signupmainhere" style={{marginBottom:"20px"}}>Sign Up Here</h2>
          <hr/>
          <div className="content">
          <div className="formcontent">
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
              id="admin_id"
              onKeyDown={() => {
                hidemsg("admin_id_error");
              }}
              onChange={(e) => setAdmin_id(e.target.value)}
              className="input-field"
              placeholder="Enter Admin Id"
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
              name="f_name"
              type="text"
              id="f_name"
              onKeyDown={() => {
                hidemsg("first_name_error");
              }}
              onChange={(e) => setF_name(e.target.value)}
              className="input-field"
              placeholder="Enter First Name"
            />
            <span id="first_name_error" className="text-danger"></span>
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
              name="l_name"
              type="text"
              id="l_name"
              onKeyDown={() => {
                hidemsg("last_name_error");
              }}
              onChange={(e) => setL_name(e.target.value)}
              className="input-field"
              placeholder="Enter last Name"
            />
            <span id="last_name_error" className="text-danger"></span>
          </span>
          <span
            style={{ width: "70%", marginLeft: "15%", marginBottom: "15px" }}
          >
            <Form.Control
              className="input-field"
              size="lg"
              type="number"
              id="number"
              placeholder="Enter Mobile Number"
              onKeyDown={() => {
                hidemsg("number_error");
              }}
              onChange={(e) => setContact(e.target.value)}
              maxLength="10"
              name="number"
              required
            />
            <span id="number_error" className="text-danger"></span>
          </span>
          <span
            style={{ width: "70%", marginLeft: "15%", marginBottom: "15px" }}
          >
            <Form.Control
              className="input-field"
              size="lg"
              type="text"
              id="email"
              placeholder="Enter Email Address"
              onKeyDown={() => {
                hidemsg("email_error");
              }}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
            />
            <span id="email_error" className="text-danger"></span>
          </span>
          <span
            style={{ width: "70%", marginLeft: "15%", marginBottom: "15px" }}
          >
            <Form.Control
              className="input-field"
              size="lg"
              type="text"
              id="password"
              placeholder="Enter Password"
              onKeyDown={() => {
                hidemsg("password_error");
              }}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            <span id="password_error" className="text-danger"></span>
          </span>
          <span
            style={{ width: "70%", marginLeft: "15%", marginBottom: "15px" }}
          >
            <Form.Control
              className="input-field"
              size="lg"
              type="text"
              id="shopname"
              placeholder="Enter Shopname"
              onKeyDown={() => {
                hidemsg("shopname_error");
              }}
              onChange={(e) => setShopname(e.target.value)}
              name="shopname"
            />
            <span id="shopname_error" className="text-danger"></span>
          </span>
          <span
            style={{ width: "70%", marginLeft: "15%", marginBottom: "15px" }}
          >
            <Form.Control
              className="input-field"
              size="lg"
              type="text"
              id="city"
              placeholder="Enter Cityname"
              onKeyDown={() => {
                hidemsg("cityname_error");
              }}
              onChange={(e) => setCity(e.target.value)}
              name="city"
            />
            <span id="cityname_error" className="text-danger"></span>
          </span>
          <div>
          <Button variant="primary" className="mainsignupbtn" size="lg" onClick={(e) => formsubmit(e)}>
            Submit
          </Button>
          </div>
          </div>
          <div className="signupimg">
          <img src={signupimg} alt="img" className="divimg"></img>
          </div>
          </div>
          <br/>
          <br />
          <NotificationContainer />
        </div>
        <div className="rightside"></div>
        </div>
      )}
    </>
  );
};

export default Signup;

