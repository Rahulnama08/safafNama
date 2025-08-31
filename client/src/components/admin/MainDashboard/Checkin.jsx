import React from "react";
import TableTemp from "../Template/TableTemp";
import { useLocation } from "react-router-dom";

const Checkin = () => {
  let location = useLocation();
  const { data } = location.state || {};
  console.log(data);
  return (
    <div>
      <h1 className="font-medium mt-5 text-3xl font-serif tracking-tighter">
        Checked-in Bookings
      </h1>

      <TableTemp data={{ data : data, status: "checkin" }} />
    </div>
  );
};

export default Checkin;
