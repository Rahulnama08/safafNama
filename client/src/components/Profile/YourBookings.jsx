import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import BASE_URL from "../../utils/api";
import { toast } from "sonner";

const YourBookings = () => {
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

  return (
    <div className="font-serif">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending Bookings</TabsTrigger>
          <TabsTrigger value="confirm">Confirm Bookings</TabsTrigger>
          <TabsTrigger value="cancel">Cancel Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="mt-5 flex flex-wrap gap-5 ">
            {bookings
              .filter(
                (book) =>
                  book.isChecking === "pending" && book.status === "booked"
              )
              .map((booking) => (
                <div className="card flex  flex-col gap-4 border p-4 w-fit rounded-3xl border-gray-400">
                  <div>
                    <p className="text-2xl  tracking-tighter font-serif">
                      {booking.hotelId.name} ,
                    </p>
                    <p>{booking.hotelId.address}</p>
                  </div>

                  <div className="flex gap-6 ">
                    <div>
                      <h1>Room Number </h1>
                      <h1>Checkin Date </h1>
                      <h1>Checkout Date </h1>
                      <h1>Total Amount </h1>
                    </div>

                    <div>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                    </div>
                    <div>
                      <p>{booking.roomId.roomNumber}</p>
                      <p>{booking.checkInDate.slice(0, 10)}</p>
                      <p>{booking.checkOutDate.slice(0, 10)}</p>
                      <p>{booking.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    {booking.status === "pending" ? (
                      <p className="text-red-600">Waiting for confirmation</p>
                    ) : (
                      <>
                        <button
                          onClick={() => confirmBookingUser(booking._id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 font-serif rounded-lg text-md px-3 py-0.5 text-center w-fit"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => cancellBookingUser(booking._id)}
                          className="text-white bg-pink-500 hover:bg-pink-600 font-serif rounded-lg text-md px-3 py-0.5 text-center w-fit"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="confirm">
          <div className="mt-5 flex flex-wrap gap-5 ">
            {bookings
              .filter((book) => book.isChecking === "confirm")
              .map((booking) => (
                <div className="card flex  flex-col gap-4 border p-4 w-fit rounded-3xl border-gray-400">
                  <div>
                    <p className="text-2xl  tracking-tighter font-serif">
                      {booking.hotelId.name} ,
                    </p>
                    <p>{booking.hotelId.address}</p>
                  </div>

                  <div className="flex gap-6 ">
                    <div>
                      <h1>Room Number </h1>
                      <h1>Checkin Date </h1>
                      <h1>Checkout Date </h1>
                      <h1>Total Amount </h1>
                    </div>

                    <div>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                    </div>
                    <div>
                      <p>{booking.roomId.roomNumber}</p>
                      <p>{booking.checkInDate.slice(0, 10)}</p>
                      <p>{booking.checkOutDate.slice(0, 10)}</p>
                      <p>{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="cancel">
          <div className="mt-5 flex flex-wrap gap-5 ">
            {bookings
              .filter(
                (book) =>
                  book.isChecking === "cancelled" || book.status === "cancelled"
              )
              .map((booking) => (
                <div className="card flex  flex-col gap-4 border p-4 w-fit rounded-3xl border-gray-400">
                  <div>
                    <p className="text-2xl  tracking-tighter font-serif">
                      {booking.hotelId.name} ,
                    </p>
                    <p>{booking.hotelId.address}</p>
                  </div>

                  <div className="flex gap-6 ">
                    <div>
                      <h1>Room Number </h1>
                      <h1>Checkin Date </h1>
                      <h1>Checkout Date </h1>
                      <h1>Total Amount </h1>
                    </div>

                    <div>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                      <p>:</p>
                    </div>
                    <div>
                      <p>{booking.roomId.roomNumber}</p>
                      <p>{booking.checkInDate.slice(0, 10)}</p>
                      <p>{booking.checkOutDate.slice(0, 10)}</p>
                      <p>{booking.totalAmount}</p>
                    </div>
                  </div>

                  {booking.status === "cancelled" && (
                    <p className="text-red-600">Booking Cancelled by Admin</p>
                  )}
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="mt-5 flex flex-wrap gap-5 ">
            {bookings.map((booking) => (
              <div className="card flex  flex-col gap-4 border p-4 w-fit rounded-3xl border-gray-400">
                <div>
                  <p className="text-2xl  tracking-tighter font-serif">
                    {booking.hotelId.name} ,
                  </p>
                  <p>{booking.hotelId.address}</p>
                </div>

                <div className="flex gap-6 ">
                  <div>
                    <h1>Room Number </h1>
                    <h1>Checkin Date </h1>
                    <h1>Checkout Date </h1>
                    <h1>Total Amount </h1>
                  </div>

                  <div>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                  </div>
                  <div>
                    <p>{booking.roomId.roomNumber}</p>
                    <p>{booking.checkInDate.slice(0, 10)}</p>
                    <p>{booking.checkOutDate.slice(0, 10)}</p>
                    <p>{booking.totalAmount}</p>
                  </div>
                </div>

                <div className="flex flex-col mt-2">
                  {booking.status === "pending" ? (
                    <p className="text-red-600">Waiting for confirmation</p>
                  ) : (
                    <>
                      <p>Checked-In : {booking.isChecking}</p>
                      <p> Status : {booking.status}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YourBookings;
