import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import HomePage from "../Pages/Home/HomePage/HomePage";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import SearchPage from "../Pages/SearchPages/Searchpage";
import DonationRequestsPage from "../Pages/DonationRequestesPage/DonationRequestesPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children:[
        {
            index: true,
            element:<HomePage></HomePage>
        },
        {
          path: 'searchPage',
          element: <SearchPage></SearchPage>
        },
        {
          path:'donationRequests',
          element:<DonationRequestsPage></DonationRequestsPage>
        }
       
    ]
  },
   {
          path:'/',
          element:<AuthLayout></AuthLayout>,
          children:[
            {
              path:'login',
              element:<Login></Login>
            },
            {
              path:'register',
              element:<Register></Register>
            }
          ]
        }
]);