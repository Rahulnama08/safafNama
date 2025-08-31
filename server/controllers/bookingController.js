const bookingModel = require("../models/bookingModel");
const moment = require("moment");
const approvedBookingMail = require("../utils/approvedMail");
exports.bookRoom = async (req, res) => {
  console.log(req.body);
  try {
    const {
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalAmount,
      userName,
      userPhone,
    } = req.body;

    const conflict = await bookingModel.findOne({
      roomId,
      status: "booked",
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });
    console.log("bjjb", conflict);

    if (conflict) {
      return res
        .status(200)
        .json({ message: "Room is already booked for these dates" });
    }

    const booking = new bookingModel({
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalAmount,
      userName,
      userPhone,
      userId: req.user._id,
    });
    const save = await booking.save();
    res.status(201).json({ message: "Request sent successfully to admin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  console.log(req.body);
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    console.log(new Date(checkInDate), new Date(checkOutDate));

    const bookings = await bookingModel.find({
      roomId: roomId,
    });
    console.log(bookings);

    const conflict = await bookingModel.findOne({
      roomId,
      status:  "booked" || "pending",
      
      checkInDate: { $lt: new Date(checkOutDate) }, 
      checkOutDate: { $gt: new Date(checkInDate) }, 
    });
    console.log("dfwvwsfrsfswf--------------------", conflict);

    if (conflict) {
      return res.status(200).json({ available: false });
    }
    console.log("------------------");

    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const booking = await bookingModel
      .find()
      .populate(
        "hotelId",
        "name address status totalRoom description contactNumber contactEmail"
      )
      .populate(
        "roomId",
        "name address status totalRoom description contactNumber contactEmail roomNumber images"
      )
      .populate("userId", "name email age phone role status");

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// for admin

exports.approved = async (req, res) => {
  console.log(req.query);
  try {
    const { id } = req.query;
    const approved = await bookingModel.findByIdAndUpdate(
      id,
      {
        status: "booked",
      },
      { new: true }
    );

    const populatedBooking = await bookingModel
      .findById(id)
      .populate("userId", "name email")
      .populate("roomId", "roomNumber roomType ");


    await approvedBookingMail(populatedBooking);

    res.status(200).json({ message: "Approved", approved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pending = async (req, res) => {
  try {
    const { id } = req.query;
    const pending = await bookingModel.findByIdAndUpdate(
      id,
      {
        status: "pending",
      },
      { new: true }
    );

    res.status(200).json({ message: "Pending", pending });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelled = async (req, res) => {
  try {
    const { id } = req.query;
    const cancelled = await bookingModel.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
      },
      { new: true }
    );

    res.status(200).json({ message: "Cancelled", cancelled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// --------------------------------------------------

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await bookingModel
      .find({ userId })
      .populate(
        "hotelId",
        "name address status totalRoom description contactNumber contactEmail"
      )
      .populate(
        "roomId",
        "name address status totalRoom description contactNumber contactEmail roomNumber images"
      )
      .populate("userId", "name email age phone role status");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.confirmBookingUser = async (req, res) => {
  // console.log(req.headers)
  // console.log(req.query)
  try {
    const { id } = req.query;
    const confirm = await bookingModel.findByIdAndUpdate(
      id,
      {
        isChecking: "confirm",
      },
      { new: true }
    );

    res.status(200).json({ message: "Confirmed", confirm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBookingUser = async (req, res) => {
  try {
    const { id } = req.query;
    const cancel = await bookingModel.findByIdAndUpdate(
      id,
      {
        isChecking: "cancelled",
      },
      { new: true }
    );

    res.status(200).json({ message: "Cancelled", cancel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------

exports.analytics = async (req, res) => {
  try {
    const bookings = await bookingModel.find({
      $or: [
        { checkInDate: { $gte: new Date(getLastSunday()) } },
        { checkOutDate: { $gte: new Date(getLastSunday()) } },
      ],
    });
    // console.log("fwfwfwegverwgvergvegvebvebv")
    // console.log(bookings)
    // console.log("fwfwfwegverwgvergvegvebvebv")

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const chartData = days.map((day) => ({ day, checkin: 0, checkout: 0 }));
    // console.log("chartData", chartData);

    bookings.forEach((booking) => {
      const checkinDay = new Date(booking.checkInDate).getDay();
      const checkoutDay = new Date(booking.checkOutDate).getDay();

      chartData[checkinDay].checkin += 1;
      chartData[checkoutDay].checkout += 1;
    });

    // console.log("chartData2", chartData);
    res.json(chartData);
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Utility to get last Sunday's date
function getLastSunday() {
  const today = new Date();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());
  lastSunday.setHours(0, 0, 0, 0);
  console.log("lastSunday", lastSunday);
  return lastSunday;
}

// exports.weeklyRevenue = async (req, res) => {
//   try {
//     const bookings = await bookingModel.find({
//       status: "booked",
//       isChecking: "confirm",
//     });

//     // Initialize revenue data for each day of the week
//     const revenueByDay = {
//       Sunday: 0,
//       Monday: 0,
//       Tuesday: 0,
//       Wednesday: 0,
//       Thursday: 0,
//       Friday: 0,
//       Saturday: 0,
//     };

//     // Fill revenue by matching day from createdAt
//     bookings.forEach((booking) => {
//       const dayName = new Date(booking.createdAt).toLocaleDateString("en-US", {
//         weekday: "long",
//       });
//       revenueByDay[dayName] += booking.totalAmount;
//     });

//     // Convert object to array format for chart
//     const chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
//       day,
//       revenue,
//     }));

//     res.status(200).json(chartData);
//   } catch (error) {
//     console.error("Error fetching revenue:", error.message);
//     res.status(500).json({ message: "Failed to get weekly revenue" });
//   }
// };


// exports.weeklyRevenue = async (req, res) => {
//   try {
//     const startOfLastWeek = moment()
//       .subtract(1, "weeks")
//       .startOf("week")
//       .startOf("day")
//       .toDate(); // last Sunday
//     const endOfLastWeek = moment()
//       .subtract(1, "weeks")
//       .endOf("week")
//       .endOf("day")
//       .toDate(); // last Saturday

//     const bookings = await bookingModel.find({
//       status: "booked",
//       isChecking: "confirm",
//       createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
//     });

//     const revenueByDay = {
//       Sunday: 0,
//       Monday: 0,
//       Tuesday: 0,
//       Wednesday: 0,
//       Thursday: 0,
//       Friday: 0,
//       Saturday: 0,
//     };

//     bookings.forEach((booking) => {
//       const dayName = new Date(booking.createdAt).toLocaleDateString("en-US", {
//         weekday: "long",
//       });
//       revenueByDay[dayName] += booking.totalAmount;
//     });

//     const chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
//       day,
//       revenue,
//     }));

//     res.status(200).json(chartData);
//   } catch (error) {
//     console.error("Error fetching revenue:", error.message);
//     res.status(500).json({ message: "Failed to get weekly revenue" });
//   }
// };

// exports.weeklyRevenue = async (req, res) => {
//   try {
//     const startOfLastWeekMoment = moment().subtract(1, "weeks").startOf("week");
//     const endOfLastWeekMoment = moment().subtract(1, "weeks").endOf("week");

//     const startOfLastWeek = startOfLastWeekMoment.startOf("day").toDate();
//     const endOfLastWeek = endOfLastWeekMoment.endOf("day").toDate();

//     const bookings = await bookingModel.find({
//       status: "booked",
//       isChecking: "confirm",
//       createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
//     });

//     const revenueByDay = {
//       Sunday: 0,
//       Monday: 0,
//       Tuesday: 0,
//       Wednesday: 0,
//       Thursday: 0,
//       Friday: 0,
//       Saturday: 0,
//     };

//     bookings.forEach((booking) => {
//       const dayName = new Date(booking.createdAt).toLocaleDateString("en-US", {
//         weekday: "long",
//       });
//       revenueByDay[dayName] += booking.totalAmount;
//     });

//     const chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
//       day,
//       revenue,
//     }));

//     const weekRangeLabel = `${startOfLastWeekMoment.format(
//       "MMMM D, YYYY"
//     )} - ${endOfLastWeekMoment.format("MMMM D, YYYY")}`;

//     res.status(200).json({
//       weekRange: weekRangeLabel,
//       data: chartData,
//     });
//   } catch (error) {
//     console.error("Error fetching revenue:", error.message);
//     res.status(500).json({ message: "Failed to get weekly revenue" });
//   }
// };

exports.weeklyRevenue = async (req, res) => {
  try {
    const { week = "last", start, end } = req.query;

    let startDate, endDate;
    let label = "";

    if (week === "current") {
      const startMoment = moment().startOf("week");
      const endMoment = moment().endOf("week");
      startDate = startMoment.toDate();
      endDate = endMoment.toDate();
      label = `${startMoment.format("MMMM D, YYYY")} - ${endMoment.format(
        "MMMM D, YYYY"
      )}`;
    } else if (week === "custom" && start && end) {
      startDate = moment(start).startOf("day").toDate();
      endDate = moment(end).endOf("day").toDate();
      label = `${moment(start).format("MMMM D, YYYY")} - ${moment(end).format(
        "MMMM D, YYYY"
      )}`;
    } else {
      // Default: last week
      const startMoment = moment().subtract(1, "weeks").startOf("week");
      const endMoment = moment().subtract(1, "weeks").endOf("week");
      startDate = startMoment.toDate();
      endDate = endMoment.toDate();
      label = `${startMoment.format("MMMM D, YYYY")} - ${endMoment.format(
        "MMMM D, YYYY"
      )}`;
    }

    const bookings = await bookingModel.find({
      status: "booked",
      isChecking: "confirm",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const revenueByDay = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    bookings.forEach((booking) => {
      const dayName = new Date(booking.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
      });
      revenueByDay[dayName] += booking.totalAmount;
    });

    const chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
      day,
      revenue,
    }));

    res.status(200).json({
      weekRange: label,
      data: chartData,
    });
  } catch (error) {
    console.error("Error fetching revenue:", error.message);
    res.status(500).json({ message: "Failed to get weekly revenue" });
  }
};




// exports.getWeeklyBookingCounts = async (req, res) => {
//   try {
//     const startOfWeek = moment().startOf("week").startOf("day").toDate(); // Sunday
//     const endOfWeek = moment().endOf("week").endOf("day").toDate(); // Saturday

//     const bookings = await bookingModel.find({
//       createdAt: { $gte: startOfWeek, $lte: endOfWeek },
//     });

//     // Initialize counts with 0 for each day
//     const weekDays = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const dayCounts = weekDays.map((day) => ({
//       day,
//       bookings: 0,
//     }));

//     // Count bookings per day
//     bookings.forEach((booking) => {
//       const dayIndex = new Date(booking.createdAt).getDay(); // 0=Sun, 6=Sat
//       dayCounts[dayIndex].bookings += 1;
//     });

//     res.status(200).json(dayCounts);
//   } catch (error) {
//     console.error("Error in weekly bookings:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// exports.getWeeklyBookingCounts = async (req, res) => {
//   try {
//     const startOfLastWeek = moment()
//       .subtract(1, "weeks")
//       .startOf("week")
//       .startOf("day")
//       .toDate(); // last Sunday
//     const endOfLastWeek = moment()
//       .subtract(1, "weeks")
//       .endOf("week")
//       .endOf("day")
//       .toDate(); // last Saturday

//     const bookings = await bookingModel.find({
//       createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
//     });

//     const weekDays = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const dayCounts = weekDays.map((day) => ({
//       day,
//       bookings: 0,
//     }));

//     bookings.forEach((booking) => {
//       const dayIndex = new Date(booking.createdAt).getDay(); // 0=Sun, 6=Sat
//       dayCounts[dayIndex].bookings += 1;
//     });

//     res.status(200).json(dayCounts);
//   } catch (error) {
//     console.error("Error in weekly bookings:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// exports.getWeeklyBookingCounts = async (req, res) => {
//   try {
//     const startOfLastWeekMoment = moment().subtract(1, "weeks").startOf("week");
//     const endOfLastWeekMoment = moment().subtract(1, "weeks").endOf("week");

//     const startOfLastWeek = startOfLastWeekMoment.startOf("day").toDate();
//     const endOfLastWeek = endOfLastWeekMoment.endOf("day").toDate();

//     const bookings = await bookingModel.find({
//       createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
//     });

//     const weekDays = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const dayCounts = weekDays.map((day) => ({
//       day,
//       bookings: 0,
//     }));

//     bookings.forEach((booking) => {
//       const dayIndex = new Date(booking.createdAt).getDay();
//       dayCounts[dayIndex].bookings += 1;
//     });

//     const weekRangeLabel = `${startOfLastWeekMoment.format(
//       "MMMM D, YYYY"
//     )} - ${endOfLastWeekMoment.format("MMMM D, YYYY")}`;

//     res.status(200).json({
//       weekRange: weekRangeLabel,
//       data: dayCounts,
//     });
//   } catch (error) {
//     console.error("Error in weekly bookings:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



exports.getWeeklyBookingCounts = async (req, res) => {
  try {
    const { week = "last", start, end } = req.query;

    let startDate, endDate, weekRange;

    if (week === "custom" && start && end) {
      startDate = moment(start).startOf("day").toDate();
      endDate = moment(end).endOf("day").toDate();
      weekRange = `${moment(startDate).format("MMM D")} - ${moment(
        endDate
      ).format("MMM D")}`;
    } else if (week === "current") {
      startDate = moment().startOf("week").startOf("day").toDate();
      endDate = moment().endOf("week").endOf("day").toDate();
      weekRange = `Current Week (${moment(startDate).format(
        "MMM D"
      )} - ${moment(endDate).format("MMM D")})`;
    } else {
      // Default to last week
      startDate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .startOf("day")
        .toDate();
      endDate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .endOf("day")
        .toDate();
      weekRange = `Last Week (${moment(startDate).format("MMM D")} - ${moment(
        endDate
      ).format("MMM D")})`;
    }

    const bookings = await bookingModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayCounts = weekDays.map((day) => ({ day, bookings: 0 }));

    bookings.forEach((booking) => {
      const dayIndex = new Date(booking.createdAt).getDay();
      dayCounts[dayIndex].bookings += 1;
    });

    res.status(200).json({ data: dayCounts, weekRange });
  } catch (error) {
    console.error("Error in weekly bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.bookingCount = async (req, res) => {
  try {
    let data = await bookingModel.find();

    let confirmBookings = 0;
    let pendingBookings = 0;
    let cancelledBookings = 0;

    data.forEach((booking) => {
      if (booking.status === "booked" && booking.isChecking === "confirm") {
        confirmBookings += 1;
      } else if (
        booking.status === "pending" ||
        (booking.isChecking === "pending" && booking.status !== "cancelled")
      ) {
        pendingBookings += 1;
      } else if (
        booking.status === "cancelled" ||
        booking.isChecking === "cancelled"
      ) {
        cancelledBookings += 1;
      }
    });

    const chartData = [
      { browser: "booked", visitors: confirmBookings, fill: "#2b7fff" },
      {
        browser: "cancelled",
        visitors: cancelledBookings,
        fill: "#f0b100",
      },
      {
        browser: "pending",
        visitors: pendingBookings,
        fill: "#fb2c36",
      },
    ];

    console.log(chartData);

    res.status(200).json({ chartData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revenueData = async (req, res) => {
  try {
    // const data = await bookingModel.aggregate([
    //   {
    //     $match: {
    //       status: "booked",
    //       isChecking: { $nin: ["pending", "cancelled"] }
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "rooms",
    //       localField: "roomId",
    //       foreignField: "_id",
    //       as: "room",
    //     },
    //   },
    //   { $unwind: "$room" },
    //   {
    //     $lookup: {
    //       from: "hotels",
    //       localField: "room.hotelId",
    //       foreignField: "_id",
    //       as: "hotel",
    //     },
    //   },
    //   { $unwind: "$hotel" },
    //   {
    //     $lookup: {
    //       from: "locations",
    //       localField: "hotel.locationId",
    //       foreignField: "_id",
    //       as: "location",
    //     },
    //   },
    //   { $unwind: "$location" },
    //   {
    //     $lookup: {
    //       from: "states",
    //       localField: "location.stateId",
    //       foreignField: "_id",
    //       as: "state",
    //     },
    //   },
    //   { $unwind: "$state" },
    //   {
    //     $group: {
    //       _id: {
    //         state: "$state.name",
    //         city: "$location.name",
    //         hotel: "$hotel.name",
    //         room: "$room.roomNumber",
    //       },
    //       totalRevenue: { $sum: "$totalAmount" },
    //       totalBookings: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { totalRevenue: -1 } },
    // ]);

    const data = await bookingModel.aggregate([
      {
        $match: {
          status: { $in: ["booked", "completed"] },
          isChecking: { $nin: ["pending", "cancelled"] },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "hotels",
          localField: "room.hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: "$hotel" },
      {
        $lookup: {
          from: "locations",
          localField: "hotel.locationId",
          foreignField: "_id",
          as: "location",
        },
      },
      { $unwind: "$location" },
      {
        $lookup: {
          from: "states",
          localField: "location.stateId",
          foreignField: "_id",
          as: "state",
        },
      },
      { $unwind: "$state" },
      {
        $group: {
          _id: {
            state: "$state.name",
            city: "$location.name",
            hotel: "$hotel.name",
            room: "$room.roomNumber",
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
    


    console.log(data)

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating revenue report:", error);
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};
