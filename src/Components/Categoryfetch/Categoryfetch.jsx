import React, { useState, useEffect, useContext } from "react";
import { axiosInstancemain } from "../../Functions/axios";
import style from "../../Main.module.css";
import { baseURL } from "../../Functions/axios";
import toast from "react-hot-toast";
import { CartContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
const Categoryfetch = () => {
  const [categories, setCategories] = useState([]);
  const { isCart, setIsCart } = useContext(CartContext);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstancemain.get("/category/");
        setCategories(response?.data?.message);
        console.log(response?.data?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div onClick={() => setIsCart(false)} className={style.categorylistmaindiv}>
      {categories.map((category, index) => (
        <React.Fragment key={category._id}>
          <div
            onClick={() => navigate(`/category/${category.name}`)}
            className={style.categoryfetchsubdiv}
            style={
              category.name === id
                ? { backgroundColor: " rgb(56 162 188)", borderRadius: "10px" }
                : {}
            }
          >
            <div className={style.categoryfetchname}>{category.name}</div>
            <div>
              <img
                className={style.categorylistimg}
                src={`${baseURL}${category.image}`}
                alt={category.name}
              />
            </div>
          </div>
          {index < categories.length - 1 && (
            <hr
              style={{
                border: "2px solid #ffffff",
                width: "2px",
                margin: "15px",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Categoryfetch;
