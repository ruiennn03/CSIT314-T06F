import React, { Component } from 'react';
import renderingMethods from './HomeownerUI.render';
import '../HomeownerUI.css'; // Reuse existing styles

class HomeownerUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Default to browse cleaners tab
      activeTab: 'browseCleaners',
      
      // Cleaners data
      cleaners: [
        { id: 1, name: "Maria Garcia", rating: 4.8, price: "$25/hr", services: ["Regular Cleaning", "Deep Cleaning"], availability: "Mon-Fri" },
        { id: 2, name: "John Smith", rating: 4.5, price: "$22/hr", services: ["Regular Cleaning", "Move In/Out"], availability: "Weekends" },
        { id: 3, name: "Sophia Chen", rating: 4.9, price: "$28/hr", services: ["Deep Cleaning", "Office Cleaning"], availability: "24/7" }
      ],
      filteredCleaners: [],
      searchTerm: '',
      
      // Saved cleaners
      savedCleaners: [],
      
      // Bookings
      bookings: [
        { id: 101, cleaner: "Maria Garcia", service: "Regular Cleaning", date: "2023-08-15", time: "10:00 AM", status: "Confirmed" },
        { id: 102, cleaner: "John Smith", service: "Regular Cleaning", date: "2023-07-25", time: "2:00 PM", status: "Completed", rating: 4 },
        { id: 103, cleaner: "Sophia Chen", service: "Deep Cleaning", date: "2023-07-10", time: "9:00 AM", status: "Cancelled" }
      ],
      
      // UI state
      loading: false,
      message: null,
      error: null
    };
    
    // Bind rendering methods from the imported object to this instance
    for (const methodName in renderingMethods) {
      if (renderingMethods.hasOwnProperty(methodName)) {
        this[methodName] = renderingMethods[methodName].bind(this);
      }
    }
  }
  
  componentDidMount() {
    // Initialize filtered cleaners
    this.setState({
      filteredCleaners: this.state.cleaners
    });
  }
  
  // Method for navigation
  navigateTo = (tab) => {
    this.setState({ activeTab: tab });
  };
  
  // Method to refresh data
  refreshData = () => {
    // Simulate loading time
    this.setState({ loading: true });
    
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  };
  
  // Methods for browse cleaners
  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };
  
  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.searchCleaners();
  };
  
  searchCleaners = () => {
    const { searchTerm, cleaners } = this.state;
    
    if (!searchTerm.trim()) {
      this.setState({ filteredCleaners: cleaners });
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = cleaners.filter(
      cleaner => 
        cleaner.name.toLowerCase().includes(term) || 
        cleaner.services.some(service => service.toLowerCase().includes(term))
    );
    
    this.setState({ filteredCleaners: filtered });
  };
  
  // Save/unsave cleaner
  toggleSaveCleaner = (cleanerId) => {
    const { savedCleaners, cleaners } = this.state;
    
    // Check if already saved
    const isSaved = savedCleaners.some(cleaner => cleaner.id === cleanerId);
    
    if (isSaved) {
      // Remove from saved
      this.setState({
        savedCleaners: savedCleaners.filter(cleaner => cleaner.id !== cleanerId),
        message: {
          text: "Cleaner removed from saved list",
          type: "info"
        }
      });
    } else {
      // Add to saved
      const cleanerToSave = cleaners.find(cleaner => cleaner.id === cleanerId);
      
      if (cleanerToSave) {
        this.setState({
          savedCleaners: [...savedCleaners, cleanerToSave],
          message: {
            text: "Cleaner saved successfully",
            type: "success"
          }
        });
      }
    }
    
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };
  
  // Book cleaner
  bookCleaner = (cleanerId) => {
    const { cleaners } = this.state;
    const cleaner = cleaners.find(c => c.id === cleanerId);
    
    if (!cleaner) return;
    
    // Create a new booking
    const newBooking = {
      id: Date.now(), // Use timestamp as ID
      cleaner: cleaner.name,
      service: cleaner.services[0], // Default to first service
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: "10:00 AM",
      status: "Confirmed"
    };
    
    this.setState(prevState => ({
      bookings: [...prevState.bookings, newBooking],
      message: {
        text: `Booking with ${cleaner.name} confirmed for tomorrow at 10:00 AM`,
        type: "success"
      },
      activeTab: 'booked' // Switch to booked tab
    }));
    
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };
  
  // View booking details
  viewBookingDetails = (bookingId) => {
    const { bookings } = this.state;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    alert(`
      Booking Details:
      Cleaner: ${booking.cleaner}
      Service: ${booking.service}
      Date: ${booking.date}
      Time: ${booking.time}
      Status: ${booking.status}
    `);
  };
  
  // Cancel booking
  cancelBooking = (bookingId) => {
    const { bookings } = this.state;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    const confirmCancel = window.confirm(`Are you sure you want to cancel your booking with ${booking.cleaner}?`);
    
    if (confirmCancel) {
      const updatedBookings = bookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: "Cancelled" };
        }
        return b;
      });
      
      this.setState({
        bookings: updatedBookings,
        message: {
          text: "Booking cancelled successfully",
          type: "success"
        }
      });
      
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };
  
  // Rate booking
  rateBooking = (bookingId, rating) => {
    const { bookings } = this.state;
    
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, rating };
      }
      return b;
    });
    
    this.setState({
      bookings: updatedBookings,
      message: {
        text: `Thank you for rating this service!`,
        type: "success"
      }
    });
    
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };
  
  // Book again
  bookAgain = (bookingId) => {
    const { bookings } = this.state;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    // Create a new booking based on the previous one
    const newBooking = {
      id: Date.now(), // Use timestamp as ID
      cleaner: booking.cleaner,
      service: booking.service,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: booking.time,
      status: "Confirmed"
    };
    
    this.setState(prevState => ({
      bookings: [...prevState.bookings, newBooking],
      message: {
        text: `Booking with ${booking.cleaner} confirmed for tomorrow at ${booking.time}`,
        type: "success"
      },
      activeTab: 'booked' // Switch to booked tab
    }));
    
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };
  
  render() {
    // Use the renderHomeowner method from imported rendering methods
    return this.renderHomeowner();
  }
}

export default HomeownerUI;