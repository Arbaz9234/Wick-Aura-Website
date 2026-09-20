import React, { useEffect, useState, useRef, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import {
  MenuIcon,
  Search,
  ShoppingCart,
  User,
  X,
  Heart,
  MapPin,
  ChevronDown,
  Package,
  LogOut,
  Bookmark,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const {
    setShowSearch,
    getCartCount,
    wishlist,
    token,
    setToken,
    addresses,
    navigate,
    userName,
    selectedAddressId,
    setSelectedAddressId,
  } = useContext(ShopContext);

  const [showSearchIcon, setShowSearchIcon] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  const profileDropdownRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const addressModalRef = useRef(null);
  const addressTriggerRef = useRef(null);
  const navbarRef = useRef(null);
  const profileCloseTimer = useRef(null);
  const [showDropAnim, setShowDropAnim] = useState(false);
  const wasStickyRef = useRef(false);
  const isPlaceOrderPage = location.pathname.includes("place-order");
  const firstName = userName ? userName.split(" ")[0] : "";

  // Determine the active address (user-selected > isDefault > first)
  const activeAddress =
    addresses.find((a) => a._id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];
  const recentAddresses = addresses.slice(0, 3);
  const defaultAddress = addresses.find((a) => a.isDefault);
  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const navHeight = navbarRef.current?.offsetHeight || 64;
      const shouldStick = window.scrollY > navHeight;
      setIsSticky(shouldStick);

      // Trigger drop animation only on the transition to sticky
      if (shouldStick && !wasStickyRef.current) {
        setShowDropAnim(true);
        // Remove animation class after it finishes so it doesn't replay on re-renders
        setTimeout(() => setShowDropAnim(false), 300);
      }
      wasStickyRef.current = shouldStick;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Profile dropdown hover helpers — shared timer prevents flicker
  const openProfileDropdown = () => {
    if (profileCloseTimer.current) {
      clearTimeout(profileCloseTimer.current);
      profileCloseTimer.current = null;
    }
    setShowProfileDropdown(true);
  };

  const closeProfileDropdown = () => {
    profileCloseTimer.current = setTimeout(() => {
      setShowProfileDropdown(false);
      profileCloseTimer.current = null;
    }, 120);
  };

  useEffect(() => {
    setShowSearchIcon(location.pathname.includes("collection"));
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showProfileDropdown &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target) &&
        profileTriggerRef.current &&
        !profileTriggerRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        showAddressModal &&
        addressModalRef.current &&
        !addressModalRef.current.contains(e.target) &&
        addressTriggerRef.current &&
        !addressTriggerRef.current.contains(e.target)
      ) {
        setShowAddressModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown, showAddressModal]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowAddressModal(false);
    setShowProfileDropdown(false);
    if (profileCloseTimer.current) {
      clearTimeout(profileCloseTimer.current);
      profileCloseTimer.current = null;
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setShowProfileDropdown(false);
    navigate("/login");
  };

  const handleProfileAction = (path) => {
    setShowProfileDropdown(false);
    if (!token) {
      navigate("/login", { state: { redirectTo: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <div
      ref={navbarRef}
      className={`relative flex items-center justify-between py-4 font-medium gap-2 sticky top-0 z-40 transition-all duration-300 ${
        isSticky
          ? "bg-white/80 backdrop-blur-md shadow-sm -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
          : ""
      } ${showDropAnim ? "animate-navbar-drop" : ""}`}
    >
      {/* ── Left Group: Logo + Deliver To ── */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <NavLink to="/" className="flex-shrink-0">
          <img
            src={assets.logoHome}
            alt="Wick & Aura Logo"
            className="w-28 sm:w-36"
          />
        </NavLink>

        {/* Deliver To (desktop) */}
        {token && (
          <div className="hidden md:block relative" ref={addressTriggerRef}>
            <button
              onClick={() =>
                !isPlaceOrderPage && setShowAddressModal(!showAddressModal)
              }
              className="flex items-center gap-1.5 text-left group hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <MapPin className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
              <div className="leading-tight">
                <p className="text-[11px] text-gray-500 tracking-wide">
                  Delivering to
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                  {activeAddress
                    ? `${activeAddress.city} ${activeAddress.pincode}`
                    : "Add address"}
                </p>
              </div>
              {!isPlaceOrderPage && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showAddressModal ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Address Selection Modal */}
            {showAddressModal && (
              <div
                ref={addressModalRef}
                className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Choose your location
                    </h3>
                    <button
                      onClick={() => setShowAddressModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Select a delivery address
                  </p>
                </div>

                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {recentAddresses.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs">No saved addresses</p>
                    </div>
                  ) : (
                    recentAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setShowAddressModal(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors text-xs ${
                          addr._id === activeAddress?._id
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-medium text-gray-800">
                          {addr.firstName} {addr.lastName}
                          {addr.isDefault && (
                            <span className="ml-2 text-[10px] font-medium px-1.5 py-0.5 bg-black text-white rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {[addr.address1, addr.address2, addr.landmark]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-gray-500 mt-0.5">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    to="/account?tab=addresses"
                    onClick={() => setShowAddressModal(false)}
                    className="block text-center text-xs font-medium text-gray-700 hover:text-black transition-colors py-1.5"
                  >
                    See all addresses
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Center Group: Nav Links (absolutely centered on desktop) ── */}
      <ul className="hidden sm:flex items-center gap-5 text-sm absolute left-1/2 -translate-x-1/2">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1"
          viewTransition
        >
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* ── Right Group: Actions ── */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Search (collection page only) */}
        <Search
          onClick={() => setShowSearch(true)}
          className={`w-5 h-5 cursor-pointer transition-opacity ${showSearchIcon ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />

        {/* ── Hello, Name / Profile Dropdown ── */}
        <div
          className="relative hidden sm:block"
          ref={profileTriggerRef}
          onMouseEnter={openProfileDropdown}
          onMouseLeave={closeProfileDropdown}
        >
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-1.5 hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <User className="w-5 h-5 text-gray-700" />
            <div className="leading-tight text-left hidden lg:block">
              <p className="text-[11px] text-gray-500">
                {token ? `Hello, ${firstName || "User"}` : "Hello, Sign in"}
              </p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-0.5">
                Account
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`}
                />
              </p>
            </div>
          </button>

          {/* Dropdown — no gap, invisible bridge via pt-1 on inner content */}
          {showProfileDropdown && (
            <div
              ref={profileDropdownRef}
              className="absolute right-0 top-full w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {!token && (
                <div className="p-3 border-b border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    New customer? Sign up
                  </Link>
                </div>
              )}

              <div className="py-1.5">
                <button
                  onClick={() => handleProfileAction("/account")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={() => handleProfileAction("/orders")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Package className="w-4 h-4 text-gray-400" />
                  Orders
                </button>
                <button
                  onClick={() => handleProfileAction("/account?tab=addresses")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Saved Addresses
                </button>
                <button
                  onClick={() => handleProfileAction("/wishlist")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                  Wishlist
                </button>

                {token && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Returns & Orders (desktop) ── */}
        <Link
          to={token ? "/orders" : "/login"}
          state={!token ? { redirectTo: "/orders" } : undefined}
          className="hidden sm:flex flex-col items-center leading-tight hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <p className="text-[11px] text-gray-500">Returns</p>
          <p className="text-sm font-semibold text-gray-800">& Orders</p>
        </Link>

        {/* ── Cart ── */}
        <Link
          to="/cart"
          className="relative flex items-center gap-1.5 hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-black text-white rounded-full text-[10px] font-bold">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-800 hidden lg:inline">
            Cart
          </span>
        </Link>

        {/* ── Mobile Menu Toggle ── */}
        {isMenuOpen ? (
          <X
            className="cursor-pointer sm:hidden w-5 h-5"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : (
          <MenuIcon
            className="cursor-pointer sm:hidden w-5 h-5"
            onClick={() => setIsMenuOpen(true)}
          />
        )}
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 flex flex-col sm:hidden z-50">
          {/* Deliver To (mobile) */}
          {token &&
            defaultAddress &&
            (isPlaceOrderPage ? (
              <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 cursor-not-allowed opacity-60">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500">Delivering to</p>
                  <p className="text-xs font-medium">
                    {defaultAddress.city} {defaultAddress.pincode}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                to="/account?tab=addresses"
                className="flex items-center gap-2 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500">Delivering to</p>
                  <p className="text-xs font-medium">
                    {defaultAddress.city} {defaultAddress.pincode}
                  </p>
                </div>
              </Link>
            ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Nav Links */}
          <NavLink
            to="/"
            className="px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
          >
            HOME
          </NavLink>
          <NavLink
            to="/collection"
            className="px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
          >
            COLLECTION
          </NavLink>
          <NavLink
            to="/about"
            className="px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            className="px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
          >
            CONTACT
          </NavLink>

          <div className="border-t border-gray-100 my-2" />

          {/* Account Actions */}
          {token ? (
            <>
              <p className="px-6 py-2 text-[10px] text-gray-400 uppercase tracking-wider">
                Hello, {firstName || "User"}
              </p>
              <Link
                to="/account"
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <UserCircle className="w-4 h-4 text-gray-400" />
                My Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Package className="w-4 h-4 text-gray-400" />
                Orders
              </Link>
              <Link
                to="/account?tab=addresses"
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                Saved Addresses
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 text-gray-400" />
                Wishlist
              </Link>
              <div className="border-t border-gray-100 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserPlus className="w-4 h-4 text-gray-400" />
              Sign in / Sign up
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
