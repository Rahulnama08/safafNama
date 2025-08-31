import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../../utils/api";

const EditRoom = () => {
  const { id } = useParams();
  const location = useLocation();
  let navigate = useNavigate();
  const { stateData } = location.state || {}; // fallback in case state is undefined
  console.log(stateData);

  const [images, setImages] = useState({
    image1: stateData?.images[0]?.url || stateData.images[0],
    image2: stateData?.images[1]?.url || stateData.images[1],
    image3: stateData?.images[2]?.url || stateData.images[2],
    image4: stateData?.images[3]?.url || stateData.images[3],
    image5: stateData?.images[4]?.url || stateData.images[4],
  });

  const [roomNumber, setRoomNumber] = useState(stateData.roomNumber || "");
  const [pricePerNight, setPricePerNight] = useState(
    stateData.pricePerNight || 0
  );
  const [description, setDescription] = useState(stateData.description || "");
  const [totalPersons, setTotalPersons] = useState(stateData.totalPersons || 0);
  const [amenities, setAmenities] = useState(stateData.amenities || []);
  const [roomType, setRoomType] = useState(stateData.roomType || "");

  const handleSubmit = async (e) => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    e.preventDefault();
    // Handle form submission logic here
    console.log({
      roomNumber,
      pricePerNight,
      description,
      totalPersons,
      amenities,
      roomType,
    });

    try {

      const formData = new FormData();

      formData.append("roomNumber", roomNumber);
      formData.append("pricePerNight", pricePerNight);
      formData.append("description", description);
      formData.append("totalPersons", totalPersons);
      formData.append("amenities", amenities);
      formData.append("roomType", roomType);

      Object.values(images).forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img); // new file
        } else if (typeof img === "string") {
          formData.append("existingImages", img); // old image URL
        }
      });

      let res = await axios.put(
        `${BASE_URL}/rooms/update?id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/admin/room");

      // console.log(res);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
 
  
  
  return (
    <div className="pb-15 font-serif">
      <Link to="/admin/room">
        <h1 className="font-medium  text-md text-blue-500 tracking-tighter">
          Back
        </h1>
      </Link>
      <h1 className="font-medium mt-3 text-3xl tracking-tighter">Edit Room</h1>

      <div className="mt-10 sm:px-5 max-sm:w-full sm:w-3/4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="w-full">
              <label htmlFor="name">
                <span className="text-lg font-medium tracking-tight">
                  State
                </span>

                <input
                  type="text"
                  id="name"
                  placeholder="state"
                  value={stateData.stateId.name}
                  disabled
                  className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="w-full">
              <label htmlFor="name">
                <span className="text-lg font-medium tracking-tight">City</span>

                <input
                  type="text"
                  id="name"
                  placeholder="state"
                  value={stateData?.locationId?.name}
                  disabled
                  className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="w-full">
              <label htmlFor="name">
                <span className="text-lg font-medium tracking-tight">
                  Hotel
                </span>

                <input
                  type="text"
                  id="name"
                  placeholder="state"
                  value={stateData.hotelId.name}
                  disabled
                  className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="w-full">
              <label htmlFor="roomType">
                <span className="text-lg font-medium tracking-tight">
                  Room Type
                </span>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                >
                  <option value="">Select</option>
                  {[
                    "Deluxe",
                    "Suite",
                    "Standard",
                    "Family",
                    "Single",
                    "Double",
                  ].map((s, index) => (
                    <option key={index} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="w-full">
              <label htmlFor="roomNumber">
                <span className="text-lg font-medium tracking-tight">
                  Enter Room Number
                </span>

                <input
                  type="text"
                  id="roomNumber"
                  placeholder="Room Number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="w-full">
              <label htmlFor="pricePerNight">
                <span className="text-lg font-medium tracking-tight">
                  Room's Price ( per night )
                </span>

                <input
                  type="number"
                  id="pricePerNight"
                  placeholder="Price"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="w-full">
              <label htmlFor="totalPersons">
                <span className="text-lg font-medium tracking-tight">
                  Person's Capacity
                </span>

                <input
                  type="number"
                  id="totalPersons"
                  placeholder="Capacity"
                  value={totalPersons}
                  onChange={(e) => setTotalPersons(e.target.value)}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            {/* <div className="w-full">
              <label htmlFor="pricePerNight">
                <span className="text-lg font-medium tracking-tight">
                  Enter Room's Price ( per night )
                </span>

                <input
                  type="number"
                  id="pricePerNight"
                  placeholder="Price"
                  value={room.pricePerNight}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div> */}
          </div>

          <div className="mt-7">
            <label className="text-lg font-medium tracking-tight">
              Amenities
            </label>
            <div className="mt-2 flex items-center gap-5 flex-wrap">
              {[
                "WiFi",
                "TV",
                "Air Conditioning",
                "Mini Bar",
                "Room Service",
                "Balcony",
              ].map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={(e) => {
                      const updatedAmenities = e.target.checked
                        ? [...amenities, amenity]
                        : amenities.filter((a) => a !== amenity);

                      setAmenities(updatedAmenities);
                    }}
                    className="bg-gray-700 border border-gray-600 rounded"
                  />
                  <label htmlFor={amenity} className="ml-2 text-sm">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <label htmlFor="description">
              <span className="text-lg font-medium tracking-tight">
                Enter Room Description
              </span>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hotel Description"
                required
                rows="5"
                className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none resize-none"
                id="description"
              ></textarea>
            </label>
          </div>

          <div className="mt-7">
            <span className="text-lg font-medium tracking-tight">
              Enter Hotel Images
            </span>

            <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
              {Object.keys(images).map((key) => (
                <label htmlFor={`images-${key}`} key={key}>
                  <img
                    className="max-h-13 cursor-pointer opacity-80"
                    src={
                      images[key]
                        ? typeof images[key] === "string"
                          ? images[key] // already a URL string from backend
                          : URL.createObjectURL(images[key]) // File object from input
                        : "/assets/uploadArea.svg"
                    }
                    alt=""
                  />
                  <input
                    type="file" 
                    accept="image/*"
                    id={`images-${key}`}
                    hidden
                    onChange={(e) =>
                      setImages({
                        ...images,
                        [key]: e.target.files[0],
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          {/* 
          <div className="mt-7">
            <label htmlFor="images">
              <span className="text-lg font-medium tracking-tight">
                Upload Room Images
              </span>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 w-full px-3 py-2 rounded-md border border-gray-400 sm:text-sm outline-none"
              />
            </label>
          </div> */}

          <div className="mt-7">
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
