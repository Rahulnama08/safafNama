// import axios from "axios";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import BASE_URL from "../utils/api";

// const ResetPassPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState("login"); // step: login | otp
//   const [emailForOtp, setEmailForOtp] = useState("");

//   const [userData, setUserData] = useState({
//     email: "",
//     password: "",
//     otp: "",
//   });

//   const handleChange = (e) => {
//     setUserData({
//       ...userData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(`${BASE_URL}/users/resetPass`, {
//         email: userData.email,
//       });

//       if (res.data.step === "otp_verification") {
//         toast.success("OTP sent to email. Please enter it to verify.");
//         setStep("otp");
//         setEmailForOtp(userData.email);
//       }

//       setUserData({
//         email: "",
//         password: "",
//         otp: "",
//       });
//     } catch (error) {
//       // console.log(error)
//       toast.error(error.response.data.message);
//     }
//   };



//   const changePassword = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(`${BASE_URL}/users/newPass`, {
//         email: emailForOtp,
//         otp: userData.otp,
//         password: userData.password,
//       });

//       toast.success(res.data.message);
//       navigate("/");
//     } catch (error) {
//       // console.log(error)
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <section className="flex items-center justify-center h-screen">
//       <div className="flex  gap-10   rounded-4xl py-10  border-zinc-700 items-center">
//         {/* <div className="w-full hidden md:inline-block">
//           <img
//             className="h-[600px]"
//             src="https://plus.unsplash.com/premium_photo-1666973935928-5b6e53a2d286?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8"
//             alt="leftSideImage"
//           />
//         </div> */}

//         <div className="w-full flex flex-col items-center justify-center  ">
//           <form
//             onSubmit={step === "login" ? handleLoginSubmit : changePassword}
//             className="md:w-96 w-80 flex flex-col items-center justify-center p-5"
//           >
//             <h2 className="text-4xl text-gray-800 font-serif">Reset Password</h2>

//             <div className="flex items-center gap-4 w-full my-5">
//               <div className="w-full h-px bg-gray-500"></div>
//               <p className="w-full text-nowrap text-sm text-gray-800 font-serif">
//                 Verify with OTP
//               </p>
//               <div className="w-full h-px bg-gray-500"></div>
//             </div>

//             {step === "login" && (
//               <>
//                 <div className="flex items-center w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2">
//                   <svg
//                     width="16"
//                     height="11"
//                     viewBox="0 0 16 11"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
//                       fill="#6B7280"
//                     />
//                   </svg>
//                   <input
//                     type="email"
//                     placeholder="Email id"
//                     name="email"
//                     onChange={handleChange}
//                     value={userData.email}
//                     className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             {step === "otp" && (
//               <>
//                 <div className="flex mt-5 items-center w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2">
//                   <svg
//                     width="16"
//                     height="11"
//                     viewBox="0 0 16 11"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
//                       fill="#6B7280"
//                     />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Enter OTP"
//                     name="otp"
//                     onChange={handleChange}
//                     value={userData.otp}
//                     className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                     required
//                   />
//                 </div>

//                 <div className="flex items-center mt-6 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2">
//                   <svg
//                     width="13"
//                     height="17"
//                     viewBox="0 0 13 17"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
//                       fill="#6B7280"
//                     />
//                   </svg>
//                   <input
//                     type="password"
//                     placeholder="Enter New Password"
//                     name="password"
//                     onChange={handleChange}
//                     value={userData.password}
//                     className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               className="mt-8 w-full h-11 font-serif rounded-full text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               {step === "login" ? "Send OTP" : "Reset Password"}
//             </button>

//             <p className="text-gray-700 text-sm font-serif mt-4">
//               <Link className="text-indigo-600 hover:underline" to="/login">
//                 Back to login page{" "}
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ResetPassPage;
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../utils/api";

const ResetPassPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login = email, otp = verify & new password
  const [emailForOtp, setEmailForOtp] = useState("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/users/resetPass`, {
        email: userData.email,
      });
      if (res.data.step === "otp_verification") {
        toast.success("OTP sent to email. Please enter it to verify.");
        setStep("otp");
        setEmailForOtp(userData.email);
      }
      setUserData({ email: "", password: "", otp: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/users/newPass`, {
        email: emailForOtp,
        otp: userData.otp,
        password: userData.password,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8">
        <form
          onSubmit={step === "login" ? handleLoginSubmit : changePassword}
          className="flex flex-col items-center justify-center w-full"
        >
          <h2 className="text-4xl font-bold text-white font-serif">
            Reset Password
          </h2>
          <p className="text-sm text-white/80 mt-2 font-serif text-center">
            {step === "login"
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="flex-1 h-px bg-white/50"></div>
            <p className="text-sm text-white/90 uppercase font-serif">
              {step === "login" ? "Verify Email" : "Reset Password"}
            </p>
            <div className="flex-1 h-px bg-white/50"></div>
          </div>

          {/* Email Input */}
          {step === "login" && (
            <div className="flex items-center w-full bg-white/20 border border-white/30 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:ring-2 focus-within:ring-indigo-300">
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
                required
              />
            </div>
          )}

          {/* OTP + New Password */}
          {step === "otp" && (
            <>
              <div className="flex items-center mt-4 w-full bg-white/20 border border-white/30 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:ring-2 focus-within:ring-pink-300">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  value={userData.otp}
                  onChange={handleChange}
                  className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
                  required
                />
              </div>
              <div className="flex items-center mt-4 w-full bg-white/20 border border-white/30 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:ring-2 focus-within:ring-pink-300">
                <input
                  type="password"
                  placeholder="New Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 w-full h-11 font-serif rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            {step === "login" ? "Send OTP" : "Reset Password"}
          </button>

          <p className="text-white/90 text-sm mt-4 font-serif">
            <Link className="text-yellow-300 hover:underline" to="/login">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassPage;
