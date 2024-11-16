import React, { useEffect, useState } from "react";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Sidebar from "../../Components/Admin/Sidebar";
import style from "../../Main.module.css";
import {
  axiosInstancemain,
  createAxiosInstanceWithAuth,
} from "../../Functions/axios";
import SearchComponent from "../../Components/Adminheader/SearchComponent";
import routes from "../../Functions/routes";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, Form } from "antd";
function Dashboard() {
  const [side, setside] = useState(false);
  const [product, setproduct] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const productResponse = await axiosInstancemain.get(`/products/ `, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setproduct(productResponse?.data?.results);
        console.log(productResponse?.data);

        setTotalPages(Math.ceil(productResponse.data.count / 40));
      } catch (error) {
        console.log(error);
      }
    };
    fetchproduct();
  }, []);
  const handleclick = async (page) => {
    try {
      const productResponse = await axiosInstancemain.get(
        `/products?page=${page}`,
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );

      setproduct(productResponse?.data?.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(productResponse.data.count / 40));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id, available) => {
    const confirmDelete = window.confirm(
      `Do you want  to Change the product availablity to ${!available}?`
    );

    if (confirmDelete) {
      try {
        const axios = createAxiosInstanceWithAuth();

        const formData = new FormData();
        formData.append("id", id);

        const response = await axios.delete("main/products/", {
          data: formData,
        });

        if (response.status === 204 || response.status === 200) {
          setproduct(response?.data?.results);
          console.log(response);

          setTotalPages(Math.ceil(response.data.count / 40));
          toast.success(`Product availablity Changed  to ${!available}`, 2000);
        }
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.error + "  Check the availablity of category"
            : error.message
        );
        return;
      }
    } else {
      toast("Deletion cancelled");
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
          name={"Product"}
          api={"/products"}
          navigate={"/admin/product/add"}
          setcount={setTotalPages}
          setcurrent={setCurrentPage}
        />
        <div className={style.productListContainer}>
          {product.map((item) => (
            <div key={item.id} className={`col-12 ${style.productItem}`}>
              <span className={style.productName}>
                {item.name} ({item.code})
              </span>
              <div className={style.iconContainer}>
                <FaEdit
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/admin/product/edit/${item.product_id}`)
                  }
                />

                <Form.Item name="is_available" style={{ marginBottom: 0 }}>
                  <label className={style.switch}>
                    <Input
                      type="checkbox"
                      checked={item?.is_available}
                      value={item?.is_available}
                      onClick={() =>
                        handleDelete(item.product_id, item.is_available)
                      }
                    />
                    <span className={style.slider}></span>
                  </label>
                </Form.Item>
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
