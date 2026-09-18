import userModel from "../models/userModel.js";

// Get wishlist for a user
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("wishlist");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Don't add duplicates
    if (user.wishlist.includes(productId)) {
      return res.json({ success: true, wishlist: user.wishlist });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id !== productId);
    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
