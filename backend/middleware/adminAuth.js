import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("ToKen: ", token);
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login As Admin",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.id === `${process.env.ADMIN_EMAIL}${process.env.ADMIN_PASSWORD}`
    ) {
      next();
    } else {
      res.json({
        success: false,
        message: "Unauthorized access",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default adminAuth;
