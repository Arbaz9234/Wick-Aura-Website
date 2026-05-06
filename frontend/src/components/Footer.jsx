import React from "react";
import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logoHome} alt="logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
            molestiae, deleniti natus expedita atque reprehenderit vero
            veritatis fugit nemo suscipit ipsum quas numquam illum consequatur
            tempora inventore quasi voluptatum. Minima suscipit ullam corrupti
            accusamus hic quasi fuga officia excepturi consectetur?
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-000-000-0000</li>
            <li>greatstackdev@gmail.com</li>
            <li className="cursor-pointer">Instagram</li>
          </ul>
        </div>
      </div>
      <div>
        <hr className="border-none h-[1px] bg-gray-300" />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ greatstack.dev - All Right Reserved.
        </p>
      </div>
    </div>
  );
}
