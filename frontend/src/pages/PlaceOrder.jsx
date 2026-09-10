import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import OrderSummary from "../components/OrderSummary";
import { ArrowRight, Loader2, MapPin, Banknote, Plus } from "lucide-react";

export default function PlaceOrder() {
  const {
    getCartData,
    placeOrder,
    token,
    navigate,
    buyNowItem,
    setBuyNowItem,
    addresses,
  } = useContext(ShopContext);
  const [pageReady, setPageReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const cartData = getCartData();
  const isBuyNow = !!buyNowItem;

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isBuyNow && cartData.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }
  }, [token, cartData.length, isBuyNow]);

  // Clear buy-now item if user navigates away
  useEffect(() => {
    return () => setBuyNowItem(null);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Pre-select default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      selectAddress(defaultAddr._id);
    }
  }, [addresses]);

  const isNewAddress = selectedAddressId === "new";

  const selectAddress = (id) => {
    setSelectedAddressId(id);
    if (id === "new") {
      setForm({
        firstName: "",
        lastName: "",
        mobile: "",
        address1: "",
        address2: "",
        landmark: "",
        pincode: "",
        city: "",
        state: "",
      });
    } else {
      const addr = addresses.find((a) => a._id === id);
      if (addr) {
        setForm({
          firstName: addr.firstName || "",
          lastName: addr.lastName || "",
          mobile: addr.mobile || "",
          address1: addr.address1 || "",
          address2: addr.address2 || "",
          landmark: addr.landmark || "",
          pincode: addr.pincode || "",
          city: addr.city || "",
          state: addr.state || "",
        });
      }
    }
  };

  // PinCode fetch details (skip when a saved address is selected)
  useEffect(() => {
    if (!isNewAddress && addresses.length > 0) return;
    const pincode = form.pincode.trim();
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return;

    const controller = new AbortController();
    setPincodeLoading(true);

    fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            city: po.District || po.Division || "",
            state: po.State || "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setPincodeLoading(false));

    return () => controller.abort();
  }, [form.pincode, isNewAddress, addresses.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNewAddress && addresses.length > 0) {
      const required = [
        "firstName",
        "lastName",
        "mobile",
        "address1",
        "pincode",
        "city",
        "state",
      ];
      const missing = required.filter((f) => !form[f]?.trim());
      if (missing.length > 0) return;
    }
    await placeOrder(form, paymentMethod, selectedAddressId);
  };

  const inputClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white placeholder:text-gray-400";

  return (
    <form
      onSubmit={handleSubmit}
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 justify-between">
        {/* Left — Delivery Information */}
        <div className="w-full lg:w-1/2">
          <div className="text-xl sm:text-2xl mb-6">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>

          {/* Saved Address Picker */}
          {addresses.length > 0 && (
            <div className="mb-6 space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  onClick={() => selectAddress(addr._id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-black bg-white shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span
                    className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedAddressId === addr._id ? "border-black" : "border-gray-300"}`}
                  >
                    {selectedAddressId === addr._id && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {addr.firstName} {addr.lastName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {[addr.address1, addr.address2, addr.landmark]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="text-xs text-gray-400">{addr.mobile}</p>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() =>
                  selectAddress(
                    isNewAddress
                      ? (addresses.find((a) => a.isDefault) || addresses[0])
                          ?._id || "new"
                      : "new",
                  )
                }
                className={`flex items-center gap-3 w-full p-4 rounded-xl border transition-all ${isNewAddress ? "border-black bg-white shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
              >
                <Plus
                  className={`w-4 h-4 transition-transform ${isNewAddress ? "rotate-45 text-gray-800" : "text-gray-600"}`}
                />
                <span
                  className={`text-sm font-medium ${isNewAddress ? "text-gray-800" : "text-gray-600"}`}
                >
                  Add New Address
                </span>
              </button>
            </div>
          )}

          {(isNewAddress || addresses.length === 0) && (
            <div className="space-y-4 mt-6">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First name"
                  required
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last name"
                  required
                />
              </div>

              <input
                name="address1"
                value={form.address1}
                onChange={handleChange}
                className={inputClass}
                placeholder="Address line 1"
                required
              />

              <input
                name="address2"
                value={form.address2}
                onChange={handleChange}
                className={inputClass}
                placeholder="Address line 2"
              />

              <div className="flex gap-4">
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Landmark (optional)"
                />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setForm((prev) => ({ ...prev, mobile: val }));
                  }}
                  className={inputClass}
                  placeholder="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="relative w-full">
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setForm((prev) => ({
                        ...prev,
                        pincode: val,
                        ...(val.length < 6 ? { city: "", state: "" } : {}),
                      }));
                    }}
                    className={inputClass}
                    placeholder="Pincode"
                    inputMode="numeric"
                    required
                  />
                  {pincodeLoading && (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="City"
                  required
                />
              </div>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
                placeholder="State"
                required
              />

              {form.city && form.state && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Delivering to {form.city}, {form.state}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — Summary & Payment */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <OrderSummary
              showItems
              buyNowItem={buyNowItem}
              setBuyNowItem={setBuyNowItem}
            />

            {/* Payment Method */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-black mb-5">
                Payment Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "razorpay" ? "border-black bg-white shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === "razorpay" ? "border-black" : "border-gray-300"}`}
                  >
                    {paymentMethod === "razorpay" && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </span>
                  <img
                    src={assets.razorpayLogo}
                    alt="Razorpay"
                    className="h-6 object-contain"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "cod" ? "border-black bg-white shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === "cod" ? "border-black" : "border-gray-300"}`}
                  >
                    {paymentMethod === "cod" && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </span>
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Place Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
