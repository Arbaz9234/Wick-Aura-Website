import React, { useContext } from "react";
import Banner from "../components/Banner";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import { ShopContext } from "../context/ShopContext";

export default function Shop() {
  const { subscribed } = useContext(ShopContext);
  return (
    <div>
      <Banner />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      {!subscribed && <NewsLetter />}
    </div>
  );
}
