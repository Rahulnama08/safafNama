import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import BASE_URL from "../../../utils/api";
import { FiEdit2 } from "react-icons/fi";
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
import { BiUser } from "react-icons/bi";
import { LuUsersRound } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";

const CreateHotels = () => {
  const [hotel, setHotel] = useState({
    state: "",
    city: "",
    name: "",
    address: "",
    totalRoom: "",
    description: "",
    contactNumber: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setHotel((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = JSON.parse(localStorage.getItem("data")).token;
    console.log(token);

    try {
      const formData = new FormData();

      formData.append("state", hotel.state);
      formData.append("city", hotel.city);
      formData.append("name", hotel.name);
      formData.append("address", hotel.address);
      formData.append("totalRoom", hotel.totalRoom);
      formData.append("description", hotel.description);
      formData.append("contactNumber", hotel.contactNumber);
      formData.append("contactEmail", hotel.contactEmail);

      formData.append("hotelImages", hotelImages.image1);
      formData.append("hotelImages", hotelImages.image2);
      formData.append("hotelImages", hotelImages.image3);
      formData.append("hotelImages", hotelImages.image4);

      const res = await axios.post(`${BASE_URL}/hotels/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      // console.log(res);
      fetchData();

      setHotel({
        state: "",
        city: "",
        name: "",
        address: "",
        totalRoom: "",
        description: "",
        contactNumber: "",
        contactEmail: "",
      });

      setHotelImages({
        image1: "",
        image2: "",
        image3: "",
        image4: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  const [hotelData, setHotelData] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.get(`${BASE_URL}/hotels/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      setHotelData(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleStatusChange = async (id) => {
    console.log("object");
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.put(
        `${BASE_URL}/hotels/softDelete?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    // console.log("object");
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.delete(`${BASE_URL}/hotels/hardDelete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

  // city and state data for dropdown
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);

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

  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  // Run this whenever hotel.state changes
  useEffect(() => {
    if (hotel.state) {
      fetchCityData(hotel.state);
    }
  }, [hotel.state]);

  // searching and sorting
  const [search, setSearch] = useState("");
  const filteredData = hotelData.filter((state) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  );

  const [click, setClick] = useState("default");
  const sortedData = [...filteredData].sort((a, b) => {
    if (click === "asc") {
      return a.name.localeCompare(b.name);
    } else if (click === "dsc") {
      return b.name.localeCompare(a.name);
    } else if (click === "timeAsc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (click === "timeDesc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return 0; // No sorting
    }
  });

  const [searchInactive, setSearchInactive] = useState("");
  const filteredDataInactive = hotelData.filter((state) =>
    state.name.toLowerCase().includes(searchInactive.toLowerCase())
  );

  const [clickInactive, setClickInactive] = useState("default");
  const sortedDataInactive = [...filteredDataInactive].sort((a, b) => {
    if (clickInactive === "asc") {
      return a.name.localeCompare(b.name);
    } else if (clickInactive === "dsc") {
      return b.name.localeCompare(a.name);
    } else if (clickInactive === "timeAsc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (clickInactive === "timeDesc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return 0; // No sorting
    }
  });

  // ---------------------------------------------------------

  const [hotelImages, setHotelImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const { theme } = useTheme();

  return (
    <div className="pb-15 font-serif">
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Add Hotel
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
                      value={hotel.state}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option value="">Select a state</option>
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
                      value={hotel.city}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    >
                      <option value="">Select a city</option>
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
                  <label htmlFor="name">
                    <span className="text-lg font-medium tracking-tight">
                      Enter Hotel Name
                    </span>

                    <input
                      type="text"
                      id="name"
                      placeholder="Hotel Name"
                      value={hotel.name}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="totalRoom">
                    <span className="text-lg font-medium tracking-tight">
                      Enter Total Rooms
                    </span>

                    <input
                      type="number"
                      id="totalRoom"
                      placeholder="Total Rooms"
                      value={hotel.totalRoom}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="w-full">
                  <label htmlFor="contactNumber">
                    <span className="text-lg font-medium tracking-tight">
                      Enter Hotel's Contact Number
                    </span>

                    <input
                      type="text"
                      id="contactNumber"
                      placeholder="Contact Number"
                      value={hotel.contactNumber}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="contactEmail">
                    <span className="text-lg font-medium tracking-tight">
                      Enter Hotel's Contact Email
                    </span>

                    <input
                      type="email"
                      id="contactEmail"
                      placeholder="Contact Email"
                      value={hotel.contactEmail}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <label htmlFor="address">
                  <span className="text-lg font-medium tracking-tight">
                    Enter Hotel Address
                  </span>

                  <input
                    type="text"
                    id="address"
                    placeholder="Hotel Address"
                    value={hotel.address}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                  />
                </label>
              </div>

              <div className="mt-7">
                <span className="text-lg font-medium tracking-tight">
                  Enter Hotel Images
                </span>

                <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
                  {Object.keys(hotelImages).map((key) => (
                    <label htmlFor={`images-${key}`} key={key}>
                      <img
                        className="max-h-13 cursor-pointer opacity-80"
                        src={
                          hotelImages[key]
                            ? URL.createObjectURL(hotelImages[key])
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
                          setHotelImages({
                            ...hotelImages,
                            [key]: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <label htmlFor="description">
                  <span className="text-lg font-medium tracking-tight">
                    Enter Hotel Description
                  </span>

                  <textarea
                    value={hotel.description}
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
          {" "}
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
                    <option value="asc">Sort by: A to Z</option>
                    <option value="dsc">Sort by: Z to A</option>
                    <option value="timeAsc">Sort by: Newest</option>
                    <option value="timeDesc">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
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
                      src={dets.hotelImages[0]?.url || dets.hotelImages[0]}
                      alt=""
                    />
                    <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                      <p className="text-2xl font-serif tracking-tight">
                        {dets.name}
                      </p>
                      <div className="flex items-center gap-1 text-sm  tracking-tight font-serif">
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
                          {dets.address}
                        </span>
                      </div>

                      <p className="font-serif">Rooms: {dets.totalRoom}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        Email: {dets.contactEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        Phone: {dets.contactNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        to={`/admin/hotel/edit/${dets._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        state={{ stateData: dets }}
                      >
                        <button className="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusChange(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Inactive
                      </button>
                      <button
                        onClick={() => handleDelete(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
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
          {" "}
          <div className="mt-5">
            <div className="flex-row gap-5 sm:flex justify-between pr-10 w-full">
              <h1 className="font-medium text-2xl sm:text-3xl tracking-tight">
                Cities ( Inactive ){" "}
              </h1>

              <div className="flex gap-5">
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchInactive(e.target.value)}
                    value={searchInactive}
                    required
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setClickInactive(e.target.value)}
                    className="mt-1 w-full px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
                  >
                    <option value="asc">Sort by: A to Z</option>
                    <option value="dsc">Sort by: Z to A</option>
                    <option value="timeAsc">Sort by: Newest</option>
                    <option value="timeDesc">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Contact Details</div>
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
                      src={dets.hotelImages[0]?.url || dets.hotelImages[0]}
                      alt=""
                    />
                    <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                      <p className="text-2xl font-serif tracking-tight">
                        {dets.name}
                      </p>
                      <div className="flex items-center gap-1 text-sm  tracking-tight font-serif">
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
                          {dets.address}
                        </span>
                      </div>

                      <p className="font-serif">Rooms: {dets.totalRoom}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        Email: {dets.contactEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        Phone: {dets.contactNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                    <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
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
                        to={`/admin/hotel/edit/${dets._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        state={{ stateData: dets }}
                      >
                        <button className="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusChange(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleDelete(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
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

export default CreateHotels;
