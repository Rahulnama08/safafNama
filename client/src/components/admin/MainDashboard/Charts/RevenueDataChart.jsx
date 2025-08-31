"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

export default function RevenueDataChart({ data }) {
  const { chartData, mess } = data;

  // You must pick a numeric field to visualize, like 'amount'
  const valueKey = "amount"; // or "bookings", depending on what you want to show

  const chartConfig = {
    [valueKey]: {
      label: valueKey,
      color: "#2563eb",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by {mess}</CardTitle>
        <CardDescription>Aggregated Hotel Booking Revenue</CardDescription>
      </CardHeader>
      <CardContent className="h-fit w-full">
        <ChartContainer className="h-fit max-h-80 w-full" config={chartConfig}>
          <BarChart
            // style={{ height: "100%" }}
            // width={50}
            // height={10}
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 7 }}
          >
            <XAxis type="number" dataKey={valueKey} />
            <YAxis
              dataKey={mess}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(mess) => mess.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={valueKey}
              layout="vertical"
              fill="#2563eb"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
