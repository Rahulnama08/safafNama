const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalRoom: {
      type: Number,
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "locations",
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    hotelImages: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("hotels", hotelSchema);
