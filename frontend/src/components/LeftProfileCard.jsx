import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Video, Layers, Sparkles, MapPin, GraduationCap, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';

export default function LeftProfileCard() {
  const { user, isStudent, isMentor } = useAuth();

  if (!user) return null;

  const studentProfile = user.student_profile;
  const mentorProfile = user.mentor_profile;

  return (
    <div className="space-y-3">
      {/* Main Profile Card (LinkedIn style) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover banner */}
        <div className="h-16 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Avatar overlapping banner */}
        <div className="px-4 pb-4 pt-0 relative">
          <div className="-mt-10 mb-2 flex justify-between items-end">
            <Link to={isStudent ? "/profile" : "/mentor-dashboard"} className="group relative">
              <img
                src={getAvatarUrl(user)}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-white bg-indigo-50 shadow-sm object-cover group-hover:opacity-95 transition"
              />
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {user.role}
            </span>
          </div>

          {/* User info */}
          <Link
            to={isStudent ? "/profile" : "/mentor-dashboard"}
            className="font-bold text-slate-900 text-sm hover:underline hover:text-indigo-600 transition block leading-snug"
          >
            {user.name}
          </Link>

          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {user.headline || `${user.role === 'student' ? 'Student' : 'Mentor'} on ScholarSphere`}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{user.country_of_origin}</span>
          </div>

          {/* About */}
          <div className="mt-3 text-xs text-slate-600 line-clamp-2">
            {user.student_profile?.bio || user.mentor_profile?.bio || 'No bio provided.'}
          </div>

          {/* Education */}
          <div className="mt-3 flex items-start gap-2 text-xs">
            <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                {isStudent ? user.student_profile?.current_university : user.mentor_profile?.current_university || 'University not specified'}
              </p>
              <p className="text-[11px] text-slate-500">
                {isStudent ? `${user.student_profile?.field_of_interest} • ${user.student_profile?.degree_level}` : user.mentor_profile?.scholarship_they_hold}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-3 flex flex-wrap gap-1">
            {(isStudent ? user.student_profile?.interests : user.mentor_profile?.service_categories)?.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Student Specific Badges */}
          {isStudent && studentProfile && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  GPA:
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Number(studentProfile.gpa).toFixed(2)} / 4.0
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Degree:</span>
                <span className="font-medium text-slate-700 capitalize">
                  {studentProfile.degree_level}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Target Budget:</span>
                <span className="font-medium text-slate-700">
                  {studentProfile.budget_range}
                </span>
              </div>
            </div>
          )}

          {/* Mentor Specific Badges */}
          {isMentor && mentorProfile && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Scholarship:</span>
                <span className="font-semibold text-indigo-700 text-right truncate max-w-[120px]" title={mentorProfile.scholarship_they_hold}>
                  {mentorProfile.scholarship_they_hold}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Rating:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  ★ {Number(mentorProfile.rating).toFixed(1)} ({mentorProfile.total_reviews})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row (LinkedIn Style) */}
        <div className="border-t border-slate-100 divide-y divide-slate-100 text-xs">
          {isStudent ? (
            <>
              <Link
                to="/saved"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-indigo-600">
                  <Bookmark className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  <span className="text-[11px] font-medium">Saved Scholarships</span>
                </div>
                <span className="font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {user.stats?.saved_scholarships_count || 0}
                </span>
              </Link>
              <Link
                to="/live-sessions"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-indigo-600">
                  <Video className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  <span className="text-[11px] font-medium">Live Sessions Booked</span>
                </div>
                <span className="font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {user.stats?.live_sessions_count || 0}
                </span>
              </Link>
              <Link
                to="/bookings"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-indigo-600">
                  <Layers className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  <span className="text-[11px] font-medium">Async Service Bookings</span>
                </div>
                <span className="font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {user.stats?.bookings_count || 0}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/mentor-dashboard"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition group"
              >
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-indigo-600">
                  Mentoring Sessions
                </span>
                <span className="font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {user.stats?.live_sessions_count || 0}
                </span>
              </Link>
              <Link
                to="/mentor-dashboard"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition group"
              >
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-indigo-600">
                  Services Offered
                </span>
                <span className="font-bold text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {user.stats?.services_count || 0}
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Edit profile shortcut */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/70">
          <Link
            to={isStudent ? "/profile" : "/mentor-dashboard"}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 py-1 rounded transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile & Preferences</span>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Card */}
      {isStudent && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-3 space-y-2 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Quick Discovery
          </p>
          <div className="space-y-0.5">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Recommendations</span>
            </Link>
            <Link
              to="/scholarships"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>Browse All Scholarships</span>
            </Link>
            <Link
              to="/mentors"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition"
            >
              <Video className="w-3.5 h-3.5 text-slate-500" />
              <span>Find Mentors & Live Calls</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
