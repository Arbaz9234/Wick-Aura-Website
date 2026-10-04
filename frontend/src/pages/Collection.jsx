import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { ChevronDown } from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import FilterSortModal from "../components/FilterSortModal";

export default function Collection() {
  const { products, search, showSearch, productsLoading } =
    useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const openTimeout = useRef(null);
  const closeTimeout = useRef(null);
  const sortDropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState("Relevance");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const closeSortDropdown = () => {
      clearTimeout(openTimeout.current);
      clearTimeout(closeTimeout.current);
      setIsOpen(false);
    };
    const closeOnOutsideTap = (event) => {
      if (!sortDropdownRef.current?.contains(event.target)) {
        closeSortDropdown();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideTap);
    window.addEventListener("scroll", closeSortDropdown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideTap);
      window.removeEventListener("scroll", closeSortDropdown);
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      clearTimeout(openTimeout.current);
      clearTimeout(closeTimeout.current);
    },
    [],
  );

  const toggleFilter = (value, setState) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const sortProducts = (productList, sortValue) => {
    const sorted = [...productList];
    if (sortValue === "Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const handleSort = (value) => {
    setSort(value);
    setIsOpen(false);
    setFilteredProducts(sortProducts(filteredProducts, value));
  };

  const applyMobileFilters = (categories, types, sortValue) => {
    setSelectedCategories(categories);
    setSelectedTypes(types);
    setSort(sortValue);
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
    setFilteredProducts(sortProducts(updatedProducts, sort));
  };

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategories, selectedTypes, search, showSearch, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-1 lg:gap-10 pt-10 border-t border-gray-300">
      {/* Filter Options — desktop only */}
      <div className="min-w-50 lg:min-w-60 hidden lg:block">
        <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>
        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-6">
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
        <div className="border border-gray-300 pl-5 py-3 my-5">
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
        {/* Title — full width on small screens */}
        <div className="mb-2 sm:mb-0 sm:hidden">
          <Title text1={"OUR"} text2={"COLLECTIONS"} />
        </div>

        <div className="flex justify-between items-center mb-4">
          {/* Title — inline on sm+ */}
          <div className="hidden sm:block">
            <Title text1={"OUR"} text2={"COLLECTIONS"} />
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
            {/* Mobile Filter & Sort Modal */}
            <FilterSortModal
              selectedCategories={selectedCategories}
              selectedTypes={selectedTypes}
              sort={sort}
              onApply={applyMobileFilters}
              onClear={() => {
                setSelectedCategories([]);
                setSelectedTypes([]);
                setSort("Relevance");
              }}
              productCount={filteredProducts.length}
            />
            {/* Product count — mobile only, right-aligned */}
            <span className="text-sm text-gray-500 sm:hidden">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
            {/* Desktop Product Sort */}
            <div
              ref={sortDropdownRef}
              className="sort-dropdown relative hidden lg:block"
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
        </div>

        {/* Map Products */}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square" />
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
