import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../../utils/api";

const EditState = () => {
  const { id } = useParams();
  const location = useLocation();
  const { stateData } = location.state || {}; // fallback in case state is undefined
  console.log(stateData);

    const [code, setCode] = useState(stateData.code || "");
    let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = JSON.parse(localStorage.getItem("data")).token;
    // Handle form submission logic here
    try {
      let res = await axios.put(`${BASE_URL}/states/update?id=${id}`, {code}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        toast.success(res.data.message);
        navigate("/admin");
        
      // console.log(res);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Link to="/admin">
        <h1 className="font-serif  text-md text-blue-500 tracking-tighter">
          Back
        </h1>
      </Link>
      <h1 className="font-serif mt-3 text-3xl tracking-tighter">Edit State</h1>

      <div className="mt-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-5 sm:px-5 max-sm:w-full w-1/2">
            <div className="w-full">
              <label htmlFor="name">
                <span className="text-lg font-serif tracking-tight">State</span>

                <input
                  type="text"
                  id="name"
                  placeholder="state"
                  value={stateData.name}
                  disabled
                  className="mt-1 w-full px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">
                  Edit zip-code
                </span>

                <input
                  type="text"
                  id="code"
                  placeholder="zipcode"
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </div>

          <div className="mt-7 sm:px-5">
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 font-serif hover:bg-blue-700 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditState;
