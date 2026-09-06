import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, Star, Award, ShieldCheck } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';
import api from '../services/api';

export default function RightSuggestedCard() {
  const [topMentors, setTopMentors] = useState([]);
  const [closingSoonScholarships, setClosingSoonScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuggested() {
      try {
        const [mentorsRes, scholarshipsRes] = await Promise.all([
          api.get('/mentors'),
          api.get('/scholarships')
        ]);

        // Pick top 3-4 mentors
        const mentors = (mentorsRes.data || []).slice(0, 3);
        setTopMentors(mentors);

        // Pick 3 closing soon scholarships (< 30 days)
        const closingSoon = (scholarshipsRes.data || [])
          .filter((s) => s.is_closing_soon || (s.days_remaining > 0 && s.days_remaining <= 35))
          .slice(0, 3);
        setClosingSoonScholarships(closingSoon);
      } catch (e) {
        console.error('Failed to load suggestions:', e);
      } finally {
        setLoading(false);
      }
    }

    loadSuggested();
  }, []);

  return (
    <div className="space-y-3 text-xs">
      {/* Suggested Mentors Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-3.5">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Suggested Mentors</span>
          </div>
          <Link to="/mentors" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="py-6 text-center text-slate-400 text-[11px]">Loading mentors...</div>
        ) : (
          <div className="space-y-3">
            {topMentors.map((mentor) => (
              <div key={mentor.id} className="flex items-start gap-2.5 group">
                <img
                  src={getAvatarUrl(mentor)}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/mentors/${mentor.id}`}
                      className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 group-hover:underline truncate"
                    >
                      {mentor.name}
                    </Link>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate" title={mentor.headline}>
                    {mentor.scholarship_they_hold}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                      {Number(mentor.rating).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-600 font-medium truncate">
                      {mentor.current_university.split(' ')[0]}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Link
                      to={`/mentors/${mentor.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 px-2 py-0.5 rounded-full transition"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scholarships Closing Soon Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-3.5">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Closing Soon</span>
          </div>
          <Link to="/scholarships" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
            Browse
          </Link>
        </div>

        <div className="space-y-2.5">
          {closingSoonScholarships.map((s) => (
            <Link
              key={s.id}
              to={`/scholarships/${s.id}`}
              className="block p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                  {s.days_remaining}d left
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{s.country}</span>
              </div>
              <p className="font-semibold text-slate-800 text-[11px] group-hover:text-indigo-600 transition line-clamp-1">
                {s.title}
              </p>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{s.amount_description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Trust & Policy Footer Banner */}
      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Alumni Marketplace</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-500">
          First 1:1 strategy call is 100% free with any new mentor. All payments in demo mode are mock transactions.
        </p>
        <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
          <span>ScholarSphere © 2026</span>
          <span className="font-semibold text-indigo-600">Final Year Project Demo</span>
        </div>
      </div>
    </div>
  );
}
