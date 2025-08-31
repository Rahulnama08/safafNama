const { assign } = require("nodemailer/lib/shared");
const locationModel = require("../models/locationModel");
const stateModel = require("../models/stateModel");
const hotelModel = require("../models/hotelModel");
const roomModel = require("../models/roomModel");

exports.create = async (req, res) => {
  try {
    const { state, name, code } = req.body;

    const checkState = await stateModel.findOne({ name: state });
    if (!checkState) {
      return res.status(400).json({ message: "State does not exist" });
    }

    const checkCity = await locationModel.findOne({ name });
    if (checkCity) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const location = {
      name,
      code,
      stateId: checkState._id,
      assignedBy: req.user._id,
    };

    const newLocation = new locationModel(location);
    const save = await newLocation.save();
    res.status(201).json({ message: "Location added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const location = await locationModel
      .find()
      .populate("assignedBy", "name email age phone role status")
      .populate("stateId", "name");

    res.status(200).json(location);
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

    const location = await locationModel
      .findById(id)
      .populate("assignedBy", "name email age phone role status")
      .populate("stateId", "name");

    if (!location) {
      return res.status(404).json({ message: "No Location found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, code } = req.body;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const location = await locationModel.findById(id);
    if (!location) {
      return res.status(404).json({ message: "No Location found" });
    }

    const updateLocation = await locationModel.findByIdAndUpdate(
      id,
      {
        name,
        code,
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

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const location = await locationModel.findById(id);
    if (!location) {
      return res.status(404).json({ message: "No Location found" });
    }

    const state = await stateModel.findById(location.stateId);
    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    let status = "";
    if (location.status === "active") status = "inactive";
    else status = "active";

    
    if (state.status === "inactive") {
      return res.status(400).json({ message: "State is inactive" });
    }

    const updateHotel = await hotelModel.updateMany(
      { locationId: id },
      { $set: { status } }
    );

    const updateLocation = await locationModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    const updateRoom = await roomModel.updateMany(
      { locationId: id },
      { $set: { status } }
    );

    return res
      .status(200)
      .json({ message: "Location updated", location: updateLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.hardDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const location = await locationModel.findById(id);
    if (!location) {
      return res.status(404).json({ message: "No Location found" });
    }

    const updateLocation = await locationModel.findByIdAndDelete(id);
    const deleteHotels = await hotelModel.deleteMany({ locationId: id });
    const deleteRooms = await roomModel.deleteMany({ locationId: id });

    return res.status(200).json({ message: "Location deleted" });
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

    const location = await locationModel
      .find({ stateId: id })
      .populate("assignedBy", "name email age phone role status")
      .populate("stateId", "name");

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
