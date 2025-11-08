import React from 'react';
import events from '../data/events';
import EventCard from '../components/EventCard';

export default function Events(){
  return (
    <div className="events-page">
      <h2>All Events</h2>
      <div className="events-grid">
        {events.map((ev, i) => (
          <EventCard key={ev.id} event={ev} index={i} />
        ))}
      </div>
    </div>
  );
}
