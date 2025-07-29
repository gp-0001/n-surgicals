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
        <img
          src="/images/emergency-essentials.jpg"
          alt="Emergency Essentials"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT: Container for brand + card */}
      <div className="w-full md:w-1/2 flex flex-col items-center p-6">
        {/* 1. Brand in the free space above the card */}
        <h1 className="mt-8 text-4xl font-heading text-bay-leaf-700">
          N&nbsp;Surgicals
        </h1>

        {/* 2. The card itself */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mt-6 p-8">
          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                isLogin ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                !isLogin ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Sign Up
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
