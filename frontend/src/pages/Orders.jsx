import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import OrdersList from "../components/OrdersList";

export default function Orders() {
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  return (
    <div
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-center text-3xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="pt-6">
        <OrdersList />
      </div>
    </div>
  );
}
