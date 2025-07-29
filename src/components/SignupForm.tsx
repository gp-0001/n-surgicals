// src/components/SignupForm.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignupForm() {
  const nav = useNavigate();
  const [firstName, setFirst] = useState('');
  const [lastName, setLast]  = useState('');
  const [email, setEmail]     = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJob]    = useState('');
  const [password, setPwd]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert('You must accept the terms');
    if (password !== confirm) return alert('Passwords must match');
    nav('/catalog');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => setFirst(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => setLast(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
            placeholder="Doe"
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
          placeholder="john.doe@company.com"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Company/Organization</label>
        <input
          type="text"
          required
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
          placeholder="ABC Pharmaceuticals"
        />
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-gray-700 mb-1">Job Title</label>
        <select
          required
          value={jobTitle}
          onChange={e => setJob(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
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

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPwd(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bay-leaf-300 transition"
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
        />
        <label htmlFor="tos" className="text-gray-600 text-sm">
          I agree to the{' '}
          <a href="#" className="text-bay-leaf-600 hover:underline">
            Terms of Service
          </a>{' '}
          &amp;{' '}
          <a href="#" className="text-bay-leaf-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-bay-leaf-400 text-white rounded-lg hover:bg-bay-leaf-500 transition"
      >
        🛡️ Create Secure Account
      </button>

    </form>
  );
}
