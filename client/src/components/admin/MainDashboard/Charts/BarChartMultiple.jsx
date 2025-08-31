"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
import BASE_URL from "../../../../utils/api";
import { useEffect, useState } from "react";

const chartConfig = {
  checkin: {
    label: "Check-in",
    color: "#2563eb",
  },
  checkout: {
    label: "Check-out",
    color: "#60a8fb",
  },
};

export default function BarChartMultiple() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChartData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-[500] text-xl">
          Bar Chart - Multiple
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="checkin" fill="var(--color-checkin)" radius={4} />
            <Bar dataKey="checkout" fill="var(--color-checkout)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm ">
        <div className="flex flex-col  gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-[#2563eb]"></div>
            <div className="font-[400] text-xs leading-none">Check-in</div>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-[#60a8fb]"></div>
            <div className="font-[400] text-xs leading-none">Check-out</div>
          </div>
        </div>
        <div className="flex gap-2 font-medium leading-none">
          Showing total visitors for the last week.
        </div>
      </CardFooter>
    </Card>
  );
}
