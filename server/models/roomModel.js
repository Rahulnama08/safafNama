const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels",
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
    roomNumber: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Deluxe", "Suite", "Standard", "Family", "Single", "Double"], // Add all valid values here
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
      required: true,
    },

    totalPersons: {
      type: Number,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

// 🔑 Add compound unique index here
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("rooms", roomSchema);
