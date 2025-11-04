import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for an existing token in localStorage on app load
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to load auth token", e);
    } finally {
      setIsLoading(false); // Set loading to false after checking
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    // ✅ THE FIX: 'isLoading' is now provided in the value
    <AuthContext.Provider value={{ isAuthenticated, authToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};