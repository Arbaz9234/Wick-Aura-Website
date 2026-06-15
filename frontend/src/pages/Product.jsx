import React from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function Product() {
  const { productId } = useParams();
  const { products } = React.useContext(ShopContext);
  const [productData, setProductData] = React.useState(false);

  const fetchProductData = () => {
    const product = products.find((p) => p._id === productId);
    setProductData(product);
    console.log(product);
  };

  React.useEffect(() => {
    fetchProductData();
  }, [productId, products]);
  return <div>Product</div>;
}
