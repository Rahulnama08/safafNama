import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import { toast } from "sonner";
import { LuUsersRound } from "react-icons/lu";
import { CiLocationOn, CiUser } from "react-icons/ci";
import { useTheme } from "../../ThemeProvider";
import { HiOutlineMail } from "react-icons/hi";
import { CgSmartphone } from "react-icons/cg";
import { BiUser } from "react-icons/bi";

const UserCheckIn = () => {
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
      <Tabs defaultValue="booked">
        <TabsList>
          <TabsTrigger value="booked">Confirm</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="complete">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="booked">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Confirm Checked-In by Users
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Status</div>
            </div>

            {bookingData
              .filter(
                (data) =>
                  data.status === "booked" && data.isChecking === "confirm"
              )
              .map((dets) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.roomId?.images[0]?.url || dets.roomId.images[0]}
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

                  <div className="flex flex-row md:items-center md:gap-12 gap-8">
                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full bg-blue-500`}
                          ></div>
                          <p
                            className={`text-sm font-serif rounded-full text-blue-500`}
                          >
                            Confirmed
                          </p>
                        </div>
                      </>
                    </div>{" "}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Request Pending by Users
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Status</div>
            </div>

            {bookingData
              .filter(
                (data) =>
                  data.status === "booked" && data.isChecking === "pending"
              )
              .map((dets) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.roomId?.images[0]?.url || dets.roomId.images[0]}
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

                  <div className="flex flex-row md:items-center md:gap-12 gap-8">
                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full bg-yellow-400`}
                          ></div>
                          <p
                            className={`text-sm font-serif rounded-full text-yellow-400`}
                          >
                            Pending
                          </p>
                        </div>
                      </>
                    </div>{" "}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Request Cancelled by Users
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Status</div>
            </div>

            {bookingData
              .filter(
                (data) =>
                  data.status === "booked" && data.isChecking === "cancelled"
              )
              .map((dets) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.roomId?.images[0]?.url || dets.roomId.images[0]}
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

                  <div className="flex flex-row md:items-center md:gap-12 gap-8">
                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full bg-red-500`}
                          ></div>
                          <p
                            className={`text-sm font-serif rounded-full text-red-500`}
                          >
                            Cancelled
                          </p>
                        </div>
                      </>
                    </div>{" "}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="complete">
          <h1 className="font-medium mt-5 text-3xl tracking-tighter">
            Completed Bookings
          </h1>

          <div className="mt-8 w-full ">
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ">
              <div className="">Hotel Details</div>
              <div className="">Date & Timings</div>
              <div className="">User Details</div>
              <div className="pl-[3%]">Status</div>
            </div>

            {bookingData
              .filter(
                (data) =>
                  data.status === "completed" &&
                  data.isChecking === "checked-out"
              )
              .map((dets) => (
                <div className="grid grid-cols-1 max-md:gap-5 md:grid-cols-[3fr_2fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ">
                  <div className="flex flex-col md:flex-row ">
                    <img
                      className="min-md:w-44 rounded-2xl shadow object-cover"
                      src={dets.roomId?.images[0]?.url || dets.roomId.images[0]}
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

                  <div className="flex flex-row md:items-center md:gap-12 gap-8">
                    <div className="flex flex-col w-fit md:items-center">
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full bg-green-500`}
                          ></div>
                          <p
                            className={`text-sm font-serif rounded-full text-green-600`}
                          >
                            Completed
                          </p>
                        </div>
                      </>
                    </div>{" "}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserCheckIn;
