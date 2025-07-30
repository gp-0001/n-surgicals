// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
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
        <div className="text-xl font-bold text-blue-700">
          N Surgicals
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }
          >
            Catalog
          </NavLink>
          
          {/* Admin link - only show for admin users */}
          {hasRole('admin') && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }
            >
              Admin Panel
            </NavLink>
          )}

          {/* User Info */}
          {userProfile && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{userProfile.firstName} {userProfile.lastName}</span>
                <span className="block text-xs capitalize">({userProfile.role})</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg 
                           hover:bg-blue-200 transition"
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