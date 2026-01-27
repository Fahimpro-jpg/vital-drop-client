import React from 'react';
import useRole from '../../../Hooks/useRole';
import AdminDashBoardHome from './AdminDashBoardHome';
import DonorDashBoardHome from './DonorDashBoardHome';
import VolunteerDashBoardHome from './VolunteerDashBoardHome';
import Loading from '../../../components/Loading/Loading';

const DashBoardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  switch (role) {
    case 'admin':
      return <AdminDashBoardHome />;
    case 'donor':
      return <DonorDashBoardHome />;
    case 'volunteer':
      return <VolunteerDashBoardHome />;
    default:
      return <div className="text-center text-2xl mt-10">Welcome to your DashBoard</div>;
  }
};

export default DashBoardHome;
