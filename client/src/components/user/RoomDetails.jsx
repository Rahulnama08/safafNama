import React, { useCallback, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DatePickerWithRange } from "../ui/Datepicker";
import BASE_URL from "../../utils/api";
import axios from "axios";
import { useTheme } from "../ThemeProvider";

/**
 * RoomDetails
 * -------------
 * Displays a single room with gallery, description & amenities and lets the
 * user check availability / navigate to booking.
 */
const RoomDetails = () => {
  /** -------------------------
   * ROUTER / NAVIGATION HOOKS
   * ------------------------*/
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { roomData } = state || {};

  /** -------------------------
   * LOCAL STATE
   * ------------------------*/
  const [date, setDate] = useState();
  const [isAvailable, setIsAvailable] = useState(null); // null = idle
  const { theme } = useTheme();

  /** -------------------------
   * HELPERS
   * ------------------------*/
  const checkAvailability = useCallback(async () => {
    if (!date?.from || !date?.to) return;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/bookings/checkAvailability`,
        {
          roomId: roomId ?? roomData?._id,
          checkInDate: date.from.toISOString(),
          checkOutDate: date.to.toISOString(),
        }
      );
      setIsAvailable(data.available);
    } catch (error) {
      console.error(error);
      setIsAvailable(null);
    }
  }, [date, roomId, roomData]);

  /**
   * Book‑now handler with simple localStorage guard.
   * Relies on whatever you stored under "data" after login.
   */
  const handleBookNow = () => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (!userData) {
      window.scrollTo(0, 0);
      // send them to login and remember where they came from
      navigate("/login",  { replace: true, state: { from: pathname } });
      return;
    }

    navigate("/bookRoom", {
      state: {
        roomData,
        checkInDate: date.from.toISOString(),
        checkOutDate: date.to.toISOString(),
      },
    });
  };

  /** -------------------------
   * FALLBACK – if user navigated here directly or refreshes the page
   * ------------------------*/
  if (!roomData) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-center">
        <p className="max-w-md text-lg font-serif">
          Oops! We couldn’t find the room details. Please go back to the
          <Link to="/allHotels" className="ml-1 underline">
            rooms list
          </Link>
          and select a room again.
        </p>
      </div>
    );
  }

  /** -------------------------
   * TEMPLATE
   * ------------------------*/
  return (
    <div
      className={`pt-24 pb-24 px-4 sm:px-10 md:px-40 lg:px-52 flex flex-col gap-10 ${
        theme === "dark" ? "bg-neutral-900 text-white" : " text-black"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">
          {`${roomData?.hotelId?.name}, ${roomData?.locationId?.name}`}
        </h1>
      </header>

      {/* Image grid */}
      <section className="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-[50vh]">
        {roomData?.images?.slice(0, 5).map((img, idx) => (
          <img
            key={idx}
            src={img?.url || img}
            alt={`Room view ${idx + 1}`}
            className={`object-cover w-full h-full ${
              idx === 0 ? "col-span-2 row-span-2" : ""
            }`}
          />
        ))}
      </section>

      {/* Description & Amenities */}
      <section className="flex flex-col gap-7">
        <h2 className="text-2xl font-serif tracking-tight">
          {`${roomData.roomType} • ${roomData.locationId.name}, ${roomData.stateId.name}`}
        </h2>

        <p className="font-serif leading-relaxed">{roomData.description}</p>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
          <div>
            <h3 className="text-xl font-serif mb-1">Amenities</h3>
            <p className="font-serif">{roomData.amenities.join(", ")}</p>
          </div>

          <address
            className={`not-italic whitespace-pre-line font-serif border rounded-2xl p-4 ${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-500"
                : "bg-white border-gray-300"
            }`}
          >
            <strong>Contact us:</strong>
            {`\n${roomData.hotelId.contactNumber}\n${roomData.hotelId.contactEmail}`}
          </address>
        </div>
      </section>

      {/* Booking card */}
      <section
        className={`border-t border-gray-300 pt-10 flex flex-col lg:flex-row gap-10 justify-between max-sm:items-center`}
      >
        <div className=" flex flex-col gap-8">
          <div className="flex gap-5 items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                // style="display: block; height: 24px; width: 24px; fill: currentcolor;"
                className="h-6 w-6 fill-current "
              >
                <path d="M16.84 27.16v-3.4l-.26.09c-.98.32-2.03.51-3.11.55h-.7A11.34 11.34 0 0 1 1.72 13.36v-.59A11.34 11.34 0 0 1 12.77 1.72h.59c6.03.16 10.89 5.02 11.04 11.05V13.45a11.3 11.3 0 0 1-.9 4.04l-.13.3 7.91 7.9v5.6H25.7l-4.13-4.13zM10.31 7.22a3.1 3.1 0 1 1 0 6.19 3.1 3.1 0 0 1 0-6.2zm0 2.06a1.03 1.03 0 1 0 0 2.06 1.03 1.03 0 0 0 0-2.06zM22.43 25.1l4.12 4.13h2.67v-2.67l-8.37-8.37.37-.68.16-.3c.56-1.15.9-2.42.96-3.77v-.64a9.28 9.28 0 0 0-9-9h-.55a9.28 9.28 0 0 0-9 9v.54a9.28 9.28 0 0 0 13.3 8.1l.3-.16 1.52-.8v4.62z"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl">Great check-in experience</h1>
              <p className="font-serif  text-sm">
                Recent guests loved the smooth start to this stay.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                // style="display: block; height: 24px; width: 24px; fill: currentcolor;"
                className="h-6 w-6 fill-current "
              >
                <path d="M17 6a2 2 0 0 1 2 1.85v8.91l.24.24H24v-3h-3a1 1 0 0 1-.98-1.2l.03-.12 2-6a1 1 0 0 1 .83-.67L23 6h4a1 1 0 0 1 .9.58l.05.1 2 6a1 1 0 0 1-.83 1.31L29 14h-3v3h5a1 1 0 0 1 1 .88V30h-2v-3H20v3h-2v-3H2v3H0V19a3 3 0 0 1 1-2.24V8a2 2 0 0 1 1.85-2H3zm13 13H20v6h10zm-13-1H3a1 1 0 0 0-1 .88V25h16v-6a1 1 0 0 0-.77-.97l-.11-.02zm8 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM17 8H3v8h2v-3a2 2 0 0 1 1.85-2H13a2 2 0 0 1 2 1.85V16h2zm-4 5H7v3h6zm13.28-5h-2.56l-1.33 4h5.22z"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl">Room in a apartment</h1>
              <p className="font-serif  text-sm">
                Your own room in a home, plus access to shared spaces.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                // style="display: block; height: 24px; width: 24px; fill: currentcolor;"
                className="h-6 w-6 fill-current "
              >
                <path d="M11.67 0v1.67h8.66V0h2v1.67h6a2 2 0 0 1 2 1.85v16.07a2 2 0 0 1-.46 1.28l-.12.13L21 29.75a2 2 0 0 1-1.24.58H6.67a5 5 0 0 1-5-4.78V3.67a2 2 0 0 1 1.85-2h6.15V0zm16.66 11.67H3.67v13.66a3 3 0 0 0 2.82 3h11.18v-5.66a5 5 0 0 1 4.78-5h5.88zm-.08 8h-5.58a3 3 0 0 0-3 2.82v5.76zm-18.58-16h-6v6h24.66v-6h-6v1.66h-2V3.67h-8.66v1.66h-2z"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl">Free cancellation</h1>
              <p className="font-serif  text-sm">
                Get a full refund if you change your mind.
              </p>
            </div>
          </div>
        </div>

        <div
          className={` max-w-md max-sm:w-70 border rounded-2xl px-8 py-6 flex flex-col gap-6 ${
            theme === "dark"
              ? "bg-neutral-800 text-white border-neutral-500"
              : "bg-white text-black border-gray-300"
          }`}
        >
          <h3 className="text-xl font-serif">Check availability</h3>
          <DatePickerWithRange className="w-fit" date={date} setDate={setDate} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={checkAvailability}
              disabled={!date?.from || !date?.to}
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Check
            </button>

            {isAvailable === true && (
              <button
                onClick={handleBookNow}
                className="rounded-md bg-green-600 px-4 py-2 text-white"
              >
                Book now
              </button>
            )}

            {isAvailable !== null && (
              <p
                className={`font-medium ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAvailable ? "Room is available" : "Room is not available"}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetails;
