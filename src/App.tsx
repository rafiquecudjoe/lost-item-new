import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

type View = 'login' | 'register' | 'user-dashboard' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email: string, isAdmin: boolean) => {
    setUserEmail(email);
    setCurrentView(isAdmin ? 'admin-dashboard' : 'user-dashboard');
  };

  const handleRegister = (email: string) => {
    setUserEmail(email);
    setCurrentView('user-dashboard');
  };

  const handleLogout = () => {
    setUserEmail('');
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}
      {currentView === 'register' && (
        <Register
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'user-dashboard' && (
        <UserDashboard userEmail={userEmail} onLogout={handleLogout} />
      )}
      {currentView === 'admin-dashboard' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
