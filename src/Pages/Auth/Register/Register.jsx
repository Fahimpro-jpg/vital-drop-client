import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import axios from 'axios';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");
  const navigate = useNavigate();

  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Load districts
  useEffect(() => {
    fetch('/districts.json')
      .then(res => res.json())
      .then(data => setDistricts(data));
  }, []);

  const handleRegistration = async (data) => {
    setIsLoading(true);

    try {
      // 1️⃣ Firebase register
      await registerUser(data.email, data.password);

      // 2️⃣ Upload image to ImgBB
      const formData = new FormData();
      formData.append('image', data.avatar[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
        formData
      );

      const photoURL = imgRes.data.data.url;

      // 3️⃣ Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL
      });

      // 4️⃣ Save user to MongoDB
      const userInfo = {
        displayName: data.name,
        email: data.email,
        photoURL,
        bloodGroup: data.blood_group,
        district: data.district,
        upazila: data.upazila,
        role: 'donor',       
        status: 'active'     
      };

      await axiosSecure.post('/users', userInfo);

      // 5️⃣ Redirect
      navigate('/');

    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">
          Register as a Donor 🩸
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join Vital Drop and help save lives
        </p>

        <form onSubmit={handleSubmit(handleRegistration)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <label className="label font-semibold">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="input input-bordered w-full"
                placeholder="john@gmail.com"
              />
              {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
            </div>

            {/* Avatar */}
            <div className="md:col-span-2">
              <label className="label font-semibold">Avatar</label>
              <input
                type="file"
                {...register("avatar", { required: "Avatar is required" })}
                className="file-input file-input-bordered w-full"
              />
              {errors.avatar && <p className="text-error text-sm">{errors.avatar.message}</p>}
            </div>

            {/* Blood Group */}
            <div>
              <label className="label font-semibold">Blood Group</label>
              <select
                {...register("blood_group", { required: "Blood group is required" })}
                className="select select-bordered w-full"
              >
                <option value="">Select</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {errors.blood_group && <p className="text-error text-sm">{errors.blood_group.message}</p>}
            </div>

            {/* District */}
            <div>
              <label className="label font-semibold">District</label>
              <select
                {...register("district", { required: "District is required" })}
                className="select select-bordered w-full"
                onChange={(e) => {
                  const selected = districts.find(d => d.name === e.target.value);
                  setSelectedDistrict(selected);
                }}
              >
                <option value="">Select</option>
                {districts.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              {errors.district && <p className="text-error text-sm">{errors.district.message}</p>}
            </div>

            {/* Upazila */}
            <div>
              <label className="label font-semibold">Upazila</label>
              <select
                {...register("upazila", { required: "Upazila is required" })}
                className="select select-bordered w-full"
                disabled={!selectedDistrict}
              >
                <option value="">Select</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
              {errors.upazila && <p className="text-error text-sm">{errors.upazila.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label font-semibold">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                className="input input-bordered w-full"
              />
              {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label font-semibold">Confirm Password</label>
              <input
                type="password"
                {...register("confirm_password", {
                  required: "Confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                className="input input-bordered w-full"
              />
              {errors.confirm_password && <p className="text-error text-sm">{errors.confirm_password.message}</p>}
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
            <Link to="/login" className="text-primary font-semibold ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
