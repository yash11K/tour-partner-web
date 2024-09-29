import { useState, useEffect } from 'react';
import { extractRoleFromToken } from '@/utilities/token-utils';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const calculateUserRole = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const role = extractRoleFromToken(token);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    calculateUserRole();

    // Recalculate role when localStorage changes
    window.addEventListener('storage', calculateUserRole);

    return () => {
      window.removeEventListener('storage', calculateUserRole);
    };
  }, []);

  return userRole;
};