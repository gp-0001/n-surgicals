// src/pages/AuthPage.tsx
import React, { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const bgUrl = '/images/emergency-essentials.jpg' // your background

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${bgUrl}')` }}
    >
      {/* Dim the background for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="
            bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg
            w-full max-w-md p-6 sm:p-8
            max-h-[90vh] overflow-y-auto
          "
        >
          {/* Brand */}
          <h1 className="text-3xl font-heading text-bay-leaf-700 text-center mb-6">
            N Surgicals
          </h1>

          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-4 border-b">
            <button
              onClick={() => setIsLogin(true)}
              className={`pb-2 text-sm font-medium transition ${
                isLogin
                  ? 'border-b-2 border-gray text-gray'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`pb-2 text-sm font-medium transition ${
                !isLogin
                  ? 'border-b-2 border-gray text-gray'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Active Form */}
          <div className="space-y-4">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </div>
    </div>
  )
}
