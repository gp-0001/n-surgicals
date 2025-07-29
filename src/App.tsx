// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/MainLayout';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <Routes>
      {/* Public auth entry */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* All protected routes share MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="catalog" element={<Catalog />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
