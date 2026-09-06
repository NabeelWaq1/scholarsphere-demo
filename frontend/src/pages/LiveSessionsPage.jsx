import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, CheckCircle2, AlertCircle, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import JoinCallModal from '../components/JoinCallModal';
import VideoCallRoom from '../components/VideoCallRoom';
import RecordingPlayerModal from '../components/RecordingPlayerModal';
import api from '../services/api';

export default function LiveSessionsPage() {
  const { isStudent, isMentor } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [selectedCallSession, setSelectedCallSession] = useState(null);
  const [activeVideoCall, setActiveVideoCall] = useState(null);
  const [selectedRecording, setSelectedRecording] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const endpoint = isStudent ? '/live-sessions/mine' : '/live-sessions/mentor-view';
      const res = await api.get(endpoint);
      setSessions(res.data || []);
    } catch (e) {
      console.error('Failed to load live sessions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [isStudent, isMentor]);

  const upcomingSessions = sessions.filter((s) => !s.is_past && s.status !== 'completed');
  const pastSessions = sessions.filter((s) => s.is_past || s.status === 'completed');

  if (activeVideoCall) {
    return (
      <VideoCallRoom
        session={activeVideoCall}
        onLeave={async () => {
          try {
            await api.post(`/live-sessions/${activeVideoCall.id}/complete`);
          } catch (e) {
            console.error('Failed to complete session', e);
          }
          setActiveVideoCall(null);
          fetchSessions();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">
                1:1 Live Video Mentorship Calls
              </h1>
              <p className="text-[11px] text-slate-500">
                Scheduled real-time sessions with verified alumni and scholars
              </p>
            </div>
          </div>

          <button
            onClick={fetchSessions}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
            title="Refresh sessions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-slate-100 pt-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'upcoming'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upcoming Calls ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'past'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Past / Completed ({pastSessions.length})
          </button>
        </div>
      </div>

      {/* Sessions Feed */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading your scheduled sessions...</p>
        </div>
      ) : activeTab === 'upcoming' ? (
        upcomingSessions.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <Video className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">No Upcoming Live Sessions</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't scheduled any live calls yet. Remember, your first session with any new mentor is 100% free!
            </p>
            {isStudent && (
              <Link
                to="/mentors"
                className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition"
              >
                Browse Mentors & Book First Free Call
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((session) => {
              const partner = isStudent ? session.mentor : session.student;
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 hover:border-indigo-200 transition"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{session.title}</h3>
                        {session.is_free_first_session ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            1st Call Free
                          </span>
                        ) : (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded-full">
                            Paid (${parseFloat(session.price).toFixed(2)})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Scheduled for {new Date(session.scheduled_datetime).toLocaleString()} ({session.duration_minutes} mins)
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      session.status === 'requested' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      session.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                      session.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      session.status === 'declined' ? 'bg-red-50 text-red-700 border border-red-200' :
                      session.status === 'cancelled' ? 'bg-gray-50 text-gray-700 border border-gray-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {session.status}
                    </span>
                  </div>

                  {/* Partner Details */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(partner)}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900">{partner.name}</p>
                        <p className="text-[11px] text-slate-500">{partner.current_university || partner.university}</p>
                        {partner.scholarship_they_hold && (
                          <p className="text-[10px] text-indigo-700 font-semibold">{partner.scholarship_they_hold}</p>
                        )}
                      </div>
                    </div>

                    {/* Join Call Button */}
                    {session.status === 'confirmed' && (
                      <button
                        onClick={() => setActiveVideoCall(session)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 flex items-center gap-1.5 transition active:scale-95"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Call</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Past Sessions Tab */
        pastSessions.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-xs text-slate-400">
            No completed past sessions yet.
          </div>
        ) : (
          <div className="space-y-3">
            {pastSessions.map((session) => {
              const partner = isStudent ? session.mentor : session.student;
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">{session.title}</h3>
                      <p className="text-[11px] text-slate-400">
                        Completed on {new Date(session.scheduled_datetime).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} • {session.duration_minutes} mins
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(partner)}
                      alt={partner.name}
                      className="w-9 h-9 rounded-full border border-slate-200 bg-indigo-50 object-cover"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{partner.name}</p>
                      <p className="text-[11px] text-slate-500">{partner.current_university || partner.university}</p>
                    </div>
                  </div>

                  {/* Meeting Notes left by mentor */}
                  {session.meeting_note && (
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mentor's Debrief & Action Items:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed italic">
                        "{session.meeting_note}"
                      </p>
                    </div>
                  )}

                  {session.recording_url && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRecording(session)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        Watch Recording
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modals */}
      <JoinCallModal
        isOpen={!!selectedCallSession}
        onClose={() => setSelectedCallSession(null)}
        session={selectedCallSession}
      />

      {selectedRecording && (
        <RecordingPlayerModal
          isOpen={true}
          onClose={() => setSelectedRecording(null)}
          session={selectedRecording}
        />
      )}
    </div>
  );
}
