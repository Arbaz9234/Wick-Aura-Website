import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { ChevronDown } from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

export default function Collection() {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const openTimeout = useRef(null);
  const closeTimeout = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState("Relevance");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleFilter = (value, setState) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const handleSort = (value) => {
    setSort(value);
    setIsOpen(false);

    let sortedProducts = [...filteredProducts];
    if (value === "Low to High") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === "High to Low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
  };

  const applyFilters = () => {
    let updatedProducts = [...products];

    if (showSearch && search) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }
    if (selectedTypes.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedTypes.includes(product.subCategory),
      );
    }
    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedTypes, search, showSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-300">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          FILTERS
          <ChevronDown
            className={`w-4 h-4 transition-transform sm:hidden ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                id="jar"
                className="w-3"
                type="checkbox"
                value="Jar Candles"
                onChange={() =>
                  toggleFilter("Jar Candles", setSelectedCategories)
                }
              />
              <label htmlFor="jar" className="text-gray-600 cursor-pointer">
                Jar Candles
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="bouquet"
                className="w-3"
                type="checkbox"
                value="Bouquet Candles"
                onChange={() =>
                  toggleFilter("Bouquet Candles", setSelectedCategories)
                }
              />
              <label htmlFor="bouquet" className="text-gray-600 cursor-pointer">
                Bouquet Candles
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="mini"
                className="w-3"
                type="checkbox"
                value="Mini & Bubble Candles"
                onChange={() =>
                  toggleFilter("Mini & Bubble Candles", setSelectedCategories)
                }
              />
              <label htmlFor="mini" className="text-gray-600 cursor-pointer">
                Mini & Bubble Candles
              </label>
            </p>
          </div>
        </div>
        {/* Sub Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">SCENT TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                id="floral"
                className="w-3"
                type="checkbox"
                value="Floral"
                onChange={() => toggleFilter("Floral", setSelectedTypes)}
              />
              <label htmlFor="floral" className="text-gray-600 cursor-pointer">
                Floral
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="gourmet"
                className="w-3"
                type="checkbox"
                value="Gourmet"
                onChange={() => toggleFilter("Gourmet", setSelectedTypes)}
              />
              <label htmlFor="gourmet" className="text-gray-600 cursor-pointer">
                Gourmet
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="romantic"
                className="w-3"
                type="checkbox"
                value="Romantic"
                onChange={() => toggleFilter("Romantic", setSelectedTypes)}
              />
              <label
                htmlFor="romantic"
                className="text-gray-600 cursor-pointer"
              >
                Romantic
              </label>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"OUR"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <div
            className="sort-dropdown relative"
            onMouseEnter={() => {
              clearTimeout(closeTimeout.current);

              openTimeout.current = setTimeout(() => {
                setIsOpen(true);
              }, 300);
            }}
            onMouseLeave={() => {
              clearTimeout(openTimeout.current);

              closeTimeout.current = setTimeout(() => {
                setIsOpen(false);
              }, 300);
            }}
          >
            <button
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                }
              }}
              className="flex items-center justify-between min-w-[180px] border border-gray-300 rounded-md px-4 py-2 text-sm bg-white hover:border-gray-400 transition-colors"
            >
              <span>Sort By: {sort}</span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-full min-w-[180px] bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ${
                isOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              {["Relevance", "Low to High", "High to Low"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSort(option)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
          ${sort === option ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              price={item.price}
              oldPrice={item.oldPrice}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
