"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import BASE_URL from "../../../../utils/api";
import axios from "axios";
import { useEffect, useState } from "react";

const chartConfig = {
  checkin: {
    label: "Check-in",
    color: "hsl(var(--chart-1))",
  },
  checkout: {
    label: "Check-out",
    color: "hsl(var(--chart-2))",
  },
};

export default function BarChartComponent2() {
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
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Tooltip - Label Formatter</CardTitle>
          <CardDescription>Tooltip with label formatter.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar
                dataKey="checkin"
                stackId="a"
                fill="#2563eb"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="checkout"
                stackId="a"
                fill="#60a8fb"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
