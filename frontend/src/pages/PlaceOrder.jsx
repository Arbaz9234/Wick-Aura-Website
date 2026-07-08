import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import {
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  Loader2,
  MapPin,
  Banknote,
} from "lucide-react";

export default function PlaceOrder() {
  const { products, currency, cartItems, getCartAmount, delivery_fee } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [pincodeLoading, setPincodeLoading] = useState(false);
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

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  const cartData = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      if (cartItems[itemId][size] > 0) {
        cartData.push({
          _id: itemId,
          size,
          quantity: cartItems[itemId][size],
        });
      }
    }
  }

  const subtotal = getCartAmount();
  const shipping = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
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
  }, [form.pincode]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <div className="w-1/2">
          {" "}
          {/* flex-1 */}
          <div className="text-xl sm:text-2xl mb-6">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="space-y-4">
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
        </div>

        {/* Right — Summary & Payment */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-black mb-5">
                Order Summary
              </h3>

              {cartData.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-3 mb-5 pr-3">
                  {cartData.map((item) => {
                    const product = products.find((p) => p._id === item._id);
                    if (!product) return null;
                    return (
                      <div
                        key={`${item._id}-${item.size}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {currency}
                          {product.price * item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({cartData.reduce((a, b) => a + b.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-medium text-gray-800">
                    {currency}
                    {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium text-gray-800">
                      {currency}
                      {shipping}
                    </span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5">
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Add {currency}
                      {500 - subtotal} more for free shipping
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-base font-semibold text-black">
                    <span>Total</span>
                    <span>
                      {currency}
                      {total}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Including all applicable taxes
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-black mb-5">
                Payment Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "stripe" ? "border-black bg-white shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === "stripe" ? "border-black" : "border-gray-300"}`}
                  >
                    {paymentMethod === "stripe" && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </span>
                  <img
                    src={assets.stripeLogo}
                    alt="Stripe"
                    className="h-6 object-contain"
                  />
                </label>

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

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Place Order
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Secure Payment
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Fast Delivery
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Best Price
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
