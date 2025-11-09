import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UnoRegister.css';
import bgImage from '../assets/home page theme.png';

export default function UnoRegister() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    email: '',
    phone: '',
    registrationNo: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          class: formData.class,
          email: formData.email,
          phone: formData.phone,
          registrationNo: formData.registrationNo,
          timestamp: new Date().toISOString()
        })
      });

      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        setShowEnterButton(true);
      }, 1000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
      setIsSubmitted(true);
      setShowEnterButton(true);
    }
  };

  const handleEnterGame = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    setTimeout(() => {
      navigate('/game');
    }, 3000);
  };

  return (
    <div className="uno-register" style={{ backgroundImage: `url(${bgImage})` }}>
      <audio ref={audioRef} src="/assets/villain-entrance.mp3" />
      
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">Register for UNO Tournament</h1>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="register-form">
              <h3 className="participant-label">Participant 1</h3>
              
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input name-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="class"
                  placeholder="Class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="form-input class-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input email-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input phone-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="registrationNo"
                  placeholder="Registration No"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  required
                  className="form-input regno-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="success-container">
              <div className="success-message">
                <h2>Registration Successful!</h2>
                <p>Welcome, {formData.name}!</p>
                <p className="success-detail">Your registration has been confirmed.</p>
              </div>
              
              {showEnterButton && (
                <button className="btn-enter-game" onClick={handleEnterGame}>
                  🎮 Enter the Game
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
