import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Calendar,
  Bookmark,
  Sparkles,
  MapPin,
  GraduationCap,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ScholarshipCard({ scholarship, onSaveToggle }) {
  const { isStudent, user } = useAuth();
  const [isSaved, setIsSaved] = useState(scholarship.is_saved || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStudent) return;

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/scholarships/${scholarship.id}/save`);
        setIsSaved(false);
      } else {
        await api.post(`/scholarships/${scholarship.id}/save`);
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle(scholarship.id, !isSaved);
    } catch (err) {
      console.error('Save toggle failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Badge coloring for match score
  const score = scholarship.match_score;
  let scoreBadgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
  if (score >= 80) {
    scoreBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200';
  } else if (score >= 60) {
    scoreBadgeClass = 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-200';
  }

  const isFullFunding = scholarship.funding_type?.toLowerCase() === 'full';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition p-4 sm:p-5 space-y-3 relative group">
      {/* Banner Image */}
      {scholarship.image_url && (
        <div className="-mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-3 rounded-t-xl overflow-hidden">
          <img 
            src={scholarship.image_url} 
            alt={scholarship.title}
            className="w-full h-32 object-cover"
          />
        </div>
      )}
      {/* Top row: Match score (if scored) & Save button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {score !== undefined && (
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${scoreBadgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{score}% Match</span>
              <span className="text-[10px] font-medium opacity-80 hidden sm:inline">
                ({scholarship.badge_text || 'Scored'})
              </span>
            </div>
          )}

          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isFullFunding ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
          }`}>
            {isFullFunding ? 'Full Funding (100%)' : 'Partial Grant'}
          </span>

          {scholarship.is_closing_soon && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {scholarship.days_remaining} days left
            </span>
          )}
        </div>

        {isStudent && (
          <button
            onClick={handleToggleSave}
            disabled={saving}
            title={isSaved ? 'Remove from saved' : 'Save scholarship'}
            className={`p-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'text-slate-400 border-transparent hover:border-slate-200 hover:text-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Title & Provider */}
      <div>
        <Link
          to={`/scholarships/${scholarship.id}`}
          className="font-bold text-slate-900 text-base hover:text-indigo-600 hover:underline leading-snug transition block"
        >
          {scholarship.title}
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">{scholarship.provider}</p>
      </div>

      {/* Rule-Based Match Reason Breakdown Banner (if available) */}
      {scholarship.match_reason && (
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-2.5 text-xs text-indigo-950">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-700 mb-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>AI Matching Reason</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {scholarship.match_reason}
          </p>
        </div>
      )}

      {/* Amount & Key Details */}
      <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 space-y-1.5">
        <div className="flex items-baseline gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800">{scholarship.amount_description}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{scholarship.country}</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-400" />
            <span>Min GPA: {scholarship.min_gpa_required?.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Tags & Action CTA */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(scholarship.tags || []).slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          to={`/scholarships/${scholarship.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
