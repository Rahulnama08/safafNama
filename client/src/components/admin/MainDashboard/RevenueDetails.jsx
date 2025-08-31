// "use client";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../../utils/api";
// import RevenueDataChart from "./Charts/RevenueDataChart";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const RevenueDetails = () => {
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartData, setChartData] = useState();

//   const fetchData = async () => {
//     let token = JSON.parse(localStorage.getItem("data")).token;

//     try {
//       const res = await axios.get(`${BASE_URL}/bookings/revenueData`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setRevenueData(res.data);

//       console.log(res.data);

//       const formattedChartData = Object.values(
//         res.data.reduce((acc, item) => {
//           const state = item._id.state;

//           // if we haven't seen this stax`te yet, initialize it
//           if (!acc[state]) {
//             acc[state] = {
//               state,
//               bookings: 0,
//               amount: 0,
//             };
//           }

//           // accumulate bookings and revenue
//           acc[state].bookings += item.totalBookings;
//           acc[state].amount += item.totalRevenue;

//           return acc;
//         }, {}) // start with empty lookup object
//       );
//       setChartData(formattedChartData);

//       console.log(formattedChartData);
//     } catch (err) {
//       console.log(err.response.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div>

//     </div>
//   );
// };

// export default RevenueDetails;

// ---------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import RevenueDataChart from "./RevenueDataChart";
// import axios from "axios";
// import BASE_URL from "../../../utils/api";

// const RevenueDetails = () => {
//   const [chartData, setChartData] = useState();

//   const fetchData = async () => {
//     let token = JSON.parse(localStorage.getItem("data")).token;

//     try {
//       const res = await axios.get(`${BASE_URL}/bookings/revenueData`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = res.data;
//       console.log(data);

//       // Prepare Chart Data
//       const dailyMap = {};
//       const stateMap = {};
//       const cityMap = {};
//       const hotelMap = {};

//       data.forEach((item) => {
//         const {
//           _id: { state, city, hotel },
//           totalRevenue,
//           createdAt,
//         } = item;

//         // ⏱️ Group by date (trend data)
//         if (createdAt && !isNaN(new Date(createdAt))) {
//           const date = new Date(createdAt).toISOString().split("T")[0];
//           dailyMap[date] = (dailyMap[date] || 0) + totalRevenue;
//         }

//         // 📍 Grouping by location
//         stateMap[state] = (stateMap[state] || 0) + totalRevenue;
//         cityMap[city] = (cityMap[city] || 0) + totalRevenue;
//         hotelMap[hotel] = (hotelMap[hotel] || 0) + totalRevenue;
//       });

//       // Convert dailyMap into an array for the chart
//       const trendData = Object.entries(dailyMap).map(([date, amount]) => ({
//         date,
//         amount,
//       }));

//       setChartData({
//         trendData,
//         stateData: Object.entries(stateMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//         cityData: Object.entries(cityMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//         hotelData: Object.entries(hotelMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//       });
//     } catch (err) {
//       console.log(err.response?.data?.message || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="p-4">
//       <RevenueDataChart data={chartData} />
//     </div>
//   );
// };
// export default RevenueDetails;

// ---------------------------------------------------------------------------------------
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../utils/api";
// import RevenueDataChart from "./RevenueDataChart";
// import { IoSearchOutline } from "react-icons/io5";
// import { CiCalendarDate } from "react-icons/ci";
// import { useTheme } from "../../ThemeProvider";

// const RevenueDetails = () => {
//   const [chartData, setChartData] = useState();
//   const [filters, setFilters] = useState({
//     state: "",
//     city: "",
//     hotel: "",
//     startDate: "",
//     endDate: "",
//   });

//   const fetchStateData = async () => {
//     try {
//       let res = await axios.get(`${BASE_URL}/states/getAll`);

//     } catch (error) {
//       console.log(error.response.data.message);
//     }
//   };

//   const fetchCityData = async (stateName) => {
//     const selectedState = stateData.find((state) => state.name === stateName);

//     if (!selectedState) return;

//     try {
//       const res = await axios.get(
//         `${BASE_URL}/locations/getAllByState?id=${selectedState._id}`
//       );

//     } catch (error) {
//       console.log(error.response?.data?.message || "Failed to fetch cities");
//     }
//   };

//   useEffect(() => {
//       fetchData();
//       fetchStateData();
//     }, []);

//   const handleFilterChange = (e) => {
//     setFilters((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const fetchData = async () => {
//     const token = JSON.parse(localStorage.getItem("data"))?.token;

//     try {
//       const res = await axios.get(`${BASE_URL}/bookings/revenueData`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = res.data;
//       console.log("All Revenue Data:", data);

