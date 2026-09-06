import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RecommendationsFeed from './pages/RecommendationsFeed';
import BrowseScholarshipsPage from './pages/BrowseScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import MentorMarketplacePage from './pages/MentorMarketplacePage';
import MentorProfilePage from './pages/MentorProfilePage';
import LiveSessionsPage from './pages/LiveSessionsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SavedScholarshipsPage from './pages/SavedScholarshipsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import NotificationsPage from './pages/NotificationsPage';

import ConnectionsPage from './pages/ConnectionsPage';
import PostRequestPage from './pages/PostRequestPage';
import BrowseRequestsPage from './pages/BrowseRequestsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Loading ScholarSphere...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'} replace />;
  }

  return children;
};

// Route that redirects authenticated user to appropriate dashboard
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'} replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />

          {/* Student Dashboard / Recommendations Feed (LinkedIn 3-column feed) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <Layout>
                  <RecommendationsFeed />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute allowedRole="student">
                <Layout>
                  <RecommendationsFeed />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Scholarships Browse & Detail */}
          <Route
            path="/scholarships"
            element={
              <Layout>
                <BrowseScholarshipsPage />
              </Layout>
            }
          />
          <Route
            path="/scholarships/:id"
            element={
              <Layout>
                <ScholarshipDetailPage />
              </Layout>
            }
          />

          {/* Mentors Directory & Profile (LinkedIn style) */}
          <Route
            path="/mentors"
            element={
              <Layout>
                <MentorMarketplacePage />
              </Layout>
            }
          />
          <Route
            path="/mentors/:id"
            element={
              <Layout>
                <MentorProfilePage />
              </Layout>
            }
          />

          {/* Live Sessions Management */}
          <Route
            path="/live-sessions"
            element={
              <ProtectedRoute>
                <Layout>
                  <LiveSessionsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Async Service Bookings */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBookingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Saved Scholarships */}
          <Route
            path="/saved"
            element={
              <ProtectedRoute allowedRole="student">
                <Layout>
                  <SavedScholarshipsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Student Profile Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <Layout>
                  <StudentProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Notifications Page */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Mentor Portal Dashboard */}
          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedRoute allowedRole="mentor">
                <Layout showColumns={false}>
                  <MentorDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Connections */}
          <Route path="/connections" element={
            <ProtectedRoute allowedRole="student">
              <Layout><ConnectionsPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Marketplace - Student */}
          <Route path="/post-request" element={
            <ProtectedRoute allowedRole="student">
              <Layout><PostRequestPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-requests" element={
            <ProtectedRoute allowedRole="student">
              <Layout><MyRequestsPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Marketplace - Mentor */}
          <Route path="/browse-requests" element={
            <ProtectedRoute allowedRole="mentor">
              <Layout showColumns={false}><BrowseRequestsPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-applications" element={
            <ProtectedRoute allowedRole="mentor">
              <Layout showColumns={false}><MyApplicationsPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
