import React from "react";
import { BiUser } from "react-icons/bi";
import { CgSmartphone } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { LuUsersRound } from "react-icons/lu";
import { useTheme } from "../../ThemeProvider";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * TableTemp is a React functional component that renders a table-like display of booking data.
 * It displays details such as hotel name, room number, address, number of guests, total amount,
 * check-in and check-out dates, user details (name, email, phone), and booking status.
 * The component adapts its styling based on the current theme (dark or light).
 *
 * @param {Object} data - The data object containing booking information.
 * @param {Array} data.data - Array of booking objects, each containing details about the booking.
 * @param {string} data.status - The status of the bookings, which can be "pending", "confirm", "cancel",
 * "checkin", or "checkout", affecting the rendering of status indicators in the UI.
 */

/*******  041716aa-7c84-4ca0-a174-c9b9139a712e  *******/

const TableTemp = ({ data }) => {
  const { theme } = useTheme();
  return (
    <div>
      <div className="max-w-6xl mt-8 w-full ">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
          <div className="">Hotel Details</div>
          <div className="">Date & Timings</div>
          <div className="">User Details</div>
          <div className="pl-[30%]">Status</div>
        </div>

        {data.data.map((booking, index) => (
          <div
            //   key={index}
            className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t "
          >
            <div className="flex flex-col md:flex-row">
              <img
                className="min-md:w-44 rounded-2xl shadow object-cover"
                src={booking.roomId?.images[0]?.url || booking.roomId?.images[0]}
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

            <div className="flex flex-col mt-3 gap-3">
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

            <div className="flex flex-col gap-1.5 max-md:mt-3 mt-5">
              <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                <BiUser
                  className={` text-lg ${
                    theme === "dark" ? "text-neutral-400" : "text-black"
                  } `}
                />
                <span
                  className={`${
                    theme === "dark" ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Name: {booking.userName}
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
                    theme === "dark" ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Email: {booking.userId.email}
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
                    theme === "dark" ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Phone: {booking.userPhone}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center pt-3">
              {data.status === "pending" && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full bg-yellow-400`}></div>
                  <p
                    className={`text-sm font-serif rounded-full text-yellow-400`}
                  >
                    Pending
                    {booking.isChecking === "pending" &&
                    booking.status === "pending" ? (
                      <span className="block">(by User)</span>
                    ) : (
                      <span className="block">(by Admin)</span>
                    )}
                  </p>
                </div>
              )}

              {data.status === "confirm" && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full bg-blue-500`}></div>
                  <p
                    className={`text-sm font-serif rounded-full text-blue-500`}
                  >
                    Booked
                  </p>
                </div>
              )}

              {data.status === "cancel" && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full bg-red-500`}></div>
                  <p className={`text-sm font-serif rounded-full text-red-500`}>
                    Cancelled{" "}
                    {booking.status === "cancelled" ? (
                      <span className="block">(by Admin)</span>
                    ) : (
                      <span className="block">(by User)</span>
                    )}
                  </p>
                </div>
              )}

              {data.status === "checkin" && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full bg-blue-500`}></div>
                  <p
                    className={`text-sm font-serif rounded-full text-blue-500`}
                  >
                    Checked-in
                  </p>
                </div>
              )}

              {data.status === "checkout" && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full bg-green-500`}></div>
                  <p
                    className={`text-sm font-serif rounded-full text-green-500`}
                  >
                    Checked-out
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTemp;
