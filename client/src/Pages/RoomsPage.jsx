import React, { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { CiLocationOn } from "react-icons/ci";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BASE_URL from "../utils/api";
import axios from "axios";
import { useTheme } from "../components/ThemeProvider";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { CiLocationArrow1 } from "react-icons/ci";

const RoomsPage = () => {
  const [hotelData, setHotelData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hotels/getAll`);
      console.log(res.data);

      setHotelData(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [state, setState] = useState();
  const [city, setCity] = useState([]);
  const [search, setSearch] = useState("");
  const fetchStateData = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/states/getAll`);

      setStateData(res.data.filter((state) => state.status === "active"));
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
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
    hotel.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByState = state
    ? filteredBySearch.filter((hotel) => hotel.stateId.name === state)
    : filteredBySearch;

  const filteredByCity = city
    ? filteredByState.filter((hotel) => hotel.locationId.name === city)
    : filteredByState;

  const { theme } = useTheme();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <div
      className={` pt-28 md:pt-33 px-4 md:px-16 lg:px-24 xl:px-32 min-h-110 ${
        theme === "dark" ? "bg-neutral-900 text-white" : " text-black"
      }`}
    >
      <div
        className={`w-full max-sm:w-[95%] lg:w-[70%]  px-6 py-7 rounded-4xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] ${
          theme === "dark" ? "bg-neutral-800 text-white" : "bg-white text-black"
        }`}
      >
        <div>
          <h1 className="font-serif text-4xl md:text-[40px] tracking-tight">
            Find your perfect stay
          </h1>
          <p
            className={`text-sm md:text-base  mt-2 max-w-174 tracking-tight ${
              theme === "dark" ? "text-gray-300" : "text-gray-500/90"
            }`}
          >
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row items-start justify-between mt-15 relative">
        <div className="pb-20  overflow-hidden md:w-[65%]">
          {filteredByCity.map((hotel, index) => (
            <Link
              key={index}
              to={`/roomPage/${hotel._id}`}
              state={{ hotelData: hotel }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div
                className={`sm:flex sm:flex-row-reverse  gap-5     border-neutral-500  p-[5px]   text-black mt-10 justify-center ${
                  theme === "dark"
                    ? "bg-neutral-800 text-white rounded-4xl"
                    : "bg-white text-black pb-5 border-b"
                } }`}
              >
                <div className="">
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {hotel.hotelImages.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="rounded-3xl overflow-hidden h-70  sm:w-80">
                            <img
                              className="h-full w-full object-cover"
                              src={img?.url || img}
                              alt=""
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                <div className="flex flex-col  py-4 px-3 justify-between w-80">
                  <div className="mt-3 pl-1 overflow-hidden">
                    <p className="text-left text-3xl  tracking-tighter font-serif">
                      {hotel.name}
                    </p>
                    <p className="  tracking-tighter text-md font-serif">
                      {hotel.address} , {hotel.stateId.name}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="  tracking-tight font-[400] text-md font-serif">
                      {hotel.contactEmail}
                    </p>
                    <p className="  tracking-tighter text-md font-serif">
                      {hotel.contactNumber}
                    </p>
                  </div>
                  <p className="  tracking-tighter text-md font-serif">
                    Rooms starting at{" "}
                    <span className="underline text-green-700 text-lg font-mono tracking-tighter">
                      ₹2999
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <form
          className={`md:w-[30%]  text-gray-500 rounded-3xl px-6 py-4  flex flex-col  max-md:items-start gap-4 max-md:mx-auto lg:sticky top-25 mb-20 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] ${
            theme === "dark"
              ? "bg-neutral-800 text-white"
              : "bg-white text-black"
          }`}
        >
          <h1 className="font-serif text-2xl tracking-tight ">Apply Filters</h1>

          <div>
            <label htmlFor="state">
              <div className="flex items-center gap-2">
                <CiLocationOn
                  className={` text-lg ${
                    theme === "dark" ? "text-white" : "text-black"
                  } `}
                />
                <span className="font-serif">State</span>
              </div>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border   border-gray-500 sm:text-sm outline-none "
              >
                <option
                  className={`${
                    theme === "dark"
                      ? "bg-neutral-700 text-white border-gray-600"
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

          <div className="">
            <label htmlFor="state">
              <div className="flex items-center gap-2">
                <CiLocationArrow1
                  className={` text-lg ${
                    theme === "dark" ? "text-white" : "text-black"
                  } `}
                />
                <span className="font-serif">City</span>
              </div>
              <select
                id="state"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 w-full  px-3 py-1.5 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
              >
                <option
                  className={`${
                    theme === "dark"
                      ? "bg-neutral-700 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                  value=""
                >
                  Select a City
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

          <div className=" ">
            <label htmlFor="state">
              <div className="flex items-center gap-1.5">
                <IoSearchOutline
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <span className="font-serif">Search</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  required
                  className="mt-1 w-full  px-3 py-1 rounded-md font-serif border  border-gray-500 sm:text-sm outline-none "
                />
              </div>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomsPage;
