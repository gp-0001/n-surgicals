// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex h-screen bg-white">
      {/* LEFT: Image */}
      <div className="hidden md:block md:w-1/2 h-full">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">N Surgicals</h1>
            <p className="text-xl">Your trusted pharmaceutical partner</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Container for brand + card */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
        {/* The card itself */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 border">
          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                isLogin ? 'bg-gray-100 text-black border-b-2 border-blue-500' : 'text-gray-500 hover:text-black'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                !isLogin ? 'bg-gray-100 text-black border-b-2 border-blue-500' : 'text-gray-500 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Active form */}
          <div className="transition-opacity duration-200">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </div>
    </div>
  );
}