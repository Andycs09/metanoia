import React, { useState, useEffect } from 'react';
import events from '../data/events';
import scheduleData from '../data/schedule.json';
import bgImage from '../assets/home page theme.png';
import './ScheduleUpdate.css';

export default function ScheduleUpdate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState(scheduleData.scheduleData);
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setMessage('Login successful!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Invalid password!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleScheduleUpdate = (eventId, field, value) => {
    setScheduleInfo(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    // For now, we'll just show a success message
    setMessage('Schedule updated successfully!');
    setTimeout(() => setMessage(''), 3000);
    
    // Update localStorage to persist changes during the session
    localStorage.setItem('scheduleData', JSON.stringify(scheduleInfo));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="schedule-update-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="schedule-update-overlay"></div>
        <div className="login-container">
          <div className="login-card">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button type="submit" className="login-btn">Login</button>
            </form>
            {message && <div className="message">{message}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-update-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="schedule-update-overlay"></div>
      <div className="schedule-update-container">
        <div className="schedule-update-card">
          <div className="header-section">
            <h2>Schedule Update Panel</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          
          {message && <div className="message success">{message}</div>}
          
          <div className="schedule-form">
            {events.map((event) => (
              <div key={event.id} className="event-form-group">
                <h3>{event.title}</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>Time:</label>
                    <input
                      type="text"
                      value={scheduleInfo[event.id]?.time || 'TBA'}
                      onChange={(e) => handleScheduleUpdate(event.id, 'time', e.target.value)}
                      placeholder="Enter event time"
                    />
                  </div>
                  <div className="form-field">
                    <label>Venue:</label>
                    <input
                      type="text"
                      value={scheduleInfo[event.id]?.venue || 'TBA'}
                      onChange={(e) => handleScheduleUpdate(event.id, 'venue', e.target.value)}
                      placeholder="Enter event venue"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}