import React from "react";
import { Navigate } from "react-router-dom";

const CheckToken = ({ children }) => {
  console.log(JSON.parse(localStorage.getItem("data")));
  const isLoggedIn = JSON.parse(localStorage.getItem("data"));

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default CheckToken;
