import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function Cart() {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPageReady(true);
      });
    });
  }, []);

  const subtotal = getCartAmount();
  const shipping = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal + shipping;

  if (cartData.length === 0) {
    return (
      <div
        className={`min-h-[60vh] flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-xl"
        >
          Continue Shopping
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
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="pt-5 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-0 divide-y divide-gray-200">
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex gap-4 sm:gap-6 py-6 first:pt-0"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item._id}`}
                    className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-50"
                  >
                    <img
                      src={productData.image[0]}
                      alt={productData.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link
                        to={`/product/${item._id}`}
                        className="text-sm sm:text-base font-medium text-gray-800 hover:text-black transition-colors line-clamp-2"
                      >
                        {productData.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm sm:text-base font-semibold text-black">
                          {currency}
                          {productData.price}
                        </span>
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                          {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center h-9 rounded-lg border border-gray-200">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              Math.min(10, item.quantity + 1),
                            )
                          }
                          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-black hidden sm:block">
                          {currency}
                          {productData.price * item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, 0)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-10">
            <h3 className="text-lg font-semibold text-black mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm">
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

              {shipping === 0 && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2.5">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>You've unlocked free shipping!</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
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

            <button
              onClick={() => navigate("/place-order")}
              className="w-full mt-6 bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-200">
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
    </div>
  );
}
