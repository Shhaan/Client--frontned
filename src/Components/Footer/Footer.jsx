import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa"; // Import icons
import style from "./Footer.module.css";

function Footer() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <footer className={`${style.footer} container-fluid fixed-bottom`}>
      <div
        className="row py-2 align-items-center"
        style={{ justifyContent: "center" }}
      >
        <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
          <p
            className="mb-0"
            style={viewportWidth < 400 ? { fontSize: "10px" } : {}}
          >
            © SSS Fresh chicken & meat - Copyright all right reserved
          </p>
        </div>
        <div className="col-12 col-md-6 text-center text-md-end">
          {/* Social Media Links */}
          <a
            style={
              viewportWidth < 400
                ? { fontSize: "15px", color: "blue" }
                : { color: "blue" }
            }
            href="https://www.facebook.com/profile.php?id=100064014914279&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className={`${style.footerLink} me-5`}
            title="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            style={
              viewportWidth < 400
                ? { fontSize: "15px", color: "purple" }
                : { color: "purple" }
            }
            href="https://www.instagram.com/sssfresh.qa/profilecard/?igsh=dnZhcHBmYWlicGJy"
            target="_blank"
            rel="noopener noreferrer"
            className={`${style.footerLink} me-5`}
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            style={
              viewportWidth < 400
                ? { fontSize: "15px", color: "green" }
                : { color: "green" }
            }
            href="https://maps.app.goo.gl/qotnRqHcgmkBAB2Z9"
            target="_blank"
            rel="noopener noreferrer"
            className={`${style.footerLink}`}
            title="Google Maps"
            // Default color applied here
          >
            <FaMapMarkerAlt />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
