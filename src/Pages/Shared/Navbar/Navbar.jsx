import React, { useState } from 'react';
import Logo from '../../../components/Logo/Logo';
import { NavLink } from 'react-router';

const Navbar = () => {
    // TODO: Replace with actual auth state from your context/redux
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const user = {
        name: "John Doe",
        avatar: "https://via.placeholder.com/40" // Replace with actual user avatar
    };

    const navLinks = <>
        <li><NavLink to="/search" className={({isActive}) => isActive ? "text-primary font-semibold" : ""}>Search Donors</NavLink></li>     
        <li><NavLink to="/requests" className={({isActive}) => isActive ? "text-primary font-semibold" : ""}>Donation Requests</NavLink></li>
        {isLoggedIn && (
            <li><NavLink to="/funding" className={({isActive}) => isActive ? "text-primary font-semibold" : ""}>Funding</NavLink></li>
        )}
    </>;

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                        {navLinks}
                    </ul>
                </div>
                <NavLink to="/" className="btn btn-ghost text-xl px-2">
                    <Logo />
                </NavLink>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                {!isLoggedIn ? (
                    <>
                        <NavLink to="/login" className="btn btn-ghost bg-gray-300">Login</NavLink>
                        <NavLink to="/register" className="btn btn-primary text-white">Register</NavLink>
                    </>
                ) : (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-2">
                                <img src={user.avatar} alt={user.name} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                            <li className="menu-title">
                                <span>{user.name}</span>
                            </li>
                            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            <li><button onClick={() => setIsLoggedIn(false)} className="text-error">Logout</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;