//       // ✅ Apply frontend filters
//       const filtered = data.filter((item) => {
//         const { state, city, hotel } = item._id;
//         const itemDate = new Date(item.createdAt).toISOString().split("T")[0];

//         return (
//           (!filters.state || state === filters.state) &&
//           (!filters.city || city === filters.city) &&
//           (!filters.hotel || hotel === filters.hotel) &&
//           (!filters.startDate || itemDate >= filters.startDate) &&
//           (!filters.endDate || itemDate <= filters.endDate)
//         );
//       });

//       // ✅ Group and map data
//       const dailyMap = {};
//       const stateMap = {};
//       const cityMap = {};
//       const hotelMap = {};

//       filtered.forEach((item) => {
//         const {
//           _id: { state, city, hotel },
//           totalRevenue,
//           createdAt,
//         } = item;

//         const date = new Date(createdAt).toISOString().split("T")[0];
//         dailyMap[date] = (dailyMap[date] || 0) + totalRevenue;
//         stateMap[state] = (stateMap[state] || 0) + totalRevenue;
//         cityMap[city] = (cityMap[city] || 0) + totalRevenue;
//         hotelMap[hotel] = (hotelMap[hotel] || 0) + totalRevenue;
//       });

//       const trendData = Object.entries(dailyMap).map(([date, amount]) => ({
//         date,
//         amount,
//       }));

//       setChartData({
//         trendData,
//         stateData: Object.entries(stateMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//         cityData: Object.entries(cityMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//         hotelData: Object.entries(hotelMap).map(([label, amount]) => ({
//           label,
//           amount,
//         })),
//       });
//     } catch (err) {
//       console.log(err.response?.data?.message || err.message);
//     }
//   };

//   // ✅ Refetch data when filters change
//   useEffect(() => {
//     fetchData();
//   }, [filters]);
//   const { theme } = useTheme();

//   return (
//     <div className="p-4">
//       <div className="flex flex-wrap gap-4 mb-6">
//         <input
//           type="date"
//           name="startDate"
//           value={filters.startDate}
//           onChange={handleFilterChange}
//           className="border rounded px-2 py-1"
//         />
//         <input
//           type="date"
//           name="endDate"
//           value={filters.endDate}
//           onChange={handleFilterChange}
//           className="border rounded px-2 py-1"
//         />
//         <div>
//           <label htmlFor="state">
//             <div className="flex items-center gap-2">
//               <CiCalendarDate
//                 className={` text-lg ${
//                   theme === "dark" ? "text-white" : "text-black"
//                 } `}
//               />

//               <span className="font-serif">State</span>
//             </div>
//             <select
//               id="state"
//               value={state}
//               onChange={(e) => setState(e.target.value)}
//               required
//               className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//             >
//               <option
//                 className={`${
//                   theme === "dark"
//                     ? "bg-neutral-600 text-white border-gray-600"
//                     : "bg-white text-black border-gray-300"
//                 }`}
//                 value=""
//               >
//                 Select a state
//               </option>
//               {stateData.map((s, index) => (
//                 <option
//                   className={`${
//                     theme === "dark"
//                       ? "bg-neutral-900 text-white border-gray-600"
//                       : "bg-white text-black border-gray-300"
//                   }`}
//                   key={index}
//                   value={s.name}
//                 >
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>

//         <div className="">
//           <label htmlFor="state">
//             <div className="flex items-center gap-2">
//               <CiCalendarDate
//                 className={` text-lg ${
//                   theme === "dark" ? "text-white" : "text-black"
//                 } `}
//               />
//               <span className="font-serif">City</span>
//             </div>
//             <select
//               id="state"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               required
//               className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//             >
//               <option
//                 className={`${
//                   theme === "dark"
//                     ? "bg-neutral-600 text-white border-gray-600"
//                     : "bg-white text-black border-gray-300"
//                 }`}
//                 value=""
//               >
//                 Select a City
//               </option>
//               {cityData.map((s, index) => (
//                 <option
//                   className={`${
//                     theme === "dark"
//                       ? "bg-neutral-900 text-white border-gray-600"
//                       : "bg-white text-black border-gray-300"
//                   }`}
//                   key={index}
//                   value={s.name}
//                 >
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>

//         <div className=" ">
//           <label htmlFor="state">
//             <div className="flex items-center gap-1.5">
//               <IoSearchOutline
//                 className={` ${
//                   theme === "dark" ? "text-white" : "text-black"
//                 } `}
//               />
//               <span className="font-serif">Search</span>
//             </div>
//             <div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 onChange={(e) => setSearch(e.target.value)}
//                 value={search}
//                 required
//                 className="mt-1 w-full  px-3 py-1 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//               />
//             </div>
//           </label>
//         </div>
//       </div>

