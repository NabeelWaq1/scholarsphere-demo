import React from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Sparkles, X } from 'lucide-react';

export default function JoinCallModal({ isOpen, onClose, session }) {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Call Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-xs tracking-wide uppercase text-slate-300">
              Live Session Call Room
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Canvas */}
        <div className="p-6 text-center space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl"></div>

            <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-3 ring-4 ring-indigo-500/10">
              <Video className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {session.title || '1:1 Mentorship Call'}
            </h3>
            <p className="text-xs text-slate-400">
              With {session.mentor?.name || session.student?.name || 'Mentor'} • {session.duration_minutes || 30} mins
            </p>

            {/* Supervisor Demo Notice Pill */}
            <div className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-[11px] text-indigo-200 flex items-center gap-2 max-w-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>This would launch the video call in the full version — demo only.</span>
            </div>
          </div>

          {/* Fake Call Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => alert('Mute/Unmute microphone simulated.')}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition"
              title="Microphone"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert('Camera toggle simulated.')}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition"
              title="Camera"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg shadow-red-900/40"
              title="End / Exit Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950/60 p-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
          Scheduled Datetime: {new Date(session.scheduled_datetime).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
