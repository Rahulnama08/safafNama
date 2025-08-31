import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("data")).user;

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default AdminRoutes;