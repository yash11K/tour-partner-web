import axios from 'axios';
import { getAuthToken } from '../utilities/token-utils';

interface CreateUserData {
  email: string;
  phone_number: string;
  given_name: string;
  family_name: string;
  picture?: string;
}

export const createUser = async (userData: CreateUserData) => {
  const token = getAuthToken();
  
  try {
    const response = await axios.post('/api/users', userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};