const bookingModel = require("../models/bookingModel");

const autoBookingStatus = async () => {
  // console.log("working");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  // console.log("today" , today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  // console.log("yesterday", yesterday);

  try {
    // ✅ Auto Check-in: If today == checkInDate → checked-in
    await bookingModel.updateMany(
      {
        checkInDate: { $lte: today },
        isChecking: "confirm", // Admin has confirmed the booking
      },
      {
        $set: { isChecking: "checked-in" },
      }
    );

    // ✅ Auto Check-out: If checkOutDate < today → checked-out
    await bookingModel.updateMany(
      {
        checkOutDate: { $lte: yesterday },
        isChecking: "checked-in",
      },
      {
        $set: { isChecking: "checked-out" },
      }
    );

    console.log("✅ Auto check-in/out done");

    // ✅ Auto Completed: If checkOutDate < today → completed
    await bookingModel.updateMany(
      {
        checkOutDate: { $lte: yesterday },
        isChecking: "checked-out",
      },
      {
        $set: { status: "completed" },
      }
    );
    console.log("✅ Auto completed done");
  } catch (error) {
    console.error("❌ Cron job failed:", error.message);
  }
};

module.exports = autoBookingStatus;
