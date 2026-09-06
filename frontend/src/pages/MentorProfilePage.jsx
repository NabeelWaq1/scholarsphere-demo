import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  Calendar,
  Clock,
  Star,
  MapPin,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Video,
  Layers,
  ArrowRight,
  MessageSquare,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import FakeCheckoutModal from '../components/FakeCheckoutModal';
import ConnectModal from '../components/ConnectModal';
import api from '../services/api';

export default function MentorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, refreshUser } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live session eligibility state
  const [eligibility, setEligibility] = useState({
    is_free_first_session: true,
    price: 0.0,
    previous_sessions_count: 0
  });

  const [connectionStatus, setConnectionStatus] = useState('none');
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Live session booking form state
  const [sessionDate, setSessionDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(16, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [duration, setDuration] = useState(30); // 30 or 60
  const [bookingLiveSession, setBookingLiveSession] = useState(false);
  const [liveSessionSuccess, setLiveSessionSuccess] = useState(null);

  // Fake Checkout modal state for paid live session or async service
  const [checkoutModal, setCheckoutModal] = useState({
    isOpen: false,
    itemTitle: '',
    amount: 0,
    relatedType: 'live_session',
    relatedId: null,
    onSuccessCallback: null
  });

  // Fetch mentor profile and eligibility
  const loadMentorData = async () => {
    try {
      const res = await api.get(`/mentors/${id}`);
      setMentor(res.data);

      if (isStudent) {
        const eligRes = await api.get(`/mentors/${id}/live-sessions/eligibility`);
        setEligibility(eligRes.data);
        const connRes = await api.get(`/connections/status/${id}`);
        setConnectionStatus(connRes.data.status || 'none');
      }
    } catch (e) {
      console.error('Failed to load mentor:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorData();
  }, [id, isStudent]);

  // Handle Book Live Session (Enforces First-Free vs Paid rule)
  const handleBookLiveSession = async (e) => {
    e.preventDefault();
    if (!isStudent) {
      alert('Please log in with a student account to book sessions.');
      return;
    }

    const isFree = eligibility.is_free_first_session;

    if (isFree) {
      // 100% FREE first session! Skip payment entirely!
      setBookingLiveSession(true);
      try {
        const res = await api.post('/live-sessions', {
          mentor_id: mentor.id,
          scheduled_datetime: sessionDate,
          duration_minutes: duration,
          title: `Free 1:1 Application Strategy Call (${duration}m)`
        });

        setLiveSessionSuccess({
          isFree: true,
          title: res.data.session?.title,
          datetime: res.data.session?.scheduled_datetime
        });
        await refreshUser();
        // Update eligibility now that a session was created
        setEligibility((prev) => ({
          ...prev,
          is_free_first_session: false,
          previous_sessions_count: prev.previous_sessions_count + 1
        }));
      } catch (err) {
        console.error('Free session booking failed:', err);
        alert(err.response?.data?.error || 'Failed to schedule free session.');
      } finally {
        setBookingLiveSession(false);
      }
    } else {
      // Subsequent session: Requires Fake Checkout first!
      const price = duration === 60 ? 35.0 : 25.0;

      setCheckoutModal({
        isOpen: true,
        itemTitle: `1:1 Live Mentorship Call (${duration}m) with ${mentor.name}`,
        amount: price,
        relatedType: 'live_session',
        relatedId: mentor.id,
        onSuccessCallback: async (paymentData) => {
          setCheckoutModal((prev) => ({ ...prev, isOpen: false }));
          setBookingLiveSession(true);
          try {
            const res = await api.post('/live-sessions', {
              mentor_id: mentor.id,
              scheduled_datetime: sessionDate,
              duration_minutes: duration,
              title: `1:1 Live Strategy Call (${duration}m)`,
              payment_id: paymentData.payment_id
            });

            setLiveSessionSuccess({
              isFree: false,
              amount: price,
              title: res.data.session?.title,
              datetime: res.data.session?.scheduled_datetime
            });
            await refreshUser();
          } catch (err) {
            console.error('Paid session booking failed:', err);
            alert(err.response?.data?.error || 'Failed to complete session booking.');
          } finally {
            setBookingLiveSession(false);
          }
        }
      });
    }
  };

  // Handle Book Async Service (e.g. SOP Review)
  const handleBookService = (service) => {
    if (!isStudent) {
      alert('Please log in with a student account to book services.');
      return;
    }

    setCheckoutModal({
      isOpen: true,
      itemTitle: `${service.title} (${service.category}) by ${mentor.name}`,
      amount: service.price,
      relatedType: 'service_booking',
      relatedId: service.id,
      onSuccessCallback: async (paymentData) => {
        try {
          await api.post('/bookings', {
            service_id: service.id,
            notes: 'Requested from mentor profile page.',
            payment_id: paymentData.payment_id
          });
          setCheckoutModal((prev) => ({ ...prev, isOpen: false }));
          await refreshUser();
          navigate('/bookings');
        } catch (err) {
          console.error('Service booking failed:', err);
          alert(err.response?.data?.error || 'Failed to book service.');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center text-xs text-slate-500">
        Loading mentor profile...
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Mentor Not Found</h2>
        <Link to="/mentors" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Mentors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. LinkedIn-style Profile Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Banner (Clean gradient) */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-800 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Header content with overlapping avatar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="-mt-16 sm:-mt-20 mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="relative">
              <img
                src={getAvatarUrl(mentor)}
                alt={mentor.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-indigo-50 shadow-md object-cover"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Online / Active Mentor"></span>
            </div>

            {/* Quick stats badge */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-right">
                <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{Number(mentor.rating).toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-slate-400">{mentor.total_reviews} student reviews</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-right">
                <span className="font-bold text-slate-800 text-xs">{mentor.response_time_hours}h</span>
                <p className="text-[10px] text-slate-400">Response time</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {mentor.name}
              </h1>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Verified Scholar
              </span>
            </div>

            <p className="text-sm font-semibold text-indigo-700 mt-1">
              {mentor.scholarship_they_hold}
            </p>

            <p className="text-xs text-slate-600 mt-0.5">
              {mentor.headline || `${mentor.current_university} • ${mentor.country}`}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {mentor.country}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {mentor.current_university}
              </span>
              <span>•</span>
              <span>{mentor.years_experience_mentoring} yrs mentoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      {isStudent && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {connectionStatus === 'accepted' ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4"/> Connected with {mentor.name}
              </span>
            ) : (
              <span>Connect with {mentor.name} to book sessions and services.</span>
            )}
          </div>
          <div>
            {connectionStatus === 'none' && (
              <button onClick={() => setConnectModalOpen(true)} className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition">
                Connect
              </button>
            )}
            {connectionStatus === 'pending' && (
              <button disabled className="px-4 py-1.5 bg-amber-100 text-amber-700 font-bold text-xs rounded-lg">
                Connection Pending
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. About Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          About
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
          {mentor.bio}
        </p>
        <div className="pt-2 flex flex-wrap gap-1.5">
          {(mentor.service_categories || []).map((cat, idx) => (
            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Scholarship & Education Section (LinkedIn Experience style) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Scholarship & Education
        </h2>

        <div className="space-y-4 divide-y divide-slate-100">
          {/* Current University */}
          <div className="flex items-start gap-3 pt-1">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xs text-slate-900">
                {mentor.current_university}
              </h3>
              <p className="text-[11px] text-slate-600 capitalize">
                {mentor.degree_level} in {mentor.field_of_study}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Location: {mentor.country}</p>
              <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">Scholarship: {mentor.scholarship_they_hold}</p>
            </div>
          </div>
          {/* Home University */}
          <div className="flex items-start gap-3 pt-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xs text-slate-900">
                Home University
              </h3>
              <p className="text-[11px] text-slate-600 capitalize">
                Bachelors Degree
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Location: {mentor.country_of_origin}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Book a Live Session CTA Box (Key business rule test) */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-indigo-800 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Book a 1:1 Live Strategy Call
              </h2>
            </div>
            <p className="text-xs text-indigo-200">
              Direct video consultation with {mentor.name} on university shortlisting, SOPs, and interviews.
            </p>
          </div>

          {/* Eligibility Badge */}
          {eligibility.is_free_first_session ? (
            <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1st Session FREE ($0.00)</span>
            </div>
          ) : (
            <div className="bg-indigo-500/20 border border-indigo-400 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
              Standard Rate (${duration === 60 ? '35.00' : '25.00'})
            </div>
          )}
        </div>

        {liveSessionSuccess ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-4 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">Session Confirmed!</h4>
            <p className="text-xs text-emerald-200">
              Your {liveSessionSuccess.isFree ? 'FREE ' : ''}session "{liveSessionSuccess.title}" with {mentor.name} has been scheduled for {new Date(liveSessionSuccess.datetime).toLocaleString()}.
            </p>
            <div className="pt-2">
              <Link
                to="/live-sessions"
                className="inline-block px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
              >
                Go to Live Calls Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookLiveSession} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-indigo-200 mb-1">
                  Choose Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-indigo-200 mb-1">
                  Call Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-indigo-400 outline-none"
                >
                  <option value={30}>
                    30 Minutes {eligibility.is_free_first_session ? '(FREE)' : '($25.00)'}
                  </option>
                  <option value={60}>
                    60 Minutes {eligibility.is_free_first_session ? '(FREE)' : '($35.00)'}
                  </option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-indigo-900/80">
              <span className="text-xs text-indigo-300">
                {eligibility.is_free_first_session ? (
                  <>🎉 Your first session with this mentor is <strong>100% Free</strong>. No credit card required.</>
                ) : (
                  <>💳 You have previously completed {eligibility.previous_sessions_count} session(s) with {mentor.name}. Subsequent calls require payment.</>
                )}
              </span>

              <button
                type="submit"
                disabled={bookingLiveSession || (isStudent && connectionStatus !== 'accepted')}
                title={(isStudent && connectionStatus !== 'accepted') ? 'Connect first to book a session' : ''}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-70 whitespace-nowrap"
              >
                {bookingLiveSession
                  ? 'Scheduling...'
                  : eligibility.is_free_first_session
                  ? 'Book Free Session Now'
                  : `Pay & Confirm Session ($${duration === 60 ? '35.00' : '25.00'})`}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 5. Async Mentorship Services List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Mentorship Services Offered
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Written document audits & reviews</span>
        </div>

        <div className="space-y-3 pt-1">
          {(mentor.services || []).map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {service.category}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {service.delivery_time_days} days delivery
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{service.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center sm:flex-col items-end gap-2 flex-shrink-0 w-full sm:w-auto justify-between">
                <span className="text-base font-black text-slate-900">
                  ${parseFloat(service.price).toFixed(2)}
                </span>
                <button
                  disabled={isStudent && connectionStatus !== 'accepted'}
                  title={(isStudent && connectionStatus !== 'accepted') ? 'Connect first to book a service' : ''}
                  onClick={() => handleBookService(service)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition active:scale-95 whitespace-nowrap disabled:opacity-50"
                >
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Reviews & Recommendations Section (LinkedIn style) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recommendations & Student Reviews
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            {Number(mentor.rating).toFixed(1)} / 5.0
          </span>
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          {(mentor.reviews || []).length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No reviews recorded yet.</p>
          ) : (
            mentor.reviews.map((rev) => (
              <div key={rev.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {rev.student_name[0]}
                    </div>
                    <span className="font-bold text-xs text-slate-900">{rev.student_name}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic pl-9 leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-slate-400 pl-9 block">
                  {new Date(rev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fake Checkout Modal */}
      <FakeCheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={() => setCheckoutModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={(paymentData) => {
          if (checkoutModal.onSuccessCallback) {
            checkoutModal.onSuccessCallback(paymentData);
          }
        }}
        itemTitle={checkoutModal.itemTitle}
        amount={checkoutModal.amount}
        relatedType={checkoutModal.relatedType}
        relatedId={checkoutModal.relatedId}
      />
      
      {/* Connect Modal */}
      {isStudent && (
        <ConnectModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          mentor={mentor}
          onSuccess={() => {
            setConnectModalOpen(false);
            setConnectionStatus('pending');
          }}
        />
      )}
    </div>
  );
}
