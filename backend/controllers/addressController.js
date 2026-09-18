import userModel from "../models/userModel.js";

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("addresses");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { userId, ...addressData } = req.body;

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "mobile", "address1", "pincode", "city", "state"];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return res.json({ success: false, message: `${field} is required` });
      }
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Enforce 5 address limit
    if (user.addresses.length >= 5) {
      return res.json({ success: false, message: "Maximum 5 addresses allowed" });
    }

    // If this is the first address or isDefault is true, set it as default
    if (user.addresses.length === 0 || addressData.isDefault) {
      // Clear isDefault on all existing addresses
      user.addresses.forEach(addr => addr.isDefault = false);
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update an existing address
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId, ...addressData } = req.body;

    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    // If setting this as default, clear isDefault on others
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // Update fields
    Object.keys(addressData).forEach(key => {
      address[key] = addressData[key];
    });

    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default and others remain, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getAddresses, addAddress, updateAddress, deleteAddress };
