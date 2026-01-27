import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import HomePage from "../Pages/Home/HomePage/HomePage";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import SearchPage from "../Pages/SearchPages/Searchpage";
import DonationRequestsPage from "../Pages/DonationRequestesPage/DonationRequestesPage";

// DashBoard imports
import DashBoardLayout from "../Layouts/DashBoardLayout";
import DashBoardHome from "../Pages/DashBoard/DashBoardHome/DashBoardHome";
import AdminDashBoardHome from "../Pages/DashBoard/DashBoardHome/AdminDashBoardHome";
import DonorDashBoardHome from "../Pages/DashBoard/DashBoardHome/DonorDashBoardHome";
import VolunteerDashBoardHome from "../Pages/DashBoard/DashBoardHome/VolunteerDashBoardHome";
import Profile from "../Pages/DashBoard/Profile/Profile";
import UserManagement from "../Pages/Usermanagement/Usermanagement";
import MyDonationRequests from "../Pages/DashBoard/MyDonationRequests/MyDonationRequests";

export const router = createBrowserRouter([
  // ===== Public Website =====
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "searchPage",
        element: <SearchPage />
      },
      {
        path: "donationRequests",
        element: <DonationRequestsPage />
      }
    ]
  },

  // ===== Auth =====
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },

  // ===== DashBoard =====
  {
    path: "/dashboard",
    element: <DashBoardLayout />,
    children: [
      {
        index: true,
        element: <DashBoardHome />   // role switcher page
      },
      {
        path: "admin",
        element: <AdminDashBoardHome />
      },
      {
        path: "donor",
        element: <DonorDashBoardHome />
      },
      {
        path: "volunteer",
        element: <VolunteerDashBoardHome />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "my-donation-request",
        element: <MyDonationRequests></MyDonationRequests>
      },
      {
        path: "users-management",
        element: <UserManagement></UserManagement>
      }
    ]
  }
]);
