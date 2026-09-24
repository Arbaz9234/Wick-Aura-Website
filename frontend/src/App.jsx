import React, { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, useNavigationType } from "react-router";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import { ToastContainer } from "react-toastify";
import favicon from "./assets/favicon.png";
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const navType = useNavigationType();
  const isLoginPage = location.pathname === "/login";
  const direction = navType === "POP" ? "backward" : "forward";

  return (
    <div
      className={isLoginPage ? "" : "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"}
    >
      <ScrollToTop />
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <SearchBar />}
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname} direction={direction}>
          <Routes location={location}>
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
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      {!isLoginPage && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        icon={<img src={favicon} alt="Wick & Aura Logo" />}
      />
    </div>
  );
}
