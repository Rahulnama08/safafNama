const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const couponController = require("../controllers/couponController");

router.post('/create', auth, couponController.createCoupon);
router.get('/getAll',  couponController.getCoupons);
router.post('/apply', auth, couponController.applyCoupon);
router.delete('/delete', auth, couponController.deleteCoupon);
router.put('/update', auth, couponController.editCoupon);
router.put('/handleActive', auth, couponController.handleActive);
router.put('/editCoupon', auth, couponController.updateCoupon);

module.exports = router; 