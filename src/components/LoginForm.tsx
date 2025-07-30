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
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
          disabled={loading}
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
          disabled={loading}
          placeholder="••••••••"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '🔄 Logging in...' : '🔐 Login'}
      </button>
    </form>
  );
}