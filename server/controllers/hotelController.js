const hotelModel = require("../models/hotelModel");
const locationModel = require("../models/locationModel");
const roomModel = require("../models/roomModel");
const stateModel = require("../models/stateModel");
const { uploadFile, updateFile } = require("../utils/helper");

exports.create = async (req, res) => {
  
  try {
    const {
      state,
      city,
      name,
      address,
      totalRoom,
      description,
      contactNumber,
      contactEmail,
    } = req.body;

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

    const checkHotel = await hotelModel.findOne({ name });
    if (checkHotel) {
      return res.status(400).json({ message: "Hotel already exists" });
    }

    if (!req.files || !req.files.hotelImages) {
      return res.status(400).json({ message: "Images are required" });
    }

    const hotelImages = req.files.hotelImages;
    const uploadedImages = await uploadFile(hotelImages);
 

    

    const hotel = {
      name,
      address,
      totalRoom,
      locationId: checkCity._id,
      assignedBy: req.user._id,
      stateId: checkState._id,
      description,
      contactNumber,
      contactEmail,
      hotelImages: uploadedImages,
    };
    const newHotel = new hotelModel(hotel);
    const save = await newHotel.save();
    res.status(201).json({ message: "Hotel added successfully" });

    // const checkLocation = await locationModel.findOne({ name: location });
    // if (!checkLocation) {
    //   return res.status(400).json({ message: "Location does not exist" });
    // }
    // const checkHotel = await hotelModel.findOne({ name });
    // if (checkHotel) {
    //   return res.status(400).json({ message: "Hotel already exists" });
    // }
    // const hotel = {
    //   name,
    //   address,
    //   totalRoom,
    //   locationId: checkLocation._id,
    //   assignedBy: req.user._id,
    //   description,
    // };
    // const newHotel = new hotelModel(hotel);
    // const save = await newHotel.save();
    // res.status(201).json({ message: "Hotel added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const hotel = await hotelModel
      .find()
      .populate("assignedBy", "name email age phone role status")
      .populate("locationId", "name code status")
      .populate("stateId", "name code status");

    res.status(200).json(hotel);
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

    const hotel = await hotelModel.findById(id);
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
    if (hotel.status === "active") status = "inactive";
    else status = "active";

    if (state.status === "inactive") {
      return res.status(400).json({ message: "State is inactive" });
    }

    if (city.status === "inactive") {
      return res.status(400).json({ message: "City is inactive" });
    }

    const updateLocation = await hotelModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    const updateRoom = await roomModel.updateMany(
      { hotelId: id },
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

    const hotel = await hotelModel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "No Hotel found" });
    }

    const deleteLocation = await hotelModel.findByIdAndDelete(id);
    const deleteRooms = await roomModel.deleteMany({ hotelId: id });

    return res.status(200).json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllByCity = async (req, res) => {
  console.log(req.query);
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ message: "Please provide an id" });
    }

    const hotels = await hotelModel
      .find({ locationId: id })
      .populate("assignedBy", "name email age phone role status")
      .populate("locationId", "name code status")
      .populate("stateId", "name code status");

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.update = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { id } = req.query;
//     const data = req.body;

//     if (!id) {
//       return res.status(404).json({ message: "Error" });
//     }

//     const hotelImages = req.files.hotelImages;
//     const uploadedImages = await uploadFile(hotelImages);

//     if (uploadedImages) {
//       data.hotelImages = uploadedImages;
//     }

//     const updateHotel = await hotelModel.findByIdAndUpdate(
//       id,
//       {
//         ...data,
//       },
//       { new: true }
//     );

//     return res
//       .status(200)
//       .json({ message: "Hotel updated", hotel: updateHotel });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.update = async (req, res) => {
  console.log(req.body)
  console.log(req.files)
  try {
    const { id } = req.query;
    const data = req.body;

    if (!id) {
      return res.status(404).json({ message: "ID not found" });
    }

    const newImages = req.files?.hotelImages || [];
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
    
    console.log(req.body.existingImages, "existingImages");
    // let images = {
    //   url: "",
    //   public_id: "",
    // }
    // for (let i = 0; i<existingImages.length; i++){
    //   images.url = existingImages[i];
    //   images.public_id = existingImages[i];
    //   uploadedImages.push(images);
    // }



    // data.hotelImages = uploadedImages;
    let images = [...existingImages, ...uploadedImages];
    data.hotelImages = images;
    
    const updateHotel = await hotelModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Hotel updated", hotel: updateHotel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.hotelsWithRooms = async (req, res) => {
  try {
    const hotel = await hotelModel
      .find()
      .populate("assignedBy", "name email age phone role status")
      .populate("locationId", "name code status")
      .populate("stateId", "name code status");

    const rooms = await roomModel
      .find()
      .populate("hotelId", "name code status");

    res.status(200).json({ hotels: hotel, rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  console.log(req.files);
  try {
    const { id } = req.query;

    const hotel = await hotelModel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "No Hotel found" });
    }

    if (!req.files || !req.files.hotelImages) {
      return res.status(400).json({ message: "Images are required" });
    }

    const uploadedImages = await updateFile(req.files.hotelImages);
    console.log(uploadedImages);

    const updateLocation = await hotelModel.findByIdAndUpdate(
      id,
      {
        hotelImages: [...hotel.hotelImages, ...uploadedImages],
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
