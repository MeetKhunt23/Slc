import React, { useEffect, useState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import "../addbills/allbills.css";
import "./recyclebin.css";
import { AiFillStar } from "react-icons/ai";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import "react-notifications/lib/notifications.css";
import { FaTrashRestore } from "react-icons/fa";

const Recyclebin = () => {
  const navigate = useNavigate();
  const [customerslist, setCustomerslist] = useState([]);
  const [user_id, setUser_id] = useState("");
  const [recycleticketdata, setRecycleticketdata] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const getuserlistofadmin = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      admin_id: admin_id,
    };
    const res = await axios.post(
      "http://localhost:1100/addproject",
      data
    );
    if (res.data.success === "yes") {
      setCustomerslist(res.data.data);
      //   setadmin(true);
    }
  };

  const getrecycleticketsofuser = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var selectedcustomer = user_id == "" ? "all" : user_id;
    var data = {
      admin_id: admin_id,
      user_id: selectedcustomer,
    };
    const res = await axios.post(
      "http://localhost:1100/getrecyclebinbills",
      data
    );
    if (res.data.success === "yes") {
      setRecycleticketdata(res.data.data);
      //   setadmin(true);
    }
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const restorebill = async (bill_id) => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      admin_id: admin_id,
      bill_id: bill_id,
    };
    const res = await axios.post("http://localhost:1100/recyclebill", data);
    if (res.data.success === "yes") {
      getrecycleticketsofuser();
      NotificationManager.success("Bill restored Successfully.");
      //   setadmin(true);
    }
  };

  useEffect(() => {
    getuserlistofadmin();
    getrecycleticketsofuser();
    // getallbills();
  }, [user_id]);

  return (
    <>
      <div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="recyclebackbtn">
            <button className="rbbtn" onClick={() => navigate(-1)}>Back</button>
          </div>
          <div className="recycletitle">
            <h1 className="billbookheader">Recycle Bin</h1>
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
        <hr />
        <div className="selectcustomer">
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setUser_id(e.target.value)}
            style={{ height: "80px", fontSize: "20px" }}
          >
            <option value="" className="options w-auto">
              All Customers
            </option>
            {customerslist.map((pro, index) => {
              return (
                <option
                  value={pro.user_id}
                  key={index}
                  className="options w-auto"
                >
                  {pro.first_name} {pro.last_name} - [{pro.shopname} -{" "}
                  {pro.city}]
                </option>
              );
            })}
          </Form.Select>
        </div>
        <hr />
        <div>
          {!recycleticketdata.length ? (
            <div className="noselected">
              <h1 style={{ fontSize: "20px" }}>Recycle Bin Is Empty</h1>
              {/* <img src={Selectimg} className="seelctimg"/> */}
            </div>
          ) : (
            <div className="allbillslist">
              {recycleticketdata.map((pro, index) => (
                <div className="recyclebillbox">
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
                        Total Amount : <b>{pro.amount}</b>
                      </span>
                      <span>
                        Quantity : <b>{pro.quantity}</b>
                      </span>
                      <span>
                        Amount Paid : <b>{pro.billamount_paid}</b>
                      </span>
                      <span>
                        Amount Pending : <b>{pro.billamount_unpaid}</b>
                      </span>
                      <span>
                        Bill date : <b>{pro.bill_date}</b>
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
                          onClick={() => restorebill(pro.id)}
                        >
                          <FaTrashRestore style={{ marginTop: "2.5px" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isViewerOpen && (
                <ImageViewer
                  src={recycleticketdata[0].image_array}
                  currentIndex={currentImage}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={closeImageViewer}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <NotificationContainer />
    </>
  );
};

export default Recyclebin;
