import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import UserAdminUI from './boundaries/UserAdminUI';
import HomeownerUI from './boundaries/HomeownerUI';
// Import Navbar component if it exists
// import Navbar from './boundaries/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [userProfile, setUserProfile] = useState('');
  // currentPage state is missing - add it
  const [currentPage, setCurrentPage] = useState('manage');

  const userAdminRef = useRef(null);
  const homeownerRef = useRef(null);
  const cleanerUiRef = useRef(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('user');
      const savedUserProfile = localStorage.getItem('userProfile');

      if (loggedInUser) {
        // Try to parse if it's JSON, if not use as is
        try {
          const parsedUser = JSON.parse(loggedInUser);
          if (parsedUser && parsedUser.username) {
            setIsAuthenticated(true);
            setUser(parsedUser);
            setUserProfile(savedUserProfile || parsedUser.profile);
          }
        } catch (e) {
          // If not JSON, use as a string
          setIsAuthenticated(true);
          setUser(loggedInUser);
          setUserProfile(savedUserProfile);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
    }

    // Define the global refresh function for components to call
    window.refreshActiveTab = () => {
      if (userAdminRef.current && typeof userAdminRef.current.refreshActiveTabData === 'function') {
        userAdminRef.current.refreshActiveTabData();
      }
      if (homeownerRef.current && typeof homeownerRef.current.refreshData === 'function') {
        homeownerRef.current.refreshData();
      }
      if (cleanerUiRef.current && typeof cleanerUiRef.current.refreshActiveTabData === 'function') {
        cleanerUiRef.current.refreshActiveTabData();
      }
    };

    // Cleanup
    return () => {
      delete window.refreshActiveTab;
    };
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

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
  switch (userProfile) {
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