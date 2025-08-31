const userModel = require("../models/userModel");
const activityModel = require("../models/activityModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "gsdgengnntneazfehhtht";
const moment = require("moment");
const sentOtpEmail = require("../utils/otpMail");
const { uploadProfilePicture } = require("../utils/helper");
const requestIp = require("request-ip");
const os = require("os");
const { default: mongoose } = require("mongoose");
const geoip = require("geoip-lite");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, age, phone, password , role } = req.body;

//     const checkUser = await userModel.findOne({ email });
//     if (checkUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);

//     const profileImg = req.files ? req.files   : "";
//     console.log(profileImg);

//     // Upload the image to Cloudinary
//     const imageData = await uploadProfilePicture(profileImg);

//     const user = new userModel({
//       name,
//       email,
//       age,
//       phone,
//       password: hash,
//       role,
//       profileImg: imageData ? imageData.url : "",
//     });

//     const userData = new userModel(user);
//     const data = await userData.save();
//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, age, phone, password, role } = req.body;

    const checkUser = await userModel.findOne({ email }).session(session);
    if (checkUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Extract file data if any
    let profileImgUrl = "";
    if (req.files && req.files.profileImg) {
      // Assuming the field name is 'profileImg'
      const file = req.files.profileImg;

      // file.data is the buffer containing the image file, convert it to base64 string
      const base64Data = `data:${file.mimetype};base64,${file.data.toString(
        "base64"
      )}`;

      // You can pass the user id after creation, but since user id is not available before saving,
      // you can use email or a timestamp as public_id or skip public_id and let Cloudinary generate one.
      profileImgUrl = await uploadProfilePicture(base64Data, email);
    }

    const newUser = new userModel({
      name,
      email,
      age,
      phone,
      password: hash,
      role,
      // profileImg: profileImgUrl && profileImgUrl
    });

    await newUser.save({ session });

    const clientIp = requestIp.getClientIp(req);
    console.log(clientIp);

    const geo = geoip.lookup(clientIp);
    console.log("location : ", geo);

    const hostname = os.hostname();
    console.log("System Hostname:", hostname);

    const activity = new activityModel({
      userId: newUser._id,
      ipAddress: clientIp,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown",
      systemName: hostname,
      action: "signup",
    });

    await activity.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    console.log(clientIp);

    const geo = geoip.lookup(clientIp);
    console.log("location : ", geo);

    const hostname = os.hostname();
    console.log("System Hostname:", hostname);

    const activity = new activityModel({
      userId: req.user._id,
      ipAddress: clientIp,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown",
      systemName: hostname,
      action: "logout",
    });

    await activity.save();

    res.status(201).json({ message: "User logout successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) { 
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(400).json({ message: "User is inactive" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const currTime = moment(); // current moment
    const newTime = currTime.clone().add(10, "minutes");

    await userModel.findOneAndUpdate({ email }, { otp, otpTimer: newTime });
    await sentOtpEmail(user.email, otp, user.name);
    console.log('agsgvwrgvergver')

    res.status(200).json({
      message: "OTP sent to your email. Please verify.",
      step: "otp_verification",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  console.log(req.body);
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // console.log(user.otp)
    // console.log(Number(otp) === Number(user.otp));

    const currTime = moment(); // current moment

    if (currTime > user.otpTimer) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please login again." });
    }

    if (Number(otp) !== Number(user.otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await userModel.findOneAndUpdate({ email }, { otp: "", otpTimer: "" });

    // Generate JWT
    const token = jwt.sign({ email: user.email, id: user._id }, secretKey, {
      expiresIn: "1d",
    });

    const clientIp = requestIp.getClientIp(req);
    console.log(clientIp);

    const geo = geoip.lookup(clientIp);
    console.log("location : ", geo);

    const hostname = os.hostname();
    console.log("System Hostname:", hostname);

    const activity = new activityModel({
      userId: user._id,
      ipAddress: clientIp,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown",
      systemName: hostname,
      action: "login",
    });

    await activity.save();

    res.status(200).json({ message: "OTP verified successfully", token, user });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const currTime = moment(); // current moment
    const newTime = currTime.clone().add(10, "minutes");

    await userModel.findOneAndUpdate({ email }, { otp, otpTimer: newTime });

    await sentOtpEmail("m.ayyynkpanwar7@gmail.com", otp, user.name);

    res.status(200).json({
      message: "OTP sent to your email. Please verify.",
      step: "otp_verification",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.newPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log(otp, user.otp);

    if (toString(user.otp) !== toString(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const currTime = moment(); // current moment

    if (user.otpTimer < currTime) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { password: hash, otp: "", otpTimer: "" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update password" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editProfile = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, age, phone } = req.body;
    const { id } = req.query;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract file data if any
    let profileImgUrl = "";

    if (req.files && req.files.profileImg) {
      // Assuming the field name is 'profileImg'
      const file = req.files.profileImg;

      // file.data is the buffer containing the image file, convert it to base64 string
      const base64Data = `data:${file.mimetype};base64,${file.data.toString(
        "base64"
      )}`;

      // You can pass the user id after creation, but since user id is not available before saving,
      // you can use email or a timestamp as public_id or skip public_id and let Cloudinary generate one.
      profileImgUrl = await uploadProfilePicture(base64Data, email);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        age,
        phone,
        profileImg: profileImgUrl || user.profileImg,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  console.log("efw");
  try {
    const data = req.user;
    console.log(data);

    const user = await userModel.findById(data._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
