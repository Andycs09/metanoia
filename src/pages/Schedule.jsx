import React from 'react';
import events from '../data/events';
import bgImage from '../assets/home page theme.png';
import './Schedule.css';

export default function Schedule(){
  return (
    <div className="schedule-page" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Blur Overlay */}
      <div className="schedule-overlay"></div>

      {/* Content Container */}
      <div className="schedule-container">
        <div className="schedule-card">
          <h2 className="schedule-title">Schedule</h2>
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Time</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e,i)=>(
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>TBA</td>
                    <td>TBA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
