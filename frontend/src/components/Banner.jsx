import React from "react";
import { assets } from "../assets/assets";
import ImageSwiper from "./ImageSwiper";

const swiperImages = assets.loginImages.map((src, i) => ({
  src,
  alt: `Wick & Aura ${i + 1}`,
}));
export default function Banner() {
  return (
    <div className="flex flex-col sm:flex-row h-[500px] lg:h-[600px] border border-gray-400 overflow-hidden">
      {/* Banner Left */}
      <div className="w-full sm:w-1/2 flex items-center justify-center px-5 py-7 sm:px-0 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>

          <h1 className="prata-regular text-4xl  lg:text-5xl xl:text-6xl">
            Latest Arrivals
          </h1>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Banner Right */}
      <div className="w-full sm:w-1/2 h-full min-h-0 relative overflow-hidden">
        <ImageSwiper images={swiperImages} autoplayDelay={4000} />
      </div>
    </div>
  );
}
