import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();
  const addToCart = async (itemId, color, quantity = 1) => {
    if (!color || quantity < 1) {
      return;
    }
    const prevCart = structuredClone(cartItems);
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
        const response = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, color, quantity },
          { headers: { token } },
        );
        if (!response.data.success) {
          setCartItems(prevCart);
          toast.error(response.data.message || "Failed to add item to cart");
        }
      } catch (error) {
        setCartItems(prevCart);
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

  const placeOrder = async (
    deliveryInfo,
    paymentMethod,
    selectedAddressId = null,
  ) => {
    const isBuyNow = !!buyNowItem;

    let orderItems;
    let subtotal;

    if (isBuyNow) {
      const product = products.find((p) => p._id === buyNowItem._id);
      if (!product) return;
      orderItems = [
        {
          _id: buyNowItem._id,
          color: buyNowItem.color,
          quantity: buyNowItem.quantity,
          name: product.name,
          price: product.price,
          image: product.image[0],
        },
      ];
      subtotal = product.price * buyNowItem.quantity;
    } else {
      const cartData = getCartData();
      if (cartData.length === 0) return;
      orderItems = cartData.map((item) => {
        const product = products.find((p) => p._id === item._id);
        return {
          ...item,
          name: product.name,
          price: product.price,
          image: product.image[0],
        };
      });
      subtotal = getCartAmount();
    }

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
            initPay(
              response.data.order,
              isBuyNow,
              deliveryInfo,
              selectedAddressId,
            );
          } else {
            toast.error(response.data.message);
          }
          return;
        default:
          break;
      }

      if (response.data.success) {
        // Auto-save new address silently
        if (selectedAddressId === "new" || selectedAddressId === null) {
          await addAddress(deliveryInfo).catch(() => {}); // Silent fail
        }

        if (isBuyNow) {
          setBuyNowItem(null);
          // Refetch cart since backend clears it
          await getUserCart(token);
        } else {
          setCartItems({});
        }
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
  const initPay = (
    order,
    isBuyNow = false,
    deliveryInfo = null,
    selectedAddressId = null,
  ) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } },
          );
          if (data.success) {
            // Auto-save new address silently
            if (
              deliveryInfo &&
              (selectedAddressId === "new" || selectedAddressId === null)
            ) {
              await addAddress(deliveryInfo).catch(() => {}); // Silent fail
            }

            if (isBuyNow) {
              setBuyNowItem(null);
              await getUserCart(token);
            } else {
              setCartItems({});
            }
            await getUserOrders(token);
            navigate("/orders");
            toast("Payment successful!");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message || "Payment verification failed");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const getProductsData = async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.status === 200) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products. Please refresh the page");
      }
    } catch (error) {
      toast.error("Failed to load products. Please refresh the page");
    } finally {
      setProductsLoading(false);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);

  const getUserCart = async (token) => {
    setCartLoading(true);
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
      toast.error("Failed to load cart. Please try again");
    } finally {
      setCartLoading(false);
    }
  };

  const getUserOrders = async (token) => {
    setOrdersLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      toast.error("Failed to load orders. Please try again");
      return {
        success: false,
        message: error.message || "Failed to fetch orders",
      };
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUserProfile = async (t) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token: t } },
      );
      if (response.data.success) {
        setUserName(response.data.user?.name || "");
        setUserEmail(response.data.user?.email || "");
      }
    } catch (error) {
      // Non-critical — navbar just won't show the name
    }
  };

  const fetchAddresses = async (token) => {
    setAddressesLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/user/addresses",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      toast.error("Failed to load addresses. Please try again");
      return {
        success: false,
        message: error.message || "Failed to fetch addresses",
      };
    } finally {
      setAddressesLoading(false);
    }
  };

  const addAddress = async (addressData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/address/add",
        addressData,
        { headers: { token } },
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
        return { success: true, addresses: response.data.addresses };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message || "Failed to add address",
      };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/address/update",
        { addressId, ...addressData },
        { headers: { token } },
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
        return { success: true, addresses: response.data.addresses };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message || "Failed to update address",
      };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/address/delete",
        { addressId },
        { headers: { token } },
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
        return { success: true, addresses: response.data.addresses };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message || "Failed to delete address",
      };
    }
  };

  const fetchWishlist = async (t) => {
    setWishlistLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/user/wishlist",
        {},
        { headers: { token: t || token } },
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }
    } catch (error) {
      toast.error("Failed to load wishlist. Please try again");
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) return { success: false, message: "Please login" };
    // Optimistic update
    setWishlist((prev) =>
      prev.includes(productId) ? prev : [...prev, productId],
    );
    try {
      const response = await axios.post(
        backendUrl + "/api/user/wishlist/add",
        { productId },
        { headers: { token } },
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist);
        return { success: true };
      } else {
        // Revert on failure
        setWishlist((prev) => prev.filter((id) => id !== productId));
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      console.log(error);
      return {
        success: false,
        message: error.message || "Failed to add to wishlist",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return { success: false, message: "Please login" };
    // Optimistic update
    setWishlist((prev) => prev.filter((id) => id !== productId));
    try {
      const response = await axios.post(
        backendUrl + "/api/user/wishlist/remove",
        { productId },
        { headers: { token } },
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist);
        return { success: true };
      } else {
        // Revert on failure
        setWishlist((prev) => [...prev, productId]);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setWishlist((prev) => [...prev, productId]);
      console.log(error);
      return {
        success: false,
        message: error.message || "Failed to remove from wishlist",
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  useEffect(() => {
    const syncUserData = async (t) => {
      // Merge guest cart if user had items before logging in
      const guestCart = cartItems;
      const hasGuestItems = Object.keys(guestCart).length > 0;

      if (hasGuestItems) {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/cart/merge",
            { guestCart },
            { headers: { token: t } },
          );
          if (data.success) {
            setCartItems(data.cartData);
          } else {
            await getUserCart(t);
          }
        } catch {
          await getUserCart(t);
        }
      } else {
        await getUserCart(t);
      }

      getUserOrders(t);
      fetchAddresses(t);
      fetchWishlist(t);
      fetchUserProfile(t);
    };

    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
      getUserOrders(localStorage.getItem("token"));
      fetchAddresses(localStorage.getItem("token"));
      fetchWishlist(localStorage.getItem("token"));
      fetchUserProfile(localStorage.getItem("token"));
    } else if (token) {
      syncUserData(token);
    } else {
      setCartItems({});
      setOrders([]);
      setAddresses([]);
      setWishlist([]);
      setUserName("");
      setUserEmail("");
      setCartLoading(false);
      setOrdersLoading(false);
      setAddressesLoading(false);
      setWishlistLoading(false);
      setSelectedAddressId(null);
    }
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
    getUserOrders,
    buyNowItem,
    setBuyNowItem,
    navigate,
    backendUrl,
    token,
    setToken,
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    productsLoading,
    cartLoading,
    ordersLoading,
    addressesLoading,
    wishlistLoading,
    userName,
    userEmail,
    selectedAddressId,
    setSelectedAddressId,
  };
  return (
    <ShopContext.Provider value={value}>
      {props.children}
      <ToastContainer />
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
