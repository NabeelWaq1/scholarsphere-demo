import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Video,
  Star,
  Clock,
  CheckCircle2,
  DollarSign,
  FileText,
  User,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import JoinCallModal from '../components/JoinCallModal';
import api from '../services/api';

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions', 'bookings', 'services', 'connections'
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCallSession, setSelectedCallSession] = useState(null);

  // Meeting notes editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchMentorData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, bookingsRes, connectionsRes] = await Promise.all([
        api.get('/live-sessions/mentor-view'),
        api.get('/bookings/mentor-view'),
        api.get('/connections/mentor-view').catch(() => ({ data: [] }))
      ]);
      setSessions(sessionsRes.data || []);
      setBookings(bookingsRes.data || []);
      setConnections(connectionsRes.data || []);
    } catch (e) {
      console.error('Failed to load mentor dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const handleSessionAction = async (sessionId, action) => {
    try {
      await api.post(`/live-sessions/${sessionId}/${action}`);
      fetchMentorData();
    } catch (e) {
      console.error(`Failed to ${action} session:`, e);
      alert(`Failed to ${action} session.`);
    }
  };

  const handleConnectionAction = async (connId, action) => {
    try {
      await api.post(`/connections/${connId}/respond`, { action });
      fetchMentorData();
    } catch (e) {
      console.error(`Failed to ${action} connection:`, e);
      alert(`Failed to ${action} connection.`);
    }
  };

  const handleSaveNotes = async (sessionId) => {
    setSavingNote(true);
    try {
      await api.post(`/live-sessions/${sessionId}/notes`, { meeting_note: noteText });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, meeting_note: noteText, status: 'completed' } : s))
      );
      setEditingNoteId(null);
      setNoteText('');
    } catch (e) {
      console.error('Failed to save notes:', e);
      alert('Failed to save notes.');
    } finally {
      setSavingNote(false);
    }
  };

  const mentorProfile = user?.mentor_profile;

  return (
    <div className="space-y-4">
      {/* Mentor Profile Overview Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={getAvatarUrl(user)}
              alt={user?.name}
              className="w-14 h-14 rounded-full border-2 border-indigo-200 bg-indigo-50 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base">{user?.name}</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Mentor Portal
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                {mentorProfile?.scholarship_they_hold}
              </p>
              <p className="text-[11px] text-slate-500">
                {mentorProfile?.current_university} • {mentorProfile?.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/mentors/${user?.id}`}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200 transition"
            >
              Preview Public Profile
            </Link>
            <button
              onClick={fetchMentorData}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Sessions</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{sessions.length}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Async Bookings</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{bookings.length}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating</span>
            <span className="text-base font-black text-amber-600 mt-0.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              {Number(mentorProfile?.rating || 5.0).toFixed(1)}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Response Time</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{mentorProfile?.response_time_hours || 12}h</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex flex-wrap items-center gap-1 text-xs">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'sessions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'connections'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Connection Requests ({connections.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'bookings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Async Service Requests ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'services'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Services Catalog
        </button>
      </div>

      {/* Tab 1: Live Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
              No live call requests yet.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{s.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      {new Date(s.scheduled_datetime).toLocaleString()} • {s.duration_minutes} mins
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {s.is_free_first_session ? 'First Session Free' : `Paid ($${s.price})`}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAvatarUrl(s.student)}
                      alt={s.student?.name}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-indigo-50 object-cover"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{s.student?.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {s.student?.university} • GPA: {s.student?.gpa || 'N/A'} • {s.student?.field_of_study}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.status === 'requested' && (
                      <>
                        <button
                          onClick={() => handleSessionAction(s.id, 'approve')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSessionAction(s.id, 'decline')}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg transition"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {s.status === 'confirmed' && (
                      <button
                        onClick={() => setSelectedCallSession(s)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Start Call
                      </button>
                    )}
                    {(s.status === 'completed' || s.status === 'confirmed') && (
                      <button
                        onClick={() => {
                          setEditingNoteId(s.id);
                          setNoteText(s.meeting_note || '');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        {s.meeting_note ? 'Edit Notes' : 'Add Notes'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Meeting notes view / edit */}
                {editingNoteId === s.id ? (
                  <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Meeting Notes & Recommendations for {s.student?.name}:
                    </label>
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter advice, recommended universities, or SOP feedback discussed during the call..."
                      className="w-full p-2 text-xs border rounded-lg bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveNotes(s.id)}
                        disabled={savingNote}
                        className="px-3 py-1 bg-indigo-600 text-white font-semibold text-xs rounded-md"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-3 py-1 text-slate-500 text-xs hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : s.meeting_note ? (
                  <div className="bg-indigo-50/50 p-2.5 rounded-lg text-xs text-slate-700 border border-indigo-100">
                    <span className="font-bold text-indigo-900 text-[11px]">Saved Debrief: </span>
                    <span className="italic">{s.meeting_note}</span>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-3">
          {connections.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
              No connection requests yet.
            </div>
          ) : (
            connections.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={getAvatarUrl(c.student)} alt={c.student?.name} className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{c.student?.name}</h3>
                      <p className="text-[11px] text-slate-500">{c.student?.headline || c.student?.university}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${c.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {c.status}
                  </span>
                </div>
                {c.message && (
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 italic border border-slate-100">
                    "{c.message}"
                  </div>
                )}
                {c.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button onClick={() => handleConnectionAction(c.id, 'accepted')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition">
                      Accept
                    </button>
                    <button onClick={() => handleConnectionAction(c.id, 'declined')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Async Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
              No async service bookings received yet.
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {b.category}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 mt-1">{b.service_title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Paid: ${parseFloat(b.amount_paid).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
                  <img
                    src={getAvatarUrl(b.student)}
                    alt={b.student?.name}
                    className="w-7 h-7 rounded-full border border-slate-200 bg-indigo-50 object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-800">{b.student?.name}</span>
                    <span className="text-slate-400 ml-1">({b.student?.university})</span>
                  </div>
                </div>

                {b.notes && (
                  <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600">
                    <strong>Student Request:</strong> {b.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Services Catalog */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Active Mentorship Services
            </h3>
            <span className="text-xs text-slate-400">Fixed rate services</span>
          </div>

          <div className="space-y-3">
            {(mentorProfile?.services || [
              {
                id: 1,
                title: 'Comprehensive SOP & Motivation Letter Review',
                category: 'SOP review',
                price: 35.0,
                delivery_time_days: 3,
                description: 'Detailed critique of motivation letter tailored for target committee expectations.'
              },
              {
                id: 2,
                title: 'Embassy Student Visa & Blocked Account Guidance',
                category: 'Visa guidance',
                price: 25.0,
                delivery_time_days: 2,
                description: 'Step-by-step checklist, cover letter review, and embassy interview tips.'
              }
            ]).map((srv, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {srv.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{srv.delivery_time_days} days delivery</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{srv.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{srv.description}</p>
                </div>
                <span className="text-base font-black text-slate-900">${srv.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Call Simulation Modal */}
      <JoinCallModal
        isOpen={!!selectedCallSession}
        onClose={() => setSelectedCallSession(null)}
        session={selectedCallSession}
      />
    </div>
  );
}
