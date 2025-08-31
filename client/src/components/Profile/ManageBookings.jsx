import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api";
import { toast } from "sonner";
import { useTheme } from "../ThemeProvider";
import { CiLocationOn } from "react-icons/ci";
import { LuUsersRound } from "react-icons/lu";
const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const fatchUserBooking = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.get(`${BASE_URL}/bookings/getUserBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
      console.log(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fatchUserBooking();
  }, []);

  const confirmBookingUser = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    console.log(token);

    try {
      let res = await axios.put(
        `${BASE_URL}/bookings/confirmBookingUser?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fatchUserBooking();
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  };

  const cancellBookingUser = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    console.log(token);

    try {
      let res = await axios.put(
        `${BASE_URL}/bookings/cancelBookingUser?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fatchUserBooking();
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  };
  const { theme } = useTheme();

  return (
    <div className="pb-15 ">
      <div>
        <h1
          className="font-medium mt-5 text-3xl tracking-tighter font-serif
          "
        >
          {" "}
          My Bookings
        </h1>
        <p
          className={`text-sm md:text-base tracking-tight text-gray-800 mt-2 max-w-174  ${
            theme === "dark" ? "text-neutral-400" : ""
          }`}
        >
          Easily manage your past, current, and upcoming hotel reservations in
          one place. Plan your trips seamlessly with just a few clicks
        </p>
      </div>

      <div className="max-w-6xl mt-8 w-full ">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
          <div className="">Hotels</div>
          <div className="pl-[13%]">Date & Timings</div>
          <div className="pl-[32%]">Manage</div>
        </div>

        {bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((booking, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t "
            >
              <div className="flex flex-col md:flex-row">
                <img
                  className="min-md:w-44 rounded-2xl shadow object-cover"
                  src={booking?.roomId?.images[0]?.url || booking?.roomId?.images[0]}
                  alt=""
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="text-2xl font-serif tracking-tight">
                    {booking.hotelId.name} ,{" "}
                    <span className="text-[15px]">
                      ({booking.roomId.roomNumber})
                    </span>{" "}
                  </p>
                  <div className="flex items-center gap-1 text-sm  tracking-tight font-serif">
                    <CiLocationOn
                      className={` text-lg ${
                        theme === "dark" ? "text-white" : "text-black"
                      } `}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-neutral-300" : "text-gray-700"
                      }`}
                    >
                      {booking.hotelId.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                    <LuUsersRound
                      className={` text-lg ${
                        theme === "dark" ? "text-neutral-400" : "text-black"
                      } `}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-neutral-300" : "text-gray-700"
                      }`}
                    >
                      Guests: {booking.numberOfGuests}
                    </span>
                  </div>
                  <p className="font-serif">Total: ₹{booking.totalAmount}</p>
                </div>
              </div>

              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p className="font-serif">Check-In:</p>
                  <p
                    className={` text-sm font-serif ${
                      theme === "dark" ? "text-neutral-400" : "text-gray-700"
                    }`}
                  >
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-serif">Check-Out:</p>
                  <p
                    className={` text-sm font-serif ${
                      theme === "dark" ? "text-neutral-400" : "text-gray-700"
                    }`}
                  >
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center pt-3">
                {booking.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-yellow-400`}></div>
                    <p
                      className={`text-sm font-serif rounded-full text-yellow-400`}
                    >
                      Pending
                    </p>
                  </div>
                )}

                {booking.isChecking === "confirm" &&
                  booking.status === "booked" && (
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-blue-500`}></div>
                      <p
                        className={`text-sm font-serif rounded-full text-blue-500`}
                      >
                        Booked
                      </p>
                    </div>
                  )}

                {(booking.status === "cancelled" ||
                  booking.isChecking === "cancelled") && (
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-red-500`}></div>
                    <p
                      className={`text-sm font-serif rounded-full text-red-500`}
                    >
                      Cancelled{" "}
                      {booking.status === "cancelled" ? (
                        <span className="block">(by Admin)</span>
                      ) : (
                        <span className="block">(by You)</span>
                      )}
                    </p>
                  </div>
                )}

                {booking.isChecking === "checked-in" &&
                  booking.status === "booked" && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full bg-neutral-500`}
                      ></div>
                      <p
                        className={`text-sm font-serif rounded-full text-neutral-500`}
                      >
                        Checked In
                      </p>
                    </div>
                  )}

                {booking.isChecking === "checked-out" &&
                  booking.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-green-500`}></div>
                      <p
                        className={`text-sm font-serif rounded-full text-green-500`}
                      >
                        Completed
                      </p>
                    </div>
                  )}

                {booking.status === "booked" &&
                  booking.isChecking === "pending" && (
                    <>
                      <button
                        onClick={() => confirmBookingUser(booking._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => cancellBookingUser(booking._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Cancell
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManageBookings;
