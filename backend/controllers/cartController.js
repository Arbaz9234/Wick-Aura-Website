import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, color, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

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

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, color, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

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

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// merge guest cart into user cart (additive)
const mergeCart = async (req, res) => {
  try {
    const { userId, guestCart } = req.body;

    if (!guestCart || typeof guestCart !== "object" || Object.keys(guestCart).length === 0) {
      return res.json({ success: true, message: "Nothing to merge" });
    }

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    for (const itemId in guestCart) {
      for (const color in guestCart[itemId]) {
        const qty = guestCart[itemId][color];
        if (qty <= 0) continue;

        if (cartData[itemId]) {
          if (cartData[itemId][color]) {
            cartData[itemId][color] += qty;
          } else {
            cartData[itemId][color] = qty;
          }
        } else {
          cartData[itemId] = {};
          cartData[itemId][color] = qty;
        }
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, cartData, message: "Cart merged" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, mergeCart };
