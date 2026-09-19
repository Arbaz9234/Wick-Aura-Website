import React, { useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

export default function BestSeller() {
  const { products, productsLoading } = React.useContext(ShopContext);
  const [bestSeller, setBestSeller] = React.useState([]);

  useEffect(() => {
    // Filter items if bestseller = true
    const filtered = products.filter((item) => item.bestseller);
    setBestSeller(filtered.slice(0, 5));
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          The fragrances our customers keep coming back for... tried, loved, and
          lit again and again."
        </p>
      </div>
      {/* Rendering Products */}
      {productsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square" />
              <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-12">
          {bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              oldPrice={item.oldPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}
