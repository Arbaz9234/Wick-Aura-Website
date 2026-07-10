import { createContext, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const addToCart = (itemId, size, quantity = 1) => {
    if (!size || quantity < 1) {
      return;
    }
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
      } else {
        cartData[itemId][size] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  };
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error occurred while calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;
      for (const size in cartItems[itemId]) {
        total += product.price * cartItems[itemId][size];
      }
    }
    return total;
  };

  const getCartData = () => {
    const data = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          data.push({ _id: itemId, size, quantity: cartItems[itemId][size] });
        }
      }
    }
    return data;
  };

  const placeOrder = (deliveryInfo, paymentMethod) => {
    const cartData = getCartData();
    if (cartData.length === 0) return;

    const subtotal = getCartAmount();
    const shipping = subtotal >= 500 ? 0 : delivery_fee;

    const orderItems = cartData.map((item) => {
      const product = products.find((p) => p._id === item._id);
      return {
        ...item,
        name: product.name,
        price: product.price,
        image: product.image[0],
      };
    });

    const order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      items: orderItems,
      deliveryInfo,
      paymentMethod,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "Order Placed",
    };

    setOrders((prev) => [order, ...prev]);
    setCartItems({});
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getCartData,
    orders,
    placeOrder,
    navigate,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
