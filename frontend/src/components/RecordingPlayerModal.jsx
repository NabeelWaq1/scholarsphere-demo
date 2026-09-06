import React from 'react';
import { X, Play, Clock, Calendar } from 'lucide-react';

const RecordingPlayerModal = ({ isOpen, onClose, recording, session }) => {
    if (!isOpen || !recording) return null;

    const otherUser = session?.mentor || session?.student || { name: 'Demo User' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Session Recording with {otherUser.name}</h2>
                        <div className="flex items-center text-xs text-slate-500 mt-1 gap-4">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(recording.created_at || Date.now()).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recording.duration_minutes || 0} mins</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 bg-black relative flex items-center justify-center min-h-[300px]">
                    {recording.video_url ? (
                        <video 
                            src={recording.video_url} 
                            controls 
                            poster={recording.thumbnail_url}
                            className="w-full max-h-[70vh] object-contain"
                        />
                    ) : (
                        <div className="text-center text-slate-400 p-12">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <Play className="w-8 h-8 text-slate-500" />
                            </div>
                            <p>Demo Recording Video Preview</p>
                            <p className="text-xs mt-2 text-slate-500">Video source URL not available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordingPlayerModal;
