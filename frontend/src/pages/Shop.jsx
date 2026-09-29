import React from "react";
import Banner from "../components/Banner";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";

export default function Shop() {
  return (
    <div>
      <Banner />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetter />
    </div>
  );
}
