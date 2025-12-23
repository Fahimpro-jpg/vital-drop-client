import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import axios from 'axios';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const password = watch("password");
    const navigate = useNavigate();

    const { registerUser, updateUserProfile } = useAuth();

    // Load districts with nested upazilas
    useEffect(() => {
        fetch('/districts.json')
            .then(res => res.json())
            .then(data => {
                setDistricts(data);
            })
            .catch(error => console.error('Error loading districts:', error));
    }, []);

    const handleRegistration = async (data) => {
        setIsLoading(true);
        
        try {
            // Get the image file
            const profileImg = data.avatar[0]; // Fixed: was data.photo[0], should be data.avatar[0]

            // Register user first
            const result = await registerUser(data.email, data.password);
            console.log('User registered:', result.user);
            
            // Upload image to ImgBB
            const formData = new FormData();
            formData.append('image', profileImg);
            
            const imageAPI_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;

            const imageResponse = await axios.post(imageAPI_URL, formData);
            console.log('Image uploaded:', imageResponse.data.data.url);

            // Update user profile with name and photo
            const userProfile = {
                displayName: data.name,
                photoURL: imageResponse.data.data.url
            };

            await updateUserProfile(userProfile);
            console.log('User profile updated successfully');

            // TODO: Save additional user data (blood group, district, upazila) to your database here
            
            // Navigate to homepage after everything is complete
            navigate('/');
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-8 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Register as a Donor</h2>
                
                <form onSubmit={handleSubmit(handleRegistration)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Email */}
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
                            {errors.email && <p className='text-error text-sm mt-1'>{errors.email.message}</p>}
                        </div>

                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <input 
                                type="text" 
                                {...register("name", { required: "Name is required" })} 
                                className="input input-bordered" 
                                placeholder="John Doe" 
                            />
                            {errors.name && <p className='text-error text-sm mt-1'>{errors.name.message}</p>}
                        </div>

                        {/* Avatar */}
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Avatar</span>
                            </label>
                            <input 
                                type="file" 
                                accept="image/*"
                                {...register("avatar", { required: "Avatar is required" })} 
                                className="file-input file-input-bordered w-full" 
                            />
                            {errors.avatar && <p className='text-error text-sm mt-1'>{errors.avatar.message}</p>}
                        </div>

                        {/* Blood Group */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Blood Group</span>
                            </label>
                            <select 
                                {...register("blood_group", { required: "Blood group is required" })} 
                                className="select select-bordered"
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                            {errors.blood_group && <p className='text-error text-sm mt-1'>{errors.blood_group.message}</p>}
                        </div>

                        {/* District */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">District</span>
                            </label>
                            <select 
                                {...register("district", { required: "District is required" })} 
                                className="select select-bordered"
                                onChange={(e) => {
                                    const selected = districts.find(d => d.name === e.target.value);
                                    setSelectedDistrict(selected);
                                }}
                            >
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            {errors.district && <p className='text-error text-sm mt-1'>{errors.district.message}</p>}
                        </div>

                        {/* Upazila */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Upazila</span>
                            </label>
                            <select 
                                {...register("upazila", { required: "Upazila is required" })} 
                                className="select select-bordered"
                                disabled={!selectedDistrict}
                            >
                                <option value="">Select Upazila</option>
                                {selectedDistrict?.upazilas.map(upazila => (
                                    <option key={upazila.id} value={upazila.name}>
                                        {upazila.name}
                                    </option>
                                ))}
                            </select>
                            {errors.upazila && <p className='text-error text-sm mt-1'>{errors.upazila.message}</p>}
                        </div>

                        {/* Password */}
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
                            {errors.password && <p className='text-error text-sm mt-1'>{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Confirm Password</span>
                            </label>
                            <input 
                                type="password" 
                                {...register("confirm_password", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match"
                                })} 
                                className="input input-bordered" 
                                placeholder="******" 
                            />
                            {errors.confirm_password && <p className='text-error text-sm mt-1'>{errors.confirm_password.message}</p>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary text-white w-full mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>

                    <p className="text-center mt-4">
                        Already have an account? 
                        <Link to="/login" className="text-primary font-semibold ml-1">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;