// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import { LuSmartphone } from "react-icons/lu";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { CiCalendarDate } from "react-icons/ci";
// import BASE_URL from "../utils/api";

// const SignupPage = () => {
//   let navigate = useNavigate();

//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     age: "",
//   });

//   const [profileImg, setProfileImg] = useState();

//   const handleChange = (e) => {
//     setUserData({
//       ...userData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // create user
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", userData.name);
//       formData.append("email", userData.email);
//       formData.append("password", userData.password);
//       formData.append("phone", userData.phone);
//       formData.append("age", userData.age);
//       formData.append("profileImg", profileImg);

//       console.log(formData);
//       console.log(userData);
//       console.log(profileImg);

//       const res = await axios.post(
//         `${BASE_URL}/users/signup`,
//         formData
//       );

//       // console.log(res.data);
//       // const { token, user } = res.data;
//       // localStorage.setItem("data", JSON.stringify({ token, user }));

//       setUserData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         age: "",
//       });

//       toast.success(res.data.message);
//       console.log(res.data);
//       navigate("/login");
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   return (
//     <section className="flex items-center justify-center h-screen ">
//       <div className="flex   gap-10   rounded-4xl py-10  border-zinc-900 items-center">
//         {/* <div className="w-full hidden md:inline-block">
//           <img
//             className="h-[600px]"
//             src="https://plus.unsplash.com/premium_photo-1666973935928-5b6e53a2d286?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8"
//             alt="leftSideImage"
//           />
//         </div> */}

//         <div className="w-full flex flex-col items-center justify-center ">
//           <form
//             onSubmit={handleSubmit}
//             className="md:w-96 w-80 flex flex-col items-center justify-center p-5"
//           >
//             <h2 className="text-4xl text-gray-800 font-serif">Sign up</h2>
//             <p className="text-sm text-gray-800 mt-2 font-serif">
//               Welcome Please sign up to continue
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
//               <div className="w-full h-px bg-gray-600"></div>
//               <p className="w-full text-nowrap text-sm text-gray-800 font-serif">
//                 or create an account
//               </p>
//               <div className="w-full h-px bg-gray-600"></div>
//             </div>

//             <div className="flex items-center w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-4.5 gap-2">
//               <p className="text-md font-semibold text-gray-500">
//                 <FaRegCircleUser />
//               </p>
//               <input
//                 type="text"
//                 name="name"
//                 value={userData.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                 required
//               />
//             </div>

//             <div className="flex items-center mt-4 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-4.5 gap-2">
//               <p className="text-md text-gray-500">
//                 <LuSmartphone />
//               </p>
//               <input
//                 type="text"
//                 placeholder="Phone"
//                 name="phone"
//                 value={userData.phone}
//                 onChange={handleChange}
//                 className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                 required
//               />
//             </div>

//             <div className="flex items-center mt-4 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-4.5 gap-2">
//               <p className="text-xl text-gray-500">
//                 <CiCalendarDate />
//               </p>
//               <input
//                 type="number"
//                 placeholder="Age"
//                 name="age"
//                 value={userData.age}
//                 onChange={handleChange}
//                 className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                 required
//               />
//             </div>

//             <div className="flex items-center mt-4 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2">
//               <svg
//                 width="16"
//                 height="11"
//                 viewBox="0 0 16 11"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
//                   fill="#6B7280"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Email "
//                 name="email"
//                 value={userData.email}
//                 onChange={handleChange}
//                 className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                 required
//               />
//             </div>

//             <div className="flex items-center mt-4 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2">
//               <svg
//                 width="13"
//                 height="17"
//                 viewBox="0 0 13 17"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
//                   fill="#6B7280"
//                 />
//               </svg>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={userData.password}
//                 onChange={handleChange}
//                 className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm  w-full h-full font-serif"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="mt-8 w-full h-11 font-serif rounded-full text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               Create
//             </button>
//             <p className="text-gray-600 text-sm font-serif mt-4">
//               Already have an account?{" "}
//               <Link className="text-indigo-600 hover:underline" to="/login">
//                 Sign in
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignupPage;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LuSmartphone } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import BASE_URL from "../utils/api";

const SignupPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("phone", userData.phone);
      formData.append("age", userData.age);

      const res = await axios.post(`${BASE_URL}/users/signup`, formData);
      setUserData({ name: "", email: "", password: "", phone: "", age: "" });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <h2 className="text-4xl text-white font-bold">Sign up</h2>
          <p className="text-sm text-white/80 mt-2">Welcome! Please sign up to continue</p>

          {/* Google Button */}
          <button
            type="button"
            className="w-full mt-6 bg-white/20 border border-white/30 flex items-center justify-center h-12 rounded-full hover:bg-white/30 transition"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="flex-1 h-px bg-white/50"></div>
            <p className="text-sm font-medium text-white/80 uppercase">or continue with email</p>
            <div className="flex-1 h-px bg-white/50"></div>
          </div>

          {/* Name */}
          <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-4 gap-2 mt-3">
            <FaRegCircleUser className="text-white/70 text-lg" />
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-4 gap-2 mt-4">
            <LuSmartphone className="text-white/70 text-lg" />
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
              required
            />
          </div>

          {/* Age */}
          <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-4 gap-2 mt-4">
            <CiCalendarDate className="text-white/70 text-lg" />
            <input
              type="number"
              name="age"
              value={userData.age}
              onChange={handleChange}
              placeholder="Age"
              className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-4 gap-2 mt-4">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/70">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="currentColor"/>
            </svg>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Email"
              className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full bg-white/10 border border-white/30 h-12 rounded-full overflow-hidden pl-4 gap-2 mt-4">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/70">
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="currentColor"/>
            </svg>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-full font-serif"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition font-semibold">
            Create
          </button>

          {/* Footer */}
          <p className="text-white/80 text-sm mt-4">
            Already have an account? <Link className="text-white hover:underline" to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
