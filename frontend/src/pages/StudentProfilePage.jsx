import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, MapPin, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';

export default function StudentProfilePage() {
  const { user, updateStudentProfile } = useAuth();
  const navigate = useNavigate();

  const profile = user?.student_profile;

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [countryOfOrigin, setCountryOfOrigin] = useState(user?.country_of_origin || 'Pakistan');
  const [university, setUniversity] = useState(profile?.university || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(profile?.field_of_study || 'Computer Science');
  const [degreeLevel, setDegreeLevel] = useState(profile?.degree_level || 'graduate');
  const [gpa, setGpa] = useState(profile?.gpa?.toString() || '3.5');
  const [budgetRange, setBudgetRange] = useState(profile?.budget_range || 'Fully funded only');
  const [preferredCountries, setPreferredCountries] = useState(
    Array.isArray(profile?.preferred_countries)
      ? profile.preferred_countries.join(', ')
      : 'Germany, Canada'
  );
  const [bio, setBio] = useState(profile?.bio || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update form if user loaded later
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHeadline(user.headline || '');
      setCountryOfOrigin(user.country_of_origin || 'Pakistan');
      if (user.student_profile) {
        setUniversity(user.student_profile.university || '');
        setFieldOfStudy(user.student_profile.field_of_study || 'Computer Science');
        setDegreeLevel(user.student_profile.degree_level || 'graduate');
        setGpa(user.student_profile.gpa?.toString() || '3.5');
        setBudgetRange(user.student_profile.budget_range || 'Fully funded only');
        setPreferredCountries(
          Array.isArray(user.student_profile.preferred_countries)
            ? user.student_profile.preferred_countries.join(', ')
            : 'Germany, Canada'
        );
        setBio(user.student_profile.bio || '');
      }
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateStudentProfile({
        name,
        headline,
        country_of_origin: countryOfOrigin,
        university,
        field_of_study: fieldOfStudy,
        degree_level: degreeLevel,
        gpa: parseFloat(gpa),
        budget_range: budgetRange,
        preferred_countries: preferredCountries.split(',').map((c) => c.trim()).filter(Boolean),
        bio
      });

      setSuccessMsg('Profile updated successfully! Match recommendations have been recomputed.');
    } catch (err) {
      console.error('Update profile error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Demo Moment Callout Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-100">
              Live Supervisor Demonstration Tip
            </h2>
            <p className="text-xs text-indigo-100 mt-0.5">
              Change your <strong>GPA</strong>, <strong>Field of Study</strong>, or <strong>Preferred Countries</strong> here, click Save, then jump back to Recommendations to show live real-time score updates!
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-3 py-1.5 bg-white text-indigo-700 font-bold text-xs rounded-lg shadow-sm hover:bg-indigo-50 transition whitespace-nowrap flex items-center gap-1"
        >
          <span>View Feed</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <img
            src={getAvatarUrl(user)}
            alt={user?.name}
            className="w-14 h-14 rounded-full border-2 border-indigo-200 bg-indigo-50 object-cover"
          />
          <div>
            <h1 className="font-bold text-slate-900 text-base">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.headline || 'Student Profile'}</p>
          </div>
        </div>

        {/* Profile Overview (LinkedIn Style) */}
        <div className="space-y-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">About</h2>
            <p className="text-xs text-slate-700 whitespace-pre-line">{user?.student_profile?.bio || 'No bio provided.'}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Education</h2>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">{user?.student_profile?.university || 'University not specified'}</h3>
                <p className="text-[11px] text-slate-600 capitalize">
                  {user?.student_profile?.field_of_study} • {user?.student_profile?.degree_level}
                </p>
                <p className="text-[10px] text-slate-400">Class of {user?.student_profile?.graduation_year || '2026'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Skills & Interests</h2>
            <div className="flex flex-wrap gap-1.5">
              {(user?.student_profile?.interests || ['Research', 'Leadership', 'Data Analysis']).map((tag, idx) => (
                <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country of Origin
              </label>
              <select
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none bg-white"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Egypt">Egypt</option>
                <option value="Philippines">Philippines</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Kenya">Kenya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              LinkedIn-Style Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Computer Science Student @ FAST-NUCES | Aspiring to study in Germany"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field of Study (Key Match Criterion +30)
              </label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none bg-white font-medium text-slate-800"
              >
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GPA (0.0-4.0) (+20)
              </label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="4.0"
                required
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-indigo-700 rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree Level (+15)
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none bg-white"
              >
                <option value="graduate">Graduate (Masters/PhD)</option>
                <option value="undergraduate">Undergraduate (BSc)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget Need (+10)
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none bg-white"
              >
                <option value="Fully funded only">Fully funded only</option>
                <option value="$0-5000">$0 - $5,000</option>
                <option value="$5000-15000">$5,000 - $15,000</option>
                <option value="$15000+">$15,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Destination Countries (+25 match bonus)
            </label>
            <input
              type="text"
              value={preferredCountries}
              onChange={(e) => setPreferredCountries(e.target.value)}
              placeholder="Germany, Canada, UK, USA, Turkey"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Enter comma-separated country names: Germany, UK, Canada, USA, Turkey, China, Australia, Netherlands, South Korea, UAE
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Bio & Goals
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
