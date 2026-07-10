import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import getCurrentUser from './features/getCurrentUser';

const App = () => {
  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser();
    };
    getUser();
  }, []);

  return <AppRoutes />;
};

export default App;