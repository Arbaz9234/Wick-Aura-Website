import React, { useContext } from "react";
import { Link } from "react-router";
import { ShopContext } from "../context/ShopContext";
import { Heart } from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ToastContainer } from "react-toastify";

export default function Wishlist() {
  const { products, wishlist, removeFromWishlist, token, navigate } =
    useContext(ShopContext);

  if (!token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Heart className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">
          Please login to view your wishlist
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  return (
    <div className="pt-10 border-t border-gray-300">
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"WISHLIST"} />
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <Heart className="w-16 h-16 text-gray-300" />
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          <Link
            to="/collection"
            className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {wishlistProducts.map((item) => (
            <div key={item._id} className="relative group">
              <ProductItem
                name={item.name}
                price={item.price}
                oldPrice={item.oldPrice}
                id={item._id}
                image={item.image}
              />
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg z-10"
                title="Remove from wishlist"
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
