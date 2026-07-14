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
import InstagramIcon from "./instagram-icon.svg?react";
import MailIcon from "./mail-icon.svg?react";
export const assets = {
  logo,
  favicon,
  logoHome,
  menuIcon,
  bannerImage,
  razorpayLogo,
  stripeLogo,
  loginImages: [loginImage1, loginImage2, loginImage3],
  InstagramIcon,
  MailIcon,
};

export const products = [
  {
    _id: "aaaaa",
    name: "Tulip Bouquet Candle",
    description:
      "A floral masterpiece inspired by fresh tulips, blended with green notes and morning dew. Elegant, refreshing, and perfect for gifting.",
    price: 399,
    oldPrice: 499,
    image: [bannerImage],
    category: "Bouquet Candles",
    subCategory: "Floral",
    colors: ["Ivory", "Pink", "Purple"],
    date: 1716634345448,
    bestseller: true,
    reviews: [
      { name: "Sarah M.", rating: 5, date: "2 days ago", text: "Absolutely love this candle! The scent is so refreshing and it burns evenly. Will definitely buy again." },
      { name: "Priya K.", rating: 5, date: "1 week ago", text: "Bought this as a gift for my friend and she loved it. The packaging was beautiful too." },
      { name: "Rahul S.", rating: 4, date: "2 weeks ago", text: "Great quality candle. The fragrance is subtle but fills the room nicely. Fast delivery." },
    ],
  },
  {
    _id: "bbbbb",
    name: "Tulip Bouquet Jar Candle",
    description:
      "Premium wax and soothing fragrance in a beautiful jar. Clean-burning soy wax, long-lasting, and harmless to pets and the environment.",
    price: 450,
    oldPrice: 599,
    image: [bannerImage],
    category: "Jar Candles",
    subCategory: "Floral",
    colors: ["Ivory", "Red", "Pink"],
    date: 1716634345448,
    bestseller: true,
    reviews: [
      { name: "Ananya R.", rating: 5, date: "3 days ago", text: "The jar is so pretty and the wax burns cleanly. No soot at all! Amazing quality for the price." },
      { name: "Meera D.", rating: 4, date: "1 week ago", text: "Beautiful candle, the fragrance lasts long. Only wish it came in more color options." },
      { name: "Vikram P.", rating: 5, date: "3 weeks ago", text: "Ordered two for my living room. They look stunning and the scent is calming without being overpowering." },
    ],
  },
  {
    _id: "ccccc",
    name: "Scented Rose Bouquet Candle",
    description:
      "A handmade showstopper of detailed roses with a chic base and decorative bow, infused with a soft rose fragrance for a cozy, romantic ambiance.",
    price: 399,
    oldPrice: 499,
    image: [bannerImage],
    category: "Bouquet Candles",
    subCategory: "Romantic",
    colors: ["Ivory", "Rose Pink"],
    date: 1716634345448,
    bestseller: true,
    reviews: [
      { name: "Nisha T.", rating: 5, date: "1 day ago", text: "The rose detailing is incredible! Looks like a real bouquet. My room smells heavenly." },
      { name: "Arjun M.", rating: 5, date: "5 days ago", text: "Got this for my wife on our anniversary. She absolutely loved it. Worth every rupee." },
      { name: "Kavita S.", rating: 4, date: "2 weeks ago", text: "Beautiful candle but the rose scent is a bit mild. Still looks gorgeous as a decor piece." },
    ],
  },
  {
    _id: "ddddd",
    name: "Peony Scented Jar Candle",
    description:
      "A delicate white rose scent that evokes serenity and elegance, transforming any space into a fragrant oasis.",
    price: 399,
    oldPrice: 549,
    image: [bannerImage],
    category: "Jar Candles",
    subCategory: "Floral",
    colors: ["White", "Red"],
    date: 1716634345448,
    bestseller: false,
    reviews: [
      { name: "Deepa G.", rating: 5, date: "4 days ago", text: "Such a calming fragrance. I light it every evening during my reading time. Pure bliss." },
      { name: "Rohan K.", rating: 4, date: "1 week ago", text: "Clean burn and lovely scent. The jar looks elegant on my shelf even when not lit." },
    ],
  },
  {
    _id: "eeeee",
    name: "Heart Scented Candle in Glass Jar",
    description:
      "Set the perfect romantic ambiance — a warm, cozy, love-filled candle ideal for date nights, anniversaries, or self-care moments.",
    price: 250,
    oldPrice: 349,
    image: [bannerImage],
    category: "Jar Candles",
    subCategory: "Romantic",
    colors: ["Red", "White"],
    date: 1716634345448,
    bestseller: false,
    reviews: [
      { name: "Sneha L.", rating: 5, date: "3 days ago", text: "Perfect for date night! The heart shape is so cute and the warm glow sets the mood beautifully." },
      { name: "Amit B.", rating: 4, date: "1 week ago", text: "Lovely little candle. Burns well and the glass jar is reusable. Good value for money." },
      { name: "Pooja N.", rating: 5, date: "2 weeks ago", text: "Gifted this to my best friend and she was thrilled. The scent is warm and comforting." },
    ],
  },
  {
    _id: "fffff",
    name: "Daisy Flower Scented Jar Candle",
    description:
      "A delicate, uplifting floral scent that brings the freshness of a daisy field into your home.",
    price: 299,
    oldPrice: 399,
    image: [bannerImage],
    category: "Jar Candles",
    subCategory: "Floral",
    colors: ["Ivory", "Yellow"],
    date: 1716634345448,
    bestseller: false,
    reviews: [
      { name: "Isha V.", rating: 5, date: "2 days ago", text: "Smells like a spring garden! So fresh and uplifting. My new favorite candle." },
      { name: "Karan J.", rating: 4, date: "10 days ago", text: "Nice floral scent, not too sweet. Burns evenly and the jar is sturdy." },
    ],
  },
  {
    _id: "ggggg",
    name: "Iced Coffee Candle ~ Caramel Coffee",
    description:
      "Rich, caramel coffee fragrance that captures the scent of a cool, creamy iced coffee — like your favorite coffee shop, at home.",
    price: 499,
    oldPrice: 699,
    image: [bannerImage],
    category: "Jar Candles",
    subCategory: "Gourmet",
    colors: ["Caramel", "Cream"],
    date: 1716634345448,
    bestseller: true,
    reviews: [
      { name: "Aditya R.", rating: 5, date: "1 day ago", text: "Coffee lover's dream! The caramel undertone is perfect. My whole apartment smells like a café." },
      { name: "Simran P.", rating: 5, date: "4 days ago", text: "I'm obsessed with this candle. The scent throw is amazing and it looks beautiful too." },
      { name: "Mohit G.", rating: 4, date: "2 weeks ago", text: "Great concept and execution. The coffee scent is authentic and not artificial at all." },
    ],
  },
  {
    _id: "hhhhh",
    name: "Handmade Soy Wax Bubble Cube Scented Candle",
    description:
      "100% natural soy wax with a unique bubble design that adds romance and charm — clean-burning with no black smoke.",
    price: 199,
    oldPrice: 299,
    image: [bannerImage],
    category: "Mini & Bubble Candles",
    subCategory: "Floral",
    colors: ["Pink", "Ivory", "Blush"],
    date: 1716634345448,
    bestseller: false,
    reviews: [
      { name: "Riya S.", rating: 5, date: "3 days ago", text: "The bubble design is so unique! Gets compliments every time someone visits. Clean burn too." },
      { name: "Tanvi M.", rating: 4, date: "1 week ago", text: "Cute design and eco-friendly. The soy wax really does burn without any black smoke." },
    ],
  },
  {
    _id: "iiiii",
    name: "Mini Bubble Candle",
    description:
      "Delightful natural fragrance in a charming mini bubble design. 100% natural soy wax, gentle burning, no black smoke.",
    price: 79,
    oldPrice: 129,
    image: [bannerImage],
    category: "Mini & Bubble Candles",
    subCategory: "Floral",
    colors: ["Green", "Purple", "Orange", "Pink", "Blue", "Yellow", "White"],
    date: 1716634345448,
    bestseller: false,
    reviews: [
      { name: "Divya A.", rating: 5, date: "5 days ago", text: "So adorable! Bought one in every color. They make the cutest desk accessories." },
      { name: "Neha K.", rating: 4, date: "2 weeks ago", text: "Tiny but the fragrance is surprisingly good. Perfect little gifts for friends." },
    ],
  },
  {
    _id: "jjjjj",
    name: "Daisy Flower Scented Candle",
    description:
      "Hand-crafted with essential oils and high-quality wax for a delicate, uplifting floral scent that brings new life to any room.",
    price: 69,
    oldPrice: 99,
    image: [bannerImage],
    category: "Mini & Bubble Candles",
    subCategory: "Floral",
    colors: ["Purple", "Yellow", "Pink", "Orange"],
    date: 1716634345448,
    bestseller: true,
    reviews: [
      { name: "Lakshmi R.", rating: 5, date: "2 days ago", text: "So pretty and affordable! The essential oil scent is natural and not overwhelming. Love it." },
      { name: "Raj P.", rating: 5, date: "1 week ago", text: "Bought a set for my mom. She loves the daisy shape and the gentle fragrance. Great quality." },
      { name: "Sanya M.", rating: 4, date: "3 weeks ago", text: "Lovely candle for the price. Burns well and the flower shape holds up nicely." },
    ],
  },
];
