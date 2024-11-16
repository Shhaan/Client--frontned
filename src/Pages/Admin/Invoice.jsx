import React, { useEffect, useState } from "react";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Sidebar from "../../Components/Admin/Sidebar";
import style from "../../Main.module.css";
import {
  axiosInstance,
  createAxiosInstanceWithAuth,
} from "../../Functions/axios";
import SearchComponent from "../../Components/Adminheader/SearchComponent";
import routes from "../../Functions/routes";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const [side, setside] = useState(false);
  const [product, setproduct] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const axios = createAxiosInstanceWithAuth();
        const productResponse = await axios.get(`main/invoice/`);
        setproduct(productResponse?.data?.results);

        setTotalPages(Math.ceil(productResponse.data.count / 40));
      } catch (error) {
        console.log(error);
      }
    };
    fetchproduct();
  }, []);
  const handleclick = async (page) => {
    try {
      const axios = createAxiosInstanceWithAuth();
      const productResponse = await axios.get(`main/invoice/?page=${page} `);
      setproduct(productResponse?.data?.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(productResponse.data.count / 40));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (confirmDelete) {
      try {
        const axios = createAxiosInstanceWithAuth();

        const formData = new FormData();
        formData.append("id", id);

        const response = await axios.delete("main/invoice/", {
          data: formData,
        });

        if (response.status === 204 || response.status === 200) {
          setproduct(response?.data?.results);
          setTotalPages(Math.ceil(response.data.count / 40));
          toast.success("Inoice deleted successfully!");
        }
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    } else {
      toast("Deletion cancelled");
    }
  };

  const hanldekichenpdfclick = async (id) => {
    try {
      const response = await axiosInstance.get(
        `invoice/generate-kichen-pdf/${id}/`,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        newWindow.addEventListener("load", () => {
          newWindow.print();
        });
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const hanldepdfclick = async (id) => {
    try {
      const response = await axiosInstance.get(`invoice/generate-pdf/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        newWindow.addEventListener("load", () => {
          newWindow.print();
        });
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.log(error);
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

        <SearchComponent
          setitem={setproduct}
          name={"Invoice"}
          api={"/invoice"}
          navigate={"/admin/invoice/add"}
          setcount={setTotalPages}
          setcurrent={setCurrentPage}
        />
        <div className={style.productListContainer}>
          {product &&
            product.map((item) => (
              <div key={item.id} className={`col-12 ${style.productItem}`}>
                <span className={style.productName}># {item.id}</span>

                <div className={style.iconContainer}>
                  <button
                    style={viewportWidth < 453 ? { fontSize: "10px" } : {}}
                    className={style.buttoninvoicegen}
                    onClick={() => hanldepdfclick(item.id)}
                  >
                    Generate invoice
                  </button>

                  <button
                    style={viewportWidth < 453 ? { fontSize: "10px" } : {}}
                    className={style.buttoninvoicegen}
                    onClick={() => hanldekichenpdfclick(item.id)}
                  >
                    Kichen invoice
                  </button>

                  <FaEdit
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => navigate(`/admin/invoice/edit/${item.id}`)}
                  />
                  <FaTrash
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className={style.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => handleclick(currentPage - 1)}
            className={style.paginationButton}
          >
            Previous
          </button>
          <span
            className={style.pageInfo}
          >{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => handleclick(currentPage + 1)}
            className={style.paginationButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
