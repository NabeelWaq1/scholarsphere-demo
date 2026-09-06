import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, RefreshCw, Award } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function SavedScholarshipsPage() {
  const { refreshUser } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships/saved');
      setSavedScholarships(res.data || []);
    } catch (e) {
      console.error('Failed to load saved scholarships:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = (id) => {
    setSavedScholarships((prev) => prev.filter((s) => s.id !== id));
    refreshUser();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">
              Saved Scholarships ({savedScholarships.length})
            </h1>
            <p className="text-[11px] text-slate-500">
              Scholarships bookmarked for your upcoming study abroad applications
            </p>
          </div>
        </div>

        <button
          onClick={fetchSaved}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
          title="Refresh saved list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading saved scholarships...</p>
        </div>
      ) : savedScholarships.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Saved Scholarships Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any scholarship card in your Recommendations or Browse page to pin it here.
          </p>
          <Link
            to="/scholarships"
            className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition"
          >
            Browse Scholarships
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={{ ...s, is_saved: true }}
              onSaveToggle={(id, isSaved) => {
                if (!isSaved) handleRemove(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
