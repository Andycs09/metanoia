import React, { useState, useEffect } from 'react';
import events from '../data/events';
import scheduleDataFile from '../data/schedule.json';
import bgImage from '../assets/home page theme.png';
import './Schedule.css';

export default function Schedule(){
  const [scheduleData, setScheduleData] = useState(scheduleDataFile.scheduleData);

  useEffect(() => {
    // Check if there's updated schedule data in localStorage
    const savedScheduleData = localStorage.getItem('scheduleData');
    if (savedScheduleData) {
      setScheduleData(JSON.parse(savedScheduleData));
    }
  }, []);

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
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e,i)=>(
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{scheduleData[e.id]?.date || 'TBA'}</td>
                    <td>{scheduleData[e.id]?.time || 'TBA'}</td>
                    <td>{scheduleData[e.id]?.venue || 'TBA'}</td>
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
