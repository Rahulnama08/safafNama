import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ModeToggle } from "../components/modeToggle";
import { useTheme } from "../components/ThemeProvider";
import BASE_URL from "../utils/api";
import axios from "axios";
// import logo from "../../public/assets/logo.png"

const NavBar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/allHotels" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (userData) {
      setIsLogin(true);
      setName(userData.user?.name || "");
      setProfileImg(userData.user?.profileImg || "");
      setRole(userData.user?.role || "");
      setIsAdmin(userData.user?.role === "admin");
    } else {
      setIsLogin(false);
      setName("");
      setProfileImg("");
      setRole("");
      setIsAdmin(false);
    }
  }, [localStorage.getItem("data")]); // dependency to trigger on change

  const logOutUser = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    try {
      localStorage.removeItem("data");
      const res = await axios.get(`${BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Logout successful.");
      setIsLogin(false);
      setProfileImg("");
      setName("");
      setRole("");
      setIsAdmin(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in logout");
    }
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  const { theme } = useTheme();

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 ${isScrolled
          ? theme === "dark"
            ? "bg-neutral-900/90 backdrop-blur-md py-3 rounded-b-2xl shadow-md text-white border-b border-neutral-700"
            : "bg-white/90 backdrop-blur-md py-3 rounded-b-2xl shadow-md text-gray-700 border-b border-gray-300"
          : "py-4 md:py-6"
        }`}
    >
      {/* Logo */}
      <Link
        to="/"
        onClick={() => window.scrollTo(0, 0)}
        className="flex items-center gap-2"
      >
        <p
          className={`text-3xl md:text-4xl font-serif font-bold ${isScrolled
              ? theme === "dark"
                ? "text-gray-200"
                : "text-gray-700"
              : "text-white"
            }`}
        >
          सफ़रNama
        </p>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10">
        {!isAdminRoute &&
          navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => window.scrollTo(0, 0)}
              className={`group flex flex-col gap-0.5 font-serif font-medium transition-colors ${isScrolled
                  ? theme === "dark"
                    ? "text-gray-200"
                    : "text-gray-700"
                  : "text-white"
                }`}
            >
              {link.name}
              <span
                className={`h-[2px] w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? "bg-gray-700" : "bg-white"
                  } rounded-full`}
              />
            </Link>
          ))}

        {isAdmin && !isAdminRoute && (
          <Link to="/admin" onClick={() => window.scrollTo(0, 0)}>
            <button
              className={`border border-gray-400 px-4 py-1 text-sm rounded-full font-medium transition-all hover:shadow-md ${isScrolled
                  ? theme === "dark"
                    ? "text-gray-200"
                    : "text-gray-900"
                  : "text-white"
                }`}
            >
              Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <ModeToggle />
        {isLogin ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
                  src={profileImg || "https://via.placeholder.com/40"}
                  alt="Profile"
                />
                <p
                  className={`font-serif font-medium ${isScrolled
                      ? theme === "dark"
                        ? "text-gray-200"
                        : "text-gray-700"
                      : "text-white"
                    }`}
                >
                  Hello👋, {name}
                </p>
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
                <DropdownMenuItem className="font-serif rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  Account
                </DropdownMenuItem>
              </Link>
              <Link to="/profile/reset">
                <DropdownMenuItem className="font-serif rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  Reset Password
                </DropdownMenuItem>
              </Link>
              <Link to="/profile/bookings">
                <DropdownMenuItem className="font-serif rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
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
        ) : (
          <Link to="/login">
            <button className="bg-black text-white px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <ModeToggle />
        <span
          className={`text-2xl cursor-pointer ${isScrolled ? (theme === "dark" ? "text-gray-200" : "invert") : "text-white"
            }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <RiMenu3Fill />
        </span>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen flex flex-col md:hidden items-center justify-center gap-6 transition-all duration-500 ${isMenuOpen
            ? theme === "dark"
              ? "bg-neutral-900 text-white translate-x-0"
              : "bg-white text-gray-800 translate-x-0"
            : "-translate-x-full"
          }`}
      >
        <button
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-xl font-serif hover:text-blue-500 transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {isAdmin && (
          <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
            <button className="border px-4 py-1 text-sm font-medium rounded-full hover:shadow-md transition-shadow">
              Dashboard
            </button>
          </Link>
        )}

        {isLogin ? (
          <div className="flex flex-col gap-4 mt-4">
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-blue-500 text-white px-8 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
                My Account
              </button>
            </Link>
            <button
              onClick={logOutUser}
              className="text-red-500 font-serif text-sm border py-2 rounded-full border-red-600 hover:bg-red-50 dark:hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-black text-white px-8 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>

  );
};

export default NavBar;
  