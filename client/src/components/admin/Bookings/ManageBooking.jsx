import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import { toast } from "sonner";
import { LuUsersRound } from "react-icons/lu";
import { CiCalendarDate, CiLocationOn, CiUser } from "react-icons/ci";
import { useTheme } from "../../ThemeProvider";
import { HiOutlineMail } from "react-icons/hi";
import { CgSmartphone } from "react-icons/cg";
import { BiUser } from "react-icons/bi";

const ManageBooking = () => {
  const [bookingData, setBookingData] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookingData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvedReq = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/booked?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  };

  const cancelledReq = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/cancelled?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  };

  const pendingReq = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/pending?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  };

  const { theme } = useTheme();
  return (
    <div className="font-serif">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Pending Requests
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Manage</div>
            </div>

            {bookingData.filter((data) => data.status === "pending").length >
            0 ? (
              bookingData
                .filter((data) => data.status === "pending")
                .map((dets) => (
                  <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                    <div className="flex flex-col md:flex-row ">
                      <img
                        className="min-md:w-44 rounded-2xl shadow object-cover"
                        src={
                          dets.roomId?.images[0]?.url || dets.roomId.images[0]
                        }
                        alt=""
                      />
                      <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                        <p className="text-2xl font-serif tracking-tight">
                          {dets.hotelId.name} ,
                          <span className="text-[15px]">
                            ({dets.roomId.roomNumber})
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
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            {dets.hotelId.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                          <LuUsersRound
                            className={` text-lg ${
                              theme === "dark"
                                ? "text-neutral-400"
                                : "text-black"
                            } `}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            Guests: {dets.numberOfGuests}
                          </span>
                        </div>
                        <p className="font-serif">Total: ₹{dets.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex flex-col mt-3 gap-3">
                      <div>
                        <p className="font-serif">Check-In:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkInDate).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-serif">Check-Out:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkOutDate).toDateString()}
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
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          Name: {dets.userName}
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
                          Email: {dets.userId.email}
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
                          Phone: {dets.userPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <button
                          onClick={() => approvedReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => cancelledReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Cancell
                        </button>
                        {/* <button className="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif">
                      Pending
                    </button> */}
                      </>
                    </div>
                  </div>
                ))
            ) : (
              <div className="px-6 py-4  flex flex-col items-center justify-center h-100">
                <CiCalendarDate
                  className={`text-6xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-3xl mt-3">No Bookings Found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="booked">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Booked Requests
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Manage</div>
            </div>

            {bookingData.filter((data) => data.status === "booked").length >
            0 ? (
              bookingData
                .filter((data) => data.status === "booked")
                .map((dets) => (
                  <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                    <div className="flex flex-col md:flex-row ">
                      <img
                        className="min-md:w-44 rounded-2xl shadow object-cover"
                        src={
                          dets.roomId?.images[0]?.url || dets.roomId.images[0]
                        }
                        alt=""
                      />
                      <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                        <p className="text-2xl font-serif tracking-tight">
                          {dets.hotelId.name} ,
                          <span className="text-[15px]">
                            ({dets.roomId.roomNumber})
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
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            {dets.hotelId.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                          <LuUsersRound
                            className={` text-lg ${
                              theme === "dark"
                                ? "text-neutral-400"
                                : "text-black"
                            } `}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            Guests: {dets.numberOfGuests}
                          </span>
                        </div>
                        <p className="font-serif">Total: ₹{dets.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex flex-col mt-3 gap-3">
                      <div>
                        <p className="font-serif">Check-In:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkInDate).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-serif">Check-Out:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkOutDate).toDateString()}
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
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          Name: {dets.userName}
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
                          Email: {dets.userId.email}
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
                          Phone: {dets.userPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        {/* <button
                        onClick={() => approvedReq(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Confirm
                      </button> */}
                        <button
                          onClick={() => cancelledReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Cancell
                        </button>

                        <button
                          onClick={() => pendingReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Pending
                        </button>
                      </>
                    </div>
                  </div>
                ))
            ) : (
              <div className="px-6 py-4  flex flex-col items-center justify-center h-100">
                <CiCalendarDate
                  className={`text-6xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-3xl mt-3">No Bookings Found</p>
              </div>
            )}
          </div>

          {/* <h1 className="font-medium mt-10 text-xl tracking-tighter">
            Checked via Users :
          </h1> */}

          {/* <div className="mt-3  ">
            <Tabs defaultValue="check">
              <TabsList>
                <TabsTrigger value="check">Checked-In</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value="check">
                <div className="mt-8 grid sm:grid-cols-3 ">
                  {bookingData
                    .filter(
                      (data) =>
                        data.status === "booked" &&
                        data.isChecking === "confirm"
                    )
                    .map((dets) => (
                      <div className="w-fit flex flex-col gap-5 py-4 px-7 rounded-3xl  border border-gray-400">
                        <h1 className="text-xl tracking-tight">
                          Booking for {dets.userName}
                        </h1>

                        <div>
                          <div className="flex gap-6">
                            <div>
                              <h1>User Number </h1>
                              <h1>User Email </h1>
                              <h1>Room Number </h1>
                              <h1>Total Members </h1>
                              <h1>Check in Date </h1>
                              <h1>Check out Date </h1>
                              <h1>Total Amount</h1>
                            </div>
                            <div>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                            </div>
                            <div>
                              <p>{dets.userPhone}</p>
                              <p>{dets.userId.email}</p>
                              <p>{dets.roomId.roomNumber}</p>
                              <p>{dets.numberOfGuests}</p>
                              <p>{dets.checkInDate.slice(0, 10)}</p>
                              <p>{dets.checkOutDate.slice(0, 10)}</p>
                              <p>₹{dets.totalAmount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <button
                            onClick={() => pendingReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-yellow-500 text-white"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => cancelledReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-red-500 text-white"
                          >
                            Canelled
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="pending">
                <div className="mt-8 grid sm:grid-cols-3 ">
                  {bookingData
                    .filter(
                      (data) =>
                        data.status === "booked" &&
                        data.isChecking === "pending"
                    )
                    .map((dets) => (
                      <div className="w-fit flex flex-col gap-5 py-4 px-7 rounded-3xl  border border-gray-400">
                        <h1 className="text-xl tracking-tight">
                          Booking for {dets.userName}
                        </h1>

                        <div>
                          <div className="flex gap-6">
                            <div>
                              <h1>User Number </h1>
                              <h1>User Email </h1>
                              <h1>Room Number </h1>
                              <h1>Total Members </h1>
                              <h1>Check in Date </h1>
                              <h1>Check out Date </h1>
                              <h1>Total Amount</h1>
                            </div>
                            <div>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                            </div>
                            <div>
                              <p>{dets.userPhone}</p>
                              <p>{dets.userId.email}</p>
                              <p>{dets.roomId.roomNumber}</p>
                              <p>{dets.numberOfGuests}</p>
                              <p>{dets.checkInDate.slice(0, 10)}</p>
                              <p>{dets.checkOutDate.slice(0, 10)}</p>
                              <p>₹{dets.totalAmount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <button
                            onClick={() => pendingReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-yellow-500 text-white"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => cancelledReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-red-500 text-white"
                          >
                            Canelled
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="rejected">
                <div className="mt-8 grid sm:grid-cols-3 ">
                  {bookingData
                    .filter(
                      (data) =>
                        data.status === "booked" &&
                        data.isChecking === "cancelled"
                    )
                    .map((dets) => (
                      <div className="w-fit flex flex-col gap-5 py-4 px-7 rounded-3xl  border border-gray-400">
                        <h1 className="text-xl tracking-tight">
                          Booking for {dets.userName}
                        </h1>

                        <div>
                          <div className="flex gap-6">
                            <div>
                              <h1>User Number </h1>
                              <h1>User Email </h1>
                              <h1>Room Number </h1>
                              <h1>Total Members </h1>
                              <h1>Check in Date </h1>
                              <h1>Check out Date </h1>
                              <h1>Total Amount</h1>
                            </div>
                            <div>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                              <p>:</p>
                            </div>
                            <div>
                              <p>{dets.userPhone}</p>
                              <p>{dets.userId.email}</p>
                              <p>{dets.roomId.roomNumber}</p>
                              <p>{dets.numberOfGuests}</p>
                              <p>{dets.checkInDate.slice(0, 10)}</p>
                              <p>{dets.checkOutDate.slice(0, 10)}</p>
                              <p>₹{dets.totalAmount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <button
                            onClick={() => pendingReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-yellow-500 text-white"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => cancelledReq(dets._id)}
                            className="px-4 py-1 rounded-3xl bg-red-500 text-white"
                          >
                            Canelled
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div> */}
        </TabsContent>

        <TabsContent value="cancelled">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Cancelled Requests
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Manage</div>
            </div>

            {bookingData.filter((data) => data.status === "cancelled").length >
            0 ? (
              bookingData
                .filter((data) => data.status === "cancelled")
                .map((dets) => (
                  <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                    <div className="flex flex-col md:flex-row ">
                      <img
                        className="min-md:w-44 rounded-2xl shadow object-cover"
                        src={
                          dets.roomId?.images[0]?.url || dets.roomId.images[0]
                        }
                        alt=""
                      />
                      <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                        <p className="text-2xl font-serif tracking-tight">
                          {dets.hotelId.name} ,
                          <span className="text-[15px]">
                            ({dets.roomId.roomNumber})
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
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            {dets.hotelId.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700 tracking-tight font-serif">
                          <LuUsersRound
                            className={` text-lg ${
                              theme === "dark"
                                ? "text-neutral-400"
                                : "text-black"
                            } `}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-gray-700"
                            }`}
                          >
                            Guests: {dets.numberOfGuests}
                          </span>
                        </div>
                        <p className="font-serif">Total: ₹{dets.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex flex-col mt-3 gap-3">
                      <div>
                        <p className="font-serif">Check-In:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkInDate).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-serif">Check-Out:</p>
                        <p
                          className={` text-sm font-serif ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-gray-700"
                          }`}
                        >
                          {new Date(dets.checkOutDate).toDateString()}
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
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-gray-700"
                          }`}
                        >
                          Name: {dets.userName}
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
                          Email: {dets.userId.email}
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
                          Phone: {dets.userPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <button
                          onClick={() => approvedReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Confirm
                        </button>
                        {/* <button
                        onClick={() => cancelledReq(dets._id)}
                        className="px-4 py-1.5 mt-4 text-xs border border-red-500 text-red-500 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                      >
                        Cancell
                      </button> */}

                        <button
                          onClick={() => pendingReq(dets._id)}
                          className="px-4 py-1.5 mt-4 text-xs border border-yellow-400 text-yellow-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer font-serif"
                        >
                          Pending
                        </button>
                      </>
                    </div>
                  </div>
                ))
            ) : (
              <div className="px-6 py-4  flex flex-col items-center justify-center h-100">
                <CiCalendarDate
                  className={`text-6xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-3xl mt-3">No Bookings Found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageBooking;
