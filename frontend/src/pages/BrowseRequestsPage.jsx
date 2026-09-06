import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import { Search, Filter, Clock, DollarSign, CheckCircle } from 'lucide-react';

const CATEGORIES = [
    'All Categories', 'SOP review', 'Visa guidance', 'Interview prep', 
    'Recommendation letter help', 'University shortlisting', 
    'Scholarship application review', 'IELTS-TOEFL coaching', 'Other'
];

const BrowseRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All Categories');
    const [sort, setSort] = useState('Newest');
    const [applyingTo, setApplyingTo] = useState(null);
    const [applyForm, setApplyForm] = useState({ proposed_price: '', message: '' });
    const [applyLoading, setApplyLoading] = useState(false);
    const [appliedSet, setAppliedSet] = useState(new Set());

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/service-requests');
            setRequests(res.data || []);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplySubmit = async (e, reqId) => {
        e.preventDefault();
        setApplyLoading(true);
        try {
            await api.post(`/service-requests/${reqId}/apply`, {
                proposed_price: Number(applyForm.proposed_price),
                message: applyForm.message
            });
            setAppliedSet(new Set([...appliedSet, reqId]));
            setApplyingTo(null);
            setApplyForm({ proposed_price: '', message: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplyLoading(false);
        }
    };

    let filtered = requests.filter(r => category === 'All Categories' || r.category === category);
    
    if (sort === 'Newest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === 'Budget: High to Low') {
        filtered.sort((a, b) => b.budget_max - a.budget_max);
    } else if (sort === 'Budget: Low to High') {
        filtered.sort((a, b) => a.budget_min - b.budget_min);
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Browse Service Requests</h1>
                <p className="text-slate-600 mt-1">Find students who need your expertise and offer your services.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm font-medium text-slate-600">Sort by:</span>
                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        {['Newest', 'Budget: High to Low', 'Budget: Low to High'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-500">No open requests found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(req => (
                        <div key={req.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <img src={getAvatarUrl(req.student)} alt={req.student.name} className="w-12 h-12 rounded-full border border-slate-200" />
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-slate-900">{req.student.name}</h3>
                                            <p className="text-xs text-slate-500">{req.student.headline || 'Student'}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {req.category}
                                    </span>
                                </div>
                                
                                <h2 className="text-lg font-semibold text-slate-900 mb-2">{req.title}</h2>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-3">{req.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1 font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                        <DollarSign className="w-4 h-4" />
                                        ${req.budget_min} - ${req.budget_max}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Deadline: {new Date(req.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                                        {req.applications_count || 0} applications
                                    </div>
                                </div>

                                {appliedSet.has(req.id) ? (
                                    <div className="mt-4 flex items-center text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-100">
                                        <CheckCircle className="w-5 h-5 mr-2" /> Application Submitted
                                    </div>
                                ) : applyingTo === req.id ? (
                                    <form onSubmit={(e) => handleApplySubmit(e, req.id)} className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Submit your proposal</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-medium text-slate-700 mb-1">Proposed Price ($)</label>
                                                <input 
                                                    type="number" required min="1"
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={applyForm.proposed_price}
                                                    onChange={e => setApplyForm({...applyForm, proposed_price: e.target.value})}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-700 mb-1">Message to student</label>
                                                <textarea 
                                                    required rows="2"
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                                    placeholder="Why should they choose you?"
                                                    value={applyForm.message}
                                                    onChange={e => setApplyForm({...applyForm, message: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setApplyingTo(null)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
                                            <button type="submit" disabled={applyLoading} className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                                                {applyLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
                                                Submit Proposal
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button 
                                        onClick={() => setApplyingTo(req.id)}
                                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Apply for this Request
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseRequestsPage;
