import React, { useEffect, useRef, useState } from "react";
import { Form, message, Spin } from "antd";
import style from "../../Main.module.css";
import { FaTimes } from "react-icons/fa";
import { axiosInstancemain } from "../../Functions/axios";
import toast from "react-hot-toast";

const InvoiceProduct = ({ onclose, setSelectedProducts }) => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axiosInstancemain.get("product-customize/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });

        if (data.length === 0) {
          toast("No product available. Try adding products.");
          onclose();
        }
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        message.error("Failed to load products.");
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchCategory();
  }, [onclose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onclose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onclose]);

  const handleClick = (product_id, name, image, count, price) => {
    setSelectedProducts((prevSelectedProducts) => {
      const exists = prevSelectedProducts.some(
        (product) =>
          product.product_id === product_id && product.customize === ""
      );

      if (exists) {
        toast.error("This product already exists!");
        return prevSelectedProducts;
      }

      return [
        ...prevSelectedProducts,
        {
          id: Date.now(),
          product_id,
          actualcount: count,
          count: 1,
          name,
          image,
          price,
          customize: "",
        },
      ];
    });
  };

  return (
    <div ref={modalRef} className={style.invoicepopup}>
      <div className="text-end">
        <FaTimes onClick={onclose} />
      </div>

      {loading ? ( // Show loading spinner while data is being fetched
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Loading products...</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            paddingBottom: "16px",
            overflowX: "scroll",
            gap: "23px",
          }}
        >
          {product.map((i) => (
            <div
              key={i.product_id} // Add a unique key for better rendering
              className={style.withoutselectedProducts}
              onClick={() =>
                handleClick(i.product_id, i.name, i.image, i.count, i.price)
              }
              style={{ width: "25%", padding: "12px", cursor: "pointer" }}
            >
              <img
                style={{ width: "60%", height: "60%" }}
                src={i.image}
                alt="product"
              />
              <div>
                <h3 className={style.invoicepopupname}>{i.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceProduct;
