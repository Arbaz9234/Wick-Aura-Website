import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { Package, ChevronDown } from "lucide-react";

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600">Orders from customers will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">All Orders</h3>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
          >
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gray-50 text-sm">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-gray-500">
                <span>
                  Order placed:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDate(order.date)}
                  </span>
                </span>
                <span>
                  Total:{" "}
                  <span className="font-medium text-gray-700">
                    {currency}
                    {order.amount}
                  </span>
                </span>
                <span>
                  Payment:{" "}
                  <span
                    className={`font-medium ${order.payment ? "text-green-600" : "text-amber-600"}`}
                  >
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </span>
                <span>
                  Method:{" "}
                  <span className="font-medium text-gray-700">
                    {order.paymentMethod}
                  </span>
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6 px-5 py-5">
              {/* Order Items */}
              <div className="flex-1 min-w-0 space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Items ({order.items.length})
                </h4>
                {order.items.map((item, idx) => (
                  <div key={`${item._id}-${item.color}-${idx}`} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
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

              {/* Customer Info & Status */}
              <div className="lg:w-80 flex-shrink-0 space-y-4">
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-gray-600">{order.address.mobile}</p>
                    <p className="text-gray-600">{order.address.address1}</p>
                    {order.address.address2 && (
                      <p className="text-gray-600">{order.address.address2}</p>
                    )}
                    {order.address.landmark && (
                      <p className="text-gray-600">{order.address.landmark}</p>
                    )}
                    <p className="text-gray-600">
                      {order.address.city}, {order.address.state} -{" "}
                      {order.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Status Control */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Status
                  </h4>
                  <div className="relative">
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className="w-full appearance-none px-4 py-3 pr-10 text-sm border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white cursor-pointer font-medium text-gray-700"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        order.status === "Delivered"
                          ? "bg-green-500"
                          : "bg-amber-500 animate-pulse"
                      }`}
                    />
                    <span className="text-xs text-gray-600">
                      Current: {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
