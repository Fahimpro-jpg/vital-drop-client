import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const password = watch("password");

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
        // Upload avatar to ImageBB
        if (data.avatar && data.avatar[0]) {
            setImageUploading(true);
            const formData = new FormData();
            formData.append('image', data.avatar[0]);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMAGEBB_API_KEY`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    data.avatar = result.data.url;
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                alert('Failed to upload image');
                setImageUploading(false);
                return;
            }
            setImageUploading(false);
        }

        // Remove confirm_password before sending
        const { confirm_password, ...registrationData } = data;
        
        console.log('Registration data:', registrationData);
        // TODO: Send to your backend API
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
                        disabled={imageUploading}
                    >
                        {imageUploading ? 'Uploading...' : 'Register'}
                    </button>

                    <p className="text-center mt-4">
                        Already have an account? 
                        <a href="/login" className="text-primary font-semibold ml-1">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;