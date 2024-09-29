import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const { getIdTokenClaims } = useAuth0();

  const getIdToken = useCallback(async () => {
    const claims = await getIdTokenClaims();
    return claims?.__raw;
  }, [getIdTokenClaims]);

  return { getIdToken };
};