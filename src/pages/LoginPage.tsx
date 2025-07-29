// src/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const nav = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav("/catalog");
  };

  return (
    <div className="flex h-screen font-body">
      {/* LEFT SIDE: branding + stats */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/pharma-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-bay-leaf-800/60" />
        <div className="relative z-10 m-auto text-center px-12">
          <h1 className="font-heading text-5xl text-white mb-4">N Surgicals</h1>
          <p className="text-lg text-bay-leaf-100 mb-8">
            Your trusted pharmaceutical partner
          </p>
          <div className="grid grid-cols-3 gap-6 text-white">
            <div>
              <span className="block text-3xl font-semibold">500K+</span>
              <span className="text-sm">Customers</span>
            </div>
            <div>
              <span className="block text-3xl font-semibold">150+</span>
              <span className="text-sm">Regions</span>
            </div>
            <div>
              <span className="block text-3xl font-semibold">99.9%</span>
              <span className="text-sm">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <form
          onSubmit={submit}
          className="w-full max-w-md space-y-6 font-body"
        >
          <h2 className="text-2xl font-heading text-bay-leaf-700 text-center">
            Join N Surgicals
          </h2>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bay-leaf-300"
                placeholder="you@company.com"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                📧
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bay-leaf-300"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <input id="tos" type="checkbox" className="mr-2" />
            <label htmlFor="tos" className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-bay-leaf-600 hover:underline">
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a href="#" className="text-bay-leaf-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-bay-leaf-600 text-white font-semibold rounded-lg
                       hover:bg-bay-leaf-700 transition"
          >
            Create Secure Account
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-bay-leaf-600 hover:underline">
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
