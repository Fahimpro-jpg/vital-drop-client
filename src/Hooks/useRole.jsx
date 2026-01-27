import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading: roleLoading,
  } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role; 
    },
  });

  return {
    role: data,          
    roleLoading,
  };
};

export default useRole;
