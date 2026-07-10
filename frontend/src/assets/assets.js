import logo from "./logo.png";
import favicon from "./favicon.png";
import logoHome from "./logo-homepage.svg";
import menuIcon from "./menu-icon.svg";
import bannerImage from "./banner-image.jpg";
import loginImage1 from "./login-image-1.webp";
import loginImage2 from "./login-image-2.webp";
import loginImage3 from "./login-image-3.webp";
import razorpayLogo from "./razorpay_logo.png";
import stripeLogo from "./stripe_logo.png";
export const assets = {
  logo,
  favicon,
  logoHome,
  menuIcon,
  bannerImage,
  razorpayLogo,
  stripeLogo,
  loginImages: [loginImage1, loginImage2, loginImage3],
};

export const products = [
  {
    _id: "aaaaa",
    name: "Tulip Bouquet Candle",
    description:
      "A floral masterpiece inspired by fresh tulips, blended with green notes and morning dew. Elegant, refreshing, and perfect for gifting.",
    price: 100,
    image: [bannerImage, bannerImage, bannerImage, bannerImage],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "bbbbb",
    name: "Tulip Bouquet Candle",
    description:
      "A floral masterpiece inspired by fresh tulips, blended with green notes and morning dew. Elegant, refreshing, and perfect for gifting.",
    price: 200,
    image: [bannerImage],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "ccccc",
    name: "Tulip Bouquet Candle",
    description:
      "A floral masterpiece inspired by fresh tulips, blended with green notes and morning dew. Elegant, refreshing, and perfect for gifting.",
    price: 300,
    image: [bannerImage],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },
];
