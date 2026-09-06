import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import api from '../services/api';
import { Users, UserX, UserCheck, Search, Clock, Link as LinkIcon, Star, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConnectionsPage = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await api.get('/connections/mine');
                setConnections(response.data || []);
            } catch (error) {
                console.error("Failed to fetch connections:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConnections();
    }, []);

    const filteredConnections = connections.filter(conn => {
        if (filter === 'All') return true;
        return conn.status.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Connections</h1>
                    <p className="text-slate-600 mt-1">Manage your mentorship connections</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6 border border-slate-200">
                <div className="flex overflow-x-auto border-b border-slate-200">
                    {['All', 'Accepted', 'Pending'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                filter === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredConnections.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No connections found</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} connections yet. Browse mentors and start connecting!
                    </p>
                    <Link to="/mentors" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Find Mentors
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConnections.map((conn) => (
                        <div key={conn.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={getAvatarUrl(conn.mentor)}
                                            alt={conn.mentor.name}
                                            className="w-12 h-12 rounded-full border border-slate-200"
                                        />
                                        <div className="ml-3">
                                            <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{conn.mentor.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">{conn.mentor.headline}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        conn.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        conn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mt-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-slate-400" />
                                        <span className="line-clamp-1">{conn.mentor.current_university}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-slate-400" />
                                        <span className="line-clamp-1">{conn.mentor.scholarship_they_hold}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center text-sm text-slate-600">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                                    <span className="font-medium">{Number(conn.mentor.rating || 0).toFixed(1)}</span>
                                    <span className="ml-1 text-slate-400">({conn.mentor.total_reviews || 0})</span>
                                </div>
                                {conn.status === 'accepted' ? (
                                    <Link
                                        to={`/mentors/${conn.mentor.id}`}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Book Session
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/mentors/${conn.mentor.id}`}
                                        className="text-sm font-medium text-slate-500 hover:text-slate-700"
                                    >
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConnectionsPage;
