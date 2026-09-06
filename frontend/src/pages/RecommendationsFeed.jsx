import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, RefreshCw, AlertCircle, Award, CheckCircle2, ChevronRight, Edit3 } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RecommendationsFeed() {
  const { user, refreshUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState('all'); // 'all', 'high' (80+), 'good' (60+)
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      const res = await api.post('/scholarships/recommendations');
      setRecommendations(res.data || []);
      await refreshUser();
    } catch (e) {
      console.error('Failed to load recommendations:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const studentProfile = user?.student_profile;
  const preferredCountries = studentProfile?.preferred_countries || [];

  // Filter based on match tier
  const filteredList = recommendations.filter((item) => {
    if (filterTier === 'high') return item.match_score >= 80;
    if (filterTier === 'good') return item.match_score >= 60;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner: Student's Active Matching Parameters (LinkedIn Feed Header style) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">
                AI Recommendation Feed
              </h1>
              <p className="text-[11px] text-slate-500">
                Ranked 0–100% based on your academic profile and preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecommendations}
              disabled={refreshing}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition"
              title="Recalculate recommendations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Profile Criteria Chips */}
        {studentProfile && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium">Scoring criteria:</span>
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
              {studentProfile.field_of_study} (+30 max)
            </span>
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
              {Array.isArray(preferredCountries) ? preferredCountries.join(', ') : 'All Countries'} (+25 max)
            </span>
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
              GPA {Number(studentProfile.gpa).toFixed(2)} (+20 max)
            </span>
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md capitalize">
              {studentProfile.degree_level} (+15 max)
            </span>
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
              {studentProfile.budget_range} (+10 max)
            </span>
          </div>
        )}
      </div>

      {/* Filter Tier Tabs */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
              filterTier === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Ranked ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterTier('high')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition flex items-center gap-1 ${
              filterTier === 'high'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            High Match (80%+)
          </button>
          <button
            onClick={() => setFilterTier('good')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition flex items-center gap-1 ${
              filterTier === 'good'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Good Match (60%+)
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Showing {filteredList.length} results
        </span>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Computing rule-based recommendation scores...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No scholarships meet this filter tier</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching to "All Ranked" or adjust your profile criteria in your Profile settings.
          </p>
          <button
            onClick={() => setFilterTier('all')}
            className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onSaveToggle={() => refreshUser()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
