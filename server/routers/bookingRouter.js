const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middlewares/auth");

router.post('/checkAvailability',  bookingController.checkAvailability);
router.post('/bookRoom', auth, bookingController.bookRoom);
router.get('/booked' , auth, bookingController.approved);
router.get('/cancelled' , auth, bookingController.cancelled);
router.get('/pending', auth, bookingController.pending);
router.get('/getAll', auth, bookingController.getAll);
router.put("/confirmBookingUser", auth, bookingController.confirmBookingUser);
router.put("/cancelBookingUser", auth, bookingController.cancelBookingUser);
router.get("/getUserBookings", auth, bookingController.getUserBookings);

router.get('/analytics', auth, bookingController.analytics);
router.get("/weekly-revenue", auth, bookingController.weeklyRevenue);
router.get("/weekly-booking-counts", auth, bookingController.getWeeklyBookingCounts);
router.get("/booking-counts", auth, bookingController.bookingCount);
router.get("/revenueData" , auth , bookingController.revenueData)



module.exports = router;