const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const secretKey = "gsdgengnntneazfehhtht";

module.exports = async (req, res, next) => {
  console.log("auth middleware");
  console.log(req.headers.authorization);
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: "no token provided" });
    }

    const token = bearerToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "no token found" });
    }

    const decode = jwt.verify(token, secretKey);
    if (!decode) {
      return res.status(401).json({ message: "invalid token" });
    }

    const checkUser = await userModel.findOne({ email: decode.email });
    if (!checkUser) {
      return res.status(401).json({ message: "invalid user" });
    }

    req.user = checkUser;

    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
};
