// src/components/SignupForm.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SignupForm() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJob] = useState('');
  const [password, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreed) {
      setError('You must accept the terms');
      return;
    }
    if (password !== confirm) {
      setError('Passwords must match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup({ email, firstName, lastName, company, jobTitle, password });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-black mb-1">First Name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => setFirst(e.target.value)}
            placeholder="John"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div>
          <label className="block text-black mb-1">Last Name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => setLast(e.target.value)}
            placeholder="Doe"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-black mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="john.doe@company.com"
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
        />
      </div>
      <div>
        <label className="block text-black mb-1">Company/Organization</label>
        <input
          type="text"
          required
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="ABC Pharmaceuticals"
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
        />
      </div>
      <div>
        <label className="block text-black mb-1">Job Title</label>
        <select
          required
          value={jobTitle}
          onChange={e => setJob(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
        >
          <option value="" disabled>
            Select your role
          </option>
          <option>Pharmacist</option>
          <option>Nurse</option>
          <option>Doctor</option>
          <option>Administrator</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-black mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPwd(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div>
          <label className="block text-black mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          id="tos"
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          disabled={loading}
          className="mr-2"
        />
        <label htmlFor="tos" className="text-black text-sm">
          I agree to the{' '}
          <a href="#" className="text-black hover:underline">
            Terms of Service
          </a>{' '}
          &amp;{' '}
          <a href="#" className="text-black hover:underline">
            Privacy Policy
          </a>
        </label>
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
        {loading ? '🔄 Creating Account...' : '🛡️ Create Account'}
      </button>
    </form>
);
}
