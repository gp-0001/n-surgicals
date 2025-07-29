// src/components/AdminRoute.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react';


const SECRET = import.meta.env.VITE_ADMIN_KEY || 'MY_SECRET_KEY';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const [key, setKey] = useState('');

  if (ok) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bay-leaf-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-bay-leaf-700 mb-4">
          Admin Access
        </h2>
        <input
          type="password"
          placeholder="Enter admin key"
          value={key}
          onChange={e => setKey(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-bay-leaf-300 transition"
        />
        <button
          onClick={() => {
            if (key === SECRET) setOk(true);
            else alert('Invalid key');
          }}
          className="w-full py-2 bg-bay-leaf-600 text-white rounded-lg hover:bg-bay-leaf-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
