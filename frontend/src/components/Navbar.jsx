import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MenuIcon, Search, ShoppingCart, User, X } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
export default function Navbar() {
  const { setShowSearch, getCartCount } = React.useContext(ShopContext);
  const [showSearch, setShowSearchLocal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setShowSearchLocal(true);
    } else {
      setShowSearchLocal(false);
    }
  }, [location]);
  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <NavLink to="/">
        <img src={assets.logoHome} alt="Wick & Aura Logo" className="w-36" />
      </NavLink>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6 cursor-pointer">
        <Search
          onClick={() => setShowSearch(true)}
          className={`${showSearch ? "opacity-100" : "opacity-0"}`}
        />
        <div className="group relative">
          <NavLink to="/login">
            <User />
          </NavLink>
        </div>
        <Link to="/cart" className="relative">
          <ShoppingCart />
          {getCartCount() > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] min-w-4 h-4 px-1 flex items-center justify-center bg-black text-white rounded-full text-[8px]">
              {getCartCount()}
            </p>
          )}
        </Link>
        {isMenuOpen ? (
          <X
            className="cursor-pointer sm:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        ) : (
          <MenuIcon
            className="cursor-pointer sm:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        )}
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-center gap-4 sm:hidden">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
          </NavLink>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTION</p>
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
          </NavLink>
        </div>
      )}
    </div>
  );
}
