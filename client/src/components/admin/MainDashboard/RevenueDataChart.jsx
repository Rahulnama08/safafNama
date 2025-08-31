import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const RevenueDataChart = ({ data }) => {
    console.log(data)
  if (!data) return null;

  const { stateData, cityData, hotelData, trendData } = data;

  const createChartData = (labels, dataValues, label, color) => ({
    labels,
    datasets: [
      {
        label,
        data: dataValues,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 font-serif">
      {/* Revenue Over Time */}
      <div>
        <h2 className="text-lg mb-2">Revenue Over Time (₹)</h2>
        <Line
          data={createChartData(
            trendData.map((item) => item.date),
            trendData.map((item) => item.amount),
            "Revenue Over Time",
            "#a855f7"
          )}
          options={{
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
              x: { type: "time", time: { unit: "day" } },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      {/* Revenue by State */}
      <div>
        <h2 className="text-lg mb-2">Revenue by State (₹)</h2>
        <Bar
          data={createChartData(
            stateData.map((d) => d.label),
            stateData.map((d) => d.amount),
            "Revenue by State",
            "#6366f1"
          )}
          options={{ responsive: true }}
        />
      </div>

      {/* Revenue by City */}
      <div>
        <h2 className="text-lg mb-2">Revenue by City (₹)</h2>
        <Bar
          data={createChartData(
            cityData.map((d) => d.label),
            cityData.map((d) => d.amount),
            "Revenue by City",
            "#10b981"
          )}
          options={{ responsive: true }}
        />
      </div>

      {/* Revenue by Hotel */}
      <div>
        <h2 className="text-lg mb-2">Revenue by Hotel (₹)</h2>
        <Bar
          data={createChartData(
            hotelData.map((d) => d.label),
            hotelData.map((d) => d.amount),
            "Revenue by Hotel",
            "#f59e0b"
          )}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default RevenueDataChart;
