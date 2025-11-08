import React from 'react';
import events from '../data/events';
import EventCard from '../components/EventCard';

export default function Events(){
  return (
    <div>
      <h2>All Events</h2>
      <div className="events-grid">
        {events.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
