import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import ImagePreview from "../components/ImagePreview";

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
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Images</p>
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
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative">
              {images[index] ? (
                <img
                  className="w-20 h-20 object-cover border rounded cursor-pointer"
                  src={URL.createObjectURL(images[index])}
                  alt={`Upload ${index + 1}`}
                  onClick={() =>
                    setPreviewSrc(URL.createObjectURL(images[index]))
                  }
                />
              ) : (
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <img
                    className="w-20 h-20 object-cover border rounded"
                    src={assets.upload_area}
                    alt={`Upload ${index + 1}`}
                  />
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
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none cursor-pointer"
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
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Jar Candles">Jar Candles</option>
            <option value="Bouquet Candles">Bouquet Candles</option>
            <option value="Mini & Bubble Candles">Mini & Bubble Candles</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Scent type</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Floral">Floral</option>
            <option value="Gourmet">Gourmet</option>
            <option value="Romantic">Romantic</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price (₹)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="₹"
            required
          />
        </div>

        <div>
          <p className="mb-2">Old Price (₹)</p>
          <input
            onChange={(e) => setOldPrice(e.target.value)}
            value={oldPrice}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="₹"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Colors</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((color) => (
            <div key={color} onClick={() => toggleColor(color)}>
              <p
                className={`${
                  colors.includes(color) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer rounded text-md`}
              >
                {color}
              </p>
            </div>
          ))}
        </div>
        {colors.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Selected: {colors.join(", ")}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>

      {previewSrc && (
        <ImagePreview src={previewSrc} onClose={() => setPreviewSrc(null)} />
      )}
    </form>
  );
}
