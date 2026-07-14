import React from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function ProductItem({ id, image, name, price, oldPrice }) {
  const { currency } = React.useContext(ShopContext);
  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden">
        <img
          src={image[0]}
          alt="product"
          className="hover:scale-110 transition ease-in-out"
        />
      </div>

      <p className="pt-3 pb-1 text-sm md:text-base"> {name} </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
        {oldPrice && (
          <>
            <p className="text-xs text-gray-400 line-through">
              {currency}
              {oldPrice}
            </p>
            <span className="text-xs text-green-600 font-medium">
              {Math.round(((oldPrice - price) / oldPrice) * 100)}% off
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
