import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const CreateDonationRequest = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, watch } = useForm();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const selectedDistrict = watch("recipientDistrict");

  if (loading) {
    return (
      <div className="min-h-[40vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-error font-semibold">
        You must be logged in to create a donation request.
      </div>
    );
  }

  // Load districts
  useEffect(() => {
    fetch('/districts.json')
      .then(res => res.json())
      .then(data => setDistricts(data));
  }, []);

  // Sync upazilas
  useEffect(() => {
    const found = districts.find(d => d.name === selectedDistrict);
    setUpazilas(found?.upazilas || []);
  }, [selectedDistrict, districts]);

  // Check user status
  const { data: dbUser } = useQuery({
    queryKey: ['user-status', user.email],
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    }
  });

  if (dbUser?.status === 'blocked') {
    return (
      <div className="max-w-xl mx-auto p-10">
        <div className="alert alert-error shadow-lg">
          🚫 You are blocked. You cannot create donation requests.
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const donationRequest = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      recipientName: data.recipientName,
      recipientDistrict: data.recipientDistrict,
      recipientUpazila: data.recipientUpazila,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: 'pending', // ✅ corrected field
      donorName: null,
      donorEmail: null,
      createdAt: new Date()
    };

    try {
      await axiosSecure.post('/donation-requests', donationRequest);
      Swal.fire("Success 🎉", "Donation request created!", "success");
      reset();
    } catch {
      Swal.fire("Error ❌", "Something went wrong!", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          <h2 className="text-3xl font-bold text-center mb-6">
            🩸 Create Donation Request
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">

            {/* Requester */}
            <input readOnly value={user.displayName} className="input input-bordered w-full" />
            <input readOnly value={user.email} className="input input-bordered w-full" />

            {/* Recipient */}
            <input {...register("recipientName", { required: true })} placeholder="Recipient Name" className="input input-bordered w-full" />
            <select {...register("bloodGroup", { required: true })} className="select select-bordered w-full">
              <option value="">Select Blood Group</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            {/* Location */}
            <select {...register("recipientDistrict", { required: true })} className="select select-bordered w-full">
              <option value="">Select District</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select {...register("recipientUpazila", { required: true })} disabled={!upazilas.length} className="select select-bordered w-full">
              <option value="">Select Upazila</option>
              {upazilas.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>

            {/* Hospital */}
            <input {...register("hospitalName", { required: true })} placeholder="Hospital Name" className="input input-bordered w-full" />
            <input type="date" {...register("donationDate", { required: true })} className="input input-bordered w-full" />
            <input type="time" {...register("donationTime", { required: true })} className="input input-bordered w-full" />

            {/* Address & Message */}
            <input {...register("fullAddress", { required: true })} placeholder="Full Address" className="input input-bordered w-full md:col-span-2" />
            <textarea {...register("requestMessage", { required: true })} placeholder="Why blood is needed..." className="textarea textarea-bordered w-full md:col-span-2" />

            <button className="btn btn-primary md:col-span-2">Request Blood 🩸</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
