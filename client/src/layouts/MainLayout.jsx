import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import NavBar from "../Elements/NavBar";
import Footer from "../Elements/Footer";

const MainLayout = () => {
  return (
    <>
      {/* <Navbar />
       */}
      <NavBar />

      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
