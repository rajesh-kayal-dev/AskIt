import { api } from './auth/services/api';
import type { User } from './auth/types/auth.types';

const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const response = await api.get<unknown, User>('/me');
    console.log("Full response:", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;
