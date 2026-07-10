import React, { useEffect } from "react";
import Home from "./pages/home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Collection from "./pages/collection";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import CandleShop from "./pages/CandleShop";
import SearchBar from "./components/SearchBar";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/login";

  return (
    <div className={isLoginPage ? "" : "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"}>
      <ScrollToTop />
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <SearchBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wick-and-aura" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/insta" element={<CandleShop />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}
