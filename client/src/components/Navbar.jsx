// import React, { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ModeToggle } from "./modeToggle";
// import { useTheme } from "@/components/ThemeProvider";
// import { FaUserCircle } from "react-icons/fa";



// const Navbar = () => {
//   // logout
//   let navigate = useNavigate();

//   const userData = JSON.parse(localStorage.getItem("data"));
//   // const profileImg = userData?.user?.profileImg;

//   const [profileImg, setProfileImg] = React.useState(
//     userData?.user?.profileImg
//   );


//   const logOutUser = () => {
//     localStorage.removeItem("data");
//     toast.success("Logout successful.");
//     navigate("/");
//   };



//   const {theme} = useTheme();


//   return (
//     <>
//       {/* Header */}
//       <div
//         className={`flex fixed w-full z-1 items-center justify-between font-serif px-4 md:px-8  py-3   transition-all duration-300 border-b border-gray-300 rounded-b-4xl ${
//           theme === "dark"
//             ? "bg-neutral-900 text-white border-gray-500"
//             : "bg-white text-black"
//         }`}
//       >
//         {/* <img
//           className="h-12"
//           src="https://cdn.brandfetch.io/idC6eY3m41/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
//           alt="dummyLogoColored"
//         /> */}
//         <p className="text-2xl">QuickStays</p>

//         <div className="flex items-center gap-5 ">
//           {/* <p className="max-sm:hidden font-serif">Hi! {name}</p> */}
//           {/* <div class="flex flex-col w-44 text-sm">
//             <button
//               type="button"
//               class="peer group w-fit text-left px-4 pr-2 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
//             >
//               <span>Select</span>
//               <svg
//                 class="w-5 h-5 inline float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="#6B7280"
//               >
//                 <path
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="m19 9-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             <ul class="hidden overflow-hidden peer-focus:block w-fit absolute mt-10 bg-white border border-gray-300 rounded shadow-md  py-2">
//               <li class="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer">
//                 Germany
//               </li>
//               <li class="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer">
//                 Canada
//               </li>
//               <li class="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer">
//                 United States
//               </li>
//               <li class="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer">
//                 Russia
//               </li>
//             </ul>
//           </div> */}
//           <div>
//             <ModeToggle />
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger >
//               <div>
//                 <img
//                   className="h-8 w-8 rounded-full object-center  "
//                   src={profileImg}
//                   alt=""
//                 />
//               </div>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuLabel className="font-serif ">
//                 My Account
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <Link to="/profile">
//                 <DropdownMenuItem className="font-serif">
//                   Account
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/profile/reset">
//                 <DropdownMenuItem className="font-serif">
//                   Reset Password
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/profile/yourbookings">
//                 <DropdownMenuItem className="font-serif">
//                   Your Bookings
//                 </DropdownMenuItem>
//               </Link>

//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <button
//                   onClick={logOutUser}
//                   className=" cursor-pointer font-serif rounded-full text-sm text-red-500"
//                 >
//                   Logout
//                 </button>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>



//     </>
//   );
// };

// export default Navbar;
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./modeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { FaUserCircle } from "react-icons/fa";



const Navbar = () => {
  // logout
  let navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("data"));
  // const profileImg = userData?.user?.profileImg;

  const [profileImg, setProfileImg] = React.useState(
    userData?.user?.profileImg
  );


  const logOutUser = () => {
    localStorage.removeItem("data");
    toast.success("Logout successful.");
    navigate("/");
  };



  const { theme } = useTheme();


  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between font-serif px-6 md:px-12 py-3 transition-all duration-300 border-b backdrop-blur-md ${theme === "dark"
            ? "bg-neutral-900/90 text-white border-gray-700"
            : "bg-white/90 text-black border-gray-300"
          } rounded-b-2xl shadow-sm`}
      >
        {/* Logo */}
        <p className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer">
          QuickStays
        </p>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img
                  className="h-full w-full object-cover"
                  src={profileImg || "https://via.placeholder.com/40"}
                  alt="User Profile"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
            >
              <DropdownMenuLabel className="font-serif text-gray-700 dark:text-gray-200">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link to="/profile">
                <DropdownMenuItem className="font-serif hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  Account
                </DropdownMenuItem>
              </Link>
              <Link to="/profile/reset">
                <DropdownMenuItem className="font-serif hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  Reset Password
                </DropdownMenuItem>
              </Link>
              <Link to="/profile/yourbookings">
                <DropdownMenuItem className="font-serif hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  Your Bookings
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={logOutUser}
                  className="w-full text-left font-serif text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-600 transition-colors px-2 py-1"
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </>
  );
};

export default Navbar;
