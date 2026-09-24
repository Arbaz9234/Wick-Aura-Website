import React from "react";
import Banner from "../components/Banner";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import { ToastContainer } from "react-toastify";

export default function Shop() {
  return (
    <div>
      <Banner />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetter />
      <ToastContainer />
    </div>
  );
}
