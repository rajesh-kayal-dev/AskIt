import { useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import type { User } from '../types/auth.types.js';
import { AuthContext, type AuthContextValue } from './useAuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth } from './useAuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

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