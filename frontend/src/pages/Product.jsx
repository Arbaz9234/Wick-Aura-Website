import React from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function Product() {
  const { productId } = useParams();
  const { products } = React.useContext(ShopContext);
  const [productData, setProductData] = React.useState(false);
  const [image, setImage] = React.useState("");

  const fetchProductData = async () => {
    products.map((product) => {
      if (product._id === productId) {
        setProductData(product);
        setImage(product.image[0]);
        return null;
      }
    });
  };

  React.useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 border-gray-300 pt-10 transition-opacity duration-300 ease-in opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((img, index) => (
              <img
                src={img}
                key={index}
                alt={productData.name}
                className="w-[24%] sm:w-full cursor-pointer  flex-shrink-0 sm:mb-3"
              />
            ))}
          </div>
        </div>
        {/* <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{productData.name}</h1>
          <p className="text-xl text-gray-700 mt-4">
            ${productData.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mt-4">{productData.description}</p>
        </div> */}
      </div>
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
}
