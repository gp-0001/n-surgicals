// src/App.tsx - Complete working version with built-in header
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';

// Header Component - Built directly into App
function AppHeader() {
  const { userProfile, logout, hasRole } = useAuth();

  console.log('🎯 DEBUG: AppHeader rendered');
  console.log('🎯 DEBUG: AppHeader - userProfile:', userProfile);
  console.log('🎯 DEBUG: AppHeader - hasRole(admin):', hasRole('admin'));

  const handleLogout = async () => {
    console.log('🚪 DEBUG: Header logout clicked');
    try {
      await logout();
      console.log('🚪 DEBUG: Header logout successful');
    } catch (error) {
      console.error('🚪 DEBUG: Header logout error:', error);
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    console.log('⚙️ DEBUG: Admin Panel link clicked');
    console.log('⚙️ DEBUG: Current role:', userProfile?.role);
    console.log('⚙️ DEBUG: Is admin:', hasRole('admin'));
  };

  const handleCatalogClick = (e: React.MouseEvent) => {
    console.log('📦 DEBUG: Catalog link clicked');
  };

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            N Surgicals
          </div>
          
          {/* Navigation & User Info */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <a
              href="/catalog"
              onClick={handleCatalogClick}
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded"
            >
              📦 Catalog
            </a>
            
            {/* Admin Panel Link - Only for Admins */}
            {hasRole('admin') && (
              <a
                href="/admin"
                onClick={handleAdminClick}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded"
              >
                ⚙️ Admin Panel
              </a>
            )}

            {/* User Info */}
            {userProfile && (
              <div className="flex items-center space-x-4 border-l pl-6">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {userProfile.firstName} {userProfile.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userProfile.role} • {userProfile.company}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Layout with Header
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  console.log('🛡️ DEBUG: ProtectedRoute - currentUser:', currentUser);
  console.log('🛡️ DEBUG: ProtectedRoute - loading:', loading);
  
  if (loading) {
    console.log('🛡️ DEBUG: ProtectedRoute - showing loading spinner');
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🛡️ DEBUG: ProtectedRoute - no user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  console.log('🛡️ DEBUG: ProtectedRoute - user authenticated, showing content');
  return <AppLayout>{children}</AppLayout>;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { hasRole, loading, currentUser } = useAuth();
  
  console.log('👑 DEBUG: AdminRoute - currentUser:', currentUser);
  console.log('👑 DEBUG: AdminRoute - loading:', loading);
  console.log('👑 DEBUG: AdminRoute - hasRole(admin):', hasRole('admin'));
  
  if (loading) {
    console.log('👑 DEBUG: AdminRoute - showing loading spinner');
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('👑 DEBUG: AdminRoute - no user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  if (!hasRole('admin')) {
    console.log('👑 DEBUG: AdminRoute - user not admin, redirecting to /catalog');
    return <Navigate to="/catalog" replace />;
  }
  
  console.log('👑 DEBUG: AdminRoute - user is admin, showing admin content');
  return <AppLayout>{children}</AppLayout>;
}

// App Router Component
function AppRouter() {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <Routes>
        {/* Public Route - Authentication */}
        <Route 
          path="/auth" 
          element={!currentUser ? <AuthPage /> : <Navigate to="/catalog" replace />} 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/catalog" replace />} 
        />
        
        {/* Product Catalog - All authenticated users */}
        <Route 
          path="/catalog" 
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Panel - Admin users only */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />

        {/* Catch all routes */}
        <Route 
          path="*" 
          element={
            currentUser ? <Navigate to="/catalog" replace /> : <Navigate to="/auth" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}