import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';
import api from '../services/api';

const ConnectModal = ({ isOpen, onClose, mentor, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !mentor) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/connections/request', {
                mentor_id: mentor.id,
                message: message.trim()
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send connection request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Connect with Mentor</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <img 
                                src={getAvatarUrl(mentor)} 
                                alt={mentor.name} 
                                className="w-14 h-14 rounded-full border border-slate-200"
                            />
                            <div className="ml-4">
                                <h3 className="font-medium text-slate-900">{mentor.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{mentor.headline}</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                Add a personal note (optional)
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                maxLength={200}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                                placeholder={`Hi ${mentor.name.split(' ')[0]}, I'd love to connect with you to discuss your experience at ${mentor.current_university}...`}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <p className="mt-2 text-xs text-slate-500 text-right">
                                {message.length}/200 characters
                            </p>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConnectModal;
