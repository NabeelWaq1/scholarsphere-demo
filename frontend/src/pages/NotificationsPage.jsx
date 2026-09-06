import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/mine');
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  const markSingleRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">Notifications Center</h1>
            <p className="text-[11px] text-slate-500">
              Live updates regarding session confirmations, reminders, and reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded"
          >
            Mark all read
          </button>
          <button
            onClick={fetchNotifications}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No notifications on record.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markSingleRead(notif.id)}
              className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition ${
                !notif.is_read ? 'bg-indigo-50/40' : ''
              }`}
            >
              <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-indigo-600' : 'bg-transparent'}`} />
              <div className="flex-1">
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{notif.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
