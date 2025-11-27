
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, "hello");
    const user = await User.findById(decoded.userId).select("-password");

    if (!token) return res.json({ success: false, message: "user Not found" })
    req.user = user;
    next()
  }
  catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

