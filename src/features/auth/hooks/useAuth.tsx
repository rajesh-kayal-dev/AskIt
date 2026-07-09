import { useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import type { User } from '../types/auth.types.js';
import { AuthContext, type AuthContextValue } from './useAuthContext';

export { useAuth } from './useAuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const getCookie = (name: string): string | null => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                return parts.pop()?.split(';').shift() ?? null;
            }
            return null;
        };

        const token = localStorage.getItem('askit_token') || getCookie('jwt_token');

        if (!token) {
            queueMicrotask(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

            return () => {
                isMounted = false;
            };
        }

        authApi
            .getProfile()
            .then((result) => {
                if (!isMounted) {
                    return;
                }

                if (result.success && result.data?.user) {
                    setUser(result.data.user);
                    return;
                }

                localStorage.removeItem('askit_token');
            })
            .catch(() => {
                if (isMounted) {
                    localStorage.removeItem('askit_token');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const login = (token: string): void => {
        localStorage.setItem('askit_token', token);
    };

    const logout = (): Promise<void> =>
        authApi.logout().then(
            () => {
                localStorage.removeItem('askit_token');
                setUser(null);
            },
            () => {
                localStorage.removeItem('askit_token');
                setUser(null);
            }
        );

    const value: AuthContextValue = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};