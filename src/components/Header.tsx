// src/components/Header.tsx
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-heading text-bay-leaf-700">
          N Surgicals
        </div>
        <div className="flex space-x-6">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-bay-leaf-600'
                : 'text-gray-600 hover:text-bay-leaf-600'
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-bay-leaf-600'
                : 'text-gray-600 hover:text-bay-leaf-600'
            }
          >
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
