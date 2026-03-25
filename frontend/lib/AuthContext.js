import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext(null);

const API_BASE = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get tokens from localStorage
  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  };

  // Set tokens in localStorage
  const setTokens = (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  };

  // Clear tokens from localStorage
  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        // Token invalid, try to refresh
        const refreshed = await refreshTokenFunc();
        if (!refreshed) {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh access token
  const refreshTokenFunc = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.data.accessToken);
        // Retry fetching user
        await fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setTokens(data.data.accessToken, data.data.refreshToken);
    setUser(data.data.customer);
    setIsAuthenticated(true);
  };

  // Login with Google
  const loginWithGoogle = async (googleIdToken) => {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: googleIdToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Google login failed');
    }

    setTokens(data.data.accessToken, data.data.refreshToken);
    setUser(data.data.customer);
    setIsAuthenticated(true);
  };

  // Register new account
  const register = async (email, password, firstName, lastName) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Don't auto-login after registration - user needs to verify email
    return data;
  };

  // Logout
  const logout = async () => {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();

    if (refreshToken && accessToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  // Update profile
  const updateProfile = async (data) => {
    const accessToken = getAccessToken();

    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Update failed');
    }

    setUser(result.data);
    return result;
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    const accessToken = getAccessToken();

    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Password change failed');
    }

    // Logout after password change (all tokens invalidated)
    await logout();
    return result;
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Reset failed');
    }

    return result;
  };

  // Verify email
  const verifyEmail = async (token) => {
    const response = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Verification failed');
    }

    return result;
  };

  // Auto-refresh token before expiry (15min - 1min = 14min)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        refreshTokenFunc();
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    refreshToken: refreshTokenFunc,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
