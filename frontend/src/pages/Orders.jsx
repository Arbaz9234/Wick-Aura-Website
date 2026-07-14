import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

export default function Orders() {
  const { orders, currency } = useContext(ShopContext);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  if (orders.length === 0) {
    return (
      <div
        className={`min-h-[60vh] flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600">
            When you place an order, it will appear here.
          </p>
        </div>
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-xl"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-center text-3xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="pt-6 space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-2xl overflow-hidden"
          >
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gray-50 text-sm">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-gray-500">
                <span>
                  Order placed:{" "}
                  <span className="font-medium text-gray-700">
                    {order.date}
                  </span>
                </span>
                <span>
                  Total:{" "}
                  <span className="font-medium text-gray-700">
                    {currency}
                    {order.total}
                  </span>
                </span>
              </div>
              <span className="text-xs text-gray-500">#{order.id}</span>
            </div>

            {/* Order Body — Items left, Status + Track right */}
            <div className="flex items-start justify-between gap-4 px-5 py-5">
              <div className="flex-1 min-w-0 space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={`${item._id}-${item.color}-${idx}`}
                    className="flex gap-4"
                  >
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-col justify-center min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-sm font-medium text-gray-800 hover:text-black transition-colors truncate"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm font-semibold text-black">
                          {currency}
                          {item.price * item.quantity}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                          {item.color}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex md:w-1/2 items-center justify-between gap-4 sm:gap-[100px] flex-shrink-0 sm:pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {order.status}
                  </span>
                </div>
                <button
                  onClick={() => {}}
                  className="px-5 py-2.5 text-xs font-medium border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
