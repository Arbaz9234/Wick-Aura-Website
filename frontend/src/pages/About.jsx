import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

export default function About() {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t border-gray-300">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.bannerImage}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Wick & Aura was born from a simple idea — that candles should be
            more than just light. Each piece in our collection is hand-poured
            with premium soy wax and infused with captivating fragrances,
            crafted for those who cherish the finer details of life.
          </p>
          <p>
            From delicate tulip bouquets to cozy caramel coffee, every candle we
            make is designed to elevate your space and soothe your senses, one
            flicker at a time.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission is to craft moments of tranquility and delight through
            exquisite scented candles — ethically sourced, artisan hand-poured,
            and fully customizable to match your own personal aesthetic.
          </p>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-xl">Pure Ingredients:</b>
          <p className=" text-gray-600">
            Every candle is made with ethically sourced, high-quality soy wax
            and phthalate-free essential oils — clean-burning and safe for your
            home.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-xl">Artisan Crafted:</b>
          <p className=" text-gray-600">
            Each candle is meticulously hand-poured in small batches, ensuring
            consistent quality and a true-to-scent experience every time.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-xl">Made Just For You:</b>
          <p className=" text-gray-600">
            Personalize your candle with custom color options — because your
            space, and your aura, deserve something uniquely yours.
          </p>
        </div>
      </div>

      <NewsLetter />
    </div>
  );
}
