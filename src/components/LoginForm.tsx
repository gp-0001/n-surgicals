// src/components/LoginForm.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      nav('/catalog');
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-black mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
        />
      </div>
      <div>
        <label className="block text-black mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3
          bg-black/60 text-white
          rounded-lg
          hover:bg-black/80
          focus:ring-2 focus:ring-white
          transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? '🔄 Logging in...' : '🔐 Login'}
      </button>
    </form>
  );
}
