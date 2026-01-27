import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyDonationRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState('all');

  const { data: requests = [], refetch } = useQuery({
    queryKey: ['my-donation-requests', user?.email, filter],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?email=${user.email}&status=${filter}`
      );
      return res.data;
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/donation-requests/${id}`)
          .then(() => {
            refetch();
            Swal.fire("Deleted!", "Request removed.", "success");
          });
      }
    });
  };

  const handleStatusChange = (id, status) => {
    axiosSecure.patch(`/donation-requests/${id}/status`, { status })
      .then(() => {
        refetch();
        Swal.fire("Updated!", `Marked as ${status}`, "success");
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Donation Requests</h2>

        <select
          className="select select-bordered"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood</th>
              <th>Status</th>
              <th>Donor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req._id}>
                <td>{index + 1}</td>
                <td>{req.recipient_name}</td>
                <td>{req.district}, {req.upazila}</td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
                <td>{new Date(req.date).toLocaleTimeString()}</td>
                <td>{req.blood_group}</td>
                <td>
                  <span className="badge badge-info">{req.status}</span>
                </td>
                <td>
                  {req.status === 'inprogress'
                    ? `${req.donorName} (${req.donorEmail})`
                    : '—'}
                </td>
                <td className="flex gap-2">
                  <Link
                    to={`/donationRequests/${req._id}`}
                    className="btn btn-xs btn-primary"
                  >
                    View
                  </Link>

                  <Link
                    to={`/dashboard/edit-donation/${req._id}`}
                    className="btn btn-xs btn-warning"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(req._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>

                  {req.status === 'inprogress' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(req._id, 'done')}
                        className="btn btn-xs btn-success"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, 'canceled')}
                        className="btn btn-xs btn-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No donation requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyDonationRequests;
