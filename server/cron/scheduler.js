const cron = require("node-cron");
const autoBookingStatus = require("./autoBookingStatus");

// // Run every day at 00:01 AM
// // cron.schedule("1 0 * * *", async () => {
// //   console.log("⏰ Running Auto Check-in/Check-out...");
// //   await autoBookingStatus();
// // });

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron is running every minute");
  await autoBookingStatus();
});
 