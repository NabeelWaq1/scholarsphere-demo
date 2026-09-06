import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, customEmail = null, customPass = null) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const user = await login(targetEmail, targetPass);
      if (user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(null, demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Scholar<span className="text-indigo-600">Sphere</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Or{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
            create a new student or mentor account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Helper Box: 1-Click Demo Logins (Key requirement) */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-indigo-50/90 border border-indigo-200/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-xs text-indigo-900 uppercase tracking-wider">
              Try Demo Accounts (1-Click Login)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            Click any demo profile to auto-fill credentials and sign in immediately:
          </p>

          <div className="space-y-2">
            {/* Ahmed */}
            <button
              type="button"
              onClick={() => handleDemoClick('student.ahmed@demo.com', 'Demo1234')}
              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-xs flex items-center justify-between transition group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                    Ahmed Khan
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                    Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  CS @ FAST • GPA 3.6 • Prefers Germany / Canada
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Fatima */}
            <button
              type="button"
              onClick={() => handleDemoClick('student.fatima@demo.com', 'Demo1234')}
              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-xs flex items-center justify-between transition group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                    Dr. Fatima Zahra
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                    Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Medicine @ KEMU • GPA 3.9 • Prefers UK
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Ali */}
            <button
              type="button"
              onClick={() => handleDemoClick('student.ali@demo.com', 'Demo1234')}
              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-xs flex items-center justify-between transition group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                    Ali Raza
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                    Student
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    0 Sessions Booked
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Business @ IBA • GPA 3.1 • Test Free First Call
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Sara */}
              <button
                type="button"
                onClick={() => handleDemoClick('mentor.sara@demo.com', 'Demo1234')}
                className="text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-xs flex items-center justify-between transition group"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                      Sara Chen
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                      Mentor
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    DAAD Scholar @ TU Berlin
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
              </button>

              {/* Hassan */}
              <button
                type="button"
                onClick={() => handleDemoClick('mentor.hassan@demo.com', 'Demo1234')}
                className="text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-xs flex items-center justify-between transition group"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                      Hassan Tariq
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                      Mentor
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Chevening Scholar @ LSE
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
              </button>
            </div>
          </div>
        </div>

        {/* Regular Login Card */}
        <div className="bg-white py-6 px-5 sm:px-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@demo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
