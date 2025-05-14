import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import UserAdminUI from './boundaries/UserAdminUI';
import HomeownerUI from './boundaries/HomeownerUI';
// Import other UI components as needed

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [userProfile, setUserProfile] = useState('');
  
  const userAdminRef = useRef(null);
  const homeownerRef = useRef(null);
  // Add refs for other profile UIs if needed
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const savedUserProfile = localStorage.getItem('userProfile');
    
    if (loggedInUser) {
      setIsAuthenticated(true);
      setUser(loggedInUser);
      setUserProfile(savedUserProfile);
    }
  }, []);
  
  const handleLogin = (username, profile) => {
    setIsAuthenticated(true);
    setUser(username);
    setUserProfile(profile);
    
    // Store in localStorage for persistence
    localStorage.setItem('user', username);
    localStorage.setItem('userProfile', profile);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    setUserProfile('');
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <UserAdminUI 
        onLogin={handleLogin} 
        isAuthenticated={false}
      />
    );
  }

  // Render different UIs based on user profile
  switch(userProfile) {
    case 'Homeowner':
      return (
        <HomeownerUI 
          ref={homeownerRef}
          username={user}
          isAuthenticated={true}
          onLogout={handleLogout}
        />
      );
      
    case 'Cleaner':
      return (
        <div className="app-container">
          {/* Replace with CleanerUI component when available */}
          <div className="placeholder-ui">
            <h2>Cleaner Interface</h2>
            <p>Welcome {user} to your cleaner dashboard. This interface is under development.</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      );
      
    case 'Platform Manager':
      return (
        <div className="app-container">
          {/* Replace with PlatformManagerUI component when available */}
          <div className="placeholder-ui">
            <h2>Platform Manager Interface</h2>
            <p>Welcome {user} to your management dashboard. This interface is under development.</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      );
      
    case 'Admin':
    default:
      return (
        <UserAdminUI 
          ref={userAdminRef}
          username={user}
          isAuthenticated={true}
          onLogout={handleLogout}
        />
      );
  }
}

export default App;