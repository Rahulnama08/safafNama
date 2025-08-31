import axios from "axios";
import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../../utils/api";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { stateData } = location.state || {};

  // Helper function to format ISO date to "YYYY-MM-DDTHH:MM" format for input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    code: stateData?.code || "",
    discount: stateData?.discount || "",
    startDate: formatDateForInput(stateData?.startDate),
    endDate: formatDateForInput(stateData?.endDate),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("data"))?.token;

    try {
      const res = await axios.put(
        `${BASE_URL}/coupons/editCoupon?id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/admin/coupon");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="pb-10 font-serif">
      <h2 className="font-medium mt-5 text-3xl tracking-tighter">
        Edit Coupon
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-10 sm:px-5 max-sm:w-full sm:w-3/4 space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
          <div className="w-full">
            <label className="text-lg font-medium tracking-tight">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
              placeholder="e.g. SAVE20"
            />
          </div>

          <div className="w-full">
            <label className="block font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="mt-1 w-full px-3 py-2 rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
              placeholder="e.g. 20"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
          <div className="w-full">
            <label className="block font-medium">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block font-medium">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-md font-normal border border-gray-400 sm:text-sm outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-md"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCoupon;
