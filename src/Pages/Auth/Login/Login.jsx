import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import useAuth from '../../../Hooks/useAuth';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const { signInUser, loading } = useAuth();

    const handleLogin = async (data) => {
        try {
            const result = await signInUser(data.email, data.password);
            console.log('User logged in:', result.user);
            
            // Navigate to homepage after successful login
            navigate('/');
            
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full items-center">
                
                {/* Left Side - Welcome Message */}
                <div className="hidden lg:flex flex-col justify-center text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-primary mb-4">Welcome Back!</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Login to Vital-Drop and continue saving lives through blood donation.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                                ✓
                            </div>
                            <p className="text-lg">Find donors near you</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                                ✓
                            </div>
                            <p className="text-lg">Make donation requests</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                                ✓
                            </div>
                            <p className="text-lg">Save lives together</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="card bg-base-100 w-full shadow-2xl">
                    <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                        <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login</h2>
                        
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <input 
                                type="email" 
                                {...register("email", { required: "Email is required" })} 
                                className="input input-bordered" 
                                placeholder="your@email.com" 
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <input 
                                type="password" 
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })} 
                                className="input input-bordered" 
                                placeholder="******" 
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Forgot Password Link */}
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                        </label>

                        {/* Login Button */}
                        <button 
                            type="submit" 
                            className="btn btn-primary text-white w-full mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Register Link */}
                        <p className="text-center mt-4">
                            Don't have an account? 
                            <Link to="/register" className="text-primary font-semibold ml-1">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;