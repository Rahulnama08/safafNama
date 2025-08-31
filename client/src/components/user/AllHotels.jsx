// import React, { useEffect, useState } from "react";
// import HotelCard from "./HotelCard";
// import axios from "axios";
// import BASE_URL from "../../utils/api";
// import { useTheme } from "../ThemeProvider";
// import { IoSearchOutline } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import { CiCalendarDate } from "react-icons/ci";


// const AllHotels = () => {
//   const [hotelData, setHotelData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [state, setState] = useState(""); // FIX ✅ scalar string
//   const [city, setCity] = useState(""); // FIX ✅ scalar string
//   const [search, setSearch] = useState("");

//   // fetch all hotels
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/hotels/getAll`);
//       // FIX ✅ ensure array
//       const hotels = Array.isArray(res.data) ? res.data : res.data.data || [];
//       setHotelData(hotels);
//     } catch (error) {
//       console.log(error.response?.data?.message || error.message);
//     }
//   };

//   // fetch all states
//   const fetchStateData = async () => {
//     try {
//       let res = await axios.get(`${BASE_URL}/states/getAll`);
//       const states = Array.isArray(res.data) ? res.data : res.data.data || [];
//       setStateData(states.filter((s) => s.status === "active"));
//     } catch (error) {
//       console.log(error.response?.data?.message || error.message);
//     }
//   };

//   // fetch cities based on state
//   const fetchCityData = async (stateName) => {
//     const selectedState = stateData.find((s) => s.name === stateName);
//     if (!selectedState) return;

//     try {
//       const res = await axios.get(
//         `${BASE_URL}/locations/getAllByState?id=${selectedState._id}`
//       );
//       const cities = Array.isArray(res.data) ? res.data : res.data.data || [];
//       setCityData(cities);
//     } catch (error) {
//       console.log(error.response?.data?.message || "Failed to fetch cities");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchStateData();
//   }, []);

//   useEffect(() => {
//     if (state) {
//       fetchCityData(state);
//     } else {
//       setCityData([]);
//     }
//     setCity(""); // reset city when state changes
//   }, [state]);

//   // Apply filters
//   const filteredBySearch = hotelData.filter((hotel) =>
//     hotel.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const filteredByState = state
//     ? filteredBySearch.filter((hotel) => hotel.stateId?.name === state)
//     : filteredBySearch;

//   const filteredByCity = city
//     ? filteredByState.filter((hotel) => hotel.locationId?.name === city)
//     : filteredByState;

//   const { theme } = useTheme();

//   return (
//     <>
//       {/* Hero Section */}
//       <section
//         className={`h-screen flex flex-col items-start justify-center pt-30 px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("https://images.unsplash.com/photo-1697807646004-31ae73a1a625?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-no-repeat bg-cover bg-bottom ${
//           theme === "dark" ? "bg-neutral-900" : "bg-white"
//         }`}
//       >
//         <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
//           The Ultimate Hotel Experience
//         </p>
//         <h1 className="text-2xl md:text-5xl md:text-[56px] md:leading-[56px] max-w-xl mt-4 font-serif">
//           Discover Your Perfect Gateway Destination
//         </h1>
//         <p className="max-w-130 mt-2 text-sm md:text-base">
//           Unparalleled luxury and comfort await at the world's most exclusive
//           hotels and resorts. Start your journey today.
//         </p>

//         {/* Filters Form */}
//         <form
//           className={` text-neutral-700 rounded-2xl px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto ${
//             theme === "dark" ? "bg-neutral-700 text-white" : "bg-white"
//           }`}
//         >
//           {/* State */}
//           <div>
//             <label htmlFor="state">
//               <div className="flex items-center gap-2">
//                 <CiCalendarDate
//                   className={` text-lg ${
//                     theme === "dark" ? "text-white" : "text-black"
//                   } `}
//                 />
//                 <span className="font-serif">State</span>
//               </div>
//               <select
//                 id="state"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//               >
//                 <option value="">Select a state</option>
//                 {stateData.map((s, index) => (
//                   <option key={index} value={s.name}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>

//           {/* City */}
//           <div>
//             <label htmlFor="city">
//               <div className="flex items-center gap-2">
//                 <CiCalendarDate
//                   className={` text-lg ${
//                     theme === "dark" ? "text-white" : "text-black"
//                   } `}
//                 />
//                 <span className="font-serif">City</span>
//               </div>
//               <select
//                 id="city"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//               >
//                 <option value="">Select a City</option>
//                 {cityData.map((s, index) => (
//                   <option key={index} value={s.name}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>

//           {/* Search */}
//           <div>
//             <label htmlFor="search">
//               <div className="flex items-center gap-1.5">
//                 <IoSearchOutline
//                   className={` ${
//                     theme === "dark" ? "text-white" : "text-black"
//                   } `}
//                 />
//                 <span className="font-serif">Search</span>
//               </div>
//               <input
//                 id="search"
//                 type="text"
//                 placeholder="Search"
//                 onChange={(e) => setSearch(e.target.value)}
//                 value={search}
//                 className="mt-1 w-full  px-3 py-1 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
//               />
//             </label>
//           </div>
//         </form>
//       </section>

//       {/* Featured Hotels */}
//       <section className={`${theme === "dark" ? "bg-neutral-900" : ""}`}>
//         <div className="flex flex-col justify-center items-center text-center pt-10">
//           <h1 className=" text-4xl md:text-[40px] font-serif tracking-tight">
//             Featured Destination
//           </h1>
//           <p className="text-sm md:text-base text-neutral-600 tracking-tight mt-2 max-w-174">
//             Discover our handpicked selection of exceptional properties.
//           </p>

//           <div className="flex flex-wrap items-center justify-center gap-6 mt-15 pb-10 text-left">
//             {filteredByCity.slice(0, 4).map((hotel) => (
//               <HotelCard key={hotel._id} hotel={hotel} />
//             ))}
//           </div>

//           <Link to="/allHotels" onClick={() => window.scrollTo(0, 0)}>
//             <button
//               className={`my-10 px-4 py-2 text-sm font-medium border border-gray-400 rounded-xl transition-all cursor-pointer ${
//                 theme === "dark"
//                   ? " text-white "
//                   : "bg-white text-black border-gray-300"
//               }`}
//             >
//               View All Destinations
//             </button>
//           </Link>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AllHotels;

import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import axios from "axios";
import BASE_URL from "../../utils/api";
import { useTheme } from "../ThemeProvider";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";


const AllHotels = () => {
  const [hotelData, setHotelData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [state, setState] = useState(""); // FIX ✅ scalar string
  const [city, setCity] = useState(""); // FIX ✅ scalar string
  const [search, setSearch] = useState("");

  // fetch all hotels
  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hotels/getAll`);
      // FIX ✅ ensure array
      const hotels = Array.isArray(res.data) ? res.data : res.data.data || [];
      setHotelData(hotels);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  // fetch all states
  const fetchStateData = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/states/getAll`);
      const states = Array.isArray(res.data) ? res.data : res.data.data || [];
      setStateData(states.filter((s) => s.status === "active"));
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  // fetch cities based on state
  const fetchCityData = async (stateName) => {
    const selectedState = stateData.find((s) => s.name === stateName);
    if (!selectedState) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/locations/getAllByState?id=${selectedState._id}`
      );
      const cities = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCityData(cities);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch cities");
    }
  };

  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  useEffect(() => {
    if (state) {
      fetchCityData(state);
    } else {
      setCityData([]);
    }
    setCity(""); // reset city when state changes
  }, [state]);

  // Apply filters
  const filteredBySearch = hotelData.filter((hotel) =>
    hotel.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByState = state
    ? filteredBySearch.filter((hotel) => hotel.stateId?.name === state)
    : filteredBySearch;

  const filteredByCity = city
    ? filteredByState.filter((hotel) => hotel.locationId?.name === city)
    : filteredByState;

  const { theme } = useTheme();

  return (
    <>
      {/* Hero Section */}
      <section
        className={`h-screen flex flex-col items-start justify-center pt-28 px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("https://images.unsplash.com/photo-1697807646004-31ae73a1a625?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-no-repeat bg-cover bg-bottom relative`}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-start max-w-3xl">
          <p className="bg-[#49B9FF]/60 px-4 py-1.5 rounded-full mt-20 text-sm font-semibold shadow-sm">
            The Ultimate Hotel Experience
          </p>

          <h1 className="text-3xl md:text-5xl font-serif font-bold mt-4 leading-tight">
            Discover Your Perfect Gateway Destination
          </h1>

          <p className="mt-2 text-base md:text-lg text-gray-100/90">
            Unparalleled luxury and comfort await at the world's most exclusive
            hotels and resorts. Start your journey today.
          </p>

          {/* Filters Form */}
          <form
            className={`mt-8 flex flex-col md:flex-row gap-4 w-full max-w-4xl bg-white/90 dark:bg-neutral-700/90 rounded-2xl px-6 py-4 shadow-md backdrop-blur-sm`}
          >
            {/* State */}
            <div className="flex-1">
              <label htmlFor="state" className="block font-serif font-medium text-gray-700 dark:text-gray-200">
                State
              </label>
              <div className="mt-1 relative">
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-[#49B9FF] outline-none transition-all"
                >
                  <option value="">Select a state</option>
                  {stateData.map((s, index) => (
                    <option key={index} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div className="flex-1">
              <label htmlFor="city" className="block font-serif font-medium text-gray-700 dark:text-gray-200">
                City
              </label>
              <div className="mt-1 relative">
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-[#49B9FF] outline-none transition-all"
                >
                  <option value="">Select a City</option>
                  {cityData.map((s, index) => (
                    <option key={index} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block font-serif font-medium text-gray-700 dark:text-gray-200">
                Search
              </label>
              <div className="mt-1 relative flex items-center">
                <IoSearchOutline className="absolute left-3 text-gray-400 dark:text-gray-300" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-[#49B9FF] outline-none transition-all"
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className={`${theme === "dark" ? "bg-neutral-900" : "bg-gray-50"}`}>
        <div className="flex flex-col justify-center items-center text-center py-12 px-6 md:px-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Featured Destination
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl text-base md:text-lg">
            Discover our handpicked selection of exceptional properties.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {filteredByCity.slice(0, 4).map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>

          <Link to="/allHotels" onClick={() => window.scrollTo(0, 0)}>
            <button
              className={`mt-10 px-6 py-3 rounded-xl font-medium border transition-all hover:shadow-lg ${theme === "dark"
                  ? "bg-neutral-800 text-white border-gray-700"
                  : "bg-white text-black border-gray-300"
                }`}
            >
              View All Destinations
            </button>
          </Link>
        </div>
      </section>

    </>
  );
};

export default AllHotels;

