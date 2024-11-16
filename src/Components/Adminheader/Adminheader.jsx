import React, { useContext } from "react";
import style from "./Adminheader.module.css";
import logo from "../../Asset/Image/bg.png";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
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
          >
            SSS FRESH CHICKEN & MEAT
          </h3>
          {!isAdmin && (
            <React.Fragment>
              <div className={style.cartButton}>
                <button onClick={handleClick} className={style.cartButtonog}>
                  <FaShoppingBag className={`${style.icon}  `} />

                  <span> {totalItemsCount}</span>
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
