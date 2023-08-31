import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import "./customerinsights.css";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Customerinsights = () => {
  const navigate = useNavigate();
  const [userdetail, setUserdetail] = useState([]);
  const [Filtertext, setFiltertext] = useState("default");
  const Getuserdetails = async () => {
    var admin_id = localStorage.getItem("admin_id");
    var data = {
      Filtertext: Filtertext,
      admin_id: admin_id,
    };
    const res = await axios.post(
      "http://localhost:1100/getallcustomerinsights",
      data
    );
    if (res.data.success === "yes") {
      setUserdetail(res.data.data);
    }
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  useEffect(() => {
    Getuserdetails();
  }, [Filtertext]);

  return (
    <div>
      <div>
        <div style={{ flex: "1 0 auto" }}>
          <div
            style={{
              backgroundImage:
                "linear-gradient(rgb(248, 242, 242), rgb(255, 255, 255), rgba(75, 10, 255, 0.575)",
              display: "flex",
              justifyContent: "center",
              height: "90px",
            }}
          >
            <div className="insightbbtn">
              <button onClick={() => navigate(-1)}>Back</button>
            </div>
            <div className="billbookheaderdiv">
              <h2 className="historyheader">Customers Insights</h2>
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
          <div className="middlecontainer">
            <div>
              <div className="filterandtext">
                <div className="insightsfiltercontainer">
                  <Form.Select
                    aria-label="Default select example"
                    className="customerinsightfilter insightoptions"
                    style={{ border: "1px solid brown" }}
                    onChange={(e) => setFiltertext(e.target.value)}
                  >
                    <option value="default" className="insightoptions">Default</option>
                    <option value="red" className="insightoptions">Most Pending</option>
                    <option value="green" className="insightoptions">Most Cleared</option>
                    <option value="turnover" className="insightoptions">Turn Over</option>
                  </Form.Select>
                </div>
              </div>
              {userdetail.map((pro, index) => (
                <div className="detailed-insightcontainer">
                  <div className="insightdetail">
                    <div>
                      <span>Customer Name : </span> {pro.first_name}{" "}
                      {pro.last_name}
                    </div>
                    <div>
                      <span>ShopName : </span> {pro.shopname}
                    </div>
                    <div>
                      <span>City : </span> {pro.city}
                    </div>
                  </div>
                  <div className="rightcontaier">
                    <div className="insightheading">
                      <div>Turn Over</div>
                      <div> Paid</div>
                      <div> Unpaid</div>
                    </div>
                    <div className="insighnumbers">
                      <div>{numberFormat(pro.turn_over)}</div>
                      <div>{numberFormat(pro.Amount_paid)}</div>
                      <div>{numberFormat(pro.Amount_unpaid)}</div>
                    </div>
                    <div className="Starcontainer">
                      <div>
                        <AiFillStar
                          style={{ color: "red", fontSize: "35px" }}
                        />{" "}
                        👉 <b>{pro.Unpaid_bills}</b> Bills
                      </div>
                      <div>
                        <AiFillStar
                          style={{ color: "#e6b800", fontSize: "35px" }}
                        />{" "}
                        👉 <b>{pro.Halfpaid_bills}</b> Bills
                      </div>
                      <div>
                        <AiFillStar
                          style={{ color: "green", fontSize: "35px" }}
                        />{" "}
                        👉 <b>{pro.Paid_bills}</b> Bills
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customerinsights;
