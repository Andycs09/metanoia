import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // <--- replace

export default function RegisterModal({ isOpen, onRequestClose, eventId, eventTitle }) {
  const [participants, setParticipants] = useState([
    { name:'', email:'', phone:'' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function updateField(idx, field, value){
    const copy = [...participants];
    copy[idx][field] = value;
    setParticipants(copy);
  }

  function addParticipant(){
    if(participants.length < 4) setParticipants([...participants, {name:'', email:'', phone:''}]);
  }
  function removeParticipant(idx){
    setParticipants(participants.filter((_,i)=>i!==idx));
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      // prepare payload suitable for Google Sheet: send eventId and participants
      const payload = { eventId, eventTitle, participants };
      await axios.post(GOOGLE_SCRIPT_URL, payload);
      setSuccess(true);
      setParticipants([{name:'',email:'',phone:''}]);
    } catch(err){
      console.error(err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Register" style={{content:{maxWidth:600,margin:'auto'}}}>
      <h2>Register for {eventTitle}</h2>
      <form onSubmit={handleSubmit}>
        {participants.map((p, idx)=>(
          <div key={idx} style={{border:'1px solid rgba(0,0,0,0.06)', padding:10, marginBottom:8, borderRadius:6}}>
            <div style={{display:'flex', gap:8}}>
              <input required placeholder="Name" value={p.name} onChange={e=>updateField(idx,'name',e.target.value)} />
              <input required placeholder="Email" value={p.email} onChange={e=>updateField(idx,'email',e.target.value)} />
              <input required placeholder="Phone" value={p.phone} onChange={e=>updateField(idx,'phone',e.target.value)} />
            </div>
            <div style={{marginTop:6}}>
              {idx>0 && <button type="button" onClick={()=>removeParticipant(idx)}>Remove</button>}
            </div>
          </div>
        ))}
        <div style={{display:'flex', gap:8, marginBottom:12}}>
          <button type="button" onClick={addParticipant} disabled={participants.length>=4}>Add participant</button>
          <button type="submit" disabled={loading} className="btn">Submit</button>
          <button type="button" onClick={onRequestClose}>Close</button>
        </div>
        {success===true && <div style={{color:'green'}}>Registration sent!</div>}
        {success===false && <div style={{color:'red'}}>Failed to send. Try again.</div>}
      </form>
    </Modal>
  );
}
