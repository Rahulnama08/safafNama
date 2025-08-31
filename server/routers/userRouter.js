const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const auth = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/resetPass", userController.resetPassword);
router.post("/newPass", userController.newPassword);
router.put("/updateProfile", userController.editProfile);
router.get("/getProfile", auth, userController.getUser);
router.get("/logout", auth, userController.logout);


module.exports = router;