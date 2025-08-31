"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

// Chart config (no type checking here, plain object)
const chartConfig = {
  visitors: { label: "Visitors" },
  booked: { label: "Booked", color: "blue" },
  cancelled: { label: "Cancelled", color: "red" },
  pending: { label: "Pending", color: "yellow" },
};

export default function PieChartComponent() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      let res = await axios.get(`${BASE_URL}/bookings/booking-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChartData(res.data.chartData);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="flex flex-col   ">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-[500] text-xl">
          Pie Chart - Bookings
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={true}
              
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm -mt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-red-500"></div>
            <div className="font-[400] text-xs leading-none">Cancelled</div>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-yellow-500"></div>
            <div className="font-[400] text-xs leading-none">Pending</div>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-blue-500"></div>
            <div className="font-[400] text-xs leading-none">Confirmed</div>
          </div>
        </div>
        
      </CardFooter>
    </Card>
  );
}
