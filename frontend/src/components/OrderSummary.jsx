import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Truck, ShieldCheck, Tag } from "lucide-react";

export default function OrderSummary({ showItems, children }) {
  const { products, currency, getCartAmount, getCartData, delivery_fee } =
    useContext(ShopContext);

  const cartData = getCartData();
  const subtotal = getCartAmount();
  const shipping = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal + shipping;
  const itemCount = cartData.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-black mb-5">Order Summary</h3>

      {showItems && cartData.length > 0 && (
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

      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
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

      {children}

      <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-200">
        <div className="group flex flex-col items-center gap-1">
          <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-all ease-in" />
          <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-800 transition-all ease-in">
            Secure Payment
          </span>
        </div>
        <div className="group flex flex-col items-center gap-1">
          <Truck className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-all ease-in-out" />
          <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-800 transition-all ease-in">
            Fast Delivery
          </span>
        </div>
        <div className="group flex flex-col items-center gap-1">
          <Tag className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-all ease-in-out" />
          <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-800 transition-all ease-in">
            Best Price
          </span>
        </div>
      </div>
    </div>
  );
}
