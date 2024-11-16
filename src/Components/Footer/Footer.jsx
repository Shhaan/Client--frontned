import React, { useEffect, useState } from "react";
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
        <div className="col-12 col-md-6 text-center text-md-start  mb-2 mb-md-0">
          <p
            className="mb-0"
            style={viewportWidth < 400 ? { fontSize: "10px" } : {}}
          >
            © SSS Fresh chicken & meat - Copyright all right reserved
          </p>
        </div>
        {/* <div className="col-12 col-md-6 text-center text-md-end">
          <NavLink to="/terms" className={`${style.footerLink} me-3`}>
            Terms and Conditions
          </NavLink>
          <NavLink to="/about" className={`${style.footerLink} me-3`}>
            About Us
          </NavLink>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;
