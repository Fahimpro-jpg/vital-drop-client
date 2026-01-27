import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import useRole from '../Hooks/useRole';
import Logo from '../components/Logo/Logo';
import { FaUser, FaUsers, FaHome, FaPlusCircle, FaHandHoldingHeart } from 'react-icons/fa';

const DashBoardLayout = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open max-w-7xl mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content">
        {/* Top bar */}
        <nav className="navbar bg-base-200">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost lg:hidden">
            ☰
          </label>
          <h2 className="text-xl font-semibold ml-2">Vital Drop Dashboard</h2>
        </nav>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <div className="w-64 min-h-full bg-base-100 border-r">
          <div className="p-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <ul className="menu p-4 space-y-1">

            {/* Common */}
            <li>
              <NavLink to="/dashboard">
                <FaHome /> Dashboard Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/profile">
                <FaUser /> Profile
              </NavLink>
            </li>

            {/* Donor */}
            {role === 'donor' && (
              <li>
                <NavLink to="/dashboard/my-donation-request">
                  <FaHandHoldingHeart /> My Donation Requests
                </NavLink>
              </li>
            )}

            {/* Volunteer */}
            {role === 'volunteer' && (
              <li>
                <NavLink to="/dashboard/create-request">
                  <FaPlusCircle /> Create Request
                </NavLink>
              </li>
            )}

            {/* Admin */}
            {role === 'admin' && (
              <>
                <li>
                  <NavLink to="/dashboard/all-requests">
                    <FaHandHoldingHeart /> All Requests
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/users-management">
                    <FaUsers /> Users Management
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayout;
