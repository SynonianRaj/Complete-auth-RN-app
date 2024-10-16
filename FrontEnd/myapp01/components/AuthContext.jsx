import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setIsSignedIn(!!accessToken);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    checkLoginStatus();
  }, []);

  const login = async (token) => {
    try {

      await AsyncStorage.setItem('accessToken', token);
      setIsSignedIn(true);
      return true
    } catch (error) {
      console.error('Error storing token:', error);
      setIsSignedIn(false)
      return false
    }
  };

  const logout = async () => {
    try {
      // Remove the access token from AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null; // Or handle accordingly
    }
  };

  const saveToken = async(token) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch  (error) {
      console.error('Error saving token:', error);
      }

  }
  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, isLoading, login, logout, getToken, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
