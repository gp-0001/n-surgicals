// src/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-bay-leaf-50 p-6">
        <Outlet />
      </div>
    </div>
  );
}
