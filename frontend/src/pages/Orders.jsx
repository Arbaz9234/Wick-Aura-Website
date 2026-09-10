import React, { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import OrdersList from "../components/OrdersList";
import { ShopContext } from "../context/ShopContext";

export default function Orders() {
  const { token, getUserOrders, navigate } = useContext(ShopContext);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    getUserOrders(token);
  }, [token]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  const handleRefresh = async () => {
    if (token) return await getUserOrders(token);
  };

  return (
    <div
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-center text-3xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="pt-6">
        <OrdersList onRefresh={handleRefresh} />
      </div>
    </div>
  );
}
