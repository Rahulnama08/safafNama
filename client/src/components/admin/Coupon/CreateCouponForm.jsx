import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "../../ThemeProvider";
import BASE_URL from "../../../utils/api";

const CreateCouponForm = () => {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    let token = JSON.parse(localStorage.getItem("data")).token;

    try {
      const response = await axios.post(
        `${BASE_URL}/coupons/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setFormData({
        code: "",
        discount: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // --------------------------------------------------------------------------------

  const [couponData, setCouponData] = useState([]);
  const fetchCoupons = async () => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    try {
      const res = await axios.get(`${BASE_URL}/coupons/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCouponData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // --------------------------------------------------------------------------------

  const handleActive = async (id) => {
    let token = JSON.parse(localStorage.getItem("data")).token;
    try {
      const res = await axios.put(
        `${BASE_URL}/coupons/handleActive?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCouponData((prev) =>
        prev.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
        )
      );
      console.log(res.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const {theme} = useTheme()

  return (
    <div className="pb-10 font-serif">
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create Coupon</TabsTrigger>

          <TabsTrigger value="active">Active Coupon</TabsTrigger>

          <TabsTrigger value="inactive">Inactive Coupon</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <h2 className="font-medium mt-5 text-3xl tracking-tighter">
            Create a New Coupon
          </h2>

          {message && <p className="text-green-600 mb-2">{message}</p>}
          {error && <p className="text-red-600 mb-2">{error}</p>}

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
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
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
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
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
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
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
                  className="mt-1 w-full  px-3 py-2  rounded-md font-normal border border-gray-400 sm:text-sm outline-none "
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-md"
            >
              Submit
            </button>
          </form>
        </TabsContent>

        <TabsContent value="active">
          <h2 className="font-medium mt-5 text-3xl tracking-tighter">
            Active Coupons
          </h2>

          <div className="mt-5  sm:border border-gray-300 sm:rounded-2xl sm:p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-serif text-lg font-[500] w-[100px] ">
                    S.NO.
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Discount (%)
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Check-In Date
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Check-Out Date
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] text-end pr-[7%] ">
                    Manage
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponData
                  .filter((coupon) => coupon.isActive)
                  .map((coupon, i) => (
                    <TableRow
                      className={` ${
                        theme === "dark"
                          ? "bg-neutral-800 text-white"
                          : "bg-white text-neutral-700"
                      } `}
                    >
                      <TableCell className="font-serif"> {i + 1} </TableCell>
                      <TableCell className="font-serif">
                        {coupon.discount}
                      </TableCell>
                      <TableCell className="font-serif">
                        {" "}
                        {new Date(coupon.startDate).toDateString()}{" "}
                      </TableCell>
                      <TableCell className="font-serif">
                        {new Date(coupon.endDate).toDateString()}
                      </TableCell>
                      <TableCell className="flex gap-4 justify-end">
                        <Link
                          to={`/admin/coupon/edit/${coupon._id}`}
                          state={{ stateData: coupon }}
                        >
                          <p className="px-1.5 py-0.5 rounded-lg font-serif bg-yellow-500 text-white w-fit cursor-pointer">
                            {/* <FiEdit2 /> */}
                            Edit
                          </p>
                        </Link>
                        <p
                          onClick={() => handleActive(coupon._id)}
                          className="px-1.5 py-0.5 rounded-lg font-serif bg-blue-500 text-white w-fit cursor-pointer"
                        >
                          Inactive
                        </p>
                        <p
                          // onClick={() => handleDelete(state._id)}
                          className="px-1.5 py-0.5 rounded-lg font-serif bg-red-500 text-white w-fit cursor-pointer"
                        >
                          {/* <FiEdit2 /> */}
                          Delete
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <h2 className="font-medium mt-5 text-3xl tracking-tighter">
            Inactive Coupons
          </h2>

          <div className="mt-5  sm:border border-gray-300 sm:rounded-2xl sm:p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-serif text-lg font-[500] w-[100px] ">
                    S.NO.
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Discount (%)
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Check-In Date
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] ">
                    Check-Out Date
                  </TableHead>
                  <TableHead className="font-serif text-lg font-[500] text-end pr-[7%] ">
                    Manage
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponData
                  .filter((coupon) => !coupon.isActive)
                  .map((coupon, i) => (
                    <TableRow
                      className={` ${
                        theme === "dark"
                          ? "bg-neutral-800 text-white"
                          : "bg-white text-neutral-700"
                      } `}
                    >
                      <TableCell className="font-serif"> {i + 1} </TableCell>
                      <TableCell className="font-serif">
                        {coupon.discount}
                      </TableCell>
                      <TableCell className="font-serif">
                        {" "}
                        {new Date(coupon.startDate).toDateString()}{" "}
                      </TableCell>
                      <TableCell className="font-serif">
                        {new Date(coupon.endDate).toDateString()}
                      </TableCell>
                      <TableCell className="flex gap-4 justify-end">
                        <Link
                          to={`/admin/coupon/edit/${coupon._id}`}
                          state={{ stateData: coupon }}
                        >
                          <p className="px-1.5 py-0.5 rounded-lg font-serif bg-yellow-500 text-white w-fit cursor-pointer">
                            {/* <FiEdit2 /> */}
                            Edit
                          </p>
                        </Link>
                        <p
                          onClick={() => handleActive(coupon._id)}
                          className="px-1.5 py-0.5 rounded-lg font-serif bg-blue-500 text-white w-fit cursor-pointer"
                        >
                          Active
                        </p>
                        <p
                          // onClick={() => handleDelete(state._id)}
                          className="px-1.5 py-0.5 rounded-lg font-serif bg-red-500 text-white w-fit cursor-pointer"
                        >
                          {/* <FiEdit2 /> */}
                          Delete
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateCouponForm;
