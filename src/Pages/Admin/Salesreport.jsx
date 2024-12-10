import React, { useEffect, useState } from "react";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Sidebar from "../../Components/Admin/Sidebar";
import style from "../../Main.module.css";
import routes from "../../Functions/routes";
import { axiosInstance } from "../../Functions/axios";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [side, setside] = useState(false);
  const [orders, setorders] = useState([]);
  useEffect(() => {
    const salesreport = async () => {
      try {
        const response = await axiosInstance.get(
          `invoice/generatethermal-kichen-pdf/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    salesreport();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generating report for:", { startDate, endDate });
  };

  const handleDownloadReport = () => {
    console.log("Downloading sales report...");
    // Add logic for generating and downloading the report
  };

  return (
    <div>
      <Adminheader isAdmin={true} side={side} setside={setside} />
      <div className={style.adminflexdiv}>
        <div
          className={`col-4 col-md-2 ${
            side ? style.adminsidebar : `${style.adminsidebar} ${style.closed}`
          }`}
        >
          <Sidebar side={side} props={routes} />
        </div>
      </div>

      <div className="sales-report-container" style={{ height: "100vh" }}>
        <h1 className="text-center">Sales Report</h1>
        <form onSubmit={handleGenerateReport} style={{ marginTop: "100px" }}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="start_date" className="form-label">
                Start Date:
              </label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="end_date" className="form-label">
                End Date:
              </label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mb-3" style={{ marginTop: "32px" }}>
              <button type="submit" className="btn btn-primary">
                Generate Report
              </button>
            </div>
            {/* <div className="col-md-4 mb-3" style={{ marginTop: "32px" }}>
              <button
                onClick={handleDownloadReport}
                className="btn text-white btn-success mt-3"
              >
                Download Sales Report
              </button>
            </div> */}
          </div>
        </form>

        <div className="table-responsive " style={{ marginTop: "50px" }}>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Order Date</th>

                <th>Sales by item</th>
                <th>Quantity</th>
                <th>Net profit </th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderNumber}</td>
                  <td>{order.firstName}</td>
                  <td>{order.number}</td>
                  <td>{order.productName}</td>
                  <td>{order.itemTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <style jsx>{`
          .sales-report-container {
            padding: 20px;
            background: #f8f8f8;
            border-radius: 8px;
          }
          td {
            font-size: 10px;
          }
          th {
            font-size: 15px !important;
          }
          .btn {
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SalesReport;
