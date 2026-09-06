import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import { Clock, DollarSign, Calendar } from 'lucide-react';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await api.get('/service-requests/my-applications');
                setApplications(res.data || []);
            } catch (error) {
                console.error("Failed to fetch apps", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusStyle = (status) => {
        if (status === 'accepted') return 'bg-green-100 text-green-800 border-green-200';
        if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
                <p className="text-slate-600 mt-1">Track the service requests you've applied to.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : applications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-500">You haven't applied to any service requests yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map(app => (
                        <div key={app.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(app.status)}`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" /> {new Date(app.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <h3 className="text-base font-semibold text-slate-900 mb-1">{app.request.title}</h3>
                                <p className="text-sm text-indigo-600 mb-4">{app.request.category}</p>

                                <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-700 italic border border-slate-100">
                                    "{app.message}"
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={getAvatarUrl(app.request.student)} alt="Student" className="w-8 h-8 rounded-full border border-slate-200" />
                                    <span className="text-sm font-medium text-slate-700">{app.request.student.name}</span>
                                </div>
                                <div className="flex items-center text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    <DollarSign className="w-4 h-4" /> {app.proposed_price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;
