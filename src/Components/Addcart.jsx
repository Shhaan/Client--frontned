import React, { useState } from "react";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import styles from "../Main.module.css";
import CustomizationPopup from "./CustomizationPopup";
import { axiosInstancemain } from "../Functions/axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

const AddToCartButton = ({ deal }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [cutomization, setCutomization] = useState([]);

  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);

  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      const customization = await axiosInstancemain.get(
        `/customize/${deal?.product_id}/`
      );

      if (customization?.data?.message?.length > 0) {
        setCutomization(customization?.data?.message);
        setShowPopup(true);
      } else {
        dispatch(addToCart({ ...deal, count: 1 }));
        const updatedItem = cartItems.find(
          (item) => item.product_id === deal.product_id
        );
        const count = updatedItem ? updatedItem.count + 1 : 1;
        toast.success(`${deal.name} added to cart! Count: ${count}`, {
          duration: 2000,
          icon: "🛒",
        });
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("some error in the server");
      }
    }
  };

  return (
    <div className={styles.addToCartContainer}>
      <button onClick={handleClick} className={styles.addToCartButton}>
        <FaPlus className={styles.addToCartIcon} />
        <FaShoppingCart className={styles.addToCartIcon} />
      </button>
      {showPopup && (
        <div className={styles.popupWrapper}>
          <CustomizationPopup
            deal={deal}
            cutomization={cutomization}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
