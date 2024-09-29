import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';

interface ProtectedComponentProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ allowedRoles, children }) => {
  const userRole = useUserRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return null; // Or return an "Access Denied" component
  }

  return <>{children}</>;
};