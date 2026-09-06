import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, BookOpen, Globe, Award, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [role, setRole] = useState('student'); // 'student' or 'mentor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('Pakistan');

  // Student fields
  const [university, setUniversity] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [degreeLevel, setDegreeLevel] = useState('graduate');
  const [gpa, setGpa] = useState('3.5');
  const [budgetRange, setBudgetRange] = useState('Fully funded only');
  const [preferredCountries, setPreferredCountries] = useState('Germany, Canada');

  // Mentor fields
  const [currentUniversity, setCurrentUniversity] = useState('');
  const [scholarshipTheyHold, setScholarshipTheyHold] = useState('DAAD Scholar');
  const [yearsMentoring, setYearsMentoring] = useState('2');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        country_of_origin: countryOfOrigin,
        ...(role === 'student'
          ? {
              university,
              field_of_study: fieldOfStudy,
              degree_level: degreeLevel,
              gpa: parseFloat(gpa),
              budget_range: budgetRange,
              preferred_countries: preferredCountries.split(',').map((c) => c.trim()).filter(Boolean)
            }
          : {
              current_university: currentUniversity,
              field_of_study: fieldOfStudy,
              scholarship_they_hold: scholarshipTheyHold,
              years_experience_mentoring: parseInt(yearsMentoring),
              bio
            })
      };

      const user = await signup(payload);
      if (user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Scholar<span className="text-indigo-600">Sphere</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* Role Toggle Selector */}
        <div className="bg-slate-200/80 p-1 rounded-xl grid grid-cols-2 gap-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              role === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 I am an Applicant / Student
          </button>
          <button
            type="button"
            onClick={() => setRole('mentor')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              role === 'mentor'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌟 I am an Alumni / Scholar Mentor
          </button>
        </div>

        <div className="bg-white py-6 px-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Core credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bilal Tariq"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Origin</label>
                <select
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
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

            {/* Role-Specific fields */}
            {role === 'student' ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Academic & Match Preferences
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current / Last University</label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. NUST Islamabad"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                    <select
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GPA (0-4.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.0"
                      max="4.0"
                      required
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Target</label>
                    <select
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
                    >
                      <option value="graduate">Graduate (Masters/PhD)</option>
                      <option value="undergraduate">Undergraduate (Bachelors)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Preference</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
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
                    Preferred Destination Countries (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={preferredCountries}
                    onChange={(e) => setPreferredCountries(e.target.value)}
                    placeholder="Germany, Canada, UK"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Mentor Scholar Profile
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">University Abroad</label>
                    <input
                      type="text"
                      required
                      value={currentUniversity}
                      onChange={(e) => setCurrentUniversity(e.target.value)}
                      placeholder="e.g. TU Munich"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Scholarship Held</label>
                    <input
                      type="text"
                      required
                      value={scholarshipTheyHold}
                      onChange={(e) => setScholarshipTheyHold(e.target.value)}
                      placeholder="e.g. DAAD Postgraduate Fellowship"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio / Mentorship Focus</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your scholarship experience and how you can help students..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create {role === 'student' ? 'Student' : 'Mentor'} Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
