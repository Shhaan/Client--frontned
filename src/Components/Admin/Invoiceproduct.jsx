import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Modal,
  InputNumber,
  Radio,
  Button,
  Spin,
  message,
  Input,
  Menu,
  Dropdown,
} from "antd";
import { FaTimes } from "react-icons/fa";
import { axiosInstancemain, baseURL } from "../../Functions/axios";
import toast from "react-hot-toast";
import style from "../../Main.module.css";

const InvoiceProduct = ({ onclose, setSelectedProducts, selectedProducts }) => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [type, settype] = useState("shop");
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axiosInstancemain.get(
          `/products/?category=${type}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.length === 0) {
          toast("No product available. Try adding products.");
          onclose();
        }

        setProduct(data.results);
      } catch (error) {
        setProduct([]);
        console.error("Failed to fetch products:", error);
        message.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [onclose, type]);

  const handleProductClick = (product) => {
    setIsEditing(false); // Reset editing state
    setCurrentProduct(product);
    setIsModalOpen(true);

    form.setFieldsValue({
      count: 1,

      customize: "",
      price: product.price,
    });
  };

  const handleEditClick = (product) => {
    form.setFieldsValue({
      count: product.count,
      customize: product?.customize,
      price: product.price,
    });
    setIsEditing(true); // Set editing state
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAddOrUpdateProduct = (values) => {
    const { count, customize, price } = values;

    if (isEditing) {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.map((item) =>
          item.id === currentProduct.id
            ? { ...item, count, customize, price }
            : item
        )
      );
    } else {
      // Add new product
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        {
          id: Date.now(),
          product_id: currentProduct.product_id,
          name: currentProduct.name,
          image: currentProduct.image,
          price,
          count,
          quantity: currentProduct?.quantity,

          customize: customize ? customize : "",
        },
      ]);
    }

    setIsModalOpen(false);
    setCurrentProduct({});
  };

  return (
    <div className={style.invoicepopup}>
      <div className="text-end m-3">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <select
            onChange={(e) => settype(e.target.value)}
            className={style.customSelect}
          >
            <option value="shop">Shop</option>
            <option value="order">Order</option>
          </select>

          <FaTimes
            onClick={onclose}
            style={{ fontSize: "28px", cursor: "pointer", color: "red" }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Loading products...</p>
        </div>
      ) : (
        <div
          style={{
            padding: "10px",
            background: "white",
            display: "flex",
            flexDirection: "row",
            height: "100vh",
          }}
        >
          <div
            className={`col-12 col-md-8 col-xl-9 ${style.rmscroll}`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              height: "inherit",
              overflowY: "auto",
            }}
          >
            {product.map((i) => (
              <div
                key={i.product_id}
                className={style.withoutselectedProducts}
                onClick={() => handleProductClick(i)}
                style={{
                  width: "200px",
                  textAlign: "center",
                  padding: "12px",
                  cursor: "pointer",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  height: "286px",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                    marginBottom: "8px",
                    borderRadius: "6px",
                  }}
                  src={baseURL + i.image}
                  alt="product"
                />
                <h3
                  className={style.invoicepopupname}
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {i.name}
                </h3>
                <h6> {i.quantity}</h6>
              </div>
            ))}
          </div>

          {/* Selected Products */}
          <div
            className="col-12 col-md-4 col-xl-3"
            style={{
              padding: "20px",
              background: "#f8f8f8",
              borderRadius: "8px",
              height: "inherit",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Selected Products
            </h3>
            <div
              style={{ overflowY: "auto", maxHeight: "80%" }}
              className={style.rmscroll}
            >
              {selectedProducts.map((i) => (
                <div
                  style={{
                    background: "#fff",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEditClick(i)}
                >
                  <div key={i.id}>
                    {i.name} {`(${i.quantity})`} x {i.count}
                  </div>
                  <FaTimes
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProducts((prevSelectedProducts) =>
                        prevSelectedProducts.filter(
                          (product) => product.id !== i.id
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            <h6
              style={{
                color: "#333",
                textAlign: "end",
              }}
            >
              Total:
              {selectedProducts
                .reduce((sum, product) => {
                  return sum + product.count * product.price;
                }, 0)
                .toFixed(2)}
            </h6>
          </div>
        </div>
      )}

      {/* Modal for Adding or Editing Product */}
      <Modal
        title={
          isEditing
            ? `Edit ${currentProduct?.name} (${currentProduct?.quantity})`
            : `Customize ${currentProduct?.name} (${currentProduct?.quantity})`
        }
        visible={isModalOpen}
        onCancel={() => (setIsModalOpen(false), setCurrentProduct({}))}
        footer={null}
      >
        {currentProduct && (
          <Form
            layout="vertical"
            form={form}
            onFinish={handleAddOrUpdateProduct}
          >
            <Form.Item
              label="Quantity"
              name="count"
              rules={[{ required: true, message: "Please enter a count" }]}
            >
              <InputNumber type="number" min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Cutting size" name="customize">
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter a price" }]}
            >
              <InputNumber min={1} type="number" style={{ width: "100%" }} />
            </Form.Item>

            {/* <Form.Item
              label="Unit Type"
              name="unitType"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="piece">Piece</Radio>
                <Radio value="kg">Kg</Radio>
              </Radio.Group>
            </Form.Item> */}

            <Button type="primary" htmlType="submit" block>
              {isEditing ? "Update Product" : "Add to Item"}
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceProduct;
