import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

export default function Contact() {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t border-gray-300">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-10 md:gap-16">
        <img
          className="w-full md:max-w-[480px] object-cover"
          src={assets.bannerImage}
          alt="Contact us"
        />
        <div className="flex flex-col justify-center gap-8">
          <div>
            <p className="font-semibold text-xl text-gray-800">Our Store</p>
            <p className="text-gray-500 mt-3 leading-relaxed">
              54709 Willms Station
              <br />
              Suite 350, Washington, USA
            </p>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Tel: (415) 555-0132
              <br />
              Email: admin@wickandaura.com
            </p>
          </div>

          <div>
            <p className="font-semibold text-xl text-gray-800">
              Careers at Wick & Aura
            </p>
            <p className="text-gray-500 mt-3">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-3 mt-4 text-sm hover:bg-black hover:text-white transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <NewsLetter />
    </div>
  );
}
