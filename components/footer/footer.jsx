import React from "react";
import "./footer.css";
import {
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineWhatsApp,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footermaindiv">
        <div>
          <ul  className="about-details">
            <li>About Our Brand</li>
            <li>About Owners</li>
            <li>Top Brands We Deals for</li>
          </ul>
        </div>
        <div className="Adress-details">
          <ul style={{ listStyle: "none" }}>
            <li>Adress</li>
            <li>7Q7M+QG9, Mavdi, Rajkot, Gujarat 360004</li>
          </ul>
        </div>
        <div className="social-media">
            <span>Social-Media :</span>
          <ul style={{ listStyle: "none", display:"flex",fontSize:"35px",justifyContent:"space-between",cursor:"pointer",gap:"20px" }}>
            <li>
              <AiOutlineInstagram />
            </li>
            <li>
              <AiOutlineFacebook />
            </li>
            <li>
              <AiOutlineWhatsApp />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
