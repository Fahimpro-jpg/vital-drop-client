import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';
// assuming you have AuthContext

const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); // check if user is logged in

  useEffect(() => {
    // fetch all pending donation requests
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:3000/donation-requests?status=pending');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  // handle view button
  const handleView = (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/donationRequests/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Pending Blood Donation Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending donation requests at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req._id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title">{req.recipient_name}</h2>
                <p><strong>Location:</strong> {req.district}, {req.upazila}</p>
                <p><strong>Blood Group:</strong> {req.blood_group}</p>
                <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(req.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="card-actions justify-end mt-4">
                  <button 
                    onClick={() => handleView(req._id)} 
                    className="btn btn-sm btn-primary text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequestsPage;
