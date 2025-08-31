import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./auth/SignupPage";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./components/admin/Dashboard";
import RoomPage from "./components/user/RoomPage";
import { Toaster } from "sonner";
import ResetPassPage from "./auth/ResetPassPage";
import CreateState from "./components/admin/State/CreateState";
import CreateCity from "./components/admin/City/CreateCity";
import CreateHotels from "./components/admin/Hotel/CreateHotels";
import AdminRoutes from "./protectedRoutes/AdminRoutes";
import CheckToken from "./protectedRoutes/CheckToken";
import MainLayout from "./layouts/MainLayout";
import CreateRoom from "./components/admin/Room/CreateRoom";
import EditCity from "./components/admin/City/EditCity";
import EditState from "./components/admin/State/EditState";
import EditHotel from "./components/admin/Hotel/EditHotel";
import EditRoom from "./components/admin/Room/EditRoom";
import RoomDetails from "./components/user/RoomDetails";
import AllHotels from "./components/user/AllHotels";
import BookRoom from "./components/user/BookRoom";
import ManageBooking from "./components/admin/Bookings/ManageBooking";
import CreateCouponForm from "./components/admin/Coupon/CreateCouponForm";
import EditCoupon from "./components/admin/Coupon/EditCoupon";
import ProfilePage from "./components/Profile/ProfilePage";
import EditProfile from "./components/Profile/EditProfile";
import YourBookings from "./components/Profile/YourBookings";
import ForgetPass from "./components/Profile/ForgetPass";
import RoomsPage from "./Pages/RoomsPage";
import ManageBookings from "./components/Profile/ManageBookings";
import UserCheckIn from "./components/admin/UserCheckIn/UserCheckIn";
import { useTheme } from "./components/ThemeProvider";
import DashBoard from "./components/admin/MainDashboard/DashBoard";
import TotalBookings from "./components/admin/MainDashboard/TotalBookings";
import Checkin from "./components/admin/MainDashboard/Checkin";
import Checkout from "./components/admin/MainDashboard/Checkout";
import RevenueDetails from "./components/admin/MainDashboard/RevenueDetails";
import ErrorPage from "./Pages/ErrorPage";

const App = () => {
  const theme = useTheme();
  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPassPage />} />

        <Route path="/*" element={<ErrorPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<AllHotels />} />
          <Route path="/allHotels" element={<RoomsPage />} />
          <Route path="/roomPage/:id" element={<RoomPage />} />
          <Route path="/roomsdetail/:id" element={<RoomDetails />} />
          <Route
            path="/bookRoom"
            element={
              <CheckToken>
                <BookRoom />
              </CheckToken>
            }
          />

          {/* Profile routes */}
          <Route
            path="/profile"
            element={
              <CheckToken>
                <ProfilePage />
              </CheckToken>
            }
          >
            <Route index element={<EditProfile />} />
            <Route path="reset" element={<ForgetPass />} />
            <Route path="yourbookings" element={<YourBookings />} />
            <Route path="bookings" element={<ManageBookings />} />
          </Route>

          {/* Admin routes  */}
          <Route
            path="/admin"
            element={
              <AdminRoutes>
                <Dashboard />
              </AdminRoutes>
            }
          >
            <Route index element={<DashBoard />} />
            <Route path="totalBookings" element={<TotalBookings />} />
            <Route path="checkin" element={<Checkin />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="revenue" element={<RevenueDetails />} />

            <Route path="manageBookings" element={<ManageBooking />} />
            <Route path="state" element={<CreateState />} />
            <Route path="state/edit/:id" element={<EditState />} />
            <Route path="city" element={<CreateCity />} />
            <Route path="city/edit/:id" element={<EditCity />} />
            <Route path="hotel" element={<CreateHotels />} />
            <Route path="hotel/edit/:id" element={<EditHotel />} />
            <Route path="room" element={<CreateRoom />} />
            <Route path="room/edit/:id" element={<EditRoom />} />
            <Route path="userCheck" element={<UserCheckIn />} />
            <Route path="coupon" element={<CreateCouponForm />} />
            <Route path="coupon/edit/:id" element={<EditCoupon />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
