import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "../context/ShopContext";
import OrdersList from "../components/OrdersList";
import Title from "../components/Title";
import {
  ShoppingBag,
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function Account() {
  const { token, setToken, orders, getUserOrders, backendUrl } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [pageReady, setPageReady] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Pre-fill profile fields from most recent order's address
  useEffect(() => {
    if (orders.length > 0) {
      const latestOrder = orders[0]; // orders are sorted newest first
      const addr = latestOrder.address;
      setProfile((prev) => ({
        ...prev,
        phone: addr.mobile || prev.phone,
        address:
          [addr.address1, addr.address2, addr.landmark]
            .filter(Boolean)
            .join(", ") || prev.address,
        city: addr.city || prev.city,
        pincode: addr.pincode || prev.pincode,
      }));
    }
  }, [orders]);

  // Fetch orders when switching to orders tab
  useEffect(() => {
    if (activeTab === "orders" && token) {
      getUserOrders(token);
    }
  }, [activeTab]);

  const handleRefreshOrders = async () => {
    if (token) return await getUserOrders(token);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "Orders", icon: ShoppingBag },
  ];

  const inputClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none transition-colors placeholder:text-gray-400 focus:border-black";

  const hasOrderData = orders.length > 0;

  const getProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        console.log(response.data);
        setProfile((prev) => ({
          ...prev,
          name: response.data?.user?.name || prev.name,
          email: response.data?.user?.email || prev.email,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getProfile();
  }, [token]);
  return (
    <div
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-center text-3xl">
        <Title text1={"MY"} text2={"ACCOUNT"} />
      </div>

      <div className="flex flex-col sm:flex-row gap-8 pt-8">
        {/* Sidebar */}
        <div className="sm:w-56 flex-shrink-0">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <nav className="flex flex-row sm:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 w-full px-5 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <ChevronRight
                    className={`w-4 h-4 ml-auto hidden sm:block ${activeTab === tab.key ? "text-white" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </nav>

            <div className="border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">
                Personal Information
              </h4>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} pl-11 ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} pl-11 ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} pl-11 ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} pl-11 ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1.5">
                      City
                    </label>
                    <input
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="City"
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-sm text-gray-600 mb-1.5">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={profile.pincode}
                      onChange={handleChange}
                      disabled={hasOrderData}
                      className={`${inputClass} ${hasOrderData ? "bg-gray-50 text-gray-700 cursor-not-allowed" : "bg-white"}`}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <button
                  disabled={hasOrderData}
                  className={`px-8 py-3.5 text-sm font-medium uppercase tracking-wider rounded-xl mt-2 transition-colors ${
                    hasOrderData
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">
                Your Orders
              </h4>
              <OrdersList onRefresh={handleRefreshOrders} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
