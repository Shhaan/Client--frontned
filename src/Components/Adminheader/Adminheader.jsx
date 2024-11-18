import React, { useContext, useEffect, useState } from "react";
import style from "./Adminheader.module.css";
import logo from "../../Asset/Image/bg.png";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../../App";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BsList } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";

function Adminheader({
  isAdmin = false,
  whiteIcon = false,
  setside = false,
  side,
}) {
  const navigate = useNavigate();
  const { isCart, setIsCart } = useContext(CartContext);
  const { totalItemsCount } = useSelector((state) => state.cart);

  const handleClick = () => {
    if (totalItemsCount === 0) {
      return toast("Cart is empty", { duration: 3000 });
    }
    setIsCart((prev) => !prev);
    navigate("/cart");
  };

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
    <header
      style={isAdmin ? { position: "fixed", width: "100%", zIndex: 10 } : {}}
    >
      <div
        style={
          isAdmin
            ? {
                background: "#8b4513",
              }
            : {}
        }
        className={`${style.maindiv} align-items-center`}
      >
        <div
          className={`${style.subdiv1} col-3 col-md-4 text-center text-md-start`}
          onClick={() => setIsCart(false)}
        >
          {!isAdmin ? (
            <img
              style={
                viewportWidth < 400 ? { width: "74%", height: "51px" } : {}
              }
              onClick={() => navigate("/")}
              className={`${style.logoimg} img-fluid`}
              src={logo}
              alt="logo"
            />
          ) : side ? (
            <MdOutlineCancel
              style={{ color: "white", height: "27px", width: "24px" }}
              onClick={() => setside((e) => !e)}
            />
          ) : (
            <BsList
              style={{ color: "white", height: "27px", width: "24px" }}
              onClick={() => setside((e) => !e)}
            />
          )}
        </div>
        <div
          className={`${style.subdiv2} col-9 col-md-8 text-center text-md-start`}
        >
          <h3
            onClick={() => {
              navigate("/");
              setIsCart(false);
            }}
            className={style.heading}
            style={
              viewportWidth < 400
                ? {
                    fontSize: "15px",
                    margin: 0,
                    fontWeight: "600",
                  }
                : {}
            }
          >
            SSS FRESH CHICKEN & MEAT
          </h3>
          {!isAdmin && (
            <React.Fragment>
              <div className={style.cartButton}>
                <button onClick={handleClick} className={style.cartButtonog}>
                  <FaShoppingCart
                    style={
                      viewportWidth < 400
                        ? { height: "12px", width: "20px", color: "#ffffff" }
                        : { height: "12px", width: "20px", color: "#ffffff" }
                    }
                    className={`${style.icon}  `}
                  />

                  <span
                    style={
                      viewportWidth < 400
                        ? { fontSize: "13px", color: "white" }
                        : { color: "white" }
                    }
                  >
                    {" "}
                    {totalItemsCount}
                  </span>
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </header>
  );
}

export default Adminheader;
