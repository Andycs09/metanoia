import React from 'react';
import events from '../data/events';
import bgImage from '../assets/home page theme.png';

export default function Schedule(){
  return (
    <div style={{ 
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
      minHeight: '100vh',
      paddingTop: '70px',
      position: 'relative'
    }}>
      {/* Blur Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 14, 39, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #00d4ff, #ffbe0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Schedule</h2>
          <table style={{
            width:'100%', 
            borderCollapse:'collapse', 
            background:'rgba(255,255,255,0.02)', 
            color:'#fff',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{background: 'rgba(0, 212, 255, 0.1)'}}>
                <th style={{textAlign:'left', padding:'1rem', fontFamily: 'Orbitron, sans-serif'}}>Event</th>
                <th style={{textAlign:'left', padding:'1rem', fontFamily: 'Orbitron, sans-serif'}}>Time</th>
                <th style={{textAlign:'left', padding:'1rem', fontFamily: 'Orbitron, sans-serif'}}>Class</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e,i)=>(
                <tr key={e.id} style={{borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                  <td style={{padding:'1rem'}}>{e.title}</td>
                  <td style={{padding:'1rem'}}>{`${10 + i}:00 AM`}</td>
                  <td style={{padding:'1rem'}}>All</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
