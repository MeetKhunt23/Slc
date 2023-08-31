import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./customerhistory.css";
import { useNavigate } from "react-router-dom";

const Customerhistory = () => {
  const user_id = useParams();
  const navigate = useNavigate();
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

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  useEffect(() => {
    Getuserdetails();
  }, []);
  return (
    <div className="history-container">
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "-15px",
          height:"90px"
        }}
      >
        <div className="insightbbtn">
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="billbookheaderdiv">
          <h1 className="historyheader">Customers Insights</h1>
        </div>
        <div className="insighthbtn">
          <button
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            Home
          </button>
        </div>
      </div>
      <hr />
      <div className="history-upperbox">
        <div className="history-name-1">
          <div>Customer Name:</div>
          <div>Shopname: </div>
          <div>City: </div>
          <div>Contact Number: </div>
          <div>Email Id: </div>
          <div>Password: </div>
        </div>
        <div className="history-name-2">
          <div>
            {userdetail.first_name} {userdetail.last_name}
          </div>
          <div>{userdetail.shopname}</div>
          <div>{userdetail.city}</div>
          <div>{userdetail.contact}</div>
          <div>{userdetail.email}</div>
          <div>{userdetail.password}</div>
        </div>
      </div>
      <div className="history-lower">
        <div className="history-amount-1">
          <div>Total Turn Over: </div>
          <div>Amount Paid: </div>
          <div>Amount Pending: </div>
          <div>Quantity Sold: </div>
        </div>
        <div className="history-amount-2">
          <div>{numberFormat(userdetail.turn_over)}</div>
          <div>{numberFormat(userdetail.Amount_paid)}</div>
          <div>{numberFormat(userdetail.Amount_Pending)}</div>
          <div>{userdetail.quantity_traded}</div>
        </div>
      </div>
    </div>
  );
};

export default Customerhistory;
