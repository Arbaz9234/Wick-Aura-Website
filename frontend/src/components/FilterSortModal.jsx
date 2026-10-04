import React, { useState, useEffect, useRef } from "react";
import Portal from "./Portal";
import { X, ChevronRight, ChevronLeft, ChevronDown, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Jar Candles", "Bouquet Candles", "Mini & Bubble Candles"];
const SCENT_TYPES = ["Floral", "Gourmet", "Romantic"];
const SORT_OPTIONS = ["Relevance", "Low to High", "High to Low"];

export default function FilterSortModal({
  selectedCategories,
  selectedTypes,
  sort,
  onApply,
  onClear,
  productCount,
}) {
  const [isOpen, setIsOpen] = useState(false);
  // "main" | "categories" | "scentTypes"
  const [view, setView] = useState("main");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Local state so changes only commit on Apply
  const [localCategories, setLocalCategories] = useState(selectedCategories);
  const [localTypes, setLocalTypes] = useState(selectedTypes);
  const [localSort, setLocalSort] = useState(sort);

  const sortDropdownRef = useRef(null);
  const sortOptionsRef = useRef(null);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategories(selectedCategories);
      setLocalTypes(selectedTypes);
      setLocalSort(sort);
      setView("main");
      setShowSortDropdown(false);
    }
  }, [isOpen, selectedCategories, selectedTypes, sort]);

  // Close sort dropdown on outside tap & scroll into view
  useEffect(() => {
    if (!showSortDropdown) return;

    // Scroll the options into view after render
    requestAnimationFrame(() => {
      sortOptionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const handler = (e) => {
      if (!sortDropdownRef.current?.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [showSortDropdown]);

  const toggleCategory = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

  const toggleType = (value) => {
    setLocalTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

  const handleApply = () => {
    onApply(localCategories, localTypes, localSort);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalCategories([]);
    setLocalTypes([]);
    setLocalSort("Relevance");
  };

  const hasActiveFilters =
    localCategories.length > 0 ||
    localTypes.length > 0 ||
    localSort !== "Relevance";

  const activeFilterCount =
    selectedCategories.length + selectedTypes.length + (sort !== "Relevance" ? 1 : 0);

  return (
    <>
      {/* Trigger Button — mobile/tablet only */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 sm:border sm:border-gray-300 sm:rounded-lg sm:px-4 sm:py-2.5 text-sm font-medium text-gray-700 sm:hover:border-gray-400 transition-colors sm:bg-white"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter and Sort
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-black text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {view !== "main" && (
                    <button
                      onClick={() => setView("main")}
                      className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 !mb-0">
                    {view === "main" && "Filter and Sort"}
                    {view === "categories" && "Categories"}
                    {view === "scentTypes" && "Scent Type"}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {view === "main" && (
                    <span className="text-sm text-gray-400">
                      {productCount} {productCount === 1 ? "product" : "products"}
                    </span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                {/* Main View */}
                {view === "main" && (
                  <div className="space-y-1">
                    {/* Categories row */}
                    <button
                      onClick={() => setView("categories")}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <div>
                        <span className="text-[15px] font-medium text-gray-800">
                          Categories
                        </span>
                        {localCategories.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {localCategories.join(", ")}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>

                    <div className="border-t border-gray-100" />

                    {/* Scent Type row */}
                    <button
                      onClick={() => setView("scentTypes")}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <div>
                        <span className="text-[15px] font-medium text-gray-800">
                          Scent Type
                        </span>
                        {localTypes.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {localTypes.join(", ")}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>

                    <div className="border-t border-gray-100" />

                    {/* Sort by row */}
                    <div ref={sortDropdownRef} className="py-4">
                      <button
                        onClick={() => setShowSortDropdown((prev) => !prev)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-[15px] font-medium text-gray-800">
                          Sort by
                        </span>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <span>{localSort}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              showSortDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Sort options — inline, right-aligned under the selected value */}
                      {showSortDropdown && (
                        <div
                          ref={sortOptionsRef}
                          className="flex flex-col items-end mt-2"
                        >
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setLocalSort(option);
                                setShowSortDropdown(false);
                              }}
                              className={`py-1.5 text-sm text-right transition-colors ${
                                localSort === option
                                  ? "font-medium text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories Drill-down */}
                {view === "categories" && (
                  <div className="space-y-1 py-1">
                    {CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 py-3.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={localCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer"
                        />
                        <span className="text-[15px] text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Scent Type Drill-down */}
                {view === "scentTypes" && (
                  <div className="space-y-1 py-1">
                    {SCENT_TYPES.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 py-3.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={localTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer"
                        />
                        <span className="text-[15px] text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <button
                  onClick={handleClear}
                  className={`text-sm font-medium underline underline-offset-2 transition-colors ${
                    hasActiveFilters
                      ? "text-gray-700 hover:text-black"
                      : "text-gray-300 pointer-events-none"
                  }`}
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  className="bg-[#c9a96e] hover:bg-[#b8954f] text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
