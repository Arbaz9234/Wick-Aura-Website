import React, { useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { RefreshCw } from "lucide-react";

export default function BestSeller() {
  const { products, productsLoading, productsError, getProductsData } =
    React.useContext(ShopContext);
  const [bestSeller, setBestSeller] = React.useState([]);

  useEffect(() => {
    // Filter items if bestseller = true
    const filtered = products.filter((item) => item.bestseller);
    setBestSeller(filtered.slice(0, 5));
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-left sm:text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-full sm:w-3/4 m-0 sm:m-auto text-sm sm:text-sm md:text-base text-gray-600">
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
      ) : bestSeller.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p className="text-sm">
            {productsError
              ? "Couldn't load products. Please check your connection."
              : "No bestsellers available right now."}
          </p>
          {productsError && (
            <button
              onClick={getProductsData}
              className="mt-3 flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
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
