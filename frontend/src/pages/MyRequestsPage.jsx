import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp, Check, CheckCircle } from 'lucide-react';

const MyRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReq, setExpandedReq] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/service-requests/mine');
            setRequests(res.data || []);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const toggleExpand = (id) => {
        if (expandedReq === id) setExpandedReq(null);
        else setExpandedReq(id);
    };

    const handleAcceptApp = async (reqId, appId) => {
        try {
            await api.post(`/service-requests/${reqId}/applications/${appId}/accept`);
            fetchRequests();
        } catch (error) {
            alert(error.response?.data?.message || 'Error accepting application');
        }
    };

    const handleMarkComplete = async (reqId) => {
        try {
            await api.post(`/service-requests/${reqId}/complete`);
            fetchRequests();
        } catch (error) {
            alert(error.response?.data?.message || 'Error marking complete');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'completed') return 'bg-slate-100 text-slate-800 border-slate-200';
        if (status === 'in_progress') return 'bg-blue-50 text-blue-700 border-blue-200';
        return 'bg-green-50 text-green-700 border-green-200';
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Service Requests</h1>
                    <p className="text-slate-600 mt-1">Manage your posted requests and mentor applications.</p>
                </div>
                <Link to="/requests/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" /> Post New Request
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-500 mb-4">You haven't posted any service requests yet.</p>
                    <Link to="/requests/new" className="text-indigo-600 font-medium hover:underline">Post your first request</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleExpand(req.id)}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold text-slate-900">{req.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(req.status)}`}>
                                                {req.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">Category: {req.category} | Budget: ${req.budget_min}-${req.budget_max} | Deadline: {new Date(req.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-medium text-slate-700">
                                            {req.applications?.length || 0} applications
                                        </div>
                                        {expandedReq === req.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                    </div>
                                </div>
                                {req.status === 'in_progress' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleMarkComplete(req.id); }} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Mark as Completed
                                    </button>
                                )}
                            </div>

                            {expandedReq === req.id && (
                                <div className="border-t border-slate-200 bg-slate-50 p-6">
                                    <h4 className="font-medium text-slate-900 mb-4">Applications ({req.applications?.length || 0})</h4>
                                    {req.applications?.length === 0 ? (
                                        <p className="text-sm text-slate-500">No applications yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {req.applications?.map(app => (
                                                <div key={app.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <img src={getAvatarUrl(app.mentor)} alt={app.mentor.name} className="w-10 h-10 rounded-full border border-slate-200 mr-3" />
                                                            <div>
                                                                <Link to={`/mentors/${app.mentor.id}`} className="text-sm font-semibold text-slate-900 hover:underline">{app.mentor.name}</Link>
                                                                <p className="text-xs text-slate-500">{app.mentor.headline}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">
                                                            "{app.message}"
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-between sm:w-1/4">
                                                        <div className="text-lg font-bold text-green-600">${app.proposed_price}</div>
                                                        <div className="mt-2 sm:mt-0">
                                                            {app.status === 'pending' && req.status === 'open' ? (
                                                                <button 
                                                                    onClick={() => handleAcceptApp(req.id, app.id)}
                                                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 flex items-center"
                                                                >
                                                                    <Check className="w-4 h-4 mr-1" /> Accept Offer
                                                                </button>
                                                            ) : (
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                                                                }`}>
                                                                    {app.status.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequestsPage;
