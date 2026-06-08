import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout as logoutAction } from '../redux/slices/userSlice';
import { logoutUser } from '../api/authApi';
import { useAppDispatch } from '../redux/hooks';
import { ROUTES } from '../constants/routes';

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutUser();
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Logout failed, please try again.');
      throw error;
    }
  };

  return { logout };
}
