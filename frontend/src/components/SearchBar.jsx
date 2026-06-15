import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
      setSearch("");
    }
  }, [location]);
  return showSearch && visible ? (
    <div className="border-t bg-gray-50 border-gray-300 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products..."
          className="flex-1 w-full p-2 outline-none bg-inherit text-sm  focus:outline-none "
        />
        <Search className="text-gray-500 cursor-pointer" />
      </div>
      <X
        onClick={() => setShowSearch(false)}
        className="inline cursor-pointer text-gray-500"
      />
    </div>
  ) : null;
}
