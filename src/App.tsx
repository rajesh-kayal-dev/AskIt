import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import getCurrentUser from './features/getCurrentUser';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import type { AppDispatch } from './redux/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getUser = async () => {
      const response = await getCurrentUser();
      if (response) {
        dispatch(setUserData(response));
      }
    };
    getUser();
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;