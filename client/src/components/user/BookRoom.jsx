import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "../ui/Datepicker";
import BASE_URL from "../../utils/api";
import { toast } from "sonner";
import { useTheme } from "../ThemeProvider";

const BookRoom = () => {
  let navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const location = useLocation();
  const { roomData, checkInDate, checkOutDate } = location.state || {};
  console.log(checkInDate, checkOutDate, roomData);

  const [totalDays, setTotalDays] = useState(0);
  const [date, setDate] = useState({
    from: checkInDate ? new Date(checkInDate) : null,
    to: checkOutDate ? new Date(checkOutDate) : null,
  });
  const [checkIn, setCheckIn] = useState(checkInDate || null);
  const [checkOut, setCheckOut] = useState(checkOutDate || null);

  useEffect(() => {
    if (date?.from && date?.to) {
      setCheckIn(date.from.toISOString());
      console.log(date.from);
      setCheckOut(date.to.toISOString());
      setTotalDays(() => {
        const start = new Date(date.from);
        const end = new Date(date.to);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      });
    }
  }, [date]);

  const [totalAmount, setTotalAmount] = useState(0);
  const totalAmountCalculate = () => {
    console.log(Number(totalDays), Number(roomData.pricePerNight));
    const amount = Number(roomData.pricePerNight) * Number(totalDays);
    setTotalAmount(amount);
  };
  useEffect(() => {
    totalAmountCalculate();
  }, [totalDays]);

  // -----------------------------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.post(
        `${BASE_URL}/bookings/bookRoom`,
        {
          hotelId: roomData.hotelId._id,
          roomId: roomData._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests,
          totalAmount : discount > 0 ? discount : totalAmount,
          userName,
          userPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate('/profile/bookings')
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  // -----------------------------------------------------------------------------------------

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const applyCoupon = async (e) => {
    e.preventDefault();

    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const res = await axios.post(
        `${BASE_URL}/coupons/apply`,
        { code: couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const discountedAmount =
      totalAmount - (totalAmount * res.data.discount) / 100;
      // setTotalAmount(discountedAmount);
      setDiscount(discountedAmount);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const { theme } = useTheme();

  return (
    <div className={`min-h-screen pt-30 sm:pt-25 px-1  sm:px-15 pb-15 ${theme === "dark" ? "bg-neutral-900 text-white" : " text-black"}`}>
      <h1 className="text-4xl  tracking-tight font-serif pl-[8%]">Book Room</h1>

      <div className=" sm:px-5  ">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-10 justify-evenly items-center">
            {/* left side */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="w-full">
                  <label htmlFor="name">
                    <span className="text-lg font-serif tracking-tight">
                      Hotel Name
                    </span>

                    <input
                      type="text"
                      id="name"
                      placeholder="Name"
                      disabled
                      value={roomData.hotelId.name}
                      // onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2  rounded-md font-serif border  border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="phone">
                    <span className="text-lg font-serif tracking-tight">
                      Room Number
                    </span>

                    <input
                      type="text"
                      id="phone"
                      placeholder="Phone Number"
                      disabled
                      value={roomData.roomNumber}
                      // onChange={handleChange}
                      required
                      className="mt-1 w-full  px-3 py-2   rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                    />
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label htmlFor="name">
                  <span className="text-lg font-serif tracking-tight">
                    Enter Your Name
                  </span>

                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="mt-1 w-full  px-3 py-2   rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                  />
                </label>
              </div>

              <div className="w-full">
                <label htmlFor="phone">
                  <span className="text-lg font-serif tracking-tight">
                    Enter Your Phone Number
                  </span>

                  <input
                    type="text"
                    id="phone"
                    placeholder="Phone Number"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                    className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                  />
                </label>
              </div>

              <div className="w-full">
                <label htmlFor="persons">
                  <span className="text-lg font-serif tracking-tight">
                    Total Persons
                  </span>

                  <input
                    type="number"
                    id="persons"
                    placeholder="Total Persons"
                    max={roomData.totalPersons}
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    required
                    className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                  />
                  <span className="font-serif text-sm ">
                    Maximum Capacity {roomData.totalPersons}
                  </span>
                </label>
              </div>
            </div>

            {/* right side */}
            <div
              className={`flex flex-col gap-5 justify-center rounded-4xl  border p-10 ${
                theme === "dark"
                  ? "bg-neutral-800 text-white border-neutral-500"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-10">
                <div className="flex flex-col ">
                  <span className="text-lg font-serif tracking-tight">
                    Check In Date
                  </span>
                  <span className="font-serif text-sm ">
                    {checkIn ? checkIn.slice(0, 10) : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-serif tracking-tight">
                    Check Out Date
                  </span>
                  <span className="font-serif text-sm ">
                    {checkOut ? checkOut.slice(0, 10) : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-serif tracking-tight">
                    Total Days
                  </span>
                  <span className="font-serif text-sm ">{totalDays} Days</span>
                </div>
              </div>

              <div className="pb-7">
                <span className="text-lg font-serif tracking-tight">
                  You can change your dates
                </span>
                <DatePickerWithRange
                  className=""
                  date={date}
                  setDate={setDate}
                />
              </div>

              <div className="flex flex-col border-t pt-7  gap-4">
                <div className="w-full">
                  <label htmlFor="name">
                    <span className="text-lg font-serif tracking-tight">
                      Have an Coupon?
                    </span>

                    <div className="flex gap-5 items-center">
                      <input
                        type="text"
                        id="name"
                        placeholder="Add here"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="mt-1 w-full  px-3 py-2 
                         rounded-md font-serif border  border-gray-400 sm:text-sm outline-none "
                      />

                      <button
                        onClick={applyCoupon}
                        className="text-white bg-pink-500 hover:bg-pink-600 font-serif rounded-lg text-sm px-5 py-2 text-center w-fit"
                      >
                        Apply
                      </button>
                    </div>
                  </label>
                </div>
                <div>
                  <span className="text-lg font-serif tracking-tight">
                    Your Total :
                  </span>
                  <pre className="text-lg font-serif tracking-tight flex gap-5 items-center">
                    ₹{roomData.pricePerNight} x {totalDays} Days :{" "}
                    <span className="text-[20px]">₹{totalAmount}</span>
                  </pre>
                </div>

                {discount > 0 && (
                  <div>
                    <pre className="text-lg font-serif tracking-tight flex gap-5 items-center">
                      {/* ₹{roomData.pricePerNight} x {totalDays} Days :{" "} */}
                      <span className="text-lg font-serif tracking-tight">
                        After Discount :
                      </span>{" "}
                      <span className="text-[20px]">₹{discount}</span>
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <button className="text-white bg-pink-500 hover:bg-pink-600 font-serif rounded-lg text-md px-5 py-2 text-center w-fit">
                  Book
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookRoom;
