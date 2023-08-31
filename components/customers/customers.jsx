import React, { useState, useEffect } from "react";
import "./customers.css";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { CSVLink, CSVDownload } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Customers = () => {
  const [customerslist, setCustomerslist] = useState([]);

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

  const csvData = customerslist;

  const handledeletecustomer = async (user_id) => {
    if (window.confirm("Do You Want to Delete This Customer ?")) {
      var admin_id = localStorage.getItem("admin_id");
      var data = {
        admin_id: admin_id,
        user_id: user_id,
      };
      const res = await axios.post(
        "http://localhost:1100/deletecustomer",
        data
      );
      if (res.data.success === "yes") {
        NotificationManager.success("Customer Deleted Successfully.");
        getuserlistofadmin();
        localStorage.removeItem("selectedcustomer");
        localStorage.removeItem("selectedrecyclecustomer");
        localStorage.removeItem("selectedduepaymentcustomer");
        //   setadmin(true);
      }
    }
  };

  const handleupdatecustomer = async (user_id) => {
    window.location.href = "/updatemycustomer/" + user_id;
  };

  const Exportpdf = () => {
    //Referance :- https://udithajanadara.medium.com/export-react-component-as-a-pdf-5afba8ba02ee 
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "My Customers";
    const headers = [
      [
        "Admin_id",
        "First_name",
        "Last_name",
        "Shopname",
        "Contact",
        "Email",
        "City",
        "image"
      ],
    ];

    const data = customerslist.map((elt) => [
      elt.admin_id,
      elt.first_name,
      elt.last_name,
      elt.shopname,
      elt.contact,
      elt.email,
      elt.city,
      <image src={elt.profile_image}/>
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("My Customers.pdf")
  };

  useEffect(() => {
    getuserlistofadmin();
  }, []);
  return (
    <>
      <div>
        <div className="customerheader">
          <button
            onClick={() => {
              window.location.href = "/addcustomer";
            }}
            className="customernavbtn"
          >
            Add Customer
          </button>
          <button
            onClick={() => {
              window.location.href = "/Home";
            }}
            className="customernavbtn"
          >
            Home
          </button>
          <button className="customernavbtn" style={{ textDecoration: "none" }}>
            <CSVLink data={csvData}>Download Csv</CSVLink>
          </button>
          <button
            className="customernavbtn"
            style={{ textDecoration: "underline", color: "blue" }}
            onClick={() => Exportpdf()}
          >
            Download Pdf
          </button>
        </div>
        <div className="customerlist">
          {customerslist.map((pro, index) => {
            return (
              <div className="customercontainer">
                <div className="detailsofuser">
                  <div>
                    Name :{" "}
                    <b>
                      {pro.first_name} {pro.last_name}
                    </b>
                  </div>
                  <div>
                    Shopname : <b>{pro.shopname}</b>
                  </div>
                  <div>
                    City : <b>{pro.city}</b>
                  </div>
                </div>
                <div className="deletecustomer">
                  <button
                    className="deletecusbtn"
                    onClick={() => handledeletecustomer(pro.user_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="deletecusbtn"
                    onClick={() => handleupdatecustomer(pro.user_id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <NotificationContainer />
    </>
  );
};

export default Customers;
