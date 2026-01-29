import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import events from '../data/events';
import eventDetailsData from '../data/eventDetails.json';
import scheduleDataFile from '../data/schedule.json';
import './EventDetail.css';
import bgImage from '../assets/home page theme.png';
import { getEventLogo } from '../utils/eventLogos';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  const eventDetails = eventDetailsData[id];
  const [scheduleData, setScheduleData] = useState(scheduleDataFile.scheduleData);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if there's updated schedule data in localStorage (including images)
    const savedScheduleData = localStorage.getItem('scheduleData');
    if (savedScheduleData) {
      setScheduleData(JSON.parse(savedScheduleData));
    }
  }, [id]);

  if (!event || !eventDetails) {
    return (
      <div className="event-detail-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="event-detail-container">
          <h2 style={{ color: '#fff', textAlign: 'center' }}>Event not found</h2>
          <Link to="/events" className="back-button">← Back to Events</Link>
        </div>
      </div>
    );
  }

  // Get image URL - prioritize uploaded image from schedule data
  const getImageUrl = (imagePath) => {
    // Check if there's an uploaded image for this event
    const uploadedImage = scheduleData[event.id]?.image;
    if (uploadedImage) return uploadedImage;

    // Fallback to original logic
    if (!imagePath) return bgImage;
    if (imagePath.startsWith('/')) return imagePath;
    try {
      return new URL(`../../images/${imagePath}`, import.meta.url).href;
    } catch {
      return imagePath;
    }
  };

  return (
    <div className="event-detail-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="event-detail-container">
        {/* Back Button */}
        <Link to="/events" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Hero Section */}
        <div className="event-hero">
          {/* Image Section */}
          <div className="event-image-section">
            <img src={scheduleData[event.id]?.image || getEventLogo(event.id, bgImage)} alt={eventDetails.title} />
            <div className="event-badge">Featured Event</div>
          </div>

          {/* Info Section */}
          <div className="event-info-section">
            <h1 className="event-title">{eventDetails.title}</h1>
            <h2 className="event-subtitle">{eventDetails.subtitle}</h2>
            <p className="event-short-desc">{eventDetails.description}</p>

            {/* Quick Info */}
            <div className="event-quick-info">
              <div className="info-card">
                <div className="info-card-label">Team Size</div>
                <div className="info-card-value">
                  {eventDetails.teamSize.min === eventDetails.teamSize.max
                    ? `${eventDetails.teamSize.min} ${eventDetails.teamSize.min === 1 ? 'Person' : 'People'}`
                    : `${eventDetails.teamSize.min}-${eventDetails.teamSize.max} People`
                  }
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Duration</div>
                <div className="info-card-value">{eventDetails.duration}</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Venue</div>
                <div className="info-card-value">{eventDetails.venue}</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Date</div>
                <div className="info-card-value">{eventDetails.date}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="event-cta-buttons">
              {event.registrationClosed ? (
                <div className="cta-btn disabled">
                  Registration Closed
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <Link to={`/register?event=${encodeURIComponent(event.id)}`} className="cta-btn primary">
                  Register Now
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              <Link to="/schedule" className="cta-btn secondary">
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="event-details-section">
          <h2 className="section-heading">About This Event</h2>
          <p className="event-description">{eventDetails.aboutEvent}</p>

          {/* Long Description */}
          <div className="event-long-description">
            <p>{eventDetails.longDescription}</p>
          </div>

          {/* Special sections for Wild Prompt Lab */}
          {eventDetails.rounds && (
            <div className="event-rounds-section">
              <h3 className="subsection-heading">🔁 Event Rounds ({eventDetails.rounds.total} Rounds)</h3>

              <div className="round-card">
                <h4>🧠 {eventDetails.rounds.round1.name} ({eventDetails.rounds.round1.duration})</h4>
                <p>{eventDetails.rounds.round1.description}</p>
              </div>

              <div className="round-card">
                <h4>⚡ {eventDetails.rounds.round2.name}</h4>
                <p>{eventDetails.rounds.round2.description}</p>
              </div>
            </div>
          )}

          {/* Event Flow */}
          {eventDetails.eventFlow && (
            <div className="event-flow-section">
              <h3 className="subsection-heading">📋 Event Flow</h3>

              <div className="flow-round">
                <h4>Round 1: {eventDetails.rounds.round1.name}</h4>
                <ol className="flow-steps">
                  {eventDetails.eventFlow.round1.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flow-round">
                <h4>Round 2: {eventDetails.rounds.round2.name}</h4>
                <ol className="flow-steps">
                  {eventDetails.eventFlow.round2.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Judging Criteria */}
          {eventDetails.judging && (
            <div className="judging-section">
              <h3 className="subsection-heading">🏆 Judging Criteria</h3>
              <ul className="judging-list">
                {eventDetails.judging.criteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div className="event-requirements">
          <h2 className="section-heading">🛠 Requirements</h2>
          <ul className="requirements-list">
            {eventDetails.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>

        {/* Rules Section */}
        <div className="event-rules">
          <h2 className="section-heading">📜 Rules & Guidelines</h2>
          <ul className="rules-list">
            {eventDetails.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Prizes Section */}
        {eventDetails.prizes && (
          <div className="event-prizes">
            <h2 className="section-heading">🏆 Prizes</h2>
            <div className="prizes-grid">
              <div className="prize-card first">
                <div className="prize-position">🥇 1st Place</div>
                <div className="prize-amount">{eventDetails.prizes.first}</div>
              </div>
              <div className="prize-card second">
                <div className="prize-position">🥈 2nd Place</div>
                <div className="prize-amount">{eventDetails.prizes.second}</div>
              </div>
              <div className="prize-card third">
                <div className="prize-position">🥉 3rd Place</div>
                <div className="prize-amount">{eventDetails.prizes.third}</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {eventDetails.contactInfo && (
          <div className="event-contact">
            <h2 className="section-heading">📞 Contact Information</h2>
            <div className="contact-info">
              <p><strong>Coordinator:</strong> {eventDetails.contactInfo.coordinator}</p>
              <p><strong>Email:</strong> <a href={`mailto:${eventDetails.contactInfo.email}`}>{eventDetails.contactInfo.email}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${eventDetails.contactInfo.phone}`}>{eventDetails.contactInfo.phone}</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
