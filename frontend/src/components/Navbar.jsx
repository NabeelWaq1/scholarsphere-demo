import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Home,
  Award,
  Users,
  Video,
  Bookmark,
  Bell,
  LogOut,
  User,
  Settings,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import api from '../services/api';

export default function Navbar() {
  const { user, logout, isStudent, isMentor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications periodically or on mount
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications/mine');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error('Failed to mark notifications read:', e);
    }
  };

  const markSingleAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/recommendations';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/90 shadow-sm h-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 md:gap-5 flex-1 max-w-md">
          <Link to={user ? (isStudent ? '/dashboard' : '/mentor-dashboard') : '/'} className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none block">
                Scholar<span className="text-indigo-600">Sphere</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block mt-0.5">
                Alumni Mentorship & AI Discovery
              </span>
            </div>
          </Link>

          {/* Search bar (LinkedIn style) */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scholarships, countries, mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs text-slate-800 rounded-md border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </form>
        </div>

        {/* Center/Right: Navigation items (LinkedIn style) */}
        {user ? (
          <div className="flex items-center gap-1 sm:gap-4 md:gap-6">
            <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Home / Feed */}
              <Link
                to={isStudent ? '/dashboard' : '/mentor-dashboard'}
                className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                  isActive(isStudent ? '/dashboard' : '/mentor-dashboard')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Home className="w-5 h-5 mb-0.5" />
                <span className="hidden sm:inline text-[11px]">Home</span>
              </Link>

              {/* Scholarships */}
              <Link
                to="/scholarships"
                className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                  isActive('/scholarships')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-5 h-5 mb-0.5" />
                <span className="hidden sm:inline text-[11px]">Scholarships</span>
              </Link>

              {/* Mentors */}
              <Link
                to="/mentors"
                className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                  isActive('/mentors')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-5 h-5 mb-0.5" />
                <span className="hidden sm:inline text-[11px]">Mentors</span>
              </Link>

              {/* Live Sessions */}
              <Link
                to="/live-sessions"
                className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                  isActive('/live-sessions')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Video className="w-5 h-5 mb-0.5" />
                <span className="hidden sm:inline text-[11px]">Live Calls</span>
              </Link>

              {/* Bookings */}
              <Link
                to="/bookings"
                className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                  isActive('/bookings')
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-5 h-5 mb-0.5" />
                <span className="hidden sm:inline text-[11px]">Services</span>
              </Link>

              {/* Marketplace / Connections Dropdown (Student) */}
              {isStudent && (
                <div className="relative group">
                  <button className="flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition">
                    <span className="flex items-center gap-0.5 mb-0.5"><Layers className="w-5 h-5" /><ChevronDown className="w-3 h-3" /></span>
                    <span className="hidden sm:inline text-[11px]">Marketplace</span>
                  </button>
                  <div className="absolute top-full right-0 hidden group-hover:block w-40 bg-white border border-slate-200 shadow-xl rounded-lg py-1 mt-1 z-50">
                    <Link to="/mentors" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Find a Mentor</Link>
                    <Link to="/post-request" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Post a Request</Link>
                    <Link to="/my-requests" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">My Requests</Link>
                  </div>
                </div>
              )}

              {/* Connections (student only) */}
              {isStudent && (
                <Link
                  to="/connections"
                  className={`flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium transition border-b-2 ${
                    isActive('/connections')
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-5 h-5 mb-0.5" />
                  <span className="hidden sm:inline text-[11px]">Connections</span>
                </Link>
              )}

              {/* Marketplace Dropdown (Mentor) */}
              {isMentor && (
                <div className="relative group">
                  <button className="flex flex-col items-center justify-center px-2 py-1 min-w-[54px] text-xs font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition">
                    <span className="flex items-center gap-0.5 mb-0.5"><Layers className="w-5 h-5" /><ChevronDown className="w-3 h-3" /></span>
                    <span className="hidden sm:inline text-[11px]">Marketplace</span>
                  </button>
                  <div className="absolute top-full right-0 hidden group-hover:block w-40 bg-white border border-slate-200 shadow-xl rounded-lg py-1 mt-1 z-50">
                    <Link to="/browse-requests" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Browse Requests</Link>
                    <Link to="/my-applications" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">My Applications</Link>
                  </div>
                </div>
              )}
            </nav>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`flex flex-col items-center justify-center px-2 py-1 relative text-slate-500 hover:text-slate-800 transition ${
                  showNotifications ? 'text-indigo-600' : ''
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline text-[11px] font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markSingleAsRead(notif.id)}
                          className={`p-3 text-xs flex gap-2.5 items-start cursor-pointer hover:bg-slate-50 transition ${
                            !notif.is_read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-slate-700 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(notif.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <img
                  src={getAvatarUrl(user)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-indigo-200 bg-indigo-50 object-cover"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-indigo-200 bg-indigo-50"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.headline || user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    {isStudent && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>View Profile</span>
                        </Link>
                        <Link
                          to="/saved"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          <span>Saved Scholarships</span>
                        </Link>
                      </>
                    )}

                    {isMentor && (
                      <Link
                        to="/mentor-dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>Mentor Dashboard</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Demo Mode pill badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Demo Mode
            </div>
          </div>
        ) : (
          /* Logged out state */
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-200 transition"
            >
              Join Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
