import React from 'react';
import events from '../data/events';

export default function Schedule(){
  return (
    <div>
      <h2>Schedule</h2>
      <table style={{width:'100%', borderCollapse:'collapse', background:'rgba(255,255,255,0.02)', color:'#fff'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', padding:8}}>Event</th>
            <th style={{textAlign:'left', padding:8}}>Time</th>
            <th style={{textAlign:'left', padding:8}}>Class</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e,i)=>(
            <tr key={e.id} style={{borderTop:'1px solid rgba(255,255,255,0.03)'}}>
              <td style={{padding:8}}>{e.title}</td>
              <td style={{padding:8}}>{`${10 + i}:00 AM`}</td>
              <td style={{padding:8}}>All</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
