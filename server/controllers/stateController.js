const hotelModel = require("../models/hotelModel");
const locationModel = require("../models/locationModel");
const roomModel = require("../models/roomModel");
const stateModel = require("../models/stateModel");

exports.create = async (req, res) => {
  console.log(req.body);
  console.log("hrlll");
  try {
    const { name, code } = req.body;
    const checkState = await stateModel.findOne({ name });
    console.log(checkState);
    console.log(req.body);

    if (checkState) {
      return res.status(400).json({ message: "State already exists" });
    }

    const state = {
      name,
      code,
      assignedBy: req.user._id,
    };

    const newState = new stateModel(state);
    const save = await newState.save();
    res.status(201).json({ message: "State added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const state = await stateModel
      .find()
      .populate("assignedBy", "name email age phone role status");

    res.status(200).json(state);
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

    const state = await stateModel
      .findById(id)
      .populate("assignedBy", "name email age phone role status");

    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    res.status(200).json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateState = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.query;
    const { code } = req.body;

    if (!id) {
      return res.status(404).json({ message: "Error" });
    }

    const state = await stateModel.findById(id);
    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    const updatedState = await stateModel.findByIdAndUpdate(
      id,
      {
        code,
      },
      { new: true }
    );
    console.log(updatedState)

    return res
      .status(200)
      .json({ message: "State updated", state: updatedState });
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

    const state = await stateModel.findById(id);
    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    let status = "";
    if (state.status === "active") status = "inactive";
    else status = "active";

    const updateCity = await locationModel.updateMany(
      { stateId: id },
      { $set: { status } }
    );

    const updateHotel = await hotelModel.updateMany(
      { stateId: id },
      { $set: { status } }
    );

    const updateRoom = await roomModel.updateMany(
      { stateId: id },
      { $set: { status } }
    );

    const updatedState = await stateModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Location updated", state: updatedState });
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

    const state = await stateModel.findById(id);
    if (!state) {
      return res.status(404).json({ message: "No State found" });
    }

    const updatedState = await stateModel.findByIdAndDelete(id);

    const deleteCities = await locationModel.deleteMany({ stateId: id });
    const deleteHotels = await hotelModel.deleteMany({ stateId: id });
    const deleteRooms = await roomModel.deleteMany({ stateId: id });

    return res.status(200).json({ message: "State deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
