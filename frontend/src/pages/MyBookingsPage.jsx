import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Clock, CheckCircle2, DollarSign, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import api from '../services/api';

export default function MyBookingsPage() {
  const { isStudent } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/mine');
      setBookings(res.data || []);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">
              My Mentorship Service Bookings
            </h1>
            <p className="text-[11px] text-slate-500">
              Track SOP reviews, visa guidance dossiers, and mock interviews
            </p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
          title="Refresh bookings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading your service bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Services Booked Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Need an expert review on your motivation letter or visa documents? Explore services offered by verified scholars.
          </p>
          <Link
            to="/mentors"
            className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition"
          >
            Find a Mentor Service
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 hover:border-indigo-200 transition"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {booking.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {booking.delivery_time_days} days delivery
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{booking.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    {booking.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Paid: ${parseFloat(booking.amount_paid).toFixed(2)}</p>
                </div>
              </div>

              {/* Mentor details */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <img
                    src={getAvatarUrl(booking.mentor.avatar_seed, 'mentor')}
                    alt={booking.mentor.name}
                    className="w-9 h-9 rounded-full border border-slate-200 bg-indigo-50 object-cover"
                  />
                  <div>
                    <Link
                      to={`/mentors/${booking.mentor.id}`}
                      className="font-bold text-xs text-slate-900 hover:text-indigo-600 hover:underline"
                    >
                      {booking.mentor.name}
                    </Link>
                    <p className="text-[10px] text-slate-500">{booking.mentor.current_university}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  Booked on {new Date(booking.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Student notes if any */}
              {booking.notes && (
                <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Instructions: </span>
                  {booking.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
