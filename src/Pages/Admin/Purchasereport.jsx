import React, { useEffect, useRef, useState } from "react";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Sidebar from "../../Components/Admin/Sidebar";
import style from "../../Main.module.css";
import routes from "../../Functions/routes";
import { axiosInstance } from "../../Functions/axios";
import toast from "react-hot-toast";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ordertype, setordertype] = useState("");
  const [paymenttype, setpayment] = useState("");
  const [nextpage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setorders] = useState([]);
  const [side, setside] = useState(false);

  const observerRef = useRef(null);

  // Initial Data Fetch
  useEffect(() => {
    const salesreport = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("invoice/sales-report/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token") || ""}`,
          },
        });
        if (response.status === 200) {
          setorders(response.data?.results);
          setNextPage(response?.data?.next);
        }
      } catch (error) {
        toast.error("Failed to fetch sales data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    salesreport();
  }, []);

  // Infinite Scrolling
  const loadMoreProducts = async () => {
    if (!nextpage || loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(nextpage);
      if (response.status === 200) {
        setorders((prevOrders) => [...prevOrders, ...response.data.results]);
        setNextPage(response.data.next);
      }
    } catch (error) {
      toast.error("Error loading more data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextpage) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [nextpage]);

  // Generate Report with Filters
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.get("invoice/sales-report/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token") || ""}`,
        },
        params: { startDate, endDate, ordertype, paymenttype },
      });
      if (response.status === 200) {
        setorders(response.data?.results);
        setNextPage(response?.data?.next);
        toast.success("Report generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate report.");
      console.error(error);
    } finally {
      setLoading(false);
    }
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

      <div className="sales-report-container">
        <h1 className="text-center">Sales Report</h1>
        <form style={{ marginTop: "100px" }}>
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-3 mb-3">
              <label htmlFor="start_date" className="form-label">
                Start Date:
              </label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="end_date" className="form-label">
                End Date:
              </label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-2 mb-3">
              <label htmlFor="payment" className="form-label">
                Payment type:
              </label>
              <select
                onChange={(e) => setpayment(e.target.value)}
                className="form-control"
                name="payment"
                id=""
              >
                <option value="">All payment type</option>

                <option value="cash">Cash</option>
                <option value="online payment">Online payment</option>
                <option value="card ">Card</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div className="col-md-2 mb-3">
              <label htmlFor="payment" className="form-label">
                Order type:
              </label>
              <select
                onChange={(e) => setordertype(e.target.value)}
                className="form-control"
                name="payment"
                id=""
              >
                <option value="">All order type</option>

                <option value="delivery">Delivery</option>
                <option value="Take_away">Take away</option>
              </select>
            </div>

            <div className="col-md-2 mb-3" style={{ marginTop: "32px" }}>
              <button
                onClick={(e) => handleGenerateReport(e)}
                className="btn btn-primary"
              >
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

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No sales data available.</p>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order Date</th>
                  <th>Sales Item</th>
                  <th>Quantity</th>
                  <th>Net Profit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.created_at}</td>
                    <td>{order.product_name}</td>
                    <td>{order.count}</td>
                    <td>{order.price}</td>
                    <td>{order.sub_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div ref={observerRef} style={{ height: "1px" }}></div>
      </div>
    </div>
  );
};

export default SalesReport;
