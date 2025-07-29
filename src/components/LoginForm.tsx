// src/components/LoginForm.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav('/catalog');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-bay-leaf-300"
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          required
          value={pw}
          onChange={e => setPw(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-bay-leaf-300"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-bay-leaf-400 text-white rounded-lg hover:bg-bay-leaf-500 transition"
      >
        Login 
      </button>

    </form>
  );
}
