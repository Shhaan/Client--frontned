import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import styles from "../Main.module.css";
import toast from "react-hot-toast";
import { baseURL } from "../Functions/axios";
import { FaTimes } from "react-icons/fa";

const CustomizationPopup = ({ deal, onClose, cutomization }) => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAddToCart = (option) => {
    const customizedDeal = { ...deal, customization: option.name, count: 1 };
    dispatch(addToCart(customizedDeal));

    const updatedItem = cartItems.find(
      (item) =>
        item?.product_id === customizedDeal?.product_id &&
        item?.customization === option.name
    );

    const count = updatedItem ? updatedItem.count + 1 : 1;
    toast.success(
      `${deal.name} (${option.name}) added to cart! Count: ${count}`,
      {
        icon: "🛒",
      }
    );
    onClose();
  };

  return (
    <div className={styles.customizationOverlay}>
      <div className={styles.customizationPopup} ref={popupRef}>
        <FaTimes onClick={onClose} className={styles.closeIcon} />
        <h2>{deal.name} Cutting size</h2>
        {cutomization.map((option) => (
          <div
            key={option.customization_id}
            className={styles.customizationOption}
          >
            <img
              src={`${baseURL}${option.image}`}
              alt={option.name}
              className={styles.customizationImage}
            />
            <h3>
              {deal.name} ({option.name})
            </h3>
            <p>Price: QR{deal.price}</p>
            <p>Quantity: {deal.quantity}</p>

            <button
              onClick={() => handleAddToCart(option)}
              className={styles.customAddButton}
            >
              Add to Cart
            </button>
          </div>
        ))}
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPopup;
