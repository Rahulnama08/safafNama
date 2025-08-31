import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { TfiHome } from "react-icons/tfi";
import {
  CiBookmarkMinus,
  CiLocationArrow1,
  CiLocationOn,
} from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import { IoBedOutline } from "react-icons/io5";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { SlUserFollowing } from "react-icons/sl";
import { RxDashboard } from "react-icons/rx";

const Dashboard = () => {
  const dashboardicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const overviewicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z"
      />
    </svg>
  );

  const chaticon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />
    </svg>
  );

  const sidebarLinks = [
    { name: "Add State", path: "/admin/state", icon: <CiLocationOn /> },
    { name: "Add City", path: "/admin/city", icon: <CiLocationArrow1 /> },
    { name: "Add Hotel", path: "/admin/hotel", icon: <CiHome /> },
    { name: "Add Room", path: "/admin/room", icon: <IoBedOutline /> },
    {
      name: "Create Coupons",
      path: "/admin/coupon",
      icon: <PiNewspaperClippingLight />,
    },
  ];
  const sidebarLinks2 = [
    { name: "Dashboard", path: "/admin", icon: <RxDashboard /> },
    {
      name: "Bookings",
      path: "/admin/manageBookings",
      icon: <CiBookmarkMinus />,
    },
    {
      name: "User Check-In",
      path: "/admin/userCheck",
      icon: <SlUserFollowing />,
    },

    // { name: "Add Hotel", path: "/admin/hotel", icon: chaticon },
    // { name: "Add Room", path: "/admin/room", icon: chaticon },
    // { name: "Home", path: "/home", icon: chaticon },
  ];
  const { theme } = useTheme();

  return (
    <>
      {/* Sidebar + Main Content */}
      <div className={`flex min-h-screen pt-12 relative `}>
        {/* Sidebar */}
        <div
          className={`md:w-54 w-10 h-full fixed  sm:pr-2 text-base   gap-2 flex flex-col transition-all duration-300 pt-7 border-neutral-200 ${
            theme === "dark"
              ? "bg-neutral-900 text-white"
              : "bg-[#f9fbfc] text-black"
          }`}
        >
          <div className="border-b border-neutral-300 flex flex-col gap-1 pt-2 pb-3 ">
            {sidebarLinks2.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center font-serif gap-2 py-1 px-2  transition-colors duration-200 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-neutral-800 text-white"
                        : "bg-white border-r-7 border-y border-gray-300  text-black"
                      : theme === "dark"
                      ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      : "text-black hover:bg-white hover:text-black"
                  }`
                }
              >
                <p
                  className={` text-xl  ${
                    theme === "dark"
                      ? "text-white hover:bg-neutral-800 hover:"
                      : "text-black hover:bg-white"
                  } `}
                >
                  {item.icon}
                </p>
                <p className="md:block hidden text-center ">{item.name}</p>
              </NavLink>
            ))}
          </div>

          <div className="border-b border-neutral-300 flex flex-col gap-1 pb-3 ">
            {sidebarLinks.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center font-serif gap-1.5 py-1 px-2  transition-colors duration-200 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-neutral-800 text-white"
                        : "bg-white  border-y border-gray-300  text-black border-r-7"
                      : theme === "dark"
                      ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      : "text-black hover:bg-white hover:text-black "
                  }`
                }
              >
                <p
                  className={` text-xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  } `}
                >
                  {item.icon}
                </p>
                <p className="md:block hidden text-center">{item.name}</p>
              </NavLink>
            ))}
          </div>

          <div className="pb-2 border-b border-neutral-300">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <div
                className={`flex items-center font-serif cursor-pointer gap-2 py-1 px-2 rounded-r-4xl transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    : "text-black hover:bg-white hover:text-black"
                }`}
              >
                <p className="text-lg">
                  <TfiHome />
                </p>
                <p className="max-md:hidden">View</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 p-7 max-sm:py-7 max-sm:px-2 pb-10  border border-neutral-200  md:ml-52 ml-10  max-[450px]:w-[86vw] max-sm:w-[90vw] md:w-[78vw] lg:w-[83vw] xl:w-[88vw]  h-full fixed overflow-scroll ${
            theme === "dark"
              ? "bg-neutral-900 text-white  border-neutral-500"
              : "bg-white text-black border-gray-300"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
