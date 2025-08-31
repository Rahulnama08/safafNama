// import axios from "axios";
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import BASE_URL from "../utils/api";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSendingOtp, setIsSendingOtp] = useState(false);

//   // where to go after successful login –
//   // if someone sent us here with state.from, use that; otherwise home
//   const from = location.state?.from;

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

//     setIsSendingOtp(true);

//     try {
//       console.log('sending')
//       const res = await axios.post(`${BASE_URL}/users/login`, {
//         email: userData.email,
//         password: userData.password,
//       });

//       if (res.data.step === "otp_verification") {
//         toast.success("OTP sent to email. Please enter it to verify.");
//         setStep("otp");
//         setEmailForOtp(userData.email);
//         setUserData((prev) => ({ ...prev, password: "" })); // Clear password
//       }

//       setUserData({
//         email: "",
//         password: "",
//         otp: "",
//       });
//     } catch (error) {
//       // console.log(error)
//       toast.error(error.response.data.message);
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(`${BASE_URL}/users/verifyOtp`, {
//         email: emailForOtp,
//         otp: userData.otp,
//       });

//       toast.success("Login successful!");

//       console.log(res.data);
//       const { token, user } = res.data;
//       localStorage.setItem("data", JSON.stringify({ token, user }));

//       console.log(from);
//       if (from && from !== "/") {
//         return navigate(from);
//       }

//       if (user.role === "admin") {
//         return navigate("/admin");
//       }

//       navigate("/");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "OTP verification failed");
//     }
//   };

//   return (
//     <section className="flex items-center justify-center h-screen ">
//       <div className="flex  gap-10 rounded-4xl py-10  border-zinc-700 items-center">
//         {/* <div className="w-full hidden md:inline-block">
//           <img
//             className="h-[600px] "
//             src="https://plus.unsplash.com/premium_photo-1666973935928-5b6e53a2d286?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8"
//             alt="leftSideImage"
//           />
//         </div> */}

//         <div className="w-full flex flex-col items-center justify-center">
//           <form
//             onSubmit={step === "login" ? handleLoginSubmit : handleOtpSubmit}
//             className="md:w-96 w-80 flex flex-col items-center justify-center p-5"
//           >
//             <h2 className="text-4xl text-gray-800 font-serif">Sign in</h2>
//             <p className="text-sm text-gray-800 mt-3 font-serif">
//               Welcome back! Please sign in to continue
//             </p>

//             <button
//               type="button"
//               className="w-full mt-6 bg-gray-100 border border-zinc-300 flex items-center justify-center h-12 rounded-full"
//             >
//               <img
//                 src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
//                 alt="googleLogo"
//               />
//             </button>

//             <div className="flex items-center gap-4 w-full my-5">
//               <div className="w-full h-px bg-gray-800"></div>
//               <p className="w-full text-nowrap text-sm text-gray-800 font-serif">
//                 or sign in with email
//               </p>
//               <div className="w-full h-px bg-gray-800"></div>
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
//                     placeholder="Password"
//                     name="password"
//                     onChange={handleChange}
//                     value={userData.password}
//                     className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                     required
//                   />
//                 </div>

//                 <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
//                   <div className="flex items-center gap-2"></div>
//                   <Link
//                     className="text-sm  text-indigo-600 hover:underline font-serif"
//                     to="/reset"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               </>
//             )}

//             {step === "otp" && (
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
//                     type="text"
//                     placeholder="Enter OTP"
//                     name="otp"
//                     onChange={handleChange}
//                     value={userData.otp}
//                     className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={isSendingOtp}
//               className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer hover:opacity-90 transition-opacity font-serif"
//             >
//               {step === "login"
//                 ? isSendingOtp
//                   ? "Sending OTP..."
//                   : "Send OTP"
//                 : "Verify OTP"}
//             </button>

//             {step === "login" && (
//               <p className="text-gray-700 text-sm font-serif mt-4">
//                 Don’t have an account?{" "}
//                 <Link className="text-indigo-600 hover:underline" to="/signup">
//                   Create
//                 </Link>
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginPage;
import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const from = location.state?.from;
  const [step, setStep] = useState("login");
  const [emailForOtp, setEmailForOtp] = useState("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);
    try {
      const res = await axios.post(`${BASE_URL}/users/login`, {
        email: userData.email,
        password: userData.password,
      });

      if (res.data.step === "otp_verification") {
        toast.success("OTP sent to email. Please enter it to verify.");
        setStep("otp");
        setEmailForOtp(userData.email);
        setUserData((prev) => ({ ...prev, password: "" }));
      }

      setUserData({ email: "", password: "", otp: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/users/verifyOtp`, {
        email: emailForOtp,
        otp: userData.otp,
      });

      toast.success("Login successful!");
      const { token, user } = res.data;
      localStorage.setItem("data", JSON.stringify({ token, user }));

      if (from && from !== "/") return navigate(from);
      if (user.role === "admin") return navigate("/admin");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl p-8">
        <form
          onSubmit={step === "login" ? handleLoginSubmit : handleOtpSubmit}
          className="flex flex-col items-center"
        >
          {/* Heading */}
          <h2 className="text-3xl font-bold text-white">Sign in</h2>
          <p className="text-sm text-white/80 mt-2">
            Welcome back! Please login to continue
          </p>

          {/* Google Login */}
          <button
            type="button"
            className="w-full mt-6 bg-white/10 border border-white/30 flex items-center justify-center h-12 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
              className="fill-white"
            />
          </button>

          {/* Divider */}
          <div className="relative flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            <span className="relative px-4 py-1 text-xs font-medium tracking-wide text-white uppercase bg-white/10 backdrop-blur-md rounded-full">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>

          {/* Email & Password */}
          {step === "login" && (
            <>
              <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-6 gap-2 backdrop-blur-md">
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white/70"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Email address"
                  name="email"
                  onChange={handleChange}
                  value={userData.email}
                  className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full"
                  required
                />
              </div>

              <div className="flex items-center mt-4 w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-6 gap-2 backdrop-blur-md">
                <svg
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white/70"
                >
                  <path
                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={userData.password}
                  className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full"
                  required
                />
              </div>

              <div className="w-full flex justify-end mt-3">
                <Link
                  className="text-sm text-white/80 hover:underline"
                  to="/reset"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          )}

          {/* OTP */}
          {step === "otp" && (
            <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-6 gap-2 backdrop-blur-md">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/70"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="currentColor"
                />
              </svg>
              <input
                type="text"
                placeholder="Enter OTP"
                name="otp"
                onChange={handleChange}
                value={userData.otp}
                className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSendingOtp}
            className="mt-8 w-full h-11 rounded-full text-white bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90 transition-all shadow-md"
          >
            {step === "login"
              ? isSendingOtp
                ? "Sending OTP..."
                : "Send OTP"
              : "Verify OTP"}
          </button>

          {/* Footer */}
          {step === "login" && (
            <p className="text-white/80 text-sm mt-4">
              Don’t have an account?{" "}
              <Link className="text-white font-semibold hover:underline" to="/signup">
                Create
              </Link>
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
