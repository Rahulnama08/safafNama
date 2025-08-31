// controllers/couponController.js
const Coupon = require("../models/couponModels");

exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, startDate, endDate } = req.body;

    // Basic validation
    if (!code || !discount || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create coupon
    const newCoupon = new Coupon({
      code,
      discount,
      startDate,
      endDate,
    });

    const savedCoupon = await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: savedCoupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code must be unique." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code." });
    }

    // Check expiry
    if (new Date(coupon.endDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Check start date
    if (new Date(coupon.startDate) > new Date()) {
      return res.status(400).json({ message: "Coupon is not active yet." });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is not active." });
    }

    res.status(200).json({
      message: "Coupon applied successfully",
      discount: coupon.discount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    const { code, discount, startDate, endDate } = req.body;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "No Coupon found" });
    }

    coupon.code = code;
    coupon.discount = discount;
    coupon.startDate = startDate;
    coupon.endDate = endDate;
    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "No Coupon found" });
    }

    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.handleActive = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "No Coupon found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    const { code, discount, startDate, endDate } = req.body;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "No Coupon found" });
    }

    coupon.code = code;
    coupon.discount = discount;
    coupon.startDate = startDate;
    coupon.endDate = endDate;
    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};