import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import BASE_URL from "../../utils/api";

const ForgetPass = () => {
  const [step, setStep] = useState("login"); // step: login | otp
  const [emailForOtp, setEmailForOtp] = useState("");

  let user = JSON.parse(localStorage.getItem("data"))?.user;

  const [userData, setUserData] = useState({
    email: user?.email || "",
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

    try {
      const res = await axios.post(`${BASE_URL}/users/resetPass`, {
        email: userData.email,
      });

      if (res.data.step === "otp_verification") {
        toast.success("OTP sent to email. Please enter it to verify.");
        setStep("otp");
        setEmailForOtp(userData.email);
      }

      setUserData({
        email: "",
        password: "",
        otp: "",
      });
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message);
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
        // navigate("/");
        setStep("login");
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="font-serif">
      <h1 className="font-medium mt-5 text-3xl tracking-tighter">
        Reset Password
      </h1>

      <form
        onSubmit={step === "login" ? handleLoginSubmit : changePassword}
        className="mt-10 sm:px-5 max-sm:w-full sm:w-1/2 space-y-4"
      >
        {step === "login" && (
          <div className="mt-7 w-full">
            <label htmlFor="code">
              <span className="text-lg font-serif tracking-tight">Email</span>

              <input
                type="text"
                id="code"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                disabled
                name="email"
                required
                className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
              />
            </label>
          </div>
        )}

        {step === "otp" && (
          <>
            <div className="mt-7 w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">
                  Enter OTP
                </span>

                <input
                  type="text"
                  id="code"
                  placeholder="OTP"
                  name="otp"
                  onChange={handleChange}
                  value={userData.otp}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="mt-7 w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">
                  Enter New Password
                </span>

                <input
                  type="text"
                  id="code"
                  placeholder="Enter New Password"
                  name="password"
                  onChange={handleChange}
                  value={userData.password}
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </>
        )}

        <div className="mt-7">
          <button className="text-white bg-pink-500 hover:bg-pink-600 font-serif rounded-lg text-md px-5 py-2 text-center w-fit">
            {step === "login" ? "Send OTP" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPass;
