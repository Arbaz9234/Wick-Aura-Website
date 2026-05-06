import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { Search, User } from "lucide-react";
export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <a href="/">
        <img src={assets.logoHome} alt="Wick & Aura Logo" className="w-36" />
      </a>
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
        <Search />
        <div className="group relative">
          <User />
        </div>
      </div>
    </div>
  );
}
