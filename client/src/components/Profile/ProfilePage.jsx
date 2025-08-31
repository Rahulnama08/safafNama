import React from "react";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbLockPassword } from "react-icons/tb";
import { CiBookmarkMinus } from "react-icons/ci";

const ProfilePage = () => {
  const sidebarLinks = [
    { name: "Edit Profile", path: "/profile", icon: <LiaUserEditSolid /> },
    {
      name: "Reset Password",
      path: "/profile/reset",
      icon: <TbLockPassword />,
    },
    // { name: "Your Bookings", path: "/profile/yourbookings", icon: chaticon },
    {
      name: "Manage Bookings",
      path: "/profile/bookings",
      icon: <CiBookmarkMinus />,
    },
  ];

  const { theme } = useTheme();
 
  return (
    <div className={`flex min-h-screen pt-15 relative `}>
      <div
        className={`md:w-54 w-10 h-full fixed  sm:pr-2 text-base   gap-2 flex flex-col transition-all duration-300 pt-7 border-neutral-200 ${
          theme === "dark"
            ? "bg-neutral-900 text-white"
            : "bg-[#f9fbfc] text-black"
        }`}
      >
        <div
          className={`md:border-b  pb-2  border-neutral-300 mb-2 flex items-center max-md:justify-center  ${
            theme === "dark" ? " text-white" : " text-black"
          }`}
        >
          <p className="text-3xl border rounded-full  bg-white md:hidden">
            <RiAccountPinCircleLine />
          </p>
          <p className="text-xl  font-serif pl-2 max-md:hidden  font-[600] ">
            Account
            <span className="block text-sm max-md:hidden font-medium">
              Manage your account info.
            </span>
          </p>
        </div>
        {/* <div className="p-2 flex items-center gap-3">
          <div>
            <img
              className="h-8 bg-white w-8 rounded-full border p-1"
              src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
              alt=""
            />
          </div>

          <div className="text-sm font-serif tracking-tight">
            <p>Mayank</p>
            <p>mayank@gmail.com</p>
          </div>
        </div> */}

        <div className="border-b border-neutral-300 flex flex-col gap-1 pt-2 pb-3 ">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              end={item.path === "/profile"}
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
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-7 pb-10  border border-neutral-200  md:ml-52 ml-10  w-[87vw]  h-full fixed overflow-scroll ${
          theme === "dark"
            ? "bg-neutral-900 text-white  border-neutral-500"
            : "bg-white text-black border-gray-300"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
