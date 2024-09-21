import { AuthProvider } from "@refinedev/core";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const useAuth0Provider = (): AuthProvider => {
    const { isLoading, isAuthenticated, user, logout, getIdTokenClaims } = useAuth0();

    const authProvider: AuthProvider = {
        login: async () => {
            return {
                success: true,
            };
        },
        logout: async () => {
            logout({ logoutParams: { returnTo: window.location.origin } });
            return {
                success: true,
            };
        },
        onError: async (error) => {
            console.error(error);
            return { error };
        },
        check: async () => {
            try {
                const token = await getIdTokenClaims();
                if (token) {
                    axios.defaults.headers.common = {
                        Authorization: `Bearer ${token.__raw}`,
                    };
                    return {
                        authenticated: true,
                    };
                } else {
                    return {
                        authenticated: false,
                        error: {
                            message: "Check failed",
                            name: "Token not found",
                        },
                        redirectTo: "/login",
                        logout: true,
                    };
                }
            } catch (error: any) {
                return {
                    authenticated: false,
                    error: new Error(error),
                    logout: true,
                };
            }
        },
        getPermissions: async () => null,
        getIdentity: async () => {
            if (user) {
                return {
                    ...user,
                    avatar: user.picture,
                };
            }
            return null;
        },
    };

    getIdTokenClaims().then((token) => {
        if (token) {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${token.__raw}`,
            };
        }
    });

    return authProvider;
};

export default useAuth0Provider;