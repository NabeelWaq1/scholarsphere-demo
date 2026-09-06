import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, CheckCircle2, Video, ArrowRight, Sparkles } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';

export default function MentorCard({ mentor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition p-4 sm:p-5 flex flex-col justify-between space-y-4 group">
      <div>
        {/* Top Header: Avatar + Name + First session free badge */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <img
              src={getAvatarUrl(mentor)}
              alt={mentor.name}
              className="w-14 h-14 rounded-full border-2 border-indigo-100 bg-indigo-50 object-cover shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/mentors/${mentor.id}`}
                className="font-bold text-slate-900 text-base hover:text-indigo-600 hover:underline transition truncate block"
              >
                {mentor.name}
              </Link>
              {mentor.first_session_free && (
                <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>1st Call Free</span>
                </span>
              )}
            </div>

            <p className="text-xs text-indigo-700 font-semibold truncate flex items-center gap-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>{mentor.scholarship_they_hold}</span>
            </p>

            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {mentor.current_university}
            </p>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Categories Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {(mentor.service_categories || []).slice(0, 3).map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Stats & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-0.5 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              {Number(mentor.rating).toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400">({mentor.total_reviews} reviews)</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Services from <strong className="text-slate-800">${mentor.starting_price}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/mentors/${mentor.id}`}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm shadow-indigo-100 flex items-center gap-1 transition active:scale-95"
          >
            <span>Book / Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
