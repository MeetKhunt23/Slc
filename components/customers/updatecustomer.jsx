import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import $ from "jquery";
import "react-notifications/lib/notifications.css";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import "./addbills.css";
import Messages from "../constants/messages";
import Footer from "../footer/footer";
import moment from "moment/moment";
import "./updatecustomer.css";

const Updatecustomer = () => {
  const user_id = useParams();
  const [userdetail, setUserdetail] = useState({});
  const Getuserdetails = async () => {
    var data = {
      user_id: user_id.id,
    };
    const res = await axios.post(
      "http://localhost:1100/getcustomerdetail",
      data
    );
    if (res.data.success === "yes") {
      setUserdetail(res.data.data);
      //   setadmin(true);
    }
  };

  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [Shopname, setShopname] = useState("");
  const [City, setCity] = useState("");
  const [Contact, setContact] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const formsubmit = async (e) => {
    var admin_id = localStorage.getItem("admin_id");
    e.preventDefault();
    const data={
        admin_id:admin_id,
        user_id:user_id.id,
        first_name:FName==="" ? userdetail.first_name : FName,
        last_name:LName==="" ? userdetail.last_name : LName,
        shopname:Shopname==="" ? userdetail.shopname : Shopname,
        city:City==="" ? userdetail.city : City,
        contact:Contact==="" ? userdetail.contact : Contact,
        email:Email==="" ? userdetail.email : Email,
        password:Password==="" ? userdetail.password : Password
    }
    const res = await axios.post("http://localhost:1100/updatemycustomer", data);
    if (res.data.success === "yes") {
      NotificationManager.success("Customer Details Updated Successfully.");
      setTimeout(() => {
        window.location.href = "/customers"
      }, 1000);
    }
  };

  useEffect(() => {
    Getuserdetails();
  }, []);
  return (
    <>
      <div style={{ flex: "1 0 auto" }}>
        <h1
          className="updatecustomertext"
        >
          Update Customer
        </h1>
        <div className="addbillcontainer">
          <div className="updatecustomerdetails">
            <div className="updatecustomerdetails-1">
              <div>
                Current Name :{" "}
                <b>
                  {userdetail.first_name} {userdetail.last_name}
                </b>
              </div>
              <div>
                Current Shopname : <b>{userdetail.shopname}</b>
              </div>
              <div>
                Current City : <b>{userdetail.city}</b>
              </div>
            </div>
            <div className="updatecustomerdetails-2">
              <div>
                Current Contact : <b>{userdetail.contact}</b>
              </div>
              <div>
                Current Email : <b>{userdetail.email}</b>
              </div>
              <div>
                Current Password : <b>{userdetail.password}</b>
              </div>
            </div>
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setFName(e.target.value)}
              placeholder="Enter First Name"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setLName(e.target.value)}
              placeholder="Enter Last Name"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setShopname(e.target.value)}
              placeholder="Enter ShopName"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter City"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter Contact Number"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <div className="billsubbtncont">
            <Button
              className="billbtnsub"
              variant="primary"
              size="lg"
              onClick={(e) => formsubmit(e)}
            >
              Submit
            </Button>
          </div>
        </div>
        <NotificationContainer />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
};

export default Updatecustomer;
