import React, { useState, useEffect, useRef } from 'react';
import events from '../data/events';
import scheduleData from '../data/schedule.json';
import bgImage from '../assets/home page theme.png';
import './ScheduleUpdate.css';

export default function ScheduleUpdate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState(scheduleData.scheduleData);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState({});

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

  const handleImageUpload = async (eventId, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size should be less than 5MB');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(prev => ({ ...prev, [eventId]: true }));

    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        handleScheduleUpdate(eventId, 'image', base64Data);
        setUploading(prev => ({ ...prev, [eventId]: false }));
        setMessage(`Image uploaded for ${events.find(e => e.id === eventId)?.title}`);
        setTimeout(() => setMessage(''), 3000);
      };
      reader.onerror = () => {
        setUploading(prev => ({ ...prev, [eventId]: false }));
        setMessage('Failed to upload image');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(prev => ({ ...prev, [eventId]: false }));
      setMessage('Failed to upload image');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removeImage = (eventId) => {
    handleScheduleUpdate(eventId, 'image', '');
    setMessage(`Image removed for ${events.find(e => e.id === eventId)?.title}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    // For now, we'll just show a success message
    setMessage('Schedule and images updated successfully!');
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
                
                {/* Image Upload Section */}
                <div className="form-field image-upload-field">
                  <label>Event Image:</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(event.id, e.target.files[0])}
                      style={{ display: 'none' }}
                      id={`image-upload-${event.id}`}
                    />
                    
                    {!scheduleInfo[event.id]?.image ? (
                      <div className="upload-placeholder">
                        <label 
                          htmlFor={`image-upload-${event.id}`}
                          className={`upload-btn ${uploading[event.id] ? 'uploading' : ''}`}
                        >
                          {uploading[event.id] ? '📤 Uploading...' : '📷 Upload Event Image'}
                        </label>
                        <p className="upload-hint">Upload an image to display on the event detail page</p>
                      </div>
                    ) : (
                      <div className="image-preview">
                        <img 
                          src={scheduleInfo[event.id].image} 
                          alt={`${event.title} preview`}
                          className="preview-image"
                        />
                        <div className="image-actions">
                          <label 
                            htmlFor={`image-upload-${event.id}`}
                            className="change-btn"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage(event.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
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