import { api } from './auth/services/api';

const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/user/me');
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;
