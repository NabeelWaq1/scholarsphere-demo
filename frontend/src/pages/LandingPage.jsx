import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Users,
  Award,
  Video,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Globe,
  Star,
  Layers,
  BookOpen
} from 'lucide-react';
import api from '../services/api';

export default function LandingPage() {
  const [stats, setStats] = useState({
    students_count: 60,
    mentors_count: 50,
    scholarships_count: 40,
    countries_count: 10,
    total_sessions_count: 140,
    success_rate_percent: 94
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/stats/overview');
        setStats(res.data);
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Simple Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Scholar<span className="text-indigo-600">Sphere</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                FYP Demo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Matching Engine • Verified Alumni Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Discover scholarships. <br className="hidden sm:block" />
            Connect with real mentors. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
              Build your future abroad.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ScholarSphere pairs international applicants from Pakistan, India, Nigeria, and beyond with funded DAAD, Chevening, and Fulbright scholars at top universities worldwide.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Explore Demo (1-Click Logins)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-sm transition"
            >
              Create Account
            </Link>
          </div>

          {/* Demo Highlight Banner */}
          <div className="mt-8 inline-block bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2 text-xs text-amber-900 font-medium">
            💡 <strong>Supervisor Meeting Demo:</strong> Fully populated platform with 60 students, 50 mentors, 40 scholarships, and rule-based AI scoring.
          </div>
        </div>
      </section>

      {/* Real Stats Bar */}
      <section className="bg-white border-y border-slate-200 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">
                {stats.students_count}+
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Students
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">
                {stats.mentors_count}+
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Verified Scholar Mentors
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">
                {stats.scholarships_count}+
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Curated Scholarships
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">
                {stats.countries_count}
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Destination Countries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Columns */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Students Win With ScholarSphere
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Combining transparent AI recommendation algorithms with authentic human mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Rule-Based AI Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scores every scholarship 0–100% against your target degree, GPA, preferred countries, and funding needs, with clear explanations for every point awarded.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">1st Live Session Free</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with any alumnus or current scholar abroad for an initial 1:1 strategy call with zero cost and no payment step required.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">End-to-End Async Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get your SOP, motivation letters, and embassy visa dossiers reviewed directly by winners of the DAAD, Chevening, and Erasmus Mundus awards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supervisor Fast-Track Demo Section */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to inspect the live system?</h3>
          <p className="text-xs text-slate-500 mb-6">
            Log in directly with our pre-seeded student and mentor profiles to test recommendations and bookings.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <span>Go to Login with Demo Accounts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-sm">ScholarSphere</span>
            <span className="text-[11px] text-slate-500">• University FYP Demo Project</span>
          </div>
          <p className="text-[11px]">
            Designed for university final year project examination. Simulated payments in demo mode.
          </p>
        </div>
      </footer>
    </div>
  );
}
