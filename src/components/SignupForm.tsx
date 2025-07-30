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
      await signup({
        email,
        firstName,
        lastName,
        company,
        jobTitle,
        password
      });
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

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => setFirst(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
            placeholder="John"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => setLast(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
            placeholder="Doe"
            disabled={loading}
          />
        </div>
      </div>

      {/* Email & Company */}
      <div>
        <label className="block text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
          placeholder="john.doe@company.com"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Company/Organization</label>
        <input
          type="text"
          required
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
          placeholder="ABC Pharmaceuticals"
          disabled={loading}
        />
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-gray-700 mb-1">Job Title</label>
        <select
          required
          value={jobTitle}
          onChange={e => setJob(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
          disabled={loading}
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="Pharmacist">Pharmacist</option>
          <option value="Nurse">Nurse</option>
          <option value="Doctor">Doctor</option>
          <option value="Administrator">Administrator</option>
        </select>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPwd(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
            minLength={6}
            disabled={loading}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
            disabled={loading}
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center">
        <input
          id="tos"
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mr-2"
          disabled={loading}
        />
        <label htmlFor="tos" className="text-gray-600 text-sm">
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          &amp;{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '🔄 Creating Account...' : '🛡️ Create Account'}
      </button>
    </form>
  );
}