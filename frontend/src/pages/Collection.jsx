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
                id="men"
                className="w-3"
                type="checkbox"
                value="Men"
                onChange={() => toggleFilter("Men", setSelectedCategories)}
              />
              <label htmlFor="men" className="text-gray-600 cursor-pointer">
                Men
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="women"
                className="w-3"
                type="checkbox"
                value="Women"
                onChange={() => toggleFilter("Women", setSelectedCategories)}
              />
              <label htmlFor="women" className="text-gray-600 cursor-pointer">
                Women
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="kids"
                className="w-3"
                type="checkbox"
                value="Kids"
                onChange={() => toggleFilter("Kids", setSelectedCategories)}
              />
              <label htmlFor="kids" className="text-gray-600 cursor-pointer">
                Kids
              </label>
            </p>
          </div>
        </div>
        {/* Sub Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                id="topwear"
                className="w-3"
                type="checkbox"
                value="Topwear"
                onChange={() => toggleFilter("Topwear", setSelectedTypes)}
              />
              <label htmlFor="topwear" className="text-gray-600 cursor-pointer">
                Topwear
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="bottomwear"
                className="w-3"
                type="checkbox"
                value="Bottomwear"
                onChange={() => toggleFilter("Bottomwear", setSelectedTypes)}
              />
              <label
                htmlFor="bottomwear"
                className="text-gray-600 cursor-pointer"
              >
                Bottomwear
              </label>
            </p>

            <p className="flex gap-2">
              <input
                id="winterwear"
                className="w-3"
                type="checkbox"
                value="Winterwear"
                onChange={() => toggleFilter("Winterwear", setSelectedTypes)}
              />
              <label
                htmlFor="winterwear"
                className="text-gray-600 cursor-pointer"
              >
                Winterwear
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
              onClick={() => setIsOpen(!isOpen)}
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
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
