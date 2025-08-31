import React from 'react'
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div >
      <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20 min-h-screen font-serif">
        <h1 className="text-4xl md:text-5xl  ">
          404 Not Found
        </h1>
        <div className="h-px w-80 rounded bg-gradient-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
        <p className="md:text-xl text-gray-400 max-w-lg text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to={'/'}
          className="flex items-center gap-1 bg-white px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all border border-neutral-500"
        >
          Back to Home
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417"
              stroke="#1E1E1E"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage
