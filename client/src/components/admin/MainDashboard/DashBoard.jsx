import React, { use, useEffect, useState } from "react";
import { useTheme } from "../../ThemeProvider";
import { CiBookmarkMinus, CiLocationArrow1 } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { MdIncompleteCircle } from "react-icons/md";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import { data, useNavigate } from "react-router-dom";
import { BarChart } from "lucide-react";
import BarChartComponent from "./Charts/BarChartComponent ";
import { LineChartComponent } from "./Charts/LineChartComponent";
import PieChartComponent from "./Charts/PieChartComponent";
import BarChartComponent2 from "./Charts/BarChartComponent2";
import BarChartMultiple from "./Charts/BarChartMultiple";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DashBoard = () => {
  const { theme } = useTheme();
  let navigate = useNavigate();

  const [data, setData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [revenue, setRevenue] = useState();

  const [pendingBookings, setPendingBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setData(res.data);
      setBookings(
        res.data.filter(
          (book) =>
            book.isChecking !== "checked-out" &&
            book.isChecking !== "checked-in"
        )
      );
      setCheckins(res.data.filter((book) => book.isChecking === "checked-in"));
      setCheckouts(
        res.data.filter((book) => book.isChecking === "checked-out")
      );
      setRevenue(
        res.data
          .filter(
            (book) =>
              !["pending", "cancelled"].includes(book.isChecking) &&
              ["booked", "completed"].includes(book.status)
          )
          .reduce((acc, curr) => acc + curr.totalAmount, 0)
      );

      setPendingBookings(
        res.data.filter(
          (book) =>
            book.status === "pending" ||
            (book.isChecking === "pending" && book.status !== "cancelled")
        )
      );
      setCancelledBookings(
        res.data.filter(
          (book) =>
            (book.status === "cancelled" && book.isChecking !== "pending") ||
            book.isChecking === "cancelled"
        )
      );
      setConfirmedBookings(
        res.data.filter(
          (book) => book.status === "booked" && book.isChecking === "confirm"
        )
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const boxLinks = [
    {
      title: "Total Bookings",
      count: bookings.length,
      link: "/admin/totalBookings",
      icon: <CiBookmarkMinus />,
      data: bookings,
    },
    {
      title: "Check-ins",
      count: checkins.length,
      link: "/admin/checkin",
      icon: <MdIncompleteCircle />,
      data: checkins,
    },
    {
      title: "Check-outs",
      count: checkouts.length,
      link: "/admin/checkout",
      icon: <CiCircleCheck />,
      data: checkouts,
    },
    {
      title: "Total Revenue",
      count: revenue?.toFixed(2),
      link: "/admin/revenue",
      icon: <MdOutlineCurrencyRupee />,
    },
  ];

  return (
    <div className="pb-15 font-serif">
      <h1 className="font-medium mt-2 text-3xl tracking-tighter font-serif">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-7 mt-5">
        {boxLinks.map((dets, i) => (
          <div
            key={i}
            onClick={() => navigate(dets.link, { state: { data: dets.data } })}
            className={`w-full ${
              dets.link && "cursor-pointer"
            } max-[400px]:px-4 px-7 h-30 gap-2 border  rounded-3xl flex flex-col justify-center ${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-700"
                : " text-neutral-800 border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-serif text-xl  tracking-tight flex items-center gap-1">
                <span className="text-2xl">{dets.icon}</span>
                {dets.title}
              </p>
              {dets.link && <CiLocationArrow1 className="text-xl" />}
            </div>
            <p className="text-3xl font-[400] tracking-tight pl-7">
              {dets.count}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-5 w-full ">
        <BarChartComponent />
        <LineChartComponent />
      </div>

      <div className="mt-5 flex flex-col lg:flex-row gap-5 w-full ">
        <div className="flex flex-col gap-5 lg:w-[40%]">
          <PieChartComponent />
          {/* <BarChartComponent2 /> */}
          {/* <BarChartMultiple />   */}
        </div>

        <div className="max-h-[50%] h-[50%] border rounded-3xl w-full p-7 overflow-scroll scrollbar-none">
          <h1 className="font-[500] text-xl">Recent Bookings</h1>

          <div className="mt-5 ">
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="font-[500] text-lg ">Name</TableHead>
                  <TableHead className="font-[500] text-lg ">Hotel</TableHead>
                  <TableHead className="font-[500] text-lg w-[60px]">
                    Guest
                  </TableHead>
                  <TableHead className="font-[500] text-lg ">Amount</TableHead>
                  <TableHead className="font-[500] text-lg ">
                    Check-in
                  </TableHead>
                  <TableHead className="font-[500] text-lg ">
                    Check-out
                  </TableHead>
                  <TableHead className="font-[500] text-lg ">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 7)
                  .map((book, i) => (
                    <TableRow>
                      <TableCell>{book.userName}</TableCell>
                      <TableCell>{book.hotelId.name}</TableCell>
                      <TableCell className="w-[60px]">
                        {book.numberOfGuests}
                      </TableCell>
                      <TableCell> ₹{book.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(book.checkInDate).toDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(book.checkOutDate).toDateString()}
                      </TableCell>
                      <TableCell className="">
                        {(book.status === "pending" ||
                          (book.isChecking === "pending" &&
                            book.status === "booked")) && (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <p className="text-sm font-serif text-yellow-400">
                              Pending
                            </p>
                          </div>
                        )}

                        {(book.status === "cancelled" ||
                          book.isChecking === "cancelled") && (
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
                        )}

                        {book.status !== "checked-out" &&
                          book.isChecking === "confirm" &&
                          book.status === "booked" && (
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
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
