import React, { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer, cssTransition } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Share2,
} from "lucide-react";
import RelatedProducts from "../components/RelatedProducts";

const COLOR_HEX = {
  Ivory: "#FFFFF0",
  White: "#FFFFFF",
  Pink: "#F8BBD0",
  "Rose Pink": "#E91E63",
  Red: "#D32F2F",
  Purple: "#B39DDB",
  Green: "#A5D6A7",
  Orange: "#FFB74D",
  Blue: "#90CAF9",
  Yellow: "#FFF176",
  Blush: "#F4C2C2",
  Caramel: "#C68E4E",
  Cream: "#FFFDD0",
};

export default function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isAdded, setIsAdded] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const Fade = cssTransition({
    enter: "fadeIn",
    exit: "fadeOut",
  });
  useEffect(() => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setProductData(product);
      setMainImage(product.image[0]);
      setSelectedColor("");
      setQuantity(1);
      setIsAdded(false);

      const img = new Image();
      img.src = product.image[0];
      if (img.complete) {
        setIsImageLoading(false);
      } else {
        setIsImageLoading(true);
      }
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addToCart(productData._id, selectedColor, quantity);
    setIsAdded(true);
    toast.success(`${productData.name} added to cart!`, {
      position: "bottom-right",
      closeButton: false,
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="w-48 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return productData ? (
    <div className="max-w-7xl mx-auto pt-6 pb-16 transition-opacity duration-500 opacity-100">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/collection" className="hover:text-black transition-colors">
          Collection
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black font-medium truncate max-w-[200px] sm:max-w-xs">
          {productData.name}
        </span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            )}
            <img
              src={mainImage}
              alt={productData.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setIsImageLoading(false)}
            />
            {/* Share & Wishlist Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {productData.image.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productData.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    mainImage === img
                      ? "border-black shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category Badge */}
          <span className="inline-flex w-fit px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wider mb-4">
            {productData.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight mb-3">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const avg =
                  productData.reviews?.length > 0
                    ? productData.reviews.reduce((a, r) => a + r.rating, 0) /
                      productData.reviews.length
                    : 0;
                return (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(avg)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-sm text-gray-500">
              {productData.reviews?.length || 0} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl sm:text-4xl font-semibold text-black">
              {currency}
              {productData.price}
            </span>
            {productData.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {currency}
                  {productData.oldPrice}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                  {Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {productData.description}
          </p>

          {/* Color Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-black">
                Choose Your Hue
              </span>
              <span className="text-xs text-gray-500">
                {selectedColor ? `Selected: ${selectedColor}` : "Required"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {productData.colors.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedColor(item)}
                  title={item}
                  className={`relative w-11 h-11 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    item === selectedColor
                      ? "border-black scale-110 shadow-lg"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full border border-black/10"
                    style={{ backgroundColor: COLOR_HEX[item] || "#D4D4D4" }}
                  />
                  {item === selectedColor && (
                    <Check className="absolute w-4 h-4 text-black bg-white rounded-full p-0.5 -top-1 -right-1 shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center h-14 rounded-xl border-2 border-gray-200">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-14 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-14 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`outline-none flex-1 h-14 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                 ${
                   isAdded
                     ? "bg-green-600 text-white !cursor-default"
                     : "bg-black text-white hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
                 }`}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl mb-6">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-600 font-medium">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-600 font-medium">
                Secure Payment
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-600 font-medium">
                7-Day Returns
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              100% Original product
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Cash on delivery available
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Easy return and exchange within 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 lg:mt-24">
        <div className="flex border-b border-gray-200">
          {[
            { id: "description", label: "Description" },
            { id: "reviews", label: `Reviews (${productData.reviews?.length || 0})` },
            { id: "shipping", label: "Shipping Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="max-w-3xl transition-opacity duration-300">
              <h3 className="text-lg font-medium text-black mb-4">
                Product Details
              </h3>
              <div className="max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {productData.description}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Handcrafted with premium soy wax and natural essential oils,
                  this candle delivers a clean, long-lasting burn. The elegant
                  design makes it a perfect centerpiece for any room or a
                  thoughtful gift for loved ones.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Material
                    </span>
                    <p className="font-medium text-black mt-1">
                      Premium Soy Wax
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Burn Time
                    </span>
                    <p className="font-medium text-black mt-1">40-50 Hours</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Fragrance
                    </span>
                    <p className="font-medium text-black mt-1">
                      {productData.subCategory}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Weight
                    </span>
                    <p className="font-medium text-black mt-1">200g</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl transition-opacity duration-300">
              {productData.reviews?.length > 0 ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-semibold text-black">
                      {(
                        productData.reviews.reduce(
                          (a, r) => a + r.rating,
                          0,
                        ) / productData.reviews.length
                      ).toFixed(1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avg =
                            productData.reviews.reduce(
                              (a, r) => a + r.rating,
                              0,
                            ) / productData.reviews.length;
                          return (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(avg)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-sm text-gray-500">
                        Based on {productData.reviews.length} reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {productData.reviews.map((review, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-black text-sm">
                                {review.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="max-w-3xl transition-opacity duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <Truck className="w-6 h-6 text-black mb-3" />
                  <h4 className="font-medium text-black mb-1">
                    Standard Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    3-5 business days • Free on orders above ₹500
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-black mb-3" />
                  <h4 className="font-medium text-black mb-1">Easy Returns</h4>
                  <p className="text-sm text-gray-600">
                    7-day return policy for unused items in original packaging
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-black mb-3" />
                  <h4 className="font-medium text-black mb-1">
                    Secure Packaging
                  </h4>
                  <p className="text-sm text-gray-600">
                    Fragile items carefully packed with bubble wrap and foam
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <Heart className="w-6 h-6 text-black mb-3" />
                  <h4 className="font-medium text-black mb-1">Gift Options</h4>
                  <p className="text-sm text-gray-600">
                    Add a personalized note and gift wrap at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Related Products */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          productId={productData._id}
        />
      </div>
      <ToastContainer
        transition={Fade}
        collapseToast={false}
        autoClose={1500}
        hideProgressBar={true}
      />
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
}
