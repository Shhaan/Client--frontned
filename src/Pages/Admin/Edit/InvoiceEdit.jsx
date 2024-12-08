import React, { useEffect, Suspense, lazy, useState } from "react";
import Adminheader from "../../../Components/Adminheader/Adminheader";
import Sidebar from "../../../Components/Admin/Sidebar";
import style from "../../../Main.module.css";
import routes from "../../../Functions/routes";
import { Form, Input, Button, Flex, Select, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import the InvoiceProduct component
import { FaTimes } from "react-icons/fa";
import {
  axiosInstance,
  axiosInstancemain,
  baseURL,
  createAxiosInstanceWithAuth,
} from "../../../Functions/axios";
import toast from "react-hot-toast";
import axios from "axios";
const InvoiceProduct = lazy(() =>
  import("../../../Components/Admin/Invoiceproduct")
);
function Dashboard() {
  const [side, setside] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isdelivery, setisdelivery] = useState(false);
  const [form] = Form.useForm();
  const [time, settime] = useState([]);

  const navigate = useNavigate();
  const handleAddProductClick = () => {
    setIsModalVisible(true);
  };
  const { id } = useParams();
  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const { data } = await axiosInstancemain.get(`invoice/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: { id },
        });

        if (!data.error) {
          const { message } = data;
          form.setFieldsValue({
            name: message.name || "",

            time_slot: message.time_slot,
            is_delivery: message.is_delivery,
            building: message.building || "",
            Street: message.Street,
            Zone: message.Zone,
            location: message.location,
            payment: message?.payment,
          });
          setisdelivery(message?.is_delivery);
          console.log(message);

          const productsWithCustomize = message?.items.map((item) => ({
            product_id: item.product_id,
            price: item.price,
            name: item.name,
            image: baseURL + item.image,
            id: item.id,
            count: item.count,
            quantity: item.quantity,
            actualcount: item.actualcount,
            customize: item.customize,
          }));
          setSelectedProducts(productsWithCustomize);
        }
      } catch (error) {
        console.log(error);

        {
          if ((error.response.status = 404)) {
            navigate("/admin/invoice");
            toast.error("Invoice not found with given id", 3000);
          }
        }
      }
    };
    fetchinvoice();

    const fetchdata = async () => {
      try {
        const { data } = await axiosInstancemain.get("get-timeslot/");

        if (
          Array.isArray(data?.today?.timeslote) &&
          data?.today?.timeslote.length > 0
        ) {
          settime(data?.today?.timeslote);
        } else {
          settime(data?.tomorrow?.timeslote);
        }
      } catch (e) {
        console.error("Error fetching time slots:", e);
      }
    };

    fetchdata();
  }, [form, id]); // Add form and id as dependencies

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

  const onFinish = async (values) => {
    if (selectedProducts.length == 0) {
      toast.error("Must select a product");
      return;
    }

    let product = selectedProducts.map((e) => ({
      count: parseInt(e.selectedCount || e.count),
      customize: e.customize,
      product: e.product_id,
      price: parseInt(e.price),
    }));

    try {
      const axios = createAxiosInstanceWithAuth();

      const data = await axios.put("main/invoice/", {
        invoiceid: id,
        ...values,
        product,
        is_delivery: isdelivery,
      });

      if (data.status == 200) navigate("/admin/invoice");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const hanldekichenpdfclick = async (id) => {
    try {
      const response = await axiosInstance.get(
        `invoice/generatethermal-kichen-pdf/${id}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );

      if (response.status == 200) {
        try {
          const payload = {
            message: response?.data?.message, // Replace with your actual data structure
          };

          const a = await axios.post(
            "https://127.0.0.1:8000/kichen/",
            payload,
            {
              headers: {
                "Content-Type": "application/json", // Explicitly set the content type
              },
            }
          );

          if (a.status === 200) {
            toast.success("Print successfully");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Failed to print");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hanldepdfclick = async (id) => {
    try {
      const response = await axiosInstance.get(
        `invoice/generatethermal-kichen-pdf/${id}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );

      if (response.status == 200) {
        try {
          const payload = {
            message: response?.data?.message, // Replace with your actual data structure
          };

          const a = await axios.post(
            "https://127.0.0.1:8000/invoice/",
            payload,
            {
              headers: {
                "Content-Type": "application/json", // Explicitly set the content type
              },
            }
          );

          if (a.status === 200) {
            toast.success("Print successfully");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Failed to print");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const hanldepdfclick = async (id) => {
  //   try {
  //     const response = await axiosInstance.get(`invoice/generate-pdf/${id}/`, {
  //       headers: { Authorization: `Token ${localStorage.getItem("token")}` },
  //       responseType: "blob",
  //     });

  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);

  //     const newWindow = window.open(url, "_blank");
  //     if (newWindow) {
  //       newWindow.addEventListener("load", () => {
  //         newWindow.print();
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleitem = (id) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((product) => product.id !== id)
    );
  };
  return (
    <div>
      <Adminheader isAdmin={true} side={side} setside={setside} />
      <div className={style.adminflexdiv}>
        <div
          className={`col-3 col-md-2 ${
            side ? style.adminsidebar : `${style.adminsidebar} ${style.closed}`
          }`}
        >
          <Sidebar side={side} props={routes} />
        </div>

        <div
          style={isModalVisible ? { display: "none" } : {}}
          className="col-10 m-auto col-md-9 col-lg-7"
        >
          <Flex
            vertical
            style={{
              textAlign: "center",
              margin: "auto",
              marginTop: "94px",
            }}
          >
            <Form
              form={form} // Link the form instance
              style={{
                padding: "32px",
                background: "rgb(255 246 242)",
                borderRadius: "9px",
                position: "relative",
              }}
              name="normal_login"
              initialValues={{ remember: true, is_delivery: false }}
              onFinish={onFinish}
            >
              <h2 style={{ color: "Black", textAlign: "center" }}>
                Add Invoice
              </h2>

              <Form.Item
                name="name"
                label="Customer Name"
                rules={[
                  { required: true, message: "Customer Name is required" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className={style.inputofadd}
              >
                <Input style={{ height: "52px" }} placeholder="Customer name" />
              </Form.Item>

              <Form.Item
                name="time_slot"
                label="Time slot"
                rules={[{ required: true, message: "Time slot is required" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className={style.inputofadd}
              >
                <Select
                  style={{ height: "52px" }}
                  placeholder="Select a time slot"
                  options={time.map((slot) => ({
                    label: slot, // Displayed in the dropdown
                    value: slot, // Stored in the form state
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="payment"
                label="Payment"
                rules={[
                  { required: true, message: "payment slot is required" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className={style.inputofadd}
              >
                <Select
                  style={{ height: "52px" }}
                  placeholder="Select a payment type"
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "online payment", label: "Online payment" },
                    { value: "card", label: "Card" },
                    { value: "credit", label: "Credit" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="is_delivery" label="Is delivery">
                <label className={style.switch}>
                  <Input
                    type="checkbox"
                    checked={isdelivery}
                    value={isdelivery}
                    onChange={() => setisdelivery((prev) => !prev)}
                  />
                  <span className={style.slider}></span>
                </label>
              </Form.Item>

              {isdelivery && (
                <>
                  <Form.Item
                    name="building"
                    label="Building"
                    rules={[
                      { required: true, message: "Building is required" },
                    ]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={style.inputofadd}
                  >
                    <Input style={{ height: "52px" }} placeholder="Building" />
                  </Form.Item>
                  <Form.Item
                    name="location"
                    label="Location/remark"
                    rules={[
                      { required: true, message: "Location is required" },
                    ]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={style.inputofadd}
                  >
                    <Input style={{ height: "52px" }} placeholder="Location" />
                  </Form.Item>
                  <Form.Item
                    name="Street"
                    label="Street"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={style.inputofadd}
                  >
                    <Input style={{ height: "52px" }} placeholder="Street" />
                  </Form.Item>
                  <Form.Item
                    name="Zone"
                    label="Zone"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={style.inputofadd}
                  >
                    <Input style={{ height: "52px" }} placeholder="Zone" />
                  </Form.Item>{" "}
                </>
              )}

              <div
                style={{
                  display: " flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  marginBottom: "10px",
                }}
              >
                {selectedProducts.map((i) => (
                  <div
                    key={i.id}
                    className={`${style.selectedProducts} col-10 m-auto p-1 mb-2`}
                  >
                    <h3 className={style.invoicepopupname}>
                      {i.name} {`(${i?.quantity})`} x{i?.count}
                    </h3>

                    <div>
                      <FaTimes
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSelectedProducts((prevSelectedProducts) =>
                            prevSelectedProducts.filter(
                              (product) => product.id !== i.id
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="dashed"
                className="col-6"
                style={{ width: "100%", marginBottom: "20px" }}
                onClick={handleAddProductClick}
              >
                Add Product
              </Button>
              <h4 className="text-end">
                Total :
                {selectedProducts
                  .reduce((sum, product) => {
                    return sum + product.count * product.price;
                  }, 0)
                  .toFixed(2)}
              </h4>
              <Form.Item>
                <Button
                  className={style.orderNow}
                  type="primary"
                  htmlType="submit"
                  style={{ padding: "24px 25px" }}
                >
                  Submit
                </Button>
              </Form.Item>

              <button
                style={viewportWidth < 453 ? { fontSize: "10px" } : {}}
                className={style.buttoninvoicegen}
                onClick={() => hanldepdfclick(id)}
              >
                Generate invoice
              </button>

              <button
                style={viewportWidth < 453 ? { fontSize: "10px" } : {}}
                className={style.buttoninvoicegen}
                onClick={() => hanldekichenpdfclick(id)}
              >
                Kichen invoice
              </button>
            </Form>
          </Flex>
        </div>

        {isModalVisible && (
          <Suspense
            fallback={
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <Spin size="large" />
                <p>Loading Invoice Product...</p>
              </div>
            }
          >
            <InvoiceProduct
              onclose={() => setIsModalVisible(false)}
              setSelectedProducts={setSelectedProducts}
              selectedProducts={selectedProducts}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
