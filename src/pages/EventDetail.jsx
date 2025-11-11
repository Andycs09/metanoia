import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import events from '../data/events';
import './EventDetail.css';
import bgImage from '../assets/home page theme.png';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!event) {
    return (
      <div className="event-detail-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="event-detail-container">
          <h2 style={{ color: '#fff', textAlign: 'center' }}>Event not found</h2>
          <Link to="/events" className="back-button">← Back to Events</Link>
        </div>
      </div>
    );
  }

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('/')) return imagePath;
    try {
      return new URL(`../../images/${imagePath}`, import.meta.url).href;
    } catch {
      return imagePath;
    }
  };

  // Event-specific data
  const eventData = {
    'treasure-hunt': {
      fullDescription: 'Embark on an exciting adventure through campus as you search for hidden UNO treasures! This team-based treasure hunt combines physical challenges with UNO-themed clues and puzzles. Work together with your team to decode riddles, solve challenges, and be the first to find all the treasures.',
      rules: [
        'Teams of 2 participants required',
        'All clues must be solved in sequence',
        'No use of external help or internet during the hunt',
        'Teams must stay together at all times',
        'First team to complete all challenges wins'
      ],
      prizes: { first: '₹5,000', second: '₹3,000', third: '₹2,000' },
      duration: '2 hours',
      venue: 'Campus Wide'
    },
    'uno-tournament': {
      fullDescription: 'Battle it out in the ultimate UNO Tournament! Compete against the best players in knockout-style matches. Master your strategy, use your special cards wisely, and prove you\'re the UNO champion. Fast-paced, exciting, and full of surprises!',
      rules: [
        'Maximum 4 players per team',
        'Standard UNO rules apply',
        'Knockout format - single elimination',
        'Time limit of 15 minutes per match',
        'Winner determined by points or first to finish'
      ],
      prizes: { first: '₹8,000', second: '₹5,000', third: '₹3,000' },
      duration: '3 hours',
      venue: 'Main Auditorium'
    },
    'card-art': {
      fullDescription: 'Unleash your creativity and design custom UNO cards! This solo competition challenges you to create original, artistic UNO card designs. Whether digital or hand-drawn, show us your unique vision and artistic skills. The most creative and well-executed designs win!',
      rules: [
        'Individual participation only',
        'Submit original artwork - no plagiarism',
        'Can be digital or hand-drawn',
        'Must follow UNO card dimensions',
        'Presentation and explanation required'
      ],
      prizes: { first: '₹6,000', second: '₹4,000', third: '₹2,500' },
      duration: '1.5 hours',
      venue: 'Art Studio'
    },
    'relay-race': {
      fullDescription: 'Get ready for an action-packed relay race combining physical challenges with UNO-themed puzzles! Teams of 3 will race through various stations, completing both athletic and mental challenges. Speed, teamwork, and strategy are key to victory!',
      rules: [
        'Teams of 3 participants required',
        'All team members must complete their leg',
        'Challenges must be completed before moving forward',
        'No skipping stations',
        'Fastest team with all challenges completed wins'
      ],
      prizes: { first: '₹7,000', second: '₹4,500', third: '₹2,500' },
      duration: '2.5 hours',
      venue: 'Sports Complex'
    },
    'trivia': {
      fullDescription: 'Test your UNO knowledge in this fast-paced trivia competition! Answer rapid-fire questions about UNO history, rules, strategies, and fun facts. Perfect for UNO enthusiasts who know the game inside and out. Quick thinking and deep knowledge will lead you to victory!',
      rules: [
        'Teams of 2 participants',
        'Multiple choice and rapid-fire rounds',
        'No use of phones or external resources',
        '30 seconds per question',
        'Highest score wins'
      ],
      prizes: { first: '₹5,000', second: '₹3,000', third: '₹1,500' },
      duration: '1 hour',
      venue: 'Quiz Hall'
    },
    'puzzle': {
      fullDescription: 'Challenge your mind with sequential UNO-themed puzzles! Teams will solve a series of increasingly difficult puzzles, riddles, and brain teasers. From logic puzzles to pattern recognition, this event tests your problem-solving skills to the limit!',
      rules: [
        'Teams of up to 4 participants',
        'Puzzles must be solved in order',
        'Limited hints available',
        'No external help allowed',
        'First team to solve all puzzles wins'
      ],
      prizes: { first: '₹6,500', second: '₹4,000', third: '₹2,000' },
      duration: '2 hours',
      venue: 'Conference Room'
    },
    'music': {
      fullDescription: 'Showcase your musical talent in UNO Beats! Whether you\'re a DJ, singer, or instrumentalist, this is your stage. Perform UNO-themed music, remixes, or original compositions. Judges will evaluate creativity, technical skill, and audience engagement!',
      rules: [
        'Teams of up to 2 participants',
        'Performance time: 5-8 minutes',
        'Must include UNO theme elements',
        'Own equipment preferred',
        'Judged on creativity, skill, and presentation'
      ],
      prizes: { first: '₹10,000', second: '₹6,000', third: '₹3,500' },
      duration: '3 hours',
      venue: 'Open Air Theatre'
    },
    'cosplay': {
      fullDescription: 'Dress up as your favorite UNO card or character! This cosplay contest celebrates creativity, craftsmanship, and performance. Create stunning costumes, embody your character, and wow the judges with your presentation. The best UNO-inspired look takes home the prize!',
      rules: [
        'Teams of up to 3 participants',
        'Costumes must be UNO-themed',
        'Stage performance required (2-3 minutes)',
        'Judged on costume quality, creativity, and performance',
        'Props and accessories allowed'
      ],
      prizes: { first: '₹8,000', second: '₹5,000', third: '₹3,000' },
      duration: '2 hours',
      venue: 'Main Stage'
    }
  };

  const currentEventData = eventData[id] || {
    fullDescription: event.details,
    rules: ['Standard event rules apply', 'Participants must register in advance', 'Follow all event guidelines'],
    prizes: { first: '₹5,000', second: '₹3,000', third: '₹1,500' },
    duration: '2 hours',
    venue: 'TBA'
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
            <img src={getImageUrl(event.image)} alt={event.title} />
            <div className="event-badge">Featured Event</div>
          </div>

          {/* Info Section */}
          <div className="event-info-section">
            <h1 className="event-title">{event.title}</h1>
            <p className="event-short-desc">{event.short}</p>

            {/* Quick Info */}
            <div className="event-quick-info">
              <div className="info-card">
                <div className="info-card-label">Team Size</div>
                <div className="info-card-value">{event.maxParticipants} {event.maxParticipants === 1 ? 'Person' : 'People'}</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Duration</div>
                <div className="info-card-value">{currentEventData.duration}</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Venue</div>
                <div className="info-card-value">{currentEventData.venue}</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">Date</div>
                <div className="info-card-value">24-25 Nov</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="event-cta-buttons">
              <Link to={`/register?event=${encodeURIComponent(event.id)}`} className="cta-btn primary">
                Register Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/schedule" className="cta-btn secondary">
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="event-details-section">
          <h2 className="section-heading">About This Event</h2>
          <p className="event-description">{currentEventData.fullDescription}</p>
        </div>

        {/* Rules Section */}
        <div className="event-rules">
          <h2 className="section-heading">Rules & Guidelines</h2>
          <ul className="rules-list">
            {currentEventData.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Prizes Section */}
        <div className="event-prizes">
          <h2 className="section-heading">Prizes & Rewards</h2>
          <div className="prizes-grid">
            <div className="prize-card">
              <div className="prize-trophy">🥇</div>
              <div className="prize-position">First Place</div>
              <div className="prize-amount">{currentEventData.prizes.first}</div>
            </div>
            <div className="prize-card">
              <div className="prize-trophy">🥈</div>
              <div className="prize-position">Second Place</div>
              <div className="prize-amount">{currentEventData.prizes.second}</div>
            </div>
            <div className="prize-card">
              <div className="prize-trophy">🥉</div>
              <div className="prize-position">Third Place</div>
              <div className="prize-amount">{currentEventData.prizes.third}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
