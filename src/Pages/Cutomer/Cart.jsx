import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import style from "../../Main.module.css";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstancemain, baseURL } from "../../Functions/axios";
import {
  FaPlusCircle,
  FaMinusCircle,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import { phone, whatsappapi } from "../../Functions/axios";
import {
  Increasecount,
  Decreasecount,
  RemoveItem,
  removecart,
} from "../../redux/cartSlice";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Footer from "../../Components/Footer/Footer";
import toast from "react-hot-toast";
import Cartpopup from "../../Components/Home/Cartpopup";
const Cart = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    totalPrice,
    totalItemsCount,
  } = useSelector((state) => state.cart);
  const cartdelivery = useRef(null);

  const dispatch = useDispatch();
  const [delivery, setdelivery] = useState(false);
  const [takeaway, settakeaway] = useState(true);
  const [takeawayform, settakeawayform] = useState({ phone: "", time: "" });
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [deliverydetail, setdeliverydetail] = useState(false);
  const [takeawayformerror, settakeawayformerror] = useState({
    phone: "",
    time: "",
  });

  const [deliveryform, setdeliveryform] = useState({
    phone: "",
    zone: "",
    building: "",
    street: "",
  });

  const [deliveryformerror, setdeliveryformerror] = useState({
    phone: "",
    zone: "",
    building: "",
    street: "",
    slot: "",
  });

  const [selected, setselected] = useState(0);

  const [selectedtime, setselectedtime] = useState(0);

  const orderlist = ["Move to order", "Place order"];
  const [timeandtype, settimeandtype] = useState({
    deliverytype: "",
    time: "----",
    date: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartdelivery.current &&
        !cartdelivery.current.contains(event.target)
      ) {
        setdeliverydetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deliverydetail]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (totalItemsCount === 0) {
      toast("Cart is empty", 2000);
      navigate("/");
    }
  }, [totalItemsCount]);

  const handleclick = () => {
    if (selected === 0) {
      setdelivery(false);
      settakeaway(true);
      setselected(1);
      return;
    }

    let form = {};
    const error = {};

    if (delivery) {
      if (!deliveryform.phone) error.phone = "Your phone number is required";
      if (!deliveryform.street) error.street = "Your street number is required";
      if (!deliveryform.building)
        error.building = "Your building/villa number is required";
      if (!deliveryform.zone) error.zone = "Your zone number is required";
      if (!timeandtype.deliverytype || !timeandtype.time || selectedtime === 0)
        error.slot = "Time slot must be selected";

      if (Object.keys(error).length > 0) {
        setdeliveryformerror(error);
        return;
      }

      form = {
        Order_type: "Home delivery",
        Building: deliveryform.building,
        Street: deliveryform.street,
        Zone: deliveryform.zone,
        Phone: deliveryform.phone,
        Date:
          timeandtype.deliverytype +
          (timeandtype.deliverytype == "Now" ? `` : `(${timeandtype.date})`),
        Slot: timeandtype.time,
      };
    } else if (takeaway) {
      if (!takeawayform.phone) error.phone = "Your phone number is required";
      if (!takeawayform.time) error.time = "Take away time is required";

      if (Object.keys(error).length > 0) {
        settakeawayformerror(error);
        return;
      }

      form = {
        Order_type: "Take away",
        Time_slot: takeawayform.time,
        Phone_number: takeawayform.phone,
      };
    }

    const message = cartItems
      .map(
        (item) =>
          `${item.name}${
            item?.customization ? ` (${item.customization})` : ""
          } (${item.count})`
      )
      .join("%0A");

    const formDetails = Object.entries(form)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}: ${encodeURIComponent(value)}`
      )
      .join("%0A");

    const totalPriceText = encodeURIComponent(`Total price QR: ${totalPrice}`);

    const whatsappURL = `${whatsappapi}=${phone}&text=Order%20Details:%0A%0A${message}%0A%0A${formDetails}%0A%0A${totalPriceText}`;

    window.open(whatsappURL, "_blank");

    navigate("/");
    dispatch(removecart());
  };

  const handledelivery = () => {
    if (cartItems.length == 1) {
      if (cartItems[0].take_away) {
        console.log(cartItems);

        toast.error(
          `Home delivery not possible for ${cartItems[0].name}`,
          3000
        );
        return;
      }
    }
    setdelivery(true);
    settakeaway(false);
  };
  return (
    <>
      <div className={style.mainheader}>
        <div style={{ position: "fixed", zIndex: 2, width: "100%" }}>
          <Adminheader isAdmin={false} />
        </div>
      </div>
      <div style={{ marginBottom: "100px" }} className={style.cart}>
        {selected == 0 ? (
          <h1 className={`pb-4 ${style.cartheading}`}>Cart</h1>
        ) : (
          <h1 className={`pb-4 ${style.cartheading}`}>
            Checkout{" "}
            {viewportWidth < 886 && (
              <FaInfoCircle onClick={() => setdeliverydetail((p) => !p)} />
            )}
          </h1>
        )}

        {deliverydetail && viewportWidth < 886 && (
          <div
            ref={cartdelivery}
            style={{
              position: "absolute",
              zIndex: 1,
              background: "white",
              padding: "13px",
              width: "35%",
              left: "180px",
              top: "100px",
            }}
          >
            <p className={style.pdeliverydetails}> Zone 46 free delivery </p>
            <p className={style.pdeliverydetails}>
              0 km - 6km free delivery for qr 40 and above
            </p>
            <p className={style.pdeliverydetails}>
              6km - 8 km free delivery for qr 60 and above
            </p>
            <p className={style.pdeliverydetails}>
              8km -10 km free delivery for 80qr and above
            </p>
            <p className={style.pdeliverydetails}>
              10 km 12km free delivery for 100qr and above
            </p>{" "}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {selected === 0 ? (
            <div className={style.cartitemmain}>
              {cartItems.map((item) => (
                <div key={item.id} className={`px-5 ${style.cartItem}`}>
                  <img
                    src={`${baseURL}${item.image}`}
                    alt={item.name}
                    className={style.cartItemImage}
                  />
                  <div className={style.cartItemDetails}>
                    <div className={style.cartItemName}>
                      {item.name}{" "}
                      {item?.customization && `(${item?.customization})`}
                    </div>
                    {item?.original_price ? (
                      <div
                        style={{ padding: 0 }}
                        className={style.bestpriceseller}
                      >
                        <span
                          style={{ marginRight: "6px" }}
                          className={style.originalPrice}
                        >
                          QR{item?.original_price}
                        </span>
                        <span className={style.discountedPrice}>
                          QR{item?.price}
                        </span>
                      </div>
                    ) : (
                      <span id={style.bestpricesellerog}>QR{item?.price}</span>
                    )}
                    <div className={style.cartItemQuantity}>
                      Quantity: {item.quantity}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          alignItems: "center",
                        }}
                      >
                        <FaMinusCircle
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(Decreasecount(item))}
                        />
                        <div>{item.count}</div>
                        <FaPlusCircle
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(Increasecount(item))}
                        />
                      </div>

                      <FaTrash
                        style={{ marginLeft: "6px" }}
                        onClick={() => dispatch(RemoveItem(item))}
                      />
                    </div>
                    <div className={style.cartItemQuantity}>
                      Subtotal: {item.subtotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>
                <button
                  className={`${style.pickoptionbutton} ${
                    takeaway && style.selectedpickoption
                  }`}
                  onClick={() => (settakeaway(true), setdelivery(false))}
                >
                  Take away{" "}
                </button>
                <button
                  className={`${style.pickoptionbutton} ${
                    delivery && style.selectedpickoption
                  }`}
                  onClick={() => handledelivery()}
                >
                  Delivery
                </button>

                {delivery && (
                  <div>
                    <div className={style.inputcheckoutdiv}>
                      <label className={style.formlabel}>Mobile number</label>

                      <input
                        required
                        className={style.inputcheckout}
                        type="Number"
                        name="text"
                        value={deliveryform.phone}
                        onChange={(e) => (
                          setdeliveryform((i) => ({
                            ...i,
                            phone: e.target.value,
                          })),
                          (deliveryformerror.phone = "")
                        )}
                        style={
                          deliveryformerror.phone
                            ? { border: "solid 1px red" }
                            : {}
                        }
                      />
                      {deliveryformerror.phone && (
                        <h6 className={style.error}>
                          {deliveryformerror.phone}
                        </h6>
                      )}
                      <label className={style.formlabel}>
                        Building / Villa number
                      </label>

                      <input
                        required
                        className={style.inputcheckout}
                        type="Text"
                        name="text"
                        value={deliveryform.building}
                        onChange={(e) => (
                          setdeliveryform((i) => ({
                            ...i,
                            building: e.target.value,
                          })),
                          (deliveryformerror.building = "")
                        )}
                        style={
                          deliveryformerror.building
                            ? { border: "solid 1px red" }
                            : {}
                        }
                      />
                      {deliveryformerror.building && (
                        <h6 className={style.error}>
                          {deliveryformerror.building}
                        </h6>
                      )}
                      <label className={style.formlabel}>Street number</label>

                      <input
                        required
                        className={style.inputcheckout}
                        type="Text"
                        name="text"
                        value={deliveryform.street}
                        onChange={(e) => (
                          setdeliveryform((i) => ({
                            ...i,
                            street: e.target.value,
                          })),
                          (deliveryformerror.street = "")
                        )}
                        style={
                          deliveryformerror.street
                            ? { border: "solid 1px red" }
                            : {}
                        }
                      />
                      {deliveryformerror.street && (
                        <h6 className={style.error}>
                          {deliveryformerror.street}
                        </h6>
                      )}
                      <label className={style.formlabel}>Zone number </label>

                      <input
                        required
                        className={style.inputcheckout}
                        type="Text"
                        name="text"
                        value={deliveryform.zone}
                        onChange={(e) => (
                          setdeliveryform((i) => ({
                            ...i,
                            zone: e.target.value,
                          })),
                          (deliveryformerror.zone = "")
                        )}
                        style={
                          deliveryformerror.zone
                            ? { border: "solid 1px red" }
                            : {}
                        }
                      />
                      {deliveryformerror.zone && (
                        <h6 className={style.error}>
                          {deliveryformerror.zone}
                        </h6>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "25px",
                        marginTop: "46px",
                      }}
                    >
                      <div
                        onClick={() => (
                          setselectedtime(1),
                          settimeandtype((i) => ({
                            ...i,
                            deliverytype: "Now",
                            time: "With in 90 minutes",
                          })),
                          (deliveryformerror.slot = "")
                        )}
                        className={style.checkoutcart}
                        style={
                          selectedtime === 1
                            ? { backgroundColor: "#c3623c" }
                            : {}
                        }
                      >
                        Now
                        <h6 style={{ fontSize: "8px" }}>Within 90 minutes</h6>
                      </div>
                      <div
                        onClick={() => (deliveryformerror.slot = "")}
                        style={
                          selectedtime === 2
                            ? { backgroundColor: "#c3623c" }
                            : {}
                        }
                        className={style.checkoutcart}
                      >
                        <Cartpopup
                          today={true}
                          slot={timeandtype}
                          setslot={settimeandtype}
                          setselectedtime={setselectedtime}
                          selectedtime={selectedtime}
                        />
                      </div>
                      <div
                        onClick={() => (deliveryformerror.slot = "")}
                        style={
                          selectedtime === 3
                            ? { backgroundColor: "#c3623c" }
                            : {}
                        }
                        className={style.checkoutcart}
                      >
                        <Cartpopup
                          today={false}
                          selectedtime={selectedtime}
                          slot={timeandtype}
                          setslot={settimeandtype}
                          setselectedtime={setselectedtime}
                        />
                      </div>
                    </div>
                    {deliveryformerror.slot && (
                      <h6 className={style.error}>{deliveryformerror.slot}</h6>
                    )}
                  </div>
                )}

                {takeaway && (
                  <div className={style.inputcheckoutdiv}>
                    <label className={style.formlabel}>Mobile number</label>

                    <input
                      required
                      className={style.inputcheckout}
                      type="Number"
                      name="text"
                      value={takeawayform.phone}
                      style={
                        takeawayformerror.phone
                          ? { border: "solid 1px red" }
                          : {}
                      }
                      onChange={(e) => (
                        settakeawayform((i) => ({
                          ...i,
                          phone: e.target.value,
                        })),
                        (takeawayformerror.phone = "")
                      )}
                    />
                    {takeawayformerror.phone && (
                      <h6 className={style.error}>{takeawayformerror.phone}</h6>
                    )}

                    <label className={style.formlabel}>Pick up time</label>

                    <input
                      required
                      className={style.inputcheckout}
                      type="Text"
                      name="text"
                      value={takeawayform.time}
                      style={
                        takeawayformerror.time
                          ? { border: "solid 1px red" }
                          : {}
                      }
                      onChange={(e) => (
                        settakeawayform((i) => ({
                          ...i,
                          time: e.target.value,
                        })),
                        (takeawayformerror.time = "")
                      )}
                    />
                    {takeawayformerror.time && (
                      <h6 className={style.error}>{takeawayformerror.time}</h6>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          {viewportWidth > 886 && (
            <>
              <hr
                style={{
                  background: " #000000",
                  color: "white",
                  height: "60vh",
                  width: "2px",
                }}
              />
              <div>
                <h4>Delivery prices</h4>
                <div>
                  <p> Zone 46 free delivery </p>
                  <p>0 km - 6km free delivery for qr 40 and above</p>
                  <p>6km - 8 km free delivery for qr 60 and above</p>
                  <p>8km -10 km free delivery for 80qr and above</p>
                  <p>10 km 12km free delivery for 100qr and above</p>{" "}
                </div>
              </div>
            </>
          )}
        </div>
        {viewportWidth > 886 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "125px",
              marginLeft: "164px",
              marginBottom: "50px",
            }}
          >
            <div className={style.total}>Total: QR{totalPrice}</div>
            {selected === 1 && (
              <button
                onClick={() => setselected(0)}
                className={style.orderNowButton}
              >
                Back
              </button>
            )}

            <button onClick={handleclick} className={style.orderNowButton}>
              {orderlist[selected]}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "60px",
              paddingBottom: "40px",
              marginBottom: "100px",
            }}
          >
            <div className={style.total}>Total: QR{totalPrice}</div>
            {selected === 1 && (
              <button
                onClick={() => setselected(0)}
                className={style.orderNowButton}
              >
                Back
              </button>
            )}

            <button onClick={handleclick} className={style.orderNowButton}>
              {orderlist[selected]}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
