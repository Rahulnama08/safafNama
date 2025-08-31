import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../utils/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeProvider";
import { CgSmartphone } from "react-icons/cg";
import { HiOutlineMail } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { LuUsersRound } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";

const CreateRoom = () => {
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const [room, setRoom] = useState({
    state: "",
    city: "",
    hotel: "",
    roomNumber: "",
    roomType: "",
    pricePerNight: "",
    description: "",
    totalPersons: "",
    amenities: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
      alert("No files selected.");
      return;
    }

    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  //submitting data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("data")).token;
      const formData = new FormData();

      formData.append("state", room.state);
      formData.append("city", room.city);
      formData.append("hotel", room.hotel);
      formData.append("roomNumber", room.roomNumber);
      formData.append("roomType", room.roomType);
      formData.append("pricePerNight", room.pricePerNight);
      formData.append("description", room.description);
      formData.append("totalPersons", room.totalPersons);

      // For amenities if it's an array:
      room.amenities.forEach((item) => formData.append("amenities", item));
      // // For multiple images:
      // images.forEach((image) => formData.append("images", image));

      // Appending the images
      // images.forEach((img) => {
      //   if (img.size > 0) {
      //     formData.append("images", img);
      //   } else {
      //     console.error("Empty file selected");
      //   }
      // });

      formData.append("images", images.image1);
      formData.append("images", images.image2);
      formData.append("images", images.image3);
      formData.append("images", images.image4);
      formData.append("images", images.image5);

      const res = await axios.post(`${BASE_URL}/rooms/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Room created:", res.data);
      toast.success(res.data.message);

      // Reset form fields
      setRoom({
        state: "",
        city: "",
        hotel: "",
        roomNumber: "",
        roomType: "",
        pricePerNight: "",
        description: "",
        totalPersons: "",
        amenities: "",
      });

      // Reset images
      setImages({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
      });

      // setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room");
      // console.error("Failed to create room:", error.response?.data?.message);
    }
  };

  // city and state data for dropdown
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [hotelData, setHotelData] = useState([]);

  const fetchStateData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    // console.log(token);

    try {
      const res = await axios.get(`${BASE_URL}/states/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);

      setStateData(res.data.filter((state) => state.status === "active"));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Fetch cities based on selected state
  const fetchCityData = async (stateName) => {
    const token = JSON.parse(localStorage.getItem("data")).token;

    const selectedState = stateData.find((state) => state.name === stateName);

    if (!selectedState) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/locations/getAllByState?id=${selectedState._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCityData(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch cities");
    }
  };

  const fetchHotelData = async (hotelname) => {
    console.log(hotelname);
    const token = JSON.parse(localStorage.getItem("data")).token;

    const selectedCity = cityData.find((hotel) => hotel.name === hotelname);
    console.log(selectedCity);

    if (!selectedCity) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/hotels/getAllByCity?id=${selectedCity._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHotelData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch cities");
    }
  };

  useEffect(() => {
    // fetchData();
    fetchStateData();
  }, []);

  // Run this whenever hotel.state changes
  useEffect(() => {
    if (room.state) {
      fetchCityData(room.state);
    }
  }, [room.state]);

  useEffect(() => {
    if (room.city) {
      fetchHotelData(room.city);
    }
  }, [room.city]);

  // -----------------------------------------------------------------------------------

  const [roomData, setRoomData] = useState([]);
  const fetchRoomData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    // console.log(token);

    try {
      const res = await axios.get(`${BASE_URL}/rooms/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(res.data);
      setRoomData(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  // searching and sorting
  const [search, setSearch] = useState("");
  const filteredData = roomData.filter((state) =>
    // console.log(state),
    state?.hotelId?.name.toLowerCase().includes(search.toLowerCase())
  );

  const [click, setClick] = useState("default");
  const sortedData = [...filteredData].sort((a, b) => {
    if (click === "low") {
      return a.pricePerNight - b.pricePerNight;
    } else if (click === "high") {
      return b.pricePerNight - a.pricePerNight;
    } else if (click === "timeAsc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (click === "timeDesc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return 0; // No sorting
    }
  });

  const [searchInactive, setSearchInactive] = useState("");
  const filteredDataInactive = roomData.filter((state) =>
    state?.hotelId?.name.toLowerCase().includes(searchInactive.toLowerCase())
  );

  const [clickInactive, setClickInactive] = useState("default");
  const sortedDataInactive = [...filteredDataInactive].sort((a, b) => {
    if (click === "low") {
      return a.pricePerNight - b.pricePerNight;
    } else if (click === "high") {
      return b.pricePerNight - a.pricePerNight;
    } else if (clickInactive === "timeAsc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (clickInactive === "timeDesc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return 0; // No sorting
    }
  });

  // -----------------------------------------------------------------------------------

  const handleStatusChange = async (id) => {
    console.log("object");
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.put(
        `${BASE_URL}/rooms/softDelete?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchRoomData();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    console.log("object" ,id);
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      console.log('object')
      const res = await axios.delete(`${BASE_URL}/rooms/hardDelete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('object')

      toast.success(res.data.message);
      fetchRoomData();
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    }
  };

  const { theme } = useTheme();

  return (
    <div className="pb-10 font-serif">
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Add Room
          </h1>

          <div className="mt-10 sm:px-5 max-sm:w-full sm:w-3/4">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="w-full">
                  <label htmlFor="state">
                    <span className="text-lg font-medium tracking-tight">
                      Select State
                    </span>
                    <select
                      id="state"
                      value={room.state}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option
                        className={`${
                          theme === "dark"
                            ? "bg-neutral-900 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                        value=""
                      >
                        Select a state
                      </option>
                      {stateData.map((s, index) => (
                        <option
                          className={`${
                            theme === "dark"
                              ? "bg-neutral-900 text-white border-gray-600"
                              : "bg-white text-black border-gray-300"
                          }`}
                          key={index}
                          value={s.name}
                        >
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="city">
                    <span className="text-lg font-medium tracking-tight">
                      Select City
                    </span>
                    <select
                      id="city"
                      value={room.city}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option
                        className={`${
                          theme === "dark"
                            ? "bg-neutral-900 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                        value=""
                      >
                        Select a city
                      </option>
                      {cityData.map((s, index) => (
                        <option
                          className={`${
                            theme === "dark"
                              ? "bg-neutral-900 text-white border-gray-600"
                              : "bg-white text-black border-gray-300"
                          }`}
                          key={index}
                          value={s.name}
                        >
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="w-full">
                  <label htmlFor="hotel">
                    <span className="text-lg font-medium tracking-tight">
                      Select Hotel
                    </span>
                    <select
                      id="hotel"
                      value={room.hotel}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option
                        className={`${
                          theme === "dark"
                            ? "bg-neutral-900 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                        value=""
                      >
                        Select Hotel
                      </option>
                      {hotelData.map((s, index) => (
                        <option
                          className={`${
                            theme === "dark"
                              ? "bg-neutral-900 text-white border-gray-600"
                              : "bg-white text-black border-gray-300"
                          }`}
                          key={index}
                          value={s.name}
                        >
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="roomType">
                    <span className="text-lg font-medium tracking-tight">
                      Enter Room Type
                    </span>
                    <select
                      id="roomType"
                      value={room.roomType}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option
                        className={`${
                          theme === "dark"
                            ? "bg-neutral-900 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                        value=""
                      >
                        Select
                      </option>
                      {[
                        "Deluxe",
                        "Suite",
                        "Standard",
                        "Family",
                        "Single",
                        "Double",
                      ].map((s, index) => (
                        <option
                          className={`${
                            theme === "dark"
                              ? "bg-neutral-900 text-white border-gray-600"
                              : "bg-white text-black border-gray-300"
                          }`}
                          key={index}
                          value={s}
                        >
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
                      value={room.roomNumber}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>

                <div className="w-full">
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
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="w-full">
                  <label htmlFor="totalPersons">
                    <span className="text-lg font-medium tracking-tight">
                      Total Person's Capacity
                    </span>

                    <input
                      type="number"
                      id="totalPersons"
                      placeholder="Capacity"
                      value={room.totalPersons}
                      onChange={handleChange}
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
                        checked={room.amenities.includes(amenity)}
                        onChange={(e) => {
                          const updatedAmenities = e.target.checked
                            ? [...room.amenities, amenity]
                            : room.amenities.filter((a) => a !== amenity);

                          setRoom((prev) => ({
                            ...prev,
                            amenities: updatedAmenities,
                          }));
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
                    value={room.description}
                    onChange={handleChange}
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
                            ? URL.createObjectURL(images[key])
                            : `/assets/uploadArea.svg`
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
        </TabsContent>

        <TabsContent value="active">
          <div className="mt-5">
            <div className="flex-row gap-5 sm:flex justify-between pr-10 w-full">
              <h1 className="font-medium text-2xl sm:text-3xl tracking-tight">
                Hotels ( Active ){" "}
              </h1>

              <div className="flex gap-5">
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    required
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setClick(e.target.value)}
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
                  >
                    <option value="low">Sort by: Low to High</option>
                    <option value="high">Sort by: High to Low</option>
                    <option value="timeAsc">Sort by: Newest</option>
                    <option value="timeDesc">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Room Details</div>
              <div className="">Contact Info</div>
              <div className="">Created By</div>
              <div className="pl-[3%]">Manage</div>
            </div>

            {sortedData
              .filter((state) => state.status === "active")
              .map((dets, index) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.images[0]?.url || dets.images[0]}
                      alt=""
                    />
                    <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                      <p className="text-2xl font-serif tracking-tight">
                        {dets.hotelId.name} ,
                        <span className="text-[15px]">({dets.roomNumber})</span>{" "}
                      </p>
                      <div class="flex items-center gap-1 text-sm  tracking-tight font-serif">
                        <CiLocationOn
                          className={` text-lg ${
                            theme === "dark" ? "text-white" : "text-black"
                          } `}
                        />
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          {dets.hotelId.address}
                        </span>
                      </div>
                      <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                        <LuUsersRound
                          className={` text-lg ${
                            theme === "dark" ? "text-neutral-400" : "text-black"
                          } `}
                        />
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          Guests: {dets.totalPersons}
                        </span>
                      </div>
                      <p class="font-serif">Price: ₹{dets.pricePerNight}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <HiOutlineMail
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Email: {dets.hotelId.contactEmail}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <CgSmartphone
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Phone: {dets.hotelId.contactNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <BiUser
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Name: {dets.assignedBy.name}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <HiOutlineMail
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Email: {dets.assignedBy.email}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <CgSmartphone
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Phone: {dets.assignedBy.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col w-fit md:items-center">
                    <>
                      <Link
                        to={`/admin/room/edit/${dets._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        state={{ stateData: dets }}
                      >
                        <button class="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusChange(dets._id)}
                        class="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Inactive
                      </button>
                      <button
                        onClick={() => handleDelete(dets._id)}
                        class="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Delete
                      </button>
                    </>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="mt-5">
            <div className="flex-row gap-5 sm:flex justify-between pr-10 w-full">
              <h1 className="font-medium text-2xl sm:text-3xl tracking-tight">
                Hotels ( Inactive ){" "}
              </h1>

              <div className="flex gap-5">
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    required
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setClick(e.target.value)}
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
                  >
                    <option value="low">Sort by: Low to High</option>
                    <option value="high">Sort by: High to Low</option>
                    <option value="timeAsc">Sort by: Newest</option>
                    <option value="timeDesc">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Room Details</div>
              <div className="">Contact Info</div>
              <div className="">Created By</div>
              <div className="pl-[3%]">Manage</div>
            </div>

            {sortedDataInactive
              .filter((state) => state.status === "inactive")
              .map((dets, index) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.images[0]?.url || dets.images[0]}
                      alt=""
                    />
                    <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                      <p className="text-2xl font-serif tracking-tight">
                        {dets.hotelId.name} ,
                        <span className="text-[15px]">({dets.roomNumber})</span>{" "}
                      </p>
                      <div class="flex items-center gap-1 text-sm  tracking-tight font-serif">
                        <CiLocationOn
                          className={` text-lg ${
                            theme === "dark" ? "text-white" : "text-black"
                          } `}
                        />
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          {dets.hotelId.address}
                        </span>
                      </div>
                      <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                        <LuUsersRound
                          className={` text-lg ${
                            theme === "dark" ? "text-neutral-400" : "text-black"
                          } `}
                        />
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          Guests: {dets.totalPersons}
                        </span>
                      </div>
                      <p class="font-serif">Price: ₹{dets.pricePerNight}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <HiOutlineMail
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Email: {dets.hotelId.contactEmail}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <CgSmartphone
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Phone: {dets.hotelId.contactNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <BiUser
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Name: {dets.assignedBy.name}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <HiOutlineMail
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Email: {dets.assignedBy.email}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                      <CgSmartphone
                        className={` text-lg ${
                          theme === "dark" ? "text-neutral-400" : "text-black"
                        } `}
                      />
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-gray-700"
                        }`}
                      >
                        Phone: {dets.assignedBy.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col w-fit md:items-center">
                    <>
                      <Link
                        to={`/admin/room/edit/${dets._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        state={{ stateData: dets }}
                      >
                        <button class="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusChange(dets._id)}
                        class="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleDelete(dets._id)}
                        class="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Delete
                      </button>
                    </>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateRoom;
