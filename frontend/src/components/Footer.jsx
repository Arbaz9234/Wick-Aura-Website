import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logoHome} alt="logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Wick & Aura crafts hand-poured soy candles designed to bring warmth,
            fragrance, and a little calm into everyday life. Made in small
            batches with premium, phthalate-free oils — and fully customizable
            colors, because your candle should be as unique as you are.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>

          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group relative inline-block w-fit transition-colors duration-300 hover:text-gray-900"
              >
                Home
                <span className="absolute left-0 sm:block hidden -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-gray-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="group relative inline-block w-fit transition-colors duration-300 hover:text-gray-900"
              >
                About Us
                <span className="absolute left-0 sm:block hidden -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-gray-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>

            <li>
              <Link
                to="/collection"
                className="group relative inline-block w-fit transition-colors duration-300 hover:text-gray-900"
              >
                Collection
                <span className="absolute left-0 sm:block hidden -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-gray-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>

            <li>
              <Link
                to="/privacy-policy"
                className="group relative inline-block w-fit transition-colors duration-300 hover:text-gray-900"
              >
                Privacy Policy
                <span className="absolute left-0 sm:block hidden -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-gray-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

          <ul className="flex flex-col gap-3 text-gray-600">
            {/* WhatsApp */}
            {/* <li>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-black  transition-colors duration-200"
              >
                <assets.WhatsAppIcon />
                +91 {import.meta.env.VITE_WHATSAPP_NUMBER}
              </a>
            </li> */}

            {/* Email */}
            <li>
              <a
                href="mailto:wickandauracandles@gmail.com"
                className="flex items-center gap-2 hover:text-black transition-colors duration-200"
              >
                <assets.MailIcon />
                wickandauracandles@gmail.com
              </a>
            </li>

            {/* Instagram */}
            <li>
              <a
                href="https://instagram.com/wickandaura_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-black transition-colors duration-200"
              >
                <assets.InstagramIcon />
                @wickandaura_
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr className="border-none h-[1px] bg-gray-300" />
        <p className="py-5 text-sm text-center">
          Copyright 2026 @ wickandaura.in - All Right Reserved.
        </p>
      </div>
    </div>
  );
}
