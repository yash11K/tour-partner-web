import { AuthProvider } from "@refinedev/core";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React from "react";

const useAuth0Provider = (): AuthProvider => {
    const { isLoading, isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();

    // Store the access token when the component mounts
    React.useEffect(() => {
        const storeAccessToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                if (accessToken) {
                    localStorage.setItem('access_token', accessToken);
                    axios.defaults.headers.common = {
                        Authorization: `Bearer ${accessToken}`,
                    };
                }
            } catch (error) {
                console.error("Error storing access token:", error);
            }
        };

        storeAccessToken();
    }, [getAccessTokenSilently]);

    const authProvider: AuthProvider = {
        login: async () => {
            const accessToken = await getAccessTokenSilently();
            localStorage.setItem('access_token', accessToken);
            return {
                success: true,
            };
        },
        logout: async () => {
            logout({ logoutParams: { returnTo: window.location.origin } });
            localStorage.removeItem('access_token');
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
                const accessToken = await getAccessTokenSilently();
                if (accessToken) {
                    axios.defaults.headers.common = {
                        Authorization: `Bearer ${accessToken}`,
                    };
                    return {
                        authenticated: true,
                    };
                } else {
                    return {
                        authenticated: false,
                        error: {
                            message: "Check failed",
                            name: "Access token not found",
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

    return authProvider;
};

export default useAuth0Provider;