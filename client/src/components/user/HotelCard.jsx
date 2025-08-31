import React, { useEffect, useRef, useState } from "react";

import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BASE_URL from "../../utils/api";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

const imgArr = [
  "https://res.cloudinary.com/dqfhn7rw3/image/upload/v1746366622/hotel_rooms/hm2keaibvlsejba099v0.jpg",
  "https://res.cloudinary.com/dqfhn7rw3/image/upload/v1746366623/hotel_rooms/tobv9pnl8twxgx844kev.jpg",
  "https://res.cloudinary.com/dqfhn7rw3/image/upload/v1746366625/hotel_rooms/umijglaiguwhkra7wu4k.jpg",
  "https://res.cloudinary.com/dqfhn7rw3/image/upload/v1746366626/hotel_rooms/s8qgp5nrl15r2io7qzg9.jpg",
];
const HotelCard = ({ hotel }) => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const { theme } = useTheme();

  return (
    <Link
      to={`/roomPage/${hotel._id}`}
      state={{ hotelData: hotel }}
      onClick={() => window.scrollTo(0, 0)}
    >
      {/* <div
        className={`sm:flex sm:flex-row-reverse gap-5 border   p-[5px] rounded-3xl ${theme === "dark" ? "bg-neutral-900 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
      >
        <div className="">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xs"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {hotel.hotelImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="rounded-3xl overflow-hidden h-70 sm:w-80">
                    <img
                      className="h-full w-full object-cover"
                      src={img?.url}
                      alt=""
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
          </Carousel>
        </div>

        <div className="flex flex-col justify-between py-4 px-3">
          <div className="mt-3 pl-1 overflow-hidden">
            <p className="text-left text-3xl  tracking-tighter font-serif">
              {hotel.name} , {hotel.locationId.name}
            </p>
            <p className="  tracking-tighter text-md font-serif">
              {hotel.address}
            </p>
          </div>
          <p className="  tracking-tight font-[400] text-md mt-3 leading-5 font-serif max-sm:truncate">
            {hotel.description}
          </p>

          <div className="mt-3">
            <p className="  tracking-tight font-[400] text-md font-serif">
              {hotel.contactEmail}
            </p>
            <p className="  tracking-tighter text-md font-serif">
              {hotel.contactNumber}
            </p>
          </div>
          <p className="  tracking-tighter text-md mt-3 font-serif">
            Rooms starting at{" "}
            <span className="underline text-green-700 text-lg font-mono tracking-tighter">
              ₹4999
            </span>
          </p>
        </div>
      </div> */}

      <div
        className={`  rounded-3xl pb-4 w-fit sm:w-80 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] ${
          theme === "dark"
            ? "bg-neutral-800 text-white border border-neutral-700"
            : "bg-white text-black border-gray-300"
        }`}
      >
        <div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xs"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {hotel.hotelImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="rounded-t-3xl overflow-hidden h-50 sm:w-80">
                    <img
                      className="h-full w-full object-cover"
                      src={img?.url || img}
                      alt=""
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
                        <CarouselNext /> */}
          </Carousel>
        </div>

        <div className="flex flex-col justify-between  px-2">
          <div className="mt-3 pl-1 overflow-hidden">
            <p className="text-2xl  tracking-tighter font-serif">
              {hotel.name}
            </p>

            <p className="  tracking-tighter text-md font-serif">
              {hotel.address}
            </p>
          </div>

          <p className="pl-1  tracking-tight text-sm mt-3 font-serif">
            Rooms starting at{" "}
            <span className="underline text-green-700 text-lg font-mono tracking-tighter">
              ₹4999
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
