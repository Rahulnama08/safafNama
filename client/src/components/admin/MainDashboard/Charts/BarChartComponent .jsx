// "use client";

// import React, { useEffect, useState } from "react";
// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { ChartLegend, ChartLegendContent } from "../../../ui/chart";
// import axios from "axios";
// import BASE_URL from "../../../../utils/api";

// const chartConfig = {
//   //   checkin: {
//   //     label: "Check-in",
//   //     color: "hsl(var(--chart-1))",
//   //   },
//   //   checkout: {
//   //     label: "Check-out",
//   //     color: "hsl(var(--chart-2))",
//   //   },
//   bookings: {
//     label: "Bookings",
//     color: "hsl(var(--chart-3))",
//   },
// };

// const BarChartComponent = () => {
//   const [chartData, setChartData] = useState([]);

//   const fetchData = async () => {
//     let token = JSON.parse(localStorage.getItem("data")).token;

//     try {
//       let res = await axios.get(`${BASE_URL}/bookings/weekly-booking-counts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setChartData(res.data.data);
//       console.log(res.data);
//     } catch (error) {
//       console.log(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="w-full">
//       <Card>
//         <CardHeader>
//           <CardTitle className='font-[500] text-xl'>Reservations</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={chartConfig}>
//             <BarChart data={chartData}>
//               <CartesianGrid vertical={false} />
//               <ChartLegend content={<ChartLegendContent />} />

//               <XAxis
//                 dataKey="day"
//                 tickLine={false}
//                 tickMargin={10}
//                 axisLine={false}
//                 tickFormatter={(value) => value.slice(0, 3)}
//               />
//               <ChartTooltip
//                 cursor={true}
//                 content={<ChartTooltipContent indicator="dashed" />}
//               />
//               <Bar dataKey="bookings" fill="var(--chart-1)" radius={4} />
//             </BarChart>
//           </ChartContainer>
//         </CardContent>
//         <CardFooter className="flex-col items-start gap-1 text-sm -mt-4">
//           <div className="flex gap-2 font-medium leading-none">
//             Showing total visitors for the last week.
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default BarChartComponent;



"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";
import BASE_URL from "../../../../utils/api";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "../../../ui/chart";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-3))",
  },
};

const BarChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("last");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekRange, setWeekRange] = useState("");

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    const params = new URLSearchParams();

    if (filter === "custom" && startDate && endDate) {
      params.append("week", "custom");
      params.append("start", startDate);
      params.append("end", endDate);
    } else {
      params.append("week", filter);
    }

    try {
      let res = await axios.get(
        `${BASE_URL}/bookings/weekly-booking-counts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChartData(res.data.data);
      setWeekRange(res.data.weekRange);
    } catch (error) {
      console.log(error.response?.data?.message || "Error loading bookings");
    }
  };

  useEffect(() => {
    if (filter === "custom" && (!startDate || !endDate)) return;
    fetchData();
  }, [filter, startDate, endDate]);

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-[500] flex items-center justify-between">
            <p className="text-xl">Reservations</p> {/* Filter controls */}
            <div className="flex gap-4 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="last">Last Week</option>
                <option value="current">Current Week</option>
                <option value="custom">Custom Range</option>
              </select>

              {filter === "custom" && (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1"
                  />
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="bookings" fill="var(--chart-1)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-1 text-sm -mt-4">
          <div className="flex gap-2 font-medium leading-none">
            Showing bookings for:{" "}
            <span className="text-muted-foreground">{weekRange}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BarChartComponent;

