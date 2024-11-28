import React, { Suspense, lazy, useEffect, useState } from "react";
import Adminheader from "../../../Components/Adminheader/Adminheader";
import Sidebar from "../../../Components/Admin/Sidebar";
import style from "../../../Main.module.css";
import routes from "../../../Functions/routes";
import { Form, Input, Button, message, Flex, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import { FaTimes } from "react-icons/fa";
import {
  axiosInstancemain,
  createAxiosInstanceWithAuth,
} from "../../../Functions/axios";
import toast from "react-hot-toast";

const InvoiceProduct = lazy(() =>
  import("../../../Components/Admin/Invoiceproduct")
);
function Dashboard() {
  const [side, setside] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isdelivery, setisdelivery] = useState(false);
  const [time, settime] = useState([]);
  const navigate = useNavigate();
  const handleAddProductClick = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
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
  }, []);
  const onFinish = async (values) => {
    if (selectedProducts.length == 0) {
      toast.error("Product must be selected");
      return;
    }
    let product = selectedProducts.map((e) => ({
      count: e.count,
      customize: e.customize,
      product: e.product_id,
      price: parseInt(e.price),
    }));

    try {
      const axios = createAxiosInstanceWithAuth();
      const data = await axios.post("main/invoice/", {
        ...values,
        product,
        is_delivery: isdelivery,
      });

      if (data.status == 201)
        navigate(`/admin/invoice/edit/${data?.data?.message?.id}`, {
          replace: true,
        });
    } catch (error) {
      console.log(error);
    }
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
                rules={[
                  { required: true, message: "Customer Name is required" },
                ]}
                label="Customer Name"
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

              <Form.Item name="is_delivery" label="Is delivery">
                <label className={style.switch}>
                  <Input
                    type="checkbox"
                    checked={isdelivery}
                    value={isdelivery || false}
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
                    label="Location /remark "
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
                    rules={[{ required: true, message: "Street is required" }]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={style.inputofadd}
                  >
                    <Input style={{ height: "52px" }} placeholder="Street" />
                  </Form.Item>
                  <Form.Item
                    name="Zone"
                    label="Zone"
                    rules={[{ required: true, message: "Zone is required" }]}
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
                  flexDirection: "column",

                  marginBottom: "10px",
                }}
              >
                {selectedProducts.map((i) => (
                  <div
                    key={i.id}
                    className={`${style.selectedProducts} col-10 m-auto p-1 mb-2`}
                  >
                    <h3 className={style.invoicepopupname}>
                      {i.name} {`(${i.quantity})`} x{i.count}
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
