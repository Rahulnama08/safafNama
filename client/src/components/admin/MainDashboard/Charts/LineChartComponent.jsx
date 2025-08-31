// "use client";

// import { TrendingUp } from "lucide-react";
// import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
// import { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../../utils/api";

// // const chartData = [
// //   { day: "Sunday", revenue: 186 },
// //   { day: "Monday", revenue: 305 },
// //   { day: "Tuesday", revenue: 237 },
// //   { day: "Wednesday", revenue: 73 },
// //   { day: "Thursday", revenue: 209 },
// //   { day: "Friday", revenue: 214 },
// //   { day: "Saturday", revenue: 214 },
// // ];

// // Chart configuration (JS version)
// const chartConfig = {
//   revenue: {
//     label: "Revenue",
//     color: "#2563eb",
//   },
// };

// export function LineChartComponent() {
//   const [chartData, setChartData] = useState([]);

//   const fetchData = async () => {
//     let token = JSON.parse(localStorage.getItem("data")).token;

//     try {
//       let res = await axios.get(`${BASE_URL}/bookings/weekly-revenue`, {
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
//     <div className="w-full ">
//       <Card>
//         <CardHeader>
//           <CardTitle className="font-[500] text-xl">Revenue Overview</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <ChartContainer config={chartConfig}>
//             <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
//               <CartesianGrid vertical={false} />
//               <ChartLegend content={<ChartLegendContent />} />

//               <XAxis
//                 dataKey="day"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 tickFormatter={(day) => day.slice(0, 3)}
//                 interval={0}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />
//               <Line
//                 dataKey="revenue"
//                 type="natural"
//                 stroke="var(--color-revenue)"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ChartContainer>
//         </CardContent>

//         <CardFooter className="flex-col items-start gap-2 text-sm -mt-4">
//           <div className="flex gap-2 font-medium leading-none">
//             Showing revenue for the last week.
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../utils/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "../../../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
};

export function LineChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [weekRange, setWeekRange] = useState("");
  const [filter, setFilter] = useState("last");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("data"))?.token;
    const params = new URLSearchParams();

    if (filter === "custom" && startDate && endDate) {
      params.append("week", "custom");
      params.append("start", startDate);
      params.append("end", endDate);
    } else {
      params.append("week", filter);
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/bookings/weekly-revenue?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChartData(res.data.data);
      setWeekRange(res.data.weekRange);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch chart");
    }
  };

  useEffect(() => {
    if (filter === "custom" && (!startDate || !endDate)) return;
    fetchData();
  }, [filter, startDate, endDate]);

  return (
    <div className="w-full space-y-4">
      {/* Chart card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p className="font-[500] text-xl">Revenue Overview</p>
            {/* Filter controls */}
            <div className="flex gap-4 items-center font-[500] ">
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
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(day) => day.slice(0, 3)}
                interval={0}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm -mt-4">
          <div className="flex gap-2 font-medium leading-none">
            Showing revenue for:{" "}
            <span className="text-muted-foreground">{weekRange}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
