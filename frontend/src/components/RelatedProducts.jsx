import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

export default function RelatedProducts({ category, subCategory, productId }) {
  const { products } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = React.useState([]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.category === category &&
        product.subCategory === subCategory &&
        product._id !== productId,
    );
    setRelatedProducts(filtered.slice(0, 5));
  }, [category, subCategory, productId, products]);

  if (!relatedProducts.length) return null;

  return (
    <div className="my-20">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-6">
        {relatedProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}
