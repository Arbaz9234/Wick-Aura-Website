import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { toast, ToastContainer, cssTransition, Bounce } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
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
  Zap,
  Mail,
  Link as LinkIcon,
  X,
  ImagePlus,
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
  const {
    products,
    currency,
    addToCart,
    setBuyNowItem,
    navigate,
    token,
    backendUrl,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAdded, setIsAdded] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const shareRef = useRef(null);
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

  // Close share menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  const productUrl = productData
    ? `${window.location.origin}/product/${productData._id}`
    : "";

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      `Check out ${productData.name} – Wick & Aura`,
    );
    const body = encodeURIComponent(
      `Hey, I found this amazing candle!\n\n${productData.name}\n${currency}${productData.price}\n\n${productUrl}`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    setShowShareMenu(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${productData.name} on Wick & Aura store\n${productUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      toast("Link copied!", {
        position: "bottom-right",
        closeButton: false,
      });
    });
    setShowShareMenu(false);
  };

  const TEXT_TRUNCATE_LENGTH = 100;

  const getRelativeTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - reviewImages.length;
    const newFiles = files.slice(0, remaining);
    setReviewImages((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReviewImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReviewImage = (index) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
    setReviewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!reviewRating) return toast.error("Please select a rating");
    if (!reviewTitle.trim()) return toast.error("Please add a title");
    if (!reviewText.trim()) return toast.error("Please write a review");

    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append("productId", productData._id);
      formData.append("rating", reviewRating);
      formData.append("title", reviewTitle);
      formData.append("text", reviewText);
      reviewImages.forEach((file) => formData.append("images", file));

      const response = await axios.post(
        backendUrl + "/api/product/review",
        formData,
        { headers: { token } },
      );
      if (response.data.success) {
        toast("Review submitted!");
        setProductData(response.data.product);
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewTitle("");
        setReviewText("");
        setReviewImages([]);
        setReviewImagePreviews([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
    setSubmittingReview(false);
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Please select a color", {
        transition: Bounce,
      });
      return;
    }
    addToCart(productData._id, selectedColor, quantity);
    setIsAdded(true);
    toast(`${productData.name} added to cart!`, {
      position: "bottom-right",
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    setBuyNowItem({
      _id: productData._id,
      color: selectedColor,
      quantity,
    });
    navigate("/place-order");
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
              {token && (
                <button
                  onClick={() => {
                    if (isInWishlist(productData._id)) {
                      removeFromWishlist(productData._id);
                    } else {
                      addToWishlist(productData._id);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist(productData._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }`}
                  />
                </button>
              )}
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in">
                    {/* Caret */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />
                    {/* Close */}
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Share via
                    </p>
                    <button
                      onClick={handleShareEmail}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Email</span>
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="text-sm text-gray-700">WhatsApp</span>
                    </button>
                    <div className="mx-3 my-1 border-t border-gray-100" />
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
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
                  {Math.round(
                    ((productData.oldPrice - productData.price) /
                      productData.oldPrice) *
                      100,
                  )}
                  % OFF
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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full h-14 rounded-xl font-semibold text-sm uppercase tracking-wider border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] mb-6"
          >
            <Zap className="w-5 h-5" />
            Buy Now
          </button>

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
            {
              id: "reviews",
              label: `Reviews (${productData.reviews?.length || 0})`,
            },
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
              {token && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mb-6 px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Add a Review
                </button>
              )}

              {productData.reviews?.length > 0 ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-semibold text-black">
                      {(
                        productData.reviews.reduce((a, r) => a + r.rating, 0) /
                        productData.reviews.length
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
                                {getRelativeTime(review.createdAt)}
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
                        {review.title && (
                          <p className="font-medium text-black text-sm mb-1">
                            {review.title}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.text.length > TEXT_TRUNCATE_LENGTH &&
                          !expandedReviews[index] ? (
                            <>
                              {review.text.slice(0, TEXT_TRUNCATE_LENGTH)}...
                              <button
                                onClick={() =>
                                  setExpandedReviews((prev) => ({
                                    ...prev,
                                    [index]: true,
                                  }))
                                }
                                className="text-black font-medium ml-1 cursor-pointer"
                              >
                                read more
                              </button>
                            </>
                          ) : (
                            review.text
                          )}
                        </p>
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(img, "_blank")}
                              />
                            ))}
                          </div>
                        )}
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
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          />
          <div
            className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl"
            style={{ animation: "scaleIn 0.2s ease-out" }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-black mb-6">
              Write a Review
            </h3>

            {/* Star rating */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      star <= reviewRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 hover:text-amber-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Title your review
              </label>
              <input
                maxLength={50}
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="Summarize your experience"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {reviewTitle.length}/50
              </p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Your review
              </label>
              <textarea
                maxLength={200}
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="What did you like or dislike?"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {reviewText.length}/200
              </p>
            </div>

            {/* Image/video upload */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Share a photo or video
              </label>
              <div className="flex gap-2 flex-wrap">
                {reviewImagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeReviewImage(i)}
                      className="absolute top-0 right-0 bg-black/60 text-white rounded-bl-lg p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {reviewImages.length < 5 && (
                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <ImagePlus className="w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleReviewImageUpload}
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="w-full py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <ToastContainer
        transition={Fade}
        collapseToast={false}
        autoClose={1500}
      />
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
}
