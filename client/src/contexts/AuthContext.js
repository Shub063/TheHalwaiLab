import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Import the initialized auth
import api from '../utils/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate(); // Initialize navigate

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      //console.warn("User= ",googleUser);
      

      const response = await api.post('/auth/google-login', {
        email: googleUser.email,
        displayName: googleUser.displayName
      });

      const userWithAdminStatus = {
        ...googleUser,
        userName: response.data.user.userName,
        isAdmin: response.data.user.isAdmin
      };

      setUser(userWithAdminStatus);
      navigate('/'); // Redirect after login
      return userWithAdminStatus;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && !user) { // Prevent duplicate API call
        try {
          const response = await api.post('/auth/google-login', {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
  
          const userWithAdminStatus = {
            ...firebaseUser,
            userName: response.data.user.userName,
            isAdmin: response.data.user.isAdmin
          };
  
          setUser(userWithAdminStatus);
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
        }
      }
    });
  
    return () => unsubscribe();
  }, [user]); // Added `user` dependency
  

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
