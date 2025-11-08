import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterModal from './RegisterModal';

export default function EventCard({ event }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <img src={event.image} alt={event.title} style={{width:'100%', height:120, objectFit:'cover', borderRadius:6}} />
      <h3>{event.title}</h3>
      <p style={{color:'#cfd6da'}}>{event.short}</p>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <Link to={`/events/${event.id}`} className="btn" style={{textDecoration:'none'}}>Details</Link>
        <button className="btn" onClick={()=>setOpen(true)} style={{background:'#ff6b61'}}>Register</button>
      </div>
      <RegisterModal isOpen={open} onRequestClose={()=>setOpen(false)} eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
