import React, { useEffect, useState } from "react";
import "./billbook.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Footer from "../footer/footer";
import Selectimg from "../../assets/select-concept-hand-press-button-39838424.webp";

const Billbook = () => {
  const [customerslist, setCustomerslist] = useState([]);
  console.log(customerslist);
  const [user_id, setUser_id] = useState(
    localStorage.getItem("selectedcustomer")
      ? localStorage.getItem("selectedcustomer")
      : ""
  );
  const [userdetail, setUserdetail] = useState({});
  console.log("user_id", user_id);

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

  const getuserdetails = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var selectcustomer = localStorage.getItem("selectedcustomer");
    var data = {
      user_id: selectcustomer ? selectcustomer : user_id,
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

  const manageallbill = () => {
    window.location.href = "/addbills/" + userdetail.id;
    localStorage.setItem("selectedcustomer", userdetail.id);
  };

  const getallbills = () => {
    window.location.href = "/getallbills/" + userdetail.id;
  };

  const setselectedcustomer = (e) => {
    localStorage.setItem("selectedcustomer", e.target.value);
    setUser_id(e.target.value);
  };

  useEffect(() => {
    getuserdetails();
  }, [user_id]);

  useEffect(() => {
    getuserlistofadmin();
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
            // height:"80px"
          }}
        >
          <div style={{ width:"50%",display: "flex", justifyContent: "flex-end" }}>
            <h1 className="billbookheader">Bill Book </h1>
          </div>
          <div className="billbookhomebtndiv">
            <button  className="billbookhomebtn" onClick={()=>{window.location.href="/home"}}>Home</button>
          </div>
        </div> 
        <hr />
        <div className="middlecontainer">
          <div className="selectcustomer">
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setselectedcustomer(e)}
            >
              <option value="0" className="options w-auto">Select Customer</option>
              {customerslist.map((pro, index) => {
                return (
                  <option value={pro.user_id} key={index} className="options w-auto">
                    {pro.first_name} {pro.last_name} - [{pro.shopname} -{" "}
                    {pro.city}]
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <hr />
          <div>
            {user_id == 0 ? (
              <>
                <div className="noselected">
                  <h1 style={{ fontSize: "20px" }}>
                    Select Customer to Get Details
                  </h1>
                  {/* <img src={Selectimg} className="seelctimg"/> */}
                </div>
              </>
            ) : (
              <div className="detailed-container">
                <div className="detail">
                  <div>
                    <span>Customer Name : </span> {userdetail.first_name}{" "}
                    {userdetail.last_name}
                  </div>
                  <div>
                    <span>ShopName : </span> {userdetail.shopname}
                  </div>
                  <div>
                    <span>City : </span> {userdetail.city}
                  </div>
                </div>
                <div className="addbill">
                  <button className="billbtn" onClick={() => getallbills()}>
                    All Bills
                  </button>
                  <button className="billbtn" onClick={() => manageallbill()}>
                    Add Bill
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Billbook;
