import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import Booth from './pages/Booth';
import Result from './pages/Result';
import { isBackendAvailable } from './lib/supabase';

import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';

import FrameManager from './pages/admin/FrameManager';
import FrameEditor from './pages/admin/FrameEditor';
import FrameCreator from './pages/FrameCreator';
import FrameSelection from './pages/FrameSelection';
import SocialNotification from './components/SocialNotification';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SocialNotification />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
