import React, { useEffect, useState } from "react";

import axios from "axios";
import BASE_URL from "../../utils/api";
import RoomCard from "./RoomCard";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

const RoomPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { hotelData } = location.state;
  console.log(hotelData);

  const [roomData, setRoomData] = useState([]);

  const fetchRoomData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/rooms/getAllByHotel?id=${id}`);
      // console.log(res.data);

      setRoomData(res.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  const { theme } = useTheme();

  return (
    <div
      className={`pt-25 px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col   pb-25  ${theme === "dark" ? "bg-neutral-900 text-white" : " text-black"}`}
    >
      <div
        className=" w-full mb-5 border-b pb-7 border-gray-400 p-4 rounded-2xl bg-cover bg-center"
        // style={{
        //   backgroundImage: `url("https://images.unsplash.com/photo-1746003288323-89dba68721f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8")`,
        // }}
      >
        <div>
          <h1 className="text-4xl  tracking-tighter font-serif">
            {hotelData.name}
          </h1>
        </div>
        <p className=" tracking-tight font-serif">
          {hotelData.address} , {hotelData.stateId.name}
        </p>
        <p className=" tracking-tight mt-4 sm:w-1/2 leading-4.5 font-serif">
          {hotelData.description}
        </p>
        <p
          className={`tracking-tight font-serif mt-4 border p-3 rounded-2xl w-fit ${
            theme === "dark"
              ? "bg-neutral-800 text-white border-gray-500"
              : "bg-white text-black border-gray-300"
          }`}
        >
          <span className="">Contact us :</span> <br />{" "}
          {hotelData.contactNumber} , {hotelData.contactEmail}
        </p>
      </div>

      <p className="text-2xl  tracking-tight font-serif mt-7 mb-3">
        Explore Our Rooms :
      </p>

      <div className="flex flex-wrap gap-10 justify-start md:px-14">
        {roomData.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
