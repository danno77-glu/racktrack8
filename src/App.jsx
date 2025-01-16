import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { AuthProvider } from './contexts/AuthContext';
    import { SettingsProvider } from './contexts/SettingsContext';
    import Nav from './components/Nav';
    import AuditForm from './components/AuditForm';
    import AuditList from './components/AuditList';
    import AuditView from './components/AuditView';
    import TemplateEditor from './components/TemplateEditor';
    import Settings from './components/Settings';
    import LoginForm from './components/Auth/LoginForm';
    import SignupForm from './components/Auth/SignupForm';
    import PrivateRoute from './components/Auth/PrivateRoute';
    import CustomerList from './components/CustomerList';
    import ScheduledAudits from './components/ScheduledAudits';
    import AuditorDashboard from './components/AuditorDashboard';
    import './styles/global.css';

    const App = () => {
      return (
        <AuthProvider>
          <SettingsProvider>
            <Router>
              <Nav />
              <div className="container">
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <AuditorDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/audits" element={
                    <PrivateRoute>
                      <AuditList />
                    </PrivateRoute>
                  } />
                  <Route path="/audits/:id" element={
                    <PrivateRoute>
                      <AuditView />
                    </PrivateRoute>
                  } />
                  <Route path="/templates" element={
                    <PrivateRoute>
                      <TemplateEditor />
                    </PrivateRoute>
                  } />
                  <Route path="/settings" element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } />
                  <Route path="/customers" element={
                    <PrivateRoute>
                      <CustomerList />
                    </PrivateRoute>
                  } />
                  <Route path="/scheduled-audits" element={
                    <PrivateRoute>
                      <ScheduledAudits />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <AuditorDashboard />
                    </PrivateRoute>
                  } />
                  {/* Add catch-all route for 404s */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </SettingsProvider>
        </AuthProvider>
      );
    };

    export default App;


 
