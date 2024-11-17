import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Categoryfetch from "../../Components/Categoryfetch/Categoryfetch";
import Footer from "../../Components/Footer/Footer";
import { axiosInstancemain } from "../../Functions/axios";
import style from "../../Main.module.css";
import { baseURL } from "../../Functions/axios";
import AddToCartButton from "../../Components/Addcart";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { message } from "antd";
import { FaSearch } from "react-icons/fa";

export const Categoryproduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [nextpage, setNextPage] = useState(null);
  const [category, setCategory] = useState({});
  const variable = [{ All: 1 }, { Kg: 2 }, { Piece: 3 }];
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPiece, setIsPiece] = useState(null);

  const observerRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsPiece(null);

      try {
        setLoading(true);
        setProduct([]);

        const productResponse = await axiosInstancemain.get(
          `/products/?category=${id}`
        );
        setProduct(productResponse?.data?.results || []);
        setNextPage(productResponse?.data?.next);

        const categoryResponse = await axiosInstancemain.get(
          `/category/?name=${id}`
        );
        setCategory(categoryResponse?.data?.message);
      } catch (error) {
        handleError(error, navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate]);

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

  // Fetch additional products when next page is available
  const loadMoreProducts = async () => {
    if (!nextpage || loading) return;

    setLoading(true);

    try {
      const response = await axiosInstancemain.get(nextpage);
      setProduct((prevProducts) => [...prevProducts, ...response.data.results]);
      setNextPage(response.data.next);
    } catch (error) {
      toast.error(error?.response?.data || "Error loading more products", 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filtering based on piece type
  const handleClick = async (objValue) => {
    setSelected(Object.values(objValue)[0]);
    const key = Object.keys(objValue)[0];

    const isPieceValue = key === "Piece" ? true : key === "Kg" ? false : null;
    setIsPiece(isPieceValue);

    fetchProducts(isPieceValue);
  };

  // Fetch filtered products based on isPiece and searchValue
  const fetchProducts = async (isPieceFilter) => {
    try {
      setLoading(true);
      const url = `/products/?category=${id}&search=${searchValue}${
        isPieceFilter !== null ? `&is_piece=${isPieceFilter}` : ""
      }`;
      const productResponse = await axiosInstancemain.get(url);
      setProduct(productResponse?.data?.results || []);
      setNextPage(productResponse?.data?.next);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Search products based on searchValue and isPiece
  useEffect(() => {
    fetchProducts(isPiece);
  }, [id, searchValue, isPiece]);

  // IntersectionObserver to load more products
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextpage && !searchValue) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [nextpage, loading, searchValue]);

  // Error handling
  const handleError = (error, navigateFn) => {
    if (error?.response?.status === 404) {
      setProduct([]);
      if (navigateFn) navigateFn("/");
    } else {
      toast.error(error?.response?.data?.message || "An error occurred", 2000);
    }
  };

  return (
    <React.Fragment>
      <div className={style.mainheader}>
        <div style={{ position: "fixed", zIndex: 2, width: "100%" }}>
          <Adminheader isAdmin={false} />
          <Categoryfetch />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "22px",
          alignItems: "center",
        }}
      >
        <form>
          <input
            className={style.searchinp}
            type={"search"}
            style={
              viewportWidth < 600
                ? { width: "95px", height: "30px", marginLeft: "4px" }
                : {}
            }
            value={searchValue}
            onChange={(e) => setSearchParams({ search: e.target.value })}
          />
          <FaSearch />
        </form>

        {category?.as_piece && (
          <div style={{ textAlign: "end" }}>
            {variable.map((obj, index) => (
              <button
                key={index}
                style={
                  viewportWidth < 600
                    ? { width: "50px", fontSize: "8px", padding: "4px 14px" }
                    : {}
                }
                className={`${style.filtercatbutton} ms-2 ${
                  selected === Object.values(obj)[0]
                    ? style.filtercatbuttonselect
                    : ""
                }`}
                onClick={() => handleClick(obj)}
              >
                {Object.keys(obj)[0]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "23px",
          marginLeft: "25px",
          gap: "50px",
          marginBottom: "150px",
        }}
      >
        {product.length >= 1 ? (
          product.map((product) => (
            <div
              style={
                viewportWidth < 450
                  ? { position: "relative", margin: "auto" }
                  : { position: "relative" }
              }
              key={product.product_id}
            >
              <div className={style.card}>
                <img
                  src={baseURL + product.image}
                  alt="img"
                  className={style.cardimg}
                />
                <p style={{ margin: 0 }} className={style.heading}>
                  {product.name}
                </p>
                {product.original_price ? (
                  <div style={{ padding: 0 }} className={style.dealPrice}>
                    <span className={style.originalPrice}>
                      QR{product.original_price}
                    </span>
                    <span className={style.discountedPrice}>
                      QR{product.price}
                    </span>
                  </div>
                ) : (
                  <div style={{ padding: 0 }} className={style.dealPrice}>
                    <span className={style.discountedPrice}>
                      QR{product.price}
                    </span>
                  </div>
                )}
                <p style={{ margin: 0 }} className={style.quantitycatepro}>
                  {product.quantity}
                </p>
                <div className={style.discripcatepro}>
                  <p
                    className={style.discripcateprop}
                    style={{ overflow: "auto", margin: 0 }}
                  >
                    {product.discription}
                  </p>
                </div>
              </div>
              <div style={{ position: "absolute", top: "9px", right: "9px" }}>
                <AddToCartButton deal={product} />
              </div>
            </div>
          ))
        ) : (
          <div style={{ margin: "auto" }}>No Item Found </div>
        )}
      </div>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PuffLoader size={60} color="#b64d11" />
        </div>
      )}
      <div ref={observerRef} style={{ height: "1px" }}></div>
      <Footer />
    </React.Fragment>
  );
};
