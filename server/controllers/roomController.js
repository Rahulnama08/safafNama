const hotelModel = require("../models/hotelModel");
const locationModel = require("../models/locationModel");
const roomModel = require("../models/roomModel");
const stateModel = require("../models/stateModel");
const { uploadFile } = require("../utils/helper");

exports.createRoom = async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.files", req.files);
  try {
    const {
      state,
      city,
      hotel,
      roomNumber,
      roomType,
      pricePerNight,
      description, 
      totalPersons,
      amenities,
    } = req.body;

    let parsedAmenities = [];

    if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    } else if (typeof amenities === "string") {
      // Handle the case when there's only one amenity
      parsedAmenities = [amenities];
    }

    const checkState = await stateModel.findOne({ name: state });
    if (!checkState) {
      return res.status(400).json({ message: "State does not exist" });
    }
    if (checkState.status === "inactive") {
      return res.status(400).json({ message: "State is inactive" });
    }

    const checkCity = await locationModel.findOne({ name: city });
    if (!checkCity) {
      return res.status(400).json({ message: "City does not exist" });
    }
    if (checkCity.status === "inactive") {
      return res.status(400).json({ message: "City is inactive" });
    }

    const checkHotel = await hotelModel.findOne({ name: hotel });
    // console.log(checkHotel)
    if (!checkHotel) {
      return res.status(400).json({ message: "Hotel does not exist" });
    }
    if (checkHotel.status === "inactive") {
      return res.status(400).json({ message: "Hotel is inactive" });
    }

    const checkRoomInHotel = await roomModel.findOne({
      hotelId: checkHotel._id,
      roomNumber,
    });
    // console.log(checkRoomInHotel)

    if (checkRoomInHotel) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // const checkRoom = await roomModel.findOne({ roomNumber });
    // if (checkRoom) {
    //   return res.status(400).json({ message: "Room already exists" });
    // }

      if (!req.files || !req.files.images) {
        return res.status(400).json({ message: "Images are required" });
      }

      const roomImages = req.files.images;
      const uploadedImages = await uploadFile(roomImages);

    const room = {
      hotelId: checkHotel._id,
      stateId: checkState._id,
      locationId: checkCity._id,
      roomNumber,
      roomType,
      pricePerNight,
      description,
      totalPersons,
      amenities: parsedAmenities,
      images: uploadedImages,
      assignedBy: req.user._id,
    };
    // console.log(room);

    const newRoom = new roomModel(room);
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room });
  } catch (error) {
    // console.log(error)

    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const rooms = await roomModel
      .find()
      .populate("assignedBy", "name email age phone role status")
      .populate(
        "hotelId",
        "name address status totalRoom description contactNumber contactEmail"
      )
      .populate("stateId", "name code status")
      .populate("locationId", "name code status");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllByHotel = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const rooms = await roomModel
      .find({ hotelId: id })
      .populate("assignedBy", "name email age phone role status")
      .populate("hotelId", "name code status totalRoom description contactNumber contactEmail")
      .populate("stateId", "name code status")
      .populate("locationId", "name code status");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllByCity = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const rooms = await roomModel
      .find({ locationId: id })
      .populate("assignedBy", "name email age phone role status")
      .populate("hotelId", "name code status")
      .populate("stateId", "name code status")
      .populate("locationId", "name code status");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllByState = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const rooms = await roomModel
      .find({ stateId: id })
      .populate("assignedBy", "name email age phone role status")
      .populate("hotelId", "name code status")
      .populate("stateId", "name code status")
      .populate("locationId", "name code status");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const room = await roomModel
      .findById(id)
      .populate("assignedBy", "name email age phone role status")
      .populate("hotelId", "name code status")
      .populate("stateId", "name code status")
      .populate("locationId", "name code status");

    if (!room) {
      return res.status(404).json({ message: "No Room found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const room = await roomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const hotel = await hotelModel.findById(room.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "No Hotel found" });
    }

    const city = await locationModel.findById(hotel.locationId);
    if (!city) {
      return res.status(404).json({ message: "No City found" });
    }

    const state = await stateModel.findById(city.stateId);
    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    let status = "";
    if (room.status === "active") status = "inactive";
    else status = "active";

    if (state.status === "inactive") {
      return res.status(400).json({ message: "State is inactive" });
    }

    if (hotel.status === "inactive") {
      return res.status(400).json({ message: "Hotel is inactive" });
    }

    if (city.status === "inactive") {
      return res.status(400).json({ message: "City is inactive" });
    }

    const updateLocation = await roomModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Location updated", location: updateLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.hardDelete = async (req, res) => {
  console.log(req.query);
  console.log(req.data);
  console.log('fwsfws');
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const room = await roomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "No Room found" });
    }

    const deleteLocation = await roomModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  console.log(req.body);
  console.log("object");
  try {
    const { id } = req.query;
    const data = req.body;

    if (!id) {
      return res.status(404).json({ message: "Error" });
    }

    const newImages = req.files?.images || [];
    const uploadedImages = await uploadFile(newImages);

    // Merge new uploaded images with existing image URLs
    let existingImages = [];
    if (req.body.existingImages) {
      // Support both single and multiple existing image strings
      if (typeof req.body.existingImages === "string") {
        existingImages = [req.body.existingImages];
      } else {
        existingImages = req.body.existingImages;
      }
    }

    let images = [...existingImages, ...uploadedImages];
    data.images = images;

    const updateRoom = await roomModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Room updated", room: updateRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
