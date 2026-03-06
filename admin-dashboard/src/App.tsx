import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CameraManagement from './pages/CameraManagement';
import SessionMonitor from './pages/SessionMonitor';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {user ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="cameras" element={<CameraManagement />} />
              <Route path="sessions" element={<SessionMonitor />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
