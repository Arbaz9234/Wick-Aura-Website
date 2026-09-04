import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import ImagePreview from "../components/ImagePreview";
import { Upload, ChevronDown, Loader2, Plus } from "lucide-react";

const AVAILABLE_COLORS = [
  "Ivory",
  "White",
  "Pink",
  "Rose Pink",
  "Red",
  "Purple",
  "Green",
  "Orange",
  "Blue",
  "Yellow",
  "Blush",
  "Caramel",
  "Cream",
];

export default function AddProduct({ token }) {
  const [images, setImages] = useState([]);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("Jar Candles");
  const [subCategory, setSubCategory] = useState("Floral");
  const [bestseller, setBestseller] = useState(false);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleColor = (color) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (colors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("oldPrice", oldPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("colors", JSON.stringify(colors));

      images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImages([]);
        setPrice("");
        setOldPrice("");
        setColors([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white placeholder:text-gray-400";

  const selectClass =
    "w-full appearance-none px-4 py-3 pr-10 text-sm border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white cursor-pointer font-medium text-gray-700";

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Add Product
      </h3>

      <form onSubmit={onSubmitHandler} className="space-y-6 max-w-2xl">
        {/* Image Upload */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Product Images
          </h4>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (!files.length) return;
              const updatedImages = [...images];
              const emptySlots = [0, 1, 2, 3].filter((i) => !updatedImages[i]);
              if (files.length > emptySlots.length) {
                toast.warn(
                  "Only 4 images are allowed. Extra images were discarded.",
                );
              }
              files.slice(0, emptySlots.length).forEach((file, i) => {
                updatedImages[emptySlots[i]] = file;
              });
              setImages(updatedImages);
              e.target.value = "";
            }}
          />
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative">
                {images[index] ? (
                  <img
                    className="w-24 h-24 object-cover border border-gray-200 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                    src={URL.createObjectURL(images[index])}
                    alt={`Upload ${index + 1}`}
                    onClick={() =>
                      setPreviewSrc(URL.createObjectURL(images[index]))
                    }
                  />
                ) : (
                  <label
                    htmlFor="imageUpload"
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                  </label>
                )}
                {images[index] && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...images];
                      updatedImages[index] = undefined;
                      setImages(updatedImages);
                    }}
                    className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          {images.some(Boolean) && (
            <button
              type="button"
              onClick={() => setImages([])}
              className="mt-3 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-5">
          <h4 className="text-sm font-semibold text-gray-700">
            Product Details
          </h4>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={inputClass}
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Write product description"
              required
            />
          </div>
        </div>

        {/* Category & Pricing */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-5">
          <h4 className="text-sm font-semibold text-gray-700">
            Category & Pricing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="Jar Candles">Jar Candles</option>
                  <option value="Bouquet Candles">Bouquet Candles</option>
                  <option value="Mini & Bubble Candles">
                    Mini & Bubble Candles
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Scent Type
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="Floral">Floral</option>
                  <option value="Gourmet">Gourmet</option>
                  <option value="Romantic">Romantic</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Price (₹)
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className={inputClass}
                type="number"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Old Price (₹)
              </label>
              <input
                onChange={(e) => setOldPrice(e.target.value)}
                value={oldPrice}
                className={inputClass}
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Available Colors
          </h4>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                  colors.includes(color)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          {colors.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Selected: {colors.join(", ")}
            </p>
          )}
        </div>

        {/* Bestseller & Submit */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="bestseller"
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                bestseller
                  ? "bg-black border-black"
                  : "border-gray-300 bg-white"
              }`}
            >
              {bestseller && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
              className="hidden"
            />
            <span className="text-sm text-gray-700 font-medium">
              Add to Bestseller
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>

      {previewSrc && (
        <ImagePreview src={previewSrc} onClose={() => setPreviewSrc(null)} />
      )}
    </div>
  );
}
