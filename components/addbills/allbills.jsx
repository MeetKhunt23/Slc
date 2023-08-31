import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import $ from "jquery";
import "react-notifications/lib/notifications.css";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./allbills.css";
import Footer from "../footer/footer";
import ImageViewer from "react-simple-image-viewer";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import recyclbin from "../../assets/filled bin.PNG";
import { TfiWrite } from "react-icons/tfi";

const Allbills = () => {
  const navigate = useNavigate();
  const user_id = useParams();

  const [userdetail, setUserdetail] = useState({});
  const [billsdata, setallBillsdata] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [Filtertext, setFiltertext] = useState("");

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

  const getallbills = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var filtertext = Filtertext === "" ? "all" : Filtertext;
    var data = {
      admin_id: admin_id,
      user_id: user_id.id,
      filtertext: filtertext,
    };

    const res = await axios.post("http://localhost:1100/getallbills", data);
    if (res.data.success === "yes") {
      // console.log("res",res.data.data[0].bill_image);
      setallBillsdata(res.data.data);
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

  const deletebill = async (bill_id) => {
    if (window.confirm("Do You Want to delete this bill")) {
      var admin_id = localStorage.getItem("admin_id");
      var data = {
        admin_id: admin_id,
        bill_id: bill_id,
      };
      const res = await axios.post("http://localhost:1100/deletebill", data);
      if (res.data.success === "yes") {
        getallbills();
        NotificationManager.success("Bill Added To Recycle Bin.");
      }
    }
  };

  useEffect(() => {
    getallbills();
  }, [Filtertext]);

  useEffect(() => {
    getuserdetails();
    getallbills();
  }, []);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  return (
    <>
      <div>
        <div className="customerdeails">
          <div className="allbillsbackbtn">
            <button
              style={{ borderRadius: "10px 10px", marginLeft: "20px" }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          <div className="details">
            <div>
              <div className="shopandname">
                Name :{" "}
                <b>
                  {userdetail.first_name} {userdetail.last_name}
                </b>
              </div>
              <div>
                {" "}
                Shop Name : <b>{userdetail.shopname} </b>
              </div>
              <div>
                City : <b> {userdetail.city} </b>
              </div>
            </div>
          </div>
          <div className="recycldiv">
            <img
              src={recyclbin}
              className="Recylcebin"
              onClick={() => {
                window.location.href = "/recyclebin";
              }}
            />
          </div>
        </div>
        <div className="filterdiv">
          <div className="filterandhistorydiv">
            <div className="customer_accountdiv">
              <button
                className="customer_account"
                onClick={() => {
                  window.location.href = "/getcusomerhistory/" + userdetail.id;
                }}
              >
                Insights
              </button>
            </div>
            <div className="filtercontainer">
              <Form.Select
                aria-label="Default select example"
                className="filter form-allbillselect"
                onChange={(e) => setFiltertext(e.target.value)}
              >
                <option value="">All</option>
                <option value="0">UnPaid</option>
                <option value="0.5">Half-Paid</option>
                <option value="1">Paid</option>
                <option value="Asc">A-Z</option>
                <option value="Desc">Z-A</option>
              </Form.Select>
            </div>
          </div>
        </div>
        {!billsdata.length ? (
          <div className="noselected" style={{ marginTop: "80px" }}>
            <h1 style={{ fontSize: "20px" }}>No Bills Found.</h1>
            {/* <img src={Selectimg} className="seelctimg"/> */}
          </div>
        ) : (
          <div className="allbillslist">
            {billsdata.map((pro, index) => (
              <div className="billbox">
                <div className="deletebill" onClick={() => deletebill(pro.id)}>
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
                      Amount Paid : <b>{numberFormat(pro.billamount_paid)}</b>
                    </span>
                    <span>
                      Amount Pending :{" "}
                      <b>{numberFormat(pro.billamount_unpaid)}</b>
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
                      >
                        <a
                          href="https://web.whatsapp.com/send?text= Please Visit http://ad-test.easygov.co.in/PanAdvertisement"
                          rel="nofollow noopener"
                          target="_blank"
                          className="share-icon"
                        >
                          <img
                            src="/img/share-icon.png"
                            style={{ height: "36px" }}
                          />
                          Share via Whatsapp
                        </a>
                      </button>
                    </div>
                    {/* <div>
                      <button
                        className="updatebillbtn"
                        onClick={() => {
                          window.location.href = "/updatebill/" + pro.id;
                        }}
                      >
                        <TfiWrite
                          style={{ fontSize: "20px", marginTop: "1px" }}
                        />
                      </button>
                    </div> */}
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
      <NotificationContainer />
    </>
  );
};

export default Allbills;
