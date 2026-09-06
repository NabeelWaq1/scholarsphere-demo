import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Search, RefreshCw, X, Sparkles, Filter } from 'lucide-react';
import MentorCard from '../components/MentorCard';
import api from '../services/api';

export default function MentorMarketplacePage() {
  const [searchParams] = useSearchParams();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [country, setCountry] = useState(searchParams.get('country') || 'All');
  const [field, setField] = useState('All');

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (country !== 'All') params.country = country;
      if (field !== 'All') params.field_of_study = field;

      const res = await api.get('/mentors', { params });
      setMentors(res.data || []);
    } catch (e) {
      console.error('Failed to load mentors:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [category, country, field]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCountry('All');
    setField('All');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">
                Alumni & Scholar Mentors
              </h1>
              <p className="text-[11px] text-slate-500">
                Connect with 50+ award winners from TU Munich, Toronto, Oxford, LSE & more
              </p>
            </div>
          </div>

          <button
            onClick={fetchMentors}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
            title="Refresh mentors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mentor by name, university, scholarship, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-20 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 rounded-lg border border-slate-200 focus:border-indigo-600 focus:outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white font-semibold text-xs rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Service Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
            >
              <option value="All">All Services</option>
              <option value="SOP review">SOP review</option>
              <option value="Visa guidance">Visa guidance</option>
              <option value="Interview prep">Interview prep</option>
              <option value="Recommendation letter help">Recommendation letter help</option>
              <option value="University shortlisting">University shortlisting</option>
              <option value="Scholarship application review">Scholarship application review</option>
            </select>
          </div>

          {/* Mentor Country */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Host Country Abroad
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
            >
              <option value="All">All Countries</option>
              <option value="Germany">Germany</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="USA">United States</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Singapore">Singapore</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Australia">Australia</option>
              <option value="Turkey">Turkey</option>
              <option value="South Korea">South Korea</option>
              <option value="UAE">UAE</option>
            </select>
          </div>

          {/* Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Field of Study
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
            >
              <option value="All">All Fields</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Medicine">Medicine</option>
              <option value="Public Health">Public Health</option>
              <option value="Law">Law</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>
        </div>

        {/* Free Call Promo Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>First Call Free:</strong> Your initial 1:1 strategy session with any new mentor is automatically 100% free!
            </span>
          </div>
        </div>

        {/* Active filter count & reset */}
        {(category !== 'All' || country !== 'All' || field !== 'All' || search) && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Filtered mentors ({mentors.length})</span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading mentors...</p>
        </div>
      ) : mentors.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No mentors match your selected filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a broader category or reset your search to explore all mentors.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      )}
    </div>
  );
}
