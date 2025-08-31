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

const topCitiesByState = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Kakching", "Churachandpur"],
  Meghalaya: ["Shillong", "Tura", "Nongpoh", "Baghmara", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  Sikkim: ["Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
  ],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Nainital"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah"],

  // Union Territories
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Diglipur",
    "Mayabunder",
    "Rangat",
    "Havelock",
  ],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Silvassa",
    "Daman",
    "Diu",
    "Amli",
    "Khanvel",
  ],
  Delhi: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket"],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Udhampur",
  ],
  Ladakh: ["Leh", "Kargil", "Nubra", "Diskit", "Dras"],
  Lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam", "Oulgaret"],
};
const CreateCity = () => {
  const [suggestedCities, setSuggestedCities] = useState([]);

  const [city, setCity] = useState({
    state: "",
    name: "",
    code: "",
  });

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setCity((prev) => ({
  //     ...prev,
  //     [id]: value,
  //   }));
  // };
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "state") {
      const cities = topCitiesByState[value] || [];
      setSuggestedCities(cities);
      setCity((prev) => ({
        ...prev,
        state: value,
        name: "", // reset city when state changes
      }));
    } else {
      setCity((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = JSON.parse(localStorage.getItem("data")).token;
    console.log(token);

    try {
      console.log(state);
      const res = await axios.post(`${BASE_URL}/locations/create`, city, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      // console.log(res);
      fetchData();

      setCity({
        state: "",
        name: "",
        code: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  const [cityData, setCityData] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    // console.log(token);

    try {
      const res = await axios.get(`${BASE_URL}/locations/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      setCityData(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleStatusChange = async (id) => {
    console.log("object");
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.put(
        `${BASE_URL}/locations/softDelete?id=${id}`,
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
      const res = await axios.delete(
        `${BASE_URL}/locations/hardDelete?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

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

  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  // searching and sorting
  const [search, setSearch] = useState("");
  const filteredData = cityData.filter((state) =>
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
  const filteredDataInactive = cityData.filter((state) =>
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

  const {theme} = useTheme();

  return (
    <div className="pb-15">
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger className="font-serif" value="create">
            Create
          </TabsTrigger>
          <TabsTrigger className="font-serif" value="active">
            Active
          </TabsTrigger>
          <TabsTrigger className="font-serif" value="inactive">
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <h1 className="font-serif mt-5 text-3xl tracking-tighter">
            Add a City
          </h1>

          <div className="mt-10 max-sm:w-full w-1/2 sm:px-5">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="state">
                  <span className="text-lg font-serif tracking-tight">
                    Select State
                  </span>
                  <select
                    id="state"
                    value={city.state}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
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

              <div className="mt-7">
                <label htmlFor="name">
                  <span className="text-lg font-serif tracking-tight">
                    Enter City
                  </span>

                  <select
                    id="name"
                    value={city.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-md font-serif border border-gray-400 sm:text-sm outline-none"
                  >
                    <option value="">Select a city</option>
                    {suggestedCities.map((c, index) => (
                      <option
                        className={`${
                          theme === "dark"
                            ? "bg-neutral-900 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                        key={index}
                        value={c}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-7">
                <label htmlFor="code">
                  <span className="text-lg font-serif tracking-tight">
                    Enter City-code
                  </span>

                  <input
                    type="text"
                    id="code"
                    placeholder="Citycode"
                    value={city.code}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                  />
                </label>
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 font-serif text-white cursor-pointer hover:opacity-90 transition-opacity rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="mt-5 ">
            <div className="flex-row gap-5 sm:flex justify-between pr-10 w-full">
              <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">
                Cities ( Active ){" "}
              </h1>

              <div className="flex gap-5">
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    required
                    className="mt-1 w-full px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setClick(e.target.value)}
                    className="mt-1 w-full px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none"
                  >
                    <option value="asc">Sort by: A to Z</option>
                    <option value="dsc">Sort by: Z to A</option>
                    <option value="timeAsc">Sort by: Newest</option>
                    <option value="timeDesc">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:border border-gray-300 font-serif sm:rounded-2xl sm:p-3 mt-5 ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg w-[100px] ">S.NO.</TableHead>
                    <TableHead className="text-lg ">City</TableHead>
                    <TableHead className="text-lg ">State</TableHead>
                    <TableHead className="text-lg ">Created by</TableHead>
                    <TableHead className="text-lg text-end pr-[7%] ">
                      Manage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData
                    .filter((state) => state.status === "active")
                    .map((state, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{state.name}</TableCell>
                        <TableCell>{state.stateId.name}</TableCell>
                        <TableCell>{state.assignedBy.email}</TableCell>
                        <TableCell className="flex gap-4 justify-end">
                          <Link
                            to={`/admin/city/edit/${state._id}`}
                            state={{ stateData: state }}
                          >
                            <p className="px-1.5 py-0.5 rounded-lg font-medium bg-yellow-500 text-white w-fit cursor-pointer">
                              {/* <FiEdit2 /> */}
                              Edit
                            </p>
                          </Link>
                          <p
                            onClick={() => handleStatusChange(state._id)}
                            className="px-1.5 py-0.5 rounded-lg font-medium bg-blue-500 text-white w-fit cursor-pointer"
                          >
                            Inactive
                          </p>
                          <p
                            onClick={() => handleDelete(state._id)}
                            className="px-1.5 py-0.5 rounded-lg font-medium bg-red-500 text-white w-fit cursor-pointer"
                          >
                            {/* <FiEdit2 /> */}
                            Delete
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="mt-5 font-serif pb-10">
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

            <div className="sm:border border-gray-300 sm:rounded-2xl sm:p-3 mt-5 ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg w-[100px] ">S.NO.</TableHead>
                    <TableHead className="text-lg ">City</TableHead>
                    <TableHead className="text-lg ">State</TableHead>
                    <TableHead className="text-lg ">Created by</TableHead>
                    <TableHead className="text-lg text-end pr-[7%] ">
                      Manage
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sortedDataInactive
                    .filter((state) => state.status === "inactive")
                    .map((state, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{state.name}</TableCell>
                        <TableCell>{state.stateId.name}</TableCell>
                        <TableCell>{state.assignedBy.email}</TableCell>
                        <TableCell className="flex gap-4 justify-end">
                          <Link
                            to={`/admin/city/edit/${state._id}`}
                            state={{ stateData: state }}
                          >
                            <p className="px-1.5 py-0.5 rounded-lg font-medium bg-yellow-500 text-white w-fit cursor-pointer">
                              {/* <FiEdit2 /> */}
                              Edit
                            </p>
                          </Link>
                          <p
                            onClick={() => handleStatusChange(state._id)}
                            className="px-1.5 py-0.5 rounded-lg font-medium bg-blue-500 text-white w-fit cursor-pointer"
                          >
                            Active
                          </p>
                          <p
                            onClick={() => handleDelete(state._id)}
                            className="px-1.5 py-0.5 rounded-lg font-medium bg-red-500 text-white w-fit cursor-pointer"
                          >
                            {/* <FiEdit2 /> */}
                            Delete
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateCity;
