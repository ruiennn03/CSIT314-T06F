import React from 'react';

// This object holds all the rendering methods for HomeownerUI.
const renderingMethods = {
  // Render the homeowner navbar with your requested tabs
  renderHomeownerNavbar() {
    const { activeTab } = this.state;
    const { username } = this.props;
    
    return (
      <nav className="navbar homeowner-navbar">
        <ul className="navbar-nav">
          <li className={`nav-item ${activeTab === 'browseCleaners' ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => this.navigateTo('browseCleaners')}
            >
              Browse Cleaners
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => this.navigateTo('saved')}
            >
              Saved
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'booked' ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => this.navigateTo('booked')}
            >
              Booked
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => this.navigateTo('history')}
            >
              My History
            </button>
          </li>
        </ul>
        
        <div className="navbar-user">
          <span className="user-greeting">Welcome, {username}</span>
          <button className="logout-button" onClick={this.props.onLogout}>
            Logout
          </button>
        </div>
      </nav>
    );
  },
  
  // Render browse cleaners tab
  renderBrowseCleaners() {
    const { cleaners, filteredCleaners, searchTerm, loading, savedCleaners } = this.state;
    
    return (
      <div className="browse-cleaners-container">
        <h2 className="page-title">Browse Cleaners</h2>
        
        {/* Search form */}
        <form onSubmit={this.handleSearchSubmit} className="search-form">
          <div className="search-group">
            <input
              type="text"
              value={searchTerm}
              onChange={this.handleSearchChange}
              placeholder="Search by name or service..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
        
        {/* Cleaners list */}
        {loading ? (
          <div className="loading">Loading cleaners...</div>
        ) : filteredCleaners.length > 0 ? (
          <div className="cleaners-grid">
            {filteredCleaners.map(cleaner => {
              const isSaved = savedCleaners.some(saved => saved.id === cleaner.id);
              
              return (
                <div key={cleaner.id} className="cleaner-card">
                  <div className="cleaner-header">
                    <h3>{cleaner.name}</h3>
                    <button 
                      className={`save-button ${isSaved ? 'saved' : ''}`}
                      onClick={() => this.toggleSaveCleaner(cleaner.id)}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>
                  
                  <div className="cleaner-details">
                    <p><strong>Rating:</strong> {cleaner.rating}/5</p>
                    <p><strong>Price:</strong> {cleaner.price}</p>
                    <p><strong>Services:</strong> {cleaner.services.join(', ')}</p>
                    <p><strong>Availability:</strong> {cleaner.availability}</p>
                  </div>
                  
                  <button 
                    className="book-button"
                    onClick={() => this.bookCleaner(cleaner.id)}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">No cleaners found matching your search criteria</div>
        )}
      </div>
    );
  },
  
  // Render saved cleaners tab
  renderSavedCleaners() {
    const { savedCleaners, loading } = this.state;
    
    return (
      <div className="saved-cleaners-container">
        <h2 className="page-title">Saved Cleaners</h2>
        
        {loading ? (
          <div className="loading">Loading saved cleaners...</div>
        ) : savedCleaners.length > 0 ? (
          <div className="cleaners-grid">
            {savedCleaners.map(cleaner => (
              <div key={cleaner.id} className="cleaner-card">
                <div className="cleaner-header">
                  <h3>{cleaner.name}</h3>
                  <button 
                    className="save-button saved"
                    onClick={() => this.toggleSaveCleaner(cleaner.id)}
                  >
                    ★
                  </button>
                </div>
                
                <div className="cleaner-details">
                  <p><strong>Rating:</strong> {cleaner.rating}/5</p>
                  <p><strong>Price:</strong> {cleaner.price}</p>
                  <p><strong>Services:</strong> {cleaner.services.join(', ')}</p>
                  <p><strong>Availability:</strong> {cleaner.availability}</p>
                </div>
                
                <button 
                  className="book-button"
                  onClick={() => this.bookCleaner(cleaner.id)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">You haven't saved any cleaners yet</div>
        )}
      </div>
    );
  },
  
  // Render booked tab
  renderBookedCleanings() {
    const { bookings, loading } = this.state;
    // Filter for only upcoming bookings (Confirmed or Pending)
    const upcomingBookings = bookings.filter(b => 
      b.status === 'Confirmed' || b.status === 'Pending'
    );
    
    return (
      <div className="booked-cleanings-container">
        <h2 className="page-title">Booked Cleanings</h2>
        
        {loading ? (
          <div className="loading">Loading your bookings...</div>
        ) : upcomingBookings.length > 0 ? (
          <div className="bookings-list">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.service}</h3>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="booking-details">
                  <p><strong>Cleaner:</strong> {booking.cleaner}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                </div>
                
                <div className="booking-actions">
                  <button 
                    className="view-details-button"
                    onClick={() => this.viewBookingDetails(booking.id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => this.cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">You don't have any upcoming bookings</div>
        )}
      </div>
    );
  },
  
  // Render history tab
  renderCleaningHistory() {
    const { bookings, loading } = this.state;
    // Filter for only completed or canceled bookings
    const historyBookings = bookings.filter(b => 
      b.status === 'Completed' || b.status === 'Cancelled'
    );
    
    return (
      <div className="cleaning-history-container">
        <h2 className="page-title">Cleaning History</h2>
        
        {loading ? (
          <div className="loading">Loading your cleaning history...</div>
        ) : historyBookings.length > 0 ? (
          <div className="history-list">
            {historyBookings.map(booking => (
              <div key={booking.id} className="history-card">
                <div className="history-header">
                  <h3>{booking.service}</h3>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="history-details">
                  <p><strong>Cleaner:</strong> {booking.cleaner}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                </div>
                
                {booking.status === 'Completed' && (
                  <div className="rating-container">
                    <p><strong>Your Rating:</strong></p>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star}
                          className={`star ${booking.rating >= star ? 'filled' : ''}`}
                          onClick={() => this.rateBooking(booking.id, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {booking.status === 'Completed' && (
                  <button 
                    className="book-again-button"
                    onClick={() => this.bookAgain(booking.id)}
                  >
                    Book Again
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">You don't have any cleaning history yet</div>
        )}
      </div>
    );
  },
  
  // Main render method for the homeowner UI
  renderHomeowner() {
    const { message, activeTab } = this.state;
    
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Homeowner Dashboard</h1>
        </header>
        
        {/* Homeowner navbar */}
        {this.renderHomeownerNavbar()}
        
        <main className="app-content">
          <div className="homeowner-ui-container">
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            {/* Render the appropriate tab content */}
            {activeTab === 'browseCleaners' && this.renderBrowseCleaners()}
            {activeTab === 'saved' && this.renderSavedCleaners()}
            {activeTab === 'booked' && this.renderBookedCleanings()}
            {activeTab === 'history' && this.renderCleaningHistory()}
          </div>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} CleanConnect</p>
        </footer>
      </div>
    );
  }
};

export default renderingMethods;