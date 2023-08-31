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
import "./addbills.css";
import Messages from "../constants/messages";
import Footer from "../footer/footer";
import moment from "moment/moment";

const Updatebills = () => {
  const user_id = useParams();
  const [userdetail, setUserdetail] = useState({});
  const [amount, setAmount] = useState("");
  const [billamount_paid, setBillamount_paid] = useState("");
  const [pfile, setPfile] = useState("");
  console.log("image",pfile)
  const [errors, setErrors] = useState(false);
  const [paymentstatus, setPaymentstatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [billdate, setBilldate] = useState("");

  const hidemsg = (hide) => {
    $("#" + hide).html("");
  };

  const getbilldetails = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      admin_id: admin_id,
      bill_id: user_id.id,
    };
    const res = await axios.post("http://localhost:1100/getbilldetails", data);
    if (res.data.success === "yes") {
      setUserdetail(res.data.data);
      //   setadmin(true);
    }
  };

  const numberFormat = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);

  const formsubmit = async (e) => {
    var admin_id = localStorage.getItem("admin_id");
    e.preventDefault();

    if(billamount_paid>userdetail.amount){
      NotificationManager.error("Bill Amount Paid is Greater than Current Bill Amount*");
    }else{
    if (paymentstatus) {
      var bill_status = paymentstatus;
    } else {
      if (userdetail.bill_status == "Unpaid") {
        var bill_status = "0";
      } else if (userdetail.bill_status == "Paid") {
        var bill_status = "1";
      } else {
        var bill_status = "0.5";
      }
    }
    const formData = new FormData();
    formData.append("admin_id", admin_id);
    formData.append("bill_id", userdetail.id);
    formData.append("image", pfile==="" ? userdetail.image : pfile);
    formData.append("quantity", quantity==="" ? userdetail.quantity : quantity);
    formData.append("amount", amount==="" ?  userdetail.amount : amount);
    formData.append(
      "billamount_paid",
      billamount_paid==="" ?  userdetail.billamount_paid : billamount_paid
    );
    formData.append("bill_status", paymentstatus==="" ? bill_status : paymentstatus);
    formData.append("bill_date", billdate==="" ? userdetail.bill_date : billdate);

    const res = await axios.post(
      "http://localhost:1100/updatebill",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (res.data.success === "yes") {
      NotificationManager.success("Bill Updated successfully.");
      setTimeout(() => {
        window.location.href="/getallbills/"+userdetail.customer_id
      }, 1000);
    }
  }
  };

  useEffect(() => {
    getbilldetails();
  }, []);
  return (
    <>
      <div style={{ flex: "1 0 auto" }}>
        <h1
          className="updatebilltext"
          style={{
            backgroundImage:
              "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
          }}
        >
          Update Bill
        </h1>
        <div className="addbillcontainer">
          <div className="updatebilldetails">
            <div>
              <div>
                Name :{" "}
                <b>
                  {userdetail.first_name} {userdetail.last_name}
                </b>
              </div>
              <div>
                Shopname : <b>{userdetail.shopname}</b>
              </div>
              <div>
                City : <b>{userdetail.city}</b>
              </div>
            </div>
            <div>
              <div>
                Current amount : <b>{numberFormat(userdetail.amount)}</b>
              </div>
              <div>
                Current Quantity : <b>{userdetail.quantity}</b>
              </div>
              <div>
                Bill Amount Paid : <b>{numberFormat(userdetail.billamount_paid)}</b>
              </div>
              <div>
                Bill Amount Pending : <b>{numberFormat(userdetail.bill_amount_pending)}</b>
              </div>
              <div>
                Current Bill Status : <b>{userdetail.bill_status}</b>
              </div>
            </div>
          </div>
          <div className={errors ? "billinput" : "emptyinput"}>
            <Form.Control
              size="lg"
              name="admin_id"
              type="text"
              id="bill_amount"
              onKeyDown={() => {
                hidemsg("bill_amount_error");
              }}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Bill Amount"
            />
            <span id="bill_amount_error" className="text-danger"></span>
          </div>
          <div className={errors ? "billinput" : "emptyinput"}>
            <Form.Control
              size="lg"
              name="admin_id"
              type="text"
              id="billamount_paid"
              onKeyDown={() => {
                hidemsg("billamount_paid_error");
              }}
              onChange={(e) => setBillamount_paid(e.target.value)}
              placeholder="Enter Bill Amount Paid"
            />
            <span id="billamount_paid_error" className="text-danger"></span>
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              name="admin_id"
              type="text"
              id="quantity"
              onKeyDown={() => {
                hidemsg("quantity_error");
              }}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter Quantity"
            />
            <span id="quantity_error" className="text-danger"></span>
          </div>
          <div className="billinput">
            <Form.Control
              size="lg"
              name="admin_id"
              type="date"
              id="bill_date"
              onKeyDown={() => {
                hidemsg("bill_date_error");
              }}
              onChange={(e) => setBilldate(e.target.value)}
              placeholder="Enter Bll Date"
            />
            <span id="bill_date_error" className="text-danger"></span>
          </div>
          <div className={errors ? "imginput" : "emptyimginput"}>
            <br />
            <span>Insert Image ➡️ &nbsp;</span>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              onChange={(e) => setPfile(e.target.files[0])}
              onClick={() => {
                hidemsg("profile_pic_error");
              }}
            />
            <span id="profile_pic_error" className="text-danger"></span>
          </div>
          <div>
            <span>Payment Status ➡️ </span>
            <Form.Check
              inline
              label="Paid"
              name="group1"
              type="radio"
              id="payment"
              value="1"
              onChange={(e) => setPaymentstatus(e.target.value)}
              onClick={() => {
                hidemsg("payment_error");
              }}
            />
            <Form.Check
              inline
              label="Half-paid"
              name="group1"
              type="radio"
              id="payment"
              value="0.5"
              onChange={(e) => setPaymentstatus(e.target.value)}
              onClick={() => {
                hidemsg("payment_error");
              }}
            />
            <Form.Check
              inline
              label="Unpaid"
              name="group1"
              type="radio"
              id="payment"
              value="0"
              onChange={(e) => setPaymentstatus(e.target.value)}
              onClick={() => {
                hidemsg("payment_error");
              }}
            />
            <span id="payment_error" className="text-danger"></span>
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

export default Updatebills;
