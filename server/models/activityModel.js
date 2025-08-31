const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ipAddress: {
      type: String,
    },
    systemName: {
      type: String,
    },
    location: {
      type: String,
    },
    action: {
      type: String,
      enum: ["login", "logout", "signup"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("activity", activitySchema);
