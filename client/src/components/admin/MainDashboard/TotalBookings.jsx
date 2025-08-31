import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TableTemp from "../Template/TableTemp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TotalBookings = () => {
  let location = useLocation();
  const { data } = location.state || {};
  console.log(data);

  const [confirmedBookings, setConfirmedBookings] = useState(
    data.filter(
      (booking) =>
        booking.status === "booked" && booking.isChecking === "confirm"
    )
  );

  const [pendingBookings, setPendingBookings] = useState(
    data.filter(
      (booking) =>
        booking.status === "pending" ||
        (booking.isChecking === "pending" && booking.status !== "cancelled")
    )
  );

  const [cancelledBookings, setCancelledBookings] = useState(
    data.filter(
      (booking) =>
        booking.status === "cancelled" || booking.isChecking === "cancelled"
    )
  );

  return (
    <div>
      <Tabs defaultValue="booked">
        <TabsList>
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancel">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="booked">
          <h1 className="font-medium mt-5 text-3xl font-serif tracking-tighter">
            Confirmed Bookings
          </h1>

          <TableTemp data={{ data: confirmedBookings, status: "confirm" }} />
        </TabsContent>

        <TabsContent value="pending">
          <h1 className="font-medium mt-5 text-3xl font-serif tracking-tighter">
            Pending Bookings
          </h1>

          <TableTemp data={{ data: pendingBookings, status: "pending" }} />
        </TabsContent>

        <TabsContent value="cancel">
          <h1 className="font-medium mt-5 text-3xl font-serif tracking-tighter">
            Pending Bookings
          </h1>

          <TableTemp data={{ data: cancelledBookings, status: "cancel" }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TotalBookings;
