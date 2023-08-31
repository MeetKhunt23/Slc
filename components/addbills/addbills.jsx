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

const Addbills = () => {
  const user_id = useParams();
  const [userdetail, setUserdetail] = useState({});
  const [amount, setAmount] = useState("");
  const [billamount_paid, setBillamount_paid] = useState("");
  const [pfile, setPfile] = useState("");
  const [errors, setErrors] = useState(false);
  const [paymentstatus, setPaymentstatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [billdate, setBilldate] = useState("");

  const hidemsg = (hide) => {
    $("#" + hide).html("");
  };

  const HandleValidation_Bills = () => {
    if ($("#bill_amount").val() === "") {
      $("#bill_amount_error").html(Messages.bill_amount_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#bill_amount_error").html("");
    }

    if ($("#billamount_paid").val() === "") {
      $("#billamount_paid_error").html(Messages.billamount_paid_msg);
      setErrors(true);
    } else if (billamount_paid > amount) {
      setErrors(true);
      $("#billamount_paid_error").html(Messages.Paid_amount_is_higher_msg);
    } else {
      setErrors(false);
      $("#billamount_paid_error").html("");
    }

    if ($("#quantity").val() === "") {
      $("#quantity_error").html(Messages.quantity_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#quantity_error").html("");
    }

    if ($("#bill_date").val() === "") {
      $("#bill_date_error").html(Messages.bill_date_msg);
      setErrors(true);
    } else {
      setErrors(false);
      $("#bill_date_error").html("");
    }

    if (paymentstatus === "") {
      $("#payment_error").html(Messages.payment_msg);
      setErrors(false);
    } else {
      setErrors(false);
      $("#payment_error").html("");
    }

    if (pfile === "") {
      setErrors(false);
      $("#profile_pic_error").html(Messages.bill_img_msg);
    } else {
      setErrors(false);
      $("#profile_pic_error").html("");
    }
  };

  const getuserdetails = async () => {
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

  const formsubmit = async (e) => {
    var admin_id = localStorage.getItem("admin_id");

    e.preventDefault();
    HandleValidation_Bills();
    // checkValidation();
    if (
      amount !== "" &&
      paymentstatus !== "" &&
      quantity !== "" &&
      pfile !== ""
    ) {
      const formData = new FormData();
      formData.append("admin_id", admin_id);
      formData.append("customer_id", user_id.id);
      formData.append("image", pfile);
      formData.append("quantity", quantity);
      formData.append("amount", amount);
      formData.append("billamount_paid", billamount_paid);
      formData.append("bill_status", paymentstatus);
      formData.append("bill_date", billdate);

      const res = await axios.post("http://localhost:1100/addbill", formData);
      if (res.data.success === "yes") {
        NotificationManager.success("Bill Added successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1300);
      }
    } else {
      NotificationManager.error("Please Enter all details.");
    }
  };

  useEffect(() => {
    getuserdetails();
  }, []);
  return (
    <>
      <div style={{ flex: "1 0 auto" }}>
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="recyclebackbtn">
            <button
              className="rbbtn"
              onClick={() => {
                window.location.href = "/billbook";
              }}
            >
              Back
            </button>
          </div>
          <div className="recycletitle">
            <h1 className="billbookheader">Add Bill</h1>
          </div>
          <div className="recyclehome">
            <button
              className="rhbtn"
              onClick={() => {
                window.location.href = "/home";
              }}
            >
              Home
            </button>
          </div>
        </div>
        <div></div>
        <div className="addbillcontainer">
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

export default Addbills;
