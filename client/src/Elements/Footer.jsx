import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";

const Footer = () => {

    const location = useLocation();

    // Hide footer on /admin route
    if (
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/profile")
    )
      return null;
  const { theme } = useTheme();

  return (
    <div>
      <footer
        className={`px-6  md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 ${
          theme === "dark"
            ? "bg-neutral-800 text-white"
            : "bg-neutral-100 text-black"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
          <div className="md:max-w-96">
            <p
              className={`font-serif  text-4xl ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              सफ़रNama
            </p>
            <p className="mt-6 text-sm">
              Discover the world's most extraordinary places to stay, from
              boutique hotels to luxury villas and private islands.
            </p>
          </div>
          <div className="flex-1 flex items-start md:justify-end gap-20">
            <div>
              <h2 className="font-semibold mb-5 ">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About us</a>
                </li>
                <li>
                  <a href="#">Contact us</a>
                </li>
                <li>
                  <a href="#">Privacy policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold  mb-5">Subscribe to our newsletter</h2>
              <div className="text-sm space-y-2">
                <p>
                  The latest news, articles, and resources, sent to your inbox
                  weekly.
                </p>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    className="border border-gray-500/30 placeholder-gray-500 outline-none w-full max-w-64 h-9 rounded px-2"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <button className="bg-blue-600 w-24 h-9 text-white rounded">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-4  text-xs md:text-sm pb-5">
          Copyright 2024 © Company name. All Right Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
