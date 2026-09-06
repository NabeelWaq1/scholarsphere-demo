import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  Users,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, refreshUser } = useAuth();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await api.get(`/scholarships/${id}`);
        setScholarship(res.data);
        setIsSaved(res.data.is_saved);
      } catch (e) {
        console.error('Failed to load scholarship detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleToggleSave = async () => {
    if (!isStudent) return;
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/scholarships/${id}/save`);
        setIsSaved(false);
      } else {
        await api.post(`/scholarships/${id}/save`);
        setIsSaved(true);
      }
      await refreshUser();
    } catch (e) {
      console.error('Failed to toggle save:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDocCheck = (index) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-xs text-slate-500">
        Loading scholarship details...
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Scholarship Not Found</h2>
        <p className="text-xs text-slate-500">The scholarship you are looking for does not exist.</p>
        <Link to="/scholarships" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Browse
        </Link>
      </div>
    );
  }

  // GPA comparison
  const studentGpa = user?.student_profile?.gpa;
  const minGpa = scholarship.min_gpa_required;
  const meetsGpa = studentGpa ? studentGpa >= minGpa : true;

  const isFullFunding = scholarship.funding_type?.toLowerCase() === 'full';

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition mb-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {scholarship.image_url && (
          <div className="w-full h-48 sm:h-56 bg-slate-100 overflow-hidden">
            <img 
              src={scholarship.image_url}
              alt={scholarship.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Header Ribbon */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isFullFunding
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {isFullFunding ? '100% Fully Funded' : 'Partial Grant'}
              </span>

              {scholarship.is_closing_soon && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Closing Soon ({scholarship.days_remaining}d)
                </span>
              )}
            </div>

            {isStudent && (
              <button
                onClick={handleToggleSave}
                disabled={saving}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isSaved
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                <span>{isSaved ? 'Saved to Profile' : 'Save Scholarship'}</span>
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {scholarship.title}
          </h1>
          <p className="text-xs font-medium text-indigo-700 mt-1">
            Offered by: {scholarship.provider}
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Country</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {scholarship.country}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Level</span>
              <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                {scholarship.degree_level}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Minimum GPA</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {scholarship.min_gpa_required?.toFixed(2)} / 4.0
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Deadline</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {new Date(scholarship.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* GPA Comparison Alert Box (Key supervisor check) */}
        {isStudent && user?.student_profile && (
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Your Academic Eligibility Audit
            </h3>
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              meetsGpa
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              {meetsGpa ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {meetsGpa ? 'GPA Requirement Satisfied' : 'GPA Caution'}
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border">
                    Your GPA: {studentGpa.toFixed(2)} vs Min: {minGpa.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-700 leading-relaxed">
                  {meetsGpa
                    ? `Great job! Your current GPA of ${studentGpa.toFixed(2)} meets or exceeds the minimum eligibility threshold of ${minGpa.toFixed(2)} required by ${scholarship.provider}.`
                    : `Your current profile GPA (${studentGpa.toFixed(2)}) is below the recommended minimum of ${minGpa.toFixed(2)}. Some programs grant waivers for outstanding research or GRE scores.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full Overview & Funding */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Coverage & Financial Package
            </h2>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
              <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">{scholarship.amount_description}</p>
                <p className="text-[11px] text-emerald-800/80 mt-1">
                  Covers official degree enrollment at state or partner institutions with official visa certification support.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Program Description & Scope
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {scholarship.description}
            </p>
          </div>

          {/* Interactive Required Documents Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Required Application Documents Checklist
              </h2>
              <span className="text-[11px] text-slate-400">
                Click to track your readiness
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200/80 space-y-1">
              {(scholarship.required_documents || []).map((doc, idx) => (
                <label
                  key={idx}
                  onClick={() => handleToggleDocCheck(idx)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer select-none group"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[idx]}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className={`text-xs transition ${
                    checkedDocs[idx]
                      ? 'line-through text-slate-400 font-normal'
                      : 'text-slate-800 font-medium group-hover:text-indigo-600'
                  }`}>
                    {doc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Find Mentors for this Scholarship CTA */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-indigo-950">
                Need guidance applying for {scholarship.country}?
              </h4>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Connect with alumni mentors who have successfully won this scholarship.
              </p>
            </div>
            <Link
              to={`/mentors?country=${encodeURIComponent(scholarship.country)}`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition whitespace-nowrap"
            >
              Browse Mentors for {scholarship.country}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
