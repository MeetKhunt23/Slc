import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./account.css";
import Form from "react-bootstrap/Form";

const Account = () => {
  const [data, setData] = useState({});
  console.log("data", data);
  const [user_id, setUser_id] = useState("all");
  const [customerslist, setCustomerslist] = useState([]);
  const [userdetail, setUserdetail] = useState({});

  const getaccountstatement = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      admin_id: admin_id,
    };
    const response = await axios.post(
      "http://localhost:1100/getaccountdetails",
      data
    );
    // console.log("res",response.data.success);
    if (response.data.success === "yes") {
      setData(response?.data?.data);
      //   setadmin(true);
    }
  };

  const getuserlistofadmin = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      admin_id: admin_id,
    };
    const res = await axios.post(
      "http://localhost:1100/getallcustomerbyadmin",
      data
    );
    if (res.data.success === "yes") {
      setCustomerslist(res.data.data);
      //   setadmin(true);
    }
  };

  const openinsights = () => {
    window.location.href = "/customerinsights";
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const Getuserdetails = async () => {
    var user_id = user_id;
    var data = {
      user_id: user_id,
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

  const navigatetoinsights = () => {
    if (user_id === "all") {
        window.location.href = "/customerinsights/";
    } else {
        window.location.href = "/getcusomerhistory/" + user_id;
    }
  };

  useEffect(() => {
    getaccountstatement();
  }, []);

  useEffect(() => {
    Getuserdetails();
  }, [user_id]);

  useEffect(() => {
    getuserlistofadmin();
  }, []);

  return (
    <div>
      <div>
      <div
          style={{
            backgroundImage:
              "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
            display: "flex",
            justifyContent: "center",
            width:"100%",
            height:"70px"
          }}
        >
          <div className="accountheaderdiv"
          >
            <h1 className="accountheader">My Account</h1>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
            className="accounthomebtn"
              
              onClick={() => {
                window.location.href = "/home";
              }}
            >
              Home
            </button>
          </div>
        </div>
        <div className="statementbox">
          <div className="statement-left">
            <div>Total Turn Over</div>
            <div>Total Profit</div>
            <div>Total Sales(Qty.)</div>
            <div>Total Gst</div>
          </div>
          <div className="statement-right">
            <div>{numberFormat(data.Total_Turn_Over)}</div>
            <div>{numberFormat(data.Total_profit)}</div>
            <div>{data.Total_Sales}</div>
            <div>{numberFormat(data.GST)}</div>
          </div>
        </div>
        <hr />
        <div className="selectcustomer">
          <Form.Select
            aria-label="Default select example"
            style={{ height: "80px", fontSize: "20px" }}
            onChange={(e) => setUser_id(e.target.value)}
          >
            <option value="0" className="selectcustomer">All Customers</option>
            {customerslist.map((pro, index) => {
              return (
                <option value={pro.user_id} key={index} className="selectcustomer">
                  {pro.first_name} {pro.last_name} - [{pro.shopname} -{" "}
                  {pro.city}]
                </option>
              );
            })}
          </Form.Select>
        </div>
        <div>
          <button
            className="customer-insightsbtn"
            onClick={() => navigatetoinsights()}
          >
            Customers Insight
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
