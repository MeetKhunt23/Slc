import React, { useEffect, useState } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./home.css";
// import shop from "../../assets/Shops-Establishments.jpg";
import malaxmiimg from "../../assets/laxmi-maa.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/giphy.gif";


const Home = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const openbillbook = () => {
    window.location.href = "/billbook";
  };

  const opencustomers = () => {
    window.location.href = "/customers";
  };

  const openpaymentdues = () => {
    window.location.href = "/paymentdues";
  };

  const openaccount = () => {
    window.location.href = "/account";
  };

  const checklogindetails = async () => {
    setLoader(true);
    var admin_id = localStorage.getItem("admin_id");
    var device_token = localStorage.getItem("device_token");
    var user_id = localStorage.getItem("user_id");
    var data = {
      admin_id: admin_id,
      user_id: user_id,
      device_token: device_token,
    };
    const res = await axios.post(
      "http://localhost:1100/checklogindetails",
      data
    );
    if (res.data.success === "yes") {
      setTimeout(() => {
        setLoader(false);
        // window.location.reload();
      }, 1200);
      //   setadmin(true);
    } else {
      setTimeout(() => {
        setLoader(false);
        navigate("/");
      }, 1500);
    }
  };

  useEffect(() => {
    checklogindetails();
  }, []);
  return (
    <>
      <div>
        {loader ? (
          <div
            style={{
              display: "flex",
              height: "800px",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              bottom: "80px",
              // opacity:"50%"
            }}
          >
            <img
              src={Loader}
              width="400px"
              alt=""
              height="400px"
              margin="60px 40px"
              className="mt-5 mb-5"
            />
          </div>
        ) : (
          <>
            <div className="homedisplay">
              <Header />
              <div className="main">
                <div className="uppersection">
                  {/* <img src={malaxmiimg} className="gif"/> */}
                </div>
                <div className="lowersection">
                  <button onClick={() => openbillbook()}>Bill Book</button>
                  <button onClick={() => opencustomers()}>Customers</button>
                  <button onClick={() => openpaymentdues()}>
                    Payment Dues
                  </button>
                  <button onClick={() => openaccount()}>Account</button>
                </div>
                <hr />
              </div>
            </div>
            <div className="footer">
              <Footer />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
