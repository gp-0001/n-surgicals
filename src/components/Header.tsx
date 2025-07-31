// src/components/Header.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { userProfile, logout, hasRole } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Brand */}
        <div className="text-5xl font-extrabold uppercase font-serif text-black">
          N Surgicals
        </div>

        <div className="flex items-center space-x-6 text-sm">
          {/* Admin Panel (if you’re an admin) */}
          {hasRole('admin') && (
            <a
              href="/admin"
              className="text-black hover:text-gray-700 font-semibold"
            >
              Admin Panel
            </a>
          )}

          {/* User info + Logout */}
          {userProfile && (
            <div className="flex items-center space-x-4">
              <div className="text-black">
                <div className="font-medium">
                  {userProfile.firstName} {userProfile.lastName}
                </div>
                <div className="text-xs capitalize">
                  ({userProfile.role})
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="
                  px-4 py-2 text-sm
                  bg-black text-white
                  rounded-lg
                  hover:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-black
                  transition
                "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
);
}
