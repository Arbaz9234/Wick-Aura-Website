import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const addToCart = async (itemId, color, quantity = 1) => {
    if (!color || quantity < 1) {
      return;
    }
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][color]) {
        cartData[itemId][color] += quantity;
      } else {
        cartData[itemId][color] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][color] = quantity;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, color, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(error.message || "Failed to add item to cart");
      }
    }
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

  const updateQuantity = async (itemId, color, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][color];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][color] = quantity;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, color, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(error.message || "Failed to add item to cart");
      }
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;
      for (const color in cartItems[itemId]) {
        total += product.price * cartItems[itemId][color];
      }
    }
    return total;
  };

  const getCartData = () => {
    const data = [];
    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        if (cartItems[itemId][color] > 0) {
          data.push({ _id: itemId, color, quantity: cartItems[itemId][color] });
        }
      }
    }
    return data;
  };

  const placeOrder = async (deliveryInfo, paymentMethod) => {
    const cartData = getCartData();
    if (cartData.length === 0) return;

    const orderItems = cartData.map((item) => {
      const product = products.find((p) => p._id === item._id);
      return {
        ...item,
        name: product.name,
        price: product.price,
        image: product.image[0],
      };
    });

    const subtotal = getCartAmount();
    const shipping = subtotal >= 500 ? 0 : delivery_fee;
    const amount = subtotal + shipping;

    try {
      let response;
      switch (paymentMethod) {
        case "cod":
          response = await axios.post(
            backendUrl + "/api/order/place",
            { items: orderItems, amount, address: deliveryInfo },
            { headers: { token } },
          );
          break;
        case "razorpay":
          response = await axios.post(
            backendUrl + "/api/order/razorpay",
            { items: orderItems, amount, address: deliveryInfo },
            { headers: { token } },
          );
          if (response.data.success) {
            initPay(response.data.order);
          }
          break;
        default:
          break;
      }

      if (response.data.success) {
        setCartItems({});
        await getUserOrders(token);
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to place order");
    }
  };
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } },
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.status === 200) {
        setProducts(response.data.products);
      } else {
        console.error("Error fetching products data:", error);
      }
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserOrders = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
      getUserOrders(localStorage.getItem("token"));
    } else if (token) {
      getUserCart(token);
      getUserOrders(token);
    } else {
      setCartItems({});
      setOrders([]);
    }
  }, [token]);

  // Poll for order status updates & refetch on window focus
  useEffect(() => {
    if (!token) return;

    const poll = setInterval(() => getUserOrders(token), 30000);

    const onFocus = () => getUserOrders(token);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(poll);
      window.removeEventListener("focus", onFocus);
    };
  }, [token]);

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
    backendUrl,
    token,
    setToken,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
