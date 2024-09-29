import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  permissions?: string[];
  // Add other properties as needed
}

export const extractRoleFromToken = (token: string): string | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const permissions = decodedToken.permissions || [];

    if (permissions.includes('create:organization')) {
      return 'SuperAdmin';
    } else if (permissions.includes('create:members')) {
      return 'TourAdmin';
    } else if (permissions.length > 0) {
      return 'TourAgent';
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};