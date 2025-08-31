const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("./cron/scheduler");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

const userRouter = require("./routers/userRouter");
const locationRouter = require("./routers/locationRouter");
const stateRouter = require("./routers/stateRouter");
const hotelRouter = require("./routers/hotelRouter");
const roomRouter = require("./routers/roomRouter");
const bookingRouter = require("./routers/bookingRouter");
const couponRouter = require("./routers/couponRouter");

mongoose
  .connect(process.env.MONO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Allow requests from frontend on Render
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/users", userRouter);
app.use("/locations", locationRouter);
app.use("/states", stateRouter);
app.use("/hotels", hotelRouter);
app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/coupons", couponRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});
console.log("🕒 Date now:", new Date());

app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
