import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import OrderSummary from "../components/OrderSummary";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function Cart() {
  const { products, currency, updateQuantity, getCartData, navigate } =
    useContext(ShopContext);
  const [pageReady, setPageReady] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const cartData = getCartData();

  const handleQuantityChange = (itemId, size, newQty, productName) => {
    if (newQty <= 0) {
      setPendingDelete({ itemId, size, productName });
    } else {
      updateQuantity(itemId, size, newQty);
    }
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      updateQuantity(pendingDelete.itemId, pendingDelete.size, 0);
      setPendingDelete(null);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

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
            {cartData.map((item) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex gap-4 sm:gap-6 py-6 first:pt-0"
                >
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

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center h-9 rounded-lg border border-gray-200">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.size,
                              item.quantity - 1,
                              productData.name,
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
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.size,
                              0,
                              productData.name,
                            )
                          }
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
          <div className="lg:sticky lg:top-24">
            <OrderSummary>
              <button
                onClick={() => navigate("/place-order")}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </OrderSummary>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove Item?
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  <span className="font-medium text-gray-700">
                    {pendingDelete.productName}
                  </span>{" "}
                  ({pendingDelete.size}) will be removed from your cart.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Keep Item
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
