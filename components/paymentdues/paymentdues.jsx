import React, { useEffect, useState, useCallback } from "react";
import "../Billbook/billbook.css";
import "./paymentdues.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Footer from "../footer/footer";
import Selectimg from "../../assets/select-concept-hand-press-button-39838424.webp";
import ImageViewer from "react-simple-image-viewer";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import "react-notifications/lib/notifications.css";
import { TfiWrite } from "react-icons/tfi";


const PaymentDues = () => {
  const navigate=useNavigate();
  const [customerslist, setCustomerslist] = useState([]);
  console.log(customerslist);
  const [user_id, setUser_id] = useState(
    localStorage.getItem("selectedduepaymentcustomer")
      ? localStorage.getItem("selectedduepaymentcustomer")
      : ""
  );
  const [userdetail, setUserdetail] = useState({});
  const [billsdata, setallBillsdata] = useState([]);
  const [Filtertext, setFiltertext] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
    var selectcustomer = localStorage.getItem("selectedduepaymentcustomer");
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

  const setselectedcustomer = (e) => {
    localStorage.setItem("selectedduepaymentcustomer", e.target.value);
    setUser_id(e.target.value);
  };

  const getduebills = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var filtertext = Filtertext === "" ? "all" : Filtertext;
    var data = {
      admin_id: admin_id,
      user_id: user_id,
      filtertext: filtertext,
    };

    const res = await axios.post(
      "http://localhost:1100/getpaymentduebills",
      data
    );
    if (res.data.success === "yes") {
      // console.log("res",res.data.data[0].bill_image);
      setallBillsdata(res.data.data);
      //   setadmin(true);
    }
  };

  const deletebill = async (bill_id) => {
    if (window.confirm("Do You Want to delete this bill")) {
      var admin_id = localStorage.getItem("admin_id");
      var data = {
        admin_id: admin_id,
        bill_id: bill_id,
      };
      const res = await axios.post("http://localhost:1100/deletebill", data);
      if (res.data.success === "yes") {
        getduebills();
        NotificationManager.success("Bill Added To Recycle Bin.");
      }
    }
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  useEffect(() => {
    getuserdetails();
    getduebills();
  }, [user_id]);

  useEffect(() => {
    getuserlistofadmin();
    getuserdetails();
    getduebills();
  }, []);

  useEffect(() => {
    getduebills();
  }, [Filtertext]);
  return (
    <>
      <div style={{ flex: "1 0 auto" }}>
      <div
          style={{
            backgroundImage:
              "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
            display: "flex",
            justifyContent: "center",
            height:"70px"
          }}
        >
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <h1 className="paymentdueheadertitle">Payment Dues</h1>
          </div>
          <div
          className="duebillshbtn"
          >
            <button
              style={{ borderRadius: "10px 10px", marginRight: "20px" }}
              onClick={() => {
                window.location.href = "/home";
              }}
            >
              Home
            </button>
          </div>
        </div>
        <hr />
        <div className="middlecontainer">
          <div className="selectcustomer">
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setselectedcustomer(e)}
            //   value={pro.user_id}
              style={{ height: "80px", fontSize: "20px" }}
            >
              <option value="0">Select Customer</option>
              {customerslist.map((pro, index) => {
                return (
                  <option value={pro.user_id} key={index}>
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
              <div>
                <div className="filterdiv">
                  <div className="filterandhistorypaymentdiv">
                    <div className="customer_accountpaymentduediv">
                      <button
                        className="customer_account"
                        onClick={() => {
                          window.location.href =
                            "/getcusomerhistory/" + user_id;
                        }}
                      >
                        History
                      </button>
                    </div>
                    <div className="customer_detaildiv">
                      <span> Name : {userdetail.first_name} {userdetail.last_name}</span>
                      <span>Shopname : {userdetail.shopname}</span>
                      <span>City : {userdetail.city}</span>
                    </div>
                    <div className="filterpaymentduecontainer">
                      <Form.Select
                        aria-label="Default select example"
                        className="duebillsfilter"
                        onChange={(e) => setFiltertext(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="0">UnPaid</option>
                        <option value="0.5">Half-Paid</option>
                        <option value="Asc">A-Z</option>
                        <option value="Desc">Z-A</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
                {!billsdata.length ? (
                  <div className="noselected" style={{ marginTop: "30px" }}>
                    <h1 style={{ fontSize: "20px" }}>No Bills Found</h1>
                    {/* <img src={Selectimg} className="seelctimg"/> */}
                  </div>
                ) : (
                  <div className="allduebillslist">
                    {billsdata.map((pro, index) => (
                      <div className="duebillbox">
                        <div
                          className="deletebill"
                          onClick={() => deletebill(pro.id)}
                        >
                          <AiOutlineClose />
                        </div>
                        <div>
                          <img
                            src={pro.img}
                            onClick={() => openImageViewer(index)}
                            width="300"
                            key={index}
                            style={{ margin: "2px" }}
                            alt=""
                            className="billimg"
                          />
                        </div>
                        <div className="billdetails">
                          <div className="billspans">
                            <span>
                              Total Amount : <b>{numberFormat(pro.amount)}</b>
                            </span>
                            <span>
                              Quantity : <b>{pro.quantity}</b>
                            </span>
                            <span>
                              Amount Paid :{" "}
                              <b>{numberFormat(pro.billamount_paid)}</b>
                            </span>
                            <span>
                              Amount Pending :{" "}
                              <b>{numberFormat(pro.billamount_unpaid)}</b>
                            </span>
                            <span>
                              Bill date : <b>{pro.bill_date}</b>
                            </span>
                            <span>
                              Bill Due Date : <b>{pro.payment_duedate}</b>
                            </span>
                          </div>
                          <div className="statusdiv">
                            <div className="statusstar">
                              <AiFillStar
                                style={
                                  pro.bill_status == "0"
                                    ? { color: "red", fontSize: "35px" }
                                    : pro.bill_status == "0.5"
                                    ? { color: "#e6b800", fontSize: "35px" }
                                    : pro.bill_status == "1"
                                    ? { color: "green", fontSize: "35px" }
                                    : ""
                                }
                              />
                            </div>
                            <div>
                              <button
                                className="updatebillbtn"
                                onClick={() => {
                                  window.location.href =
                                    "/updatebill/" + pro.id;
                                }}
                              >
                                <TfiWrite/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isViewerOpen && (
                      <ImageViewer
                        src={billsdata[0].image_array}
                        currentIndex={currentImage}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDues;
