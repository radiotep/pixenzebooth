import { HelmetProvider } from 'react-helmet-async';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AlertProvider } from './context/AlertContext';
import SocialNotification from './components/SocialNotification';
import AdminRoute from './components/AdminRoute';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Booth = lazy(() => import('./pages/Booth'));
const Result = lazy(() => import('./pages/Result'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const FrameManager = lazy(() => import('./pages/admin/FrameManager'));
const FrameEditor = lazy(() => import('./pages/admin/FrameEditor'));
const FrameCreator = lazy(() => import('./pages/FrameCreator'));
const FrameSelection = lazy(() => import('./pages/FrameSelection'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center font-titan text-white text-xl animate-pulse">
    Loading...
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <SocialNotification />
            <main id="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/select-frame" element={<FrameSelection />} />
                  <Route path="/booth" element={<Booth />} />
                  <Route path="/result" element={<Result />} />
                  <Route path="/create-frame" element={<FrameCreator />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Routes */}
                  <Route path="/admin/frames" element={
                    <AdminRoute>
                      <FrameManager />
                    </AdminRoute>
                  } />
                  <Route path="/admin/frames/new" element={
                    <AdminRoute>
                      <FrameEditor />
                    </AdminRoute>
                  } />
                  <Route path="/admin/frames/edit/:id" element={
                    <AdminRoute>
                      <FrameEditor />
                    </AdminRoute>
                  } />


                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </Router>
        </AuthProvider>
      </AlertProvider>
    </HelmetProvider>
  );
}

export default App;
