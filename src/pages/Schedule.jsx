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

  const handlePrintSchedule = () => {
    // Create a new window with just the schedule table for printing
    const printWindow = window.open('', '_blank');
    const scheduleHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>UNOVerse Event Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #00d4ff;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #00d4ff;
              font-size: 2rem;
              margin: 0;
            }
            .header h2 {
              color: #666;
              font-size: 1.2rem;
              margin: 5px 0;
            }
            .header p {
              color: #888;
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th {
              background-color: #00d4ff;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f0f8ff;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 0.9rem;
            }
            @media print {
              body { margin: 0; }
              .header { page-break-inside: avoid; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UNOVerse Event Schedule</h1>
            <h2>Department of Computer Science</h2>
            <p>30th-31st January, 2026</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              ${events.map(event => `
                <tr>
                  <td>${event.title}</td>
                  <td>${scheduleData[event.id]?.date || 'TBA'}</td>
                  <td>${scheduleData[event.id]?.time || 'TBA'}</td>
                  <td>${scheduleData[event.id]?.venue || 'TBA'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>UNOVerse - Department of Computer Science</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(scheduleHTML);
    printWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    printWindow.onload = () => {
      printWindow.print();
      // Close the window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

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
          
          {/* Print/Download Button */}
          <div className="schedule-actions">
            <button 
              onClick={handlePrintSchedule}
              className="print-btn"
              title="Download Schedule as PDF"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 6,2 18,2 18,9"></polyline>
                <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
                <polyline points="6,14 18,14 18,22 6,22 6,14"></polyline>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
