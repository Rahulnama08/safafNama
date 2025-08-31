import React, { useState } from "react";
import { toast } from "sonner";
import BASE_URL from "../../utils/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [user, setUser] = useState();
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const [profileImg, setProfileImg] = useState();

  const getUser = async () => {
    let token = JSON.parse(localStorage.getItem("data"))?.token;
    console.log(token);

    let res = await axios.get(`${BASE_URL}/users/getProfile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data);
    setFormData({
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phone,
      age: res.data.age,
    });
    console.log(res.data);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("data"))?.token;

    try {
      // console.log('object')
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("age", formData.age);
      form.append("profileImg", profileImg);

      console.log(form);

      const res = await axios.put(
        `${BASE_URL}/users/updateProfile?id=${user._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-serif pb-20">
      <h1 className="font-medium mt-5 text-3xl tracking-tighter">
        Edit Profile
      </h1>

      <div className="mt-10 max-sm:w-full w-3/4 sm:px-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">Email</span>

                <input
                  type="text"
                  id="code"
                  placeholder="Citycode"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required
                  disabled
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>

            <div className="w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">Name</span>

                <input
                  type="text"
                  id="code"
                  placeholder="Citycode"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
            <div className="mt-7 w-full">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">Age</span>

                <input
                  type="text"
                  id="code"
                  placeholder="Citycode"
                  value={formData.age}
                  onChange={handleChange}
                  name="age"
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
            <div className="w-full mt-7">
              <label htmlFor="code">
                <span className="text-lg font-serif tracking-tight">
                  Phone Number
                </span>

                <input
                  type="number"
                  id="code"
                  placeholder="Citycode"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                  required
                  className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
                />
              </label>
            </div>
          </div>

          <div className="w-full mt-7">
            <label htmlFor="profileImg">
              <span className="text-lg font-serif tracking-tight">
                Change Profile Picture
              </span>

              <input
                type="file"
                id="profileImg"
                placeholder="Citycode"
                // value={formData.phone}
                accept="image/*"
                onChange={(e) => setProfileImg(e.target.files[0])}
                className="mt-1 w-full  px-3 py-2  rounded-md font-serif border border-gray-400 sm:text-sm outline-none "
              />
            </label>
          </div>

          <div className="mt-7">
            <button disabled={loading} className="text-white bg-pink-500 hover:bg-pink-600 font-serif rounded-lg text-md px-5 py-2 text-center w-fit">
              {
                loading ? "Updating..." : "Update"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
