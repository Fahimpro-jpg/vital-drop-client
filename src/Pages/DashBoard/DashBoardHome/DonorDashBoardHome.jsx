import React from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const DonorDashboardHome = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  /* 🔐 AUTH GUARD */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-error font-semibold">
          You must be logged in to view your dashboard.
        </p>
      </div>
    );
  }

  /* 🔹 Fetch donor's donation requests */
  const { data: requests = [], refetch } = useQuery({
    queryKey: ['my-requests', user.email],
    enabled: !!user.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests?email=${user.email}`);
      return res.data;
    }
  });

  const recentRequests = requests.slice(0, 3);

  /* 🔹 Update status */
  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/donation-requests/${id}/status`, { status });
    refetch();
  };

  /* 🔹 Delete request */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This donation request will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/donation-requests/${id}`);
      Swal.fire('Deleted!', 'Donation request deleted.', 'success');
      refetch();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* 🏠 WELCOME */}
      <div className="bg-primary text-white rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome back, {user.displayName} 👋
        </h2>
        <p className="opacity-90">
          Here is a quick overview of your recent donation requests
        </p>
      </div>

      {/* 🩸 RECENT REQUESTS */}
      {recentRequests.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">

            <h3 className="text-xl font-semibold mb-4">
              Recent Donation Requests
            </h3>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Blood</th>
                    <th>Status</th>
                    <th>Donor Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map(req => {
                    const { _id, recipient_name, district,upazila,date,time,blood_group, status, 
requesterName, requesterEmail } = req;

                    return (
                      <tr key={_id}>
                        <td>{recipient_name}</td>
                        <td>{district}, {upazila}</td>
                        <td>{date}</td>
                        <td>{time}</td>
                        <td>
                          <span className="badge badge-error text-white">{blood_group}</span>
                        </td>
                        <td>
                          <span className={`badge 
                            ${status === 'pending' && 'badge-warning'}
                            ${status === 'inprogress' && 'badge-info'}
                            ${status === 'done' && 'badge-success'}
                            ${status === 'canceled' && 'badge-error'}
                          `}>
                            {status}
                          </span>
                        </td>

                        {/* Donor Info */}
                        <td>
                          {status === 'inprogress' && requesterName ? (
                            <>
                              <p className="font-semibold">{requesterName}</p>
                              <p className="text-xs text-gray-500">{requesterEmail}</p>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="space-x-1">
                          {status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => updateStatus(_id, 'done')}
                                className="btn btn-xs btn-success"
                              >
                                Done
                              </button>
                              <button
                                onClick={() => updateStatus(_id, 'canceled')}
                                className="btn btn-xs btn-error"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          <Link
                            to={`/dashboard/edit-donation/${_id}`}
                            className="btn btn-xs btn-warning"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(_id)}
                            className="btn btn-xs btn-outline btn-error"
                          >
                            Delete
                          </button>

                          <Link
                            to={`/dashboard/donation/${_id}`}
                            className="btn btn-xs btn-info text-white"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VIEW ALL */}
            <div className="text-right mt-4">
              <Link
                to="/dashboard/my-donation-request"
                className="btn btn-primary"
              >
                View My All Requests →
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboardHome;
