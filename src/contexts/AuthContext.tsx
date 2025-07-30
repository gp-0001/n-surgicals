// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserRole = 'admin' | 'pharmacist' | 'nurse' | 'doctor';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  role: UserRole;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Map job titles to roles
  const mapJobTitleToRole = (jobTitle: string): UserRole => {
    switch (jobTitle.toLowerCase()) {
      case 'administrator':
        return 'admin';
      case 'pharmacist':
        return 'pharmacist';
      case 'nurse':
        return 'nurse';
      case 'doctor':
        return 'doctor';
      default:
        return 'pharmacist'; // default role
    }
  };

  const signup = async (userData: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }) => {
    try {
      const { password, ...profileData } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      
      const profile: UserProfile = {
        ...profileData,
        uid: userCredential.user.uid,
        role: mapJobTitleToRole(userData.jobTitle),
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), profile);
      setUserProfile(profile);
      console.log('Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      console.log('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!userProfile) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userProfile.role);
    }
    
    // Admin has access to everything
    if (userProfile.role === 'admin') return true;
    
    return userProfile.role === requiredRole;
  };

  const fetchUserProfile = async (user: User) => {
    console.log('👤 DEBUG: fetchUserProfile called for user:', user.uid);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('👤 DEBUG: Firestore document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        console.log('👤 DEBUG: User profile data:', data);
        setUserProfile(data);
      } else {
        console.log('👤 DEBUG: No user profile found in Firestore for:', user.uid);
        console.log('👤 DEBUG: User email:', user.email);
        // Profile doesn't exist - this is the problem!
      }
    } catch (error) {
      console.error('👤 DEBUG: Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};