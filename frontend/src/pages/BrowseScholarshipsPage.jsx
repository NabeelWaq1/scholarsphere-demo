import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Award, RefreshCw, Clock, X } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function BrowseScholarshipsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [country, setCountry] = useState('All');
  const [field, setField] = useState('All');
  const [degreeLevel, setDegreeLevel] = useState('All');
  const [fundingType, setFundingType] = useState('All');

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (country !== 'All') params.country = country;
      if (field !== 'All') params.field = field;
      if (degreeLevel !== 'All') params.degree_level = degreeLevel;
      if (fundingType !== 'All') params.funding_type = fundingType;

      const res = await api.get('/scholarships', { params });
      setScholarships(res.data || []);
    } catch (e) {
      console.error('Failed to load scholarships:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [country, field, degreeLevel, fundingType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScholarships();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountry('All');
    setField('All');
    setDegreeLevel('All');
    setFundingType('All');
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">
                Explore All Scholarships
              </h1>
              <p className="text-[11px] text-slate-500">
                Browse our verified catalog of 40 prestigious international scholarships
              </p>
            </div>
          </div>

          <button
            onClick={fetchScholarships}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, university, provider, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-20 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 rounded-lg border border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white font-semibold text-xs rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Country */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Country
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
              <option value="Turkey">Turkey</option>
              <option value="China">China</option>
              <option value="Australia">Australia</option>
              <option value="Netherlands">Netherlands</option>
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

          {/* Degree Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Degree Level
            </label>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
            >
              <option value="All">All Levels</option>
              <option value="graduate">Graduate (Masters/PhD)</option>
              <option value="undergraduate">Undergraduate</option>
            </select>
          </div>

          {/* Funding Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Funding Type
            </label>
            <select
              value={fundingType}
              onChange={(e) => setFundingType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-700"
            >
              <option value="All">All Funding</option>
              <option value="full">Full Funding (100%)</option>
              <option value="partial">Partial Funding</option>
            </select>
          </div>
        </div>

        {/* Active filter count & reset */}
        {(country !== 'All' || field !== 'All' || degreeLevel !== 'All' || fundingType !== 'All' || search) && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Filtered results ({scholarships.length})</span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Scholarships List */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading scholarships...</p>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <Award className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No scholarships match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse the full catalog.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onSaveToggle={() => refreshUser()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
