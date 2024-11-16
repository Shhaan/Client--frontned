import React, { useState, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Notfound from "./Notfound";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Cutomer/Home";
import Cart from "./Pages/Cutomer/Cart";
import { Categoryproduct } from "./Pages/Cutomer/Categoryproduct";
import Dashboard from "./Pages/Admin/Dashboard";
import AdminWrapper from "./Functions/Adminwrapper";
import Login from "./Pages/Admin/Login";
import Category from "./Pages/Admin/Category";
import Products from "./Pages/Admin/Products";
import Dealoftheday from "./Pages/Admin/dealoftheday";
import ProductAdd from "./Pages/Admin/Productadd";
import Categoryadd from "./Pages/Admin/Add/categoryadd";
import Dealofdayadd from "./Pages/Admin/Add/dealofdayadd";
import Dealofdayedit from "./Pages/Admin/Edit/dealofdayedit";
import Categoryedit from "./Pages/Admin/Edit/Categoryedit";
import Productedit from "./Pages/Admin/Edit/Productedit";
import Invoice from "./Pages/Admin/Invoice";
import InvoiceAdd from "./Pages/Admin/Add/InoviceAdd";
import InvoiceEdit from "./Pages/Admin/Edit/InvoiceEdit";

export const CartContext = createContext();

const App = () => {
  const [isCart, setIsCart] = useState(false);

  return (
    <CartContext.Provider value={{ isCart, setIsCart }}>
      <Toaster position="top-left" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Categoryproduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/admin">
          <Route path="login" element={<Login />} />
          <Route
            path=""
            element={
              <AdminWrapper>
                <Dashboard />
              </AdminWrapper>
            }
          />
          <Route
            path="product"
            element={
              <AdminWrapper>
                <Products />
              </AdminWrapper>
            }
          />
          <Route
            path="product/add"
            element={
              <AdminWrapper>
                <ProductAdd />
              </AdminWrapper>
            }
          />
          <Route
            path="product/edit/:id"
            element={
              <AdminWrapper>
                <Productedit />
              </AdminWrapper>
            }
          />
          <Route
            path="deal-of-day/add"
            element={
              <AdminWrapper>
                <Dealofdayadd />
              </AdminWrapper>
            }
          />{" "}
          <Route
            path="deal-of-day/edit/:id"
            element={
              <AdminWrapper>
                <Dealofdayedit />
              </AdminWrapper>
            }
          />{" "}
          <Route
            path="category/add"
            element={
              <AdminWrapper>
                <Categoryadd />
              </AdminWrapper>
            }
          />
          <Route
            path="category/edit/:id"
            element={
              <AdminWrapper>
                <Categoryedit />
              </AdminWrapper>
            }
          />
          <Route
            path="category"
            element={
              <AdminWrapper>
                <Category />
              </AdminWrapper>
            }
          />
          <Route
            path="deal-of-day"
            element={
              <AdminWrapper>
                <Dealoftheday />
              </AdminWrapper>
            }
          />
          <Route
            path="invoice"
            element={
              <AdminWrapper>
                <Invoice />
              </AdminWrapper>
            }
          />
          <Route
            path="invoice/add"
            element={
              <AdminWrapper>
                <InvoiceAdd />
              </AdminWrapper>
            }
          />
          <Route
            path="invoice/edit/:id"
            element={
              <AdminWrapper>
                <InvoiceEdit />
              </AdminWrapper>
            }
          />
        </Route>
      </Routes>
    </CartContext.Provider>
  );
};

export default App;
