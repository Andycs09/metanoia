import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import events from '../data/events';
import RegisterModal from '../components/RegisterModal';

export default function EventDetail(){
  const { id } = useParams();
  const event = events.find(e=>e.id===id) || {};
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h2>{event.title}</h2>
      <img src={event.image} alt={event.title} style={{width:'100%',maxHeight:320,objectFit:'cover',borderRadius:8}} />
      <p style={{color:'#cfd6da'}}>{event.details}</p>
      <button className="btn" onClick={()=>setOpen(true)}>Register</button>
      <RegisterModal isOpen={open} onRequestClose={()=>setOpen(false)} eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
