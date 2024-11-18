import React, { useEffect, useState, useRef, useContext } from "react";
import Adminheader from "../../Components/Adminheader/Adminheader";
import Footer from "../../Components/Footer/Footer";
import Categoryfetch from "../../Components/Categoryfetch/Categoryfetch";
import Carousel from "../../Components/Home/Carousel";
import style from "../../Main.module.css";
import { axiosInstancemain, baseURL } from "../../Functions/axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();
  const categoryRowRef = useRef(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstancemain.get("/category/");
        setCategories(response?.data?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchCategories();
    const fetchDeals = async () => {
      try {
        const response = await axiosInstancemain.get("/deal/");
        setDeals(response?.data?.message);
        console.log(response?.data?.message, "deals");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchDeals();
    const fetchBestSellers = async () => {
      try {
        const response = await axiosInstancemain.get("/best-seller/");
        setBestSellers(response?.data?.message);
        console.log(response?.data?.message, "bestSellers");
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <>
      <div className={style.mainheader}>
        <div style={{ position: "fixed", zIndex: 2, width: "100%" }}>
          <Adminheader isAdmin={false} />
          <Categoryfetch />
        </div>
      </div>
      <div>
        <Carousel />
        <div className={style.shopbycategory}>
          <h1 className={style.shopbycategoryheading}>Shop by Category</h1>
          <div className={style.categoryNavigation}>
            <div className={style.categoryRow} ref={categoryRowRef}>
              {categories.map((category, index) => (
                <div
                  onClick={() => navigate(`/category/${category.name}`)}
                  key={category.id}
                  className={style.categoryCard}
                  style={{ "--animation-order": index, cursor: "pointer" }}
                >
                  <img
                    className={style.categoryImage}
                    src={`${baseURL}${category.image}`}
                    alt={category.name}
                  />
                  <h2 className={style.categoryName}>{category.name}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>

        {deals.length > 0 && (
          <div
            className={style.shopbycategory}
            style={{ marginBottom: "10px", background: "rgb(218 241 241)" }}
          >
            <h1 className={style.shopbycategoryheading}>Deals of the Day</h1>
            <div className={style.categoryNavigation}>
              <div className={style.categoryRow} ref={categoryRowRef}>
                {deals.map((deal, index) => (
                  <div
                    key={deal.id}
                    className={style.dealCard}
                    style={{
                      "--animation-order": index,
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${deal.code}`)}
                  >
                    <img
                      className={style.categoryImage}
                      src={`${baseURL}${deal.image}`}
                      alt={deal.name}
                    />
                    <h2 className={style.DealNameday}>{deal.name}</h2>
                    <div className={style.dealPrice}>
                      {deal.original_price ? (
                        <div className={style.dealPrice}>
                          <span className={style.originalPrice}>
                            QR{deal.original_price}
                          </span>
                          <span className={style.discountedPrice}>
                            QR{deal.price}
                          </span>
                        </div>
                      ) : (
                        <div className={style.dealPrice}>
                          <span className={style.discountedPrice}>
                            QR{deal.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {bestSellers.length > 0 && (
          <div
            className={style.shopbycategory}
            style={{ marginBottom: "100px" }}
          >
            <h1 className={style.shopbycategoryheading}>Best seller</h1>
            <div className={style.categoryNavigation}>
              <div
                className={style.categoryRow}
                style={{ flexWrap: "wrap" }}
                ref={categoryRowRef}
              >
                {bestSellers.map((deal, index) => (
                  <div
                    key={deal.id}
                    className={` ${style.categorybestsellerImage} ${style.dealCard}`}
                    style={{
                      "--animation-order": index,
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${deal.code}`)}
                  >
                    <img
                      className={`${style.categoryImage} `}
                      src={`${baseURL}${deal.image}`}
                      alt={deal.name}
                    />
                    <h2 className={style.DealNameday}>{deal.name}</h2>

                    {deal.original_price ? (
                      <div className={style.dealPrice}>
                        <span className={style.originalPrice}>
                          QR{deal.original_price}
                        </span>
                        <span className={style.discountedPrice}>
                          QR{deal.price}
                        </span>
                      </div>
                    ) : (
                      <div className={style.dealPrice}>
                        <span className={style.discountedPrice}>
                          QR{deal.price}
                        </span>
                      </div>
                    )}

                    <p className={style.bestpriceseller}>{deal.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
