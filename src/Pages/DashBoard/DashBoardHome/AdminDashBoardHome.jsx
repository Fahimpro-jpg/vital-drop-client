import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaHandHoldingHeart, FaTint } from 'react-icons/fa';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const AdminDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin-stats');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // ✅ cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* 🔹 Welcome Section */}
      <div className="bg-base-200 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.displayName} 👋
        </h2>
        <p className="text-gray-600">
          Here’s what’s happening in your blood donation platform today.
        </p>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Users */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <FaUsers className="text-4xl text-primary" />
            <div>
              <h3 className="text-3xl font-bold">
                {stats.totalUsers}
              </h3>
              <p className="text-gray-500">Total Donors</p>
            </div>
          </div>
        </div>

        {/* Total Funding */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <FaHandHoldingHeart className="text-4xl text-success" />
            <div>
              <h3 className="text-3xl font-bold">
                ৳ {stats.totalFunding}
              </h3>
              <p className="text-gray-500">Total Funding</p>
            </div>
          </div>
        </div>

        {/* Total Donation Requests */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <FaTint className="text-4xl text-error" />
            <div>
              <h3 className="text-3xl font-bold">
                {stats.totalDonationRequests}
              </h3>
              <p className="text-gray-500">Blood Requests</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardHome;
