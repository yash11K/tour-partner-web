import { useCallback,useState } from 'react';

import axios from 'axios';

import { Organization } from '@/rest-api/types';

export const useUpdateOrganization = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateOrganization = useCallback(async (orgId: string, data: Partial<Organization>) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`http://localhost:8080/organizations/${orgId}`, data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return { updateOrganization, isLoading };
};