//       <RevenueDataChart data={chartData} />
//     </div>
//   );
// };

// export default RevenueDetails;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import RevenueDataChart from "./RevenueDataChart";
import { IoSearchOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { useTheme } from "../../ThemeProvider";

const RevenueDetails = () => {
  const [chartData, setChartData] = useState();
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [filters, setFilters] = useState({
    state: "",
    city: "",
    startDate: "",
    endDate: "",
  });

  const fetchStateData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/states/getAll`);
      setStateData(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch states");
    }
  };

  const fetchCityData = async (stateName) => {
    const selectedState = stateData.find((state) => state.name === stateName);
    if (!selectedState) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/locations/getAllByState?id=${selectedState._id}`
      );
      setCityData(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch cities");
    }
  };

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("data"))?.token;

    try {
      const res = await axios.get(`${BASE_URL}/bookings/revenueData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      const filtered = data.filter((item) => {
        const { state, city } = item._id;
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];

        return (
          (!filters.state || state === filters.state) &&
          (!filters.city || city === filters.city) &&
          (!filters.startDate || itemDate >= filters.startDate) &&
          (!filters.endDate || itemDate <= filters.endDate)
        );
      });

      const dailyMap = {};
      const stateMap = {};
      const cityMap = {};
      const hotelMap = {};

      filtered.forEach((item) => {
        const {
          _id: { state, city, hotel },
          totalRevenue,
          createdAt,
        } = item;

        const date = new Date(createdAt).toISOString().split("T")[0];
        dailyMap[date] = (dailyMap[date] || 0) + totalRevenue;
        stateMap[state] = (stateMap[state] || 0) + totalRevenue;
        cityMap[city] = (cityMap[city] || 0) + totalRevenue;
        hotelMap[hotel] = (hotelMap[hotel] || 0) + totalRevenue;
      });

      const trendData = Object.entries(dailyMap).map(([date, amount]) => ({
        date,
        amount,
      }));

      setChartData({
        trendData,
        stateData: Object.entries(stateMap).map(([label, amount]) => ({
          label,
          amount,
        })),
        cityData: Object.entries(cityMap).map(([label, amount]) => ({
          label,
          amount,
        })),
        hotelData: Object.entries(hotelMap).map(([label, amount]) => ({
          label,
          amount,
        })),
      });

      const total = filtered.reduce((acc, curr) => acc + curr.totalRevenue, 0);
      setTotalAmount(total);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  useEffect(() => {
    if (filters.state) {
      fetchCityData(filters.state);
    } else {
      setCityData([]);
    }
  }, [filters.state]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const { theme } = useTheme();

  return (
    <div className="p-4">
      <div className="text-2xl  mb-4  font-serif border-b pb-5 border-neutral-400">
        Total Revenue: <span className="text-3xl text-green-700">₹{totalAmount.toLocaleString("en-IN")}</span>
      </div>
      <div className="flex items-center flex-wrap gap-4 mt-5   mb-6">
        <div>
          <label htmlFor="startDate">
            <div className="flex items-center gap-2">
              <CiCalendarDate
                className={`text-lg ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <span className="font-serif">Start Date</span>
            </div>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="  px-3 py-1.5 rounded-md font-serif border border-gray-500 sm:text-sm "
            />
          </label>
        </div>

        <div>
          <label htmlFor="endDate">
            <div className="flex items-center gap-2">
              <CiCalendarDate
                className={`text-lg ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <span className="font-serif">End Date</span>
            </div>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="  px-3 py-1.5 rounded-md font-serif border border-gray-500 sm:text-sm "
            />
          </label>
        </div>

        <div>
          <label htmlFor="state">
            <div className="flex items-center gap-2">
              <CiCalendarDate
                className={`text-lg ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <span className="font-serif">State</span>
            </div>
            <select
              id="state"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-1.5 rounded-md font-serif border border-gray-500 sm:text-sm outline-none"
            >
              <option value="">All States</option>
              {stateData.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label htmlFor="city">
            <div className="flex items-center gap-2">
              <CiCalendarDate
                className={`text-lg ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <span className="font-serif">City</span>
            </div>
            <select
              id="city"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-1.5 rounded-md font-serif border border-gray-500 sm:text-sm outline-none"
            >
              <option value="">All Cities</option>
              {cityData.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* <div>
          <label htmlFor="search">
            <div className="flex items-center gap-1.5">
              <IoSearchOutline
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
              />
              <span className="font-serif">Search</span>
            </div>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="mt-1 w-full px-3 py-1 rounded-md font-serif border border-gray-500 sm:text-sm outline-none"
            />
          </label>
        </div> */}
      </div>

      <RevenueDataChart data={chartData} />
    </div>
  );
};

export default RevenueDetails;
