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
  FaBiking,
  FaCross,
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
import { MdDeliveryDining, MdOutlineCancel } from "react-icons/md";
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
  const [takeawayform, settakeawayform] = useState({
    phone: "",
    time: "",
    name: "",
  });
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [deliverydetail, setdeliverydetail] = useState(false);
  const [takeawayformerror, settakeawayformerror] = useState({
    phone: "",
    time: "",
  });
  const [dcount, setdcount] = useState(0);
  const [deliveryform, setdeliveryform] = useState({
    phone: "",
    zone: "",
    building: "",
    street: "",
    name: "",
    paymentType: "",
  });

  const [deliveryformerror, setdeliveryformerror] = useState({
    phone: "",
    zone: "",
    building: "",
    street: "",
    slot: "",
    paymentType: "",
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
      if (deliveryform.phone.length != 8) error.phone = "Must submit 8 number";

      if (!deliveryform.building)
        error.building = "Your building/villa number is required";
      if (!deliveryform.paymentType)
        error.paymentType = "Payment type is required";

      if (!timeandtype.deliverytype || !timeandtype.time || selectedtime === 0)
        error.slot = "Time slot must be selected";

      if (Object.keys(error).length > 0) {
        setdeliveryformerror(error);
        return;
      }

      form = {
        Order_type: "Home delivery",

        Date:
          timeandtype.deliverytype +
          (timeandtype.deliverytype == "Now" ? `` : `(${timeandtype.date})`),
        Slot: timeandtype.time,
        PaymentType: deliveryform.paymentType,
        Name: deliveryform.name,
        Phone: deliveryform.phone,
        Building: deliveryform.building,
        Street: deliveryform.street,
        Zone: deliveryform.zone,
      };
    } else if (takeaway) {
      if (takeawayform.phone.length != 8) error.phone = "Must submit 8 number";

      if (!takeawayform.time) error.time = "Take away time is required";

      if (Object.keys(error).length > 0) {
        settakeawayformerror(error);
        return;
      }

      form = {
        Order_type: "Take away",
        Time: takeawayform.time,
        Name: takeawayform.name,

        Phone_number: takeawayform.phone,
      };
    }

    const message = cartItems
      .map(
        (item, i) =>
          `${i + 1}. ${item.name}${
            item?.customization ? ` (${item.customization})` : ""
          }   (${item.quantity})  x ${item.count} %0A`
      )
      .join("%0A");

    const formDetails = Object.entries(form)
      .filter(([key, value]) => value && value != "")
      .map(([key, value]) => {
        const lineBreak = ["Order_type", "Slot"].includes(key) ? "%0A" : "";
        return `${encodeURIComponent(key)}: ${encodeURIComponent(
          value
        )}${lineBreak}`;
      })
      .join("%0A");

    const totalPriceText = encodeURIComponent(`Total price QR: ${totalPrice}`);

    const whatsappURL = `${whatsappapi}=${phone}&text=%0A${message}%0A%0A${formDetails}%0A%0A${totalPriceText}`;

    window.open(whatsappURL, "_blank");

    navigate("/");
    dispatch(removecart());
  };

  const handledelivery = () => {
    if (cartItems.length == 1) {
      if (cartItems[0].take_away) {
        toast.error(
          `Home delivery not possible for ${cartItems[0].name}`,
          3000
        );
        return;
      }
    }
    if (dcount === 0) {
      setdeliverydetail(true);
    }
    setdcount((p) => p + 1);
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
          <ul
            ref={cartdelivery}
            style={{
              padding: "20px",
              width: "66%",
              left: "49px",
              top: "200px",
              display: "flex",

              flexDirection: "column",
              gap: "14px",
              borderRadius: "7px",

              position: "absolute",
              zIndex: 1,
              background: "#f0f6f6",
            }}
          >
            <p>
              <MdOutlineCancel
                onClick={() => setdeliverydetail(false)}
                style={{ cursor: "pointer" }}
              />
            </p>
            <li className={style.pdeliverydetails}>
              {" "}
              0 km - 6km free delivery for qr 40 and above
            </li>
            <li className={style.pdeliverydetails}>
              6km - 8 km free delivery for qr 60 and above
            </li>
            <li className={style.pdeliverydetails}>
              8km -10 km free delivery for 80qr and above
            </li>
            <li className={style.pdeliverydetails}>
              10 km -12km free delivery for 100qr and above
            </li>
            <li className={style.pdeliverydetails}>
              12 km - 15 km free delivery for 130qr and above
            </li>{" "}
          </ul>
        )}

        <div
          style={
            viewportWidth > 886
              ? {
                  display: "flex",
                  justifyContent: "space-around",
                }
              : {
                  padding: "20px",
                }
          }
        >
          {selected === 0 ? (
            <div className={style.cartitemmain}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    paddingRight: "10px !important",
                    paddingLeft: "10px !important",
                  }}
                  className={` ${style.cartItem}`}
                >
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
                  style={viewportWidth < 450 ? { width: "135px" } : {}}
                  onClick={() => (settakeaway(true), setdelivery(false))}
                >
                  Take away{" "}
                </button>
                <button
                  style={viewportWidth < 450 ? { width: "135px" } : {}}
                  className={`${style.pickoptionbutton} ${
                    delivery && style.selectedpickoption
                  }`}
                  onClick={() => handledelivery()}
                >
                  Delivery <FaBiking />
                </button>

                {delivery && (
                  <div>
                    <div className={style.inputcheckoutdiv}>
                      <label className={style.formlabel}>Name</label>

                      <input
                        type="text"
                        className={style.inputcheckout}
                        name="name"
                        value={deliveryform.name}
                        onChange={(e) => {
                          setdeliveryform((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                        }}
                      />
                      <label className={style.formlabel}>Mobile number</label>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            padding: "0.5rem",
                          }}
                        >
                          +974
                        </span>
                        <input
                          required
                          className={style.inputcheckout}
                          type="tel"
                          name="phone"
                          value={deliveryform.phone}
                          onChange={(e) => {
                            const inputValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            setdeliveryform((i) => ({
                              ...i,
                              phone: inputValue,
                            }));
                            deliveryformerror.phone = ""; // Clear any errors
                          }}
                          style={{
                            ...(deliveryformerror.phone
                              ? { border: "solid 1px red" }
                              : {}),
                          }}
                        />
                      </div>

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

                      <label className={style.formlabel}>Payment Type</label>

                      <select
                        className={style.inputcheckout}
                        name="paymentType"
                        style={
                          deliveryformerror.paymentType
                            ? { border: "solid 1px red" }
                            : {}
                        }
                        value={deliveryform.paymentType || ""}
                        onChange={(e) => {
                          setdeliveryform((prev) => ({
                            ...prev,
                            paymentType: e.target.value,
                          }));
                          deliveryformerror.paymentType = "";
                        }}
                      >
                        <option value="">Select Payment Type</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Online">Online</option>
                      </select>
                      {deliveryformerror.paymentType && (
                        <h6 className={style.error}>
                          {deliveryformerror.paymentType}
                        </h6>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "17px",
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
                    <label className={style.formlabel}>Name</label>

                    <input
                      type="text"
                      className={style.inputcheckout}
                      name="name"
                      value={takeawayform.name}
                      onChange={(e) => {
                        settakeawayform((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                    />

                    <label className={style.formlabel}>Mobile number</label>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          padding: "0.5rem",
                        }}
                      >
                        +974
                      </span>
                      <input
                        required
                        className={style.inputcheckout}
                        type="tel"
                        name="phone"
                        value={takeawayform.phone}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          settakeawayform((i) => ({
                            ...i,
                            phone: inputValue,
                          }));
                          takeawayformerror.phone = ""; // Clear any errors
                        }}
                        style={{
                          ...(takeawayform.phone
                            ? { border: "solid 1px red" }
                            : {}),
                        }}
                      />
                    </div>

                    {takeawayformerror.phone && (
                      <h6 className={style.error}>{takeawayformerror.phone}</h6>
                    )}

                    <label className={style.formlabel}>Pick up time</label>

                    <input
                      required
                      type="time"
                      className={style.inputcheckout}
                      name="time"
                      value={takeawayform.rawTime} // Use raw time for the input
                      style={
                        takeawayformerror.time
                          ? { border: "solid 1px red", color: "#c1532e" }
                          : { color: "#c1532e" }
                      }
                      onChange={(e) => {
                        const time = e.target.value; // Raw time in HH:mm format

                        const [hours, minutes] = time.split(":");
                        const intHours = parseInt(hours, 10);
                        const ampm = intHours >= 12 ? "PM" : "AM";
                        const adjustedHours = intHours % 12 || 12;
                        const formattedTime = `${adjustedHours}:${minutes} ${ampm}`; // Formatted time

                        takeawayformerror.time = ""; // Clear any error message

                        settakeawayform((prev) => ({
                          ...prev,
                          rawTime: time, // Store the raw time
                          time: formattedTime, // Store the formatted time
                        }));
                      }}
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
                  <p> 0 km - 6km free delivery for qr 40 and above</p>
                  <p>6km - 8 km free delivery for qr 60 and above</p>
                  <p>8km -10 km free delivery for 80qr and above</p>
                  <p>10 km -12km free delivery for 100qr and above</p>
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
