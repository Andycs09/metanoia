import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxy_m675sauTDwM3v4V7eoXZBVP4B0DLC7H7IJW099nSpt1scDKdoW6EXiQceZItdMu/exechttps://script.google.com/macros/s/AKfycbxy_m675sauTDwM3v4V7eoXZBVP4B0DLC7H7IJW099nSpt1scDKdoW6EXiQceZItdMu/exec '; // <--- replace

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

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    content: {
      position: 'relative',
      inset: 'auto',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.95), rgba(42, 82, 152, 0.95))',
      border: '2px solid rgba(33, 150, 243, 0.5)',
      borderRadius: '16px',
      padding: '0',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Register" 
      style={modalStyles}
    >
      <style>{`
        .register-modal-content {
          padding: 24px;
        }
        
        .register-modal-header {
          text-align: center;
          margin-bottom: 24px;
          color: white;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
        }
        
        .participant-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        
        .participant-header {
          color: #64B5F6;
          font-weight: 600;
          margin-bottom: 12px;
          font-size: 1rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .register-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        
        .register-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .register-input:focus {
          outline: none;
          border-color: #2196F3;
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
        }
        
        .remove-btn {
          padding: 8px 16px;
          background: rgba(244, 67, 54, 0.8);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.9rem;
        }
        
        .remove-btn:hover {
          background: rgba(244, 67, 54, 1);
          transform: translateY(-2px);
        }
        
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        
        .modal-btn {
          flex: 1;
          min-width: 120px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .modal-btn.add {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }
        
        .modal-btn.add:hover:not(:disabled) {
          background: linear-gradient(135deg, #45a049, #3d8b40);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }
        
        .modal-btn.add:disabled {
          background: rgba(76, 175, 80, 0.3);
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .modal-btn.submit {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
        }
        
        .modal-btn.submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #1976D2, #1565C0);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
        }
        
        .modal-btn.submit:disabled {
          background: rgba(33, 150, 243, 0.3);
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .modal-btn.close {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .modal-btn.close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .status-message {
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          margin-top: 16px;
        }
        
        .status-message.success {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.5);
        }
        
        .status-message.error {
          background: rgba(244, 67, 54, 0.2);
          color: #F44336;
          border: 1px solid rgba(244, 67, 54, 0.5);
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .register-modal-content {
            padding: 20px;
          }
          
          .register-modal-header {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }
          
          .participant-card {
            padding: 12px;
            margin-bottom: 12px;
          }
          
          .register-input {
            padding: 10px 12px;
            font-size: 0.95rem;
          }
          
          .button-group {
            flex-direction: column;
            gap: 10px;
          }
          
          .modal-btn {
            width: 100%;
            min-width: auto;
            padding: 12px 16px;
            font-size: 0.95rem;
          }
        }
        
        @media (max-width: 480px) {
          .register-modal-content {
            padding: 16px;
          }
          
          .register-modal-header {
            font-size: 1.25rem;
            margin-bottom: 16px;
          }
          
          .participant-card {
            padding: 10px;
          }
          
          .participant-header {
            font-size: 0.9rem;
            margin-bottom: 10px;
          }
          
          .input-group {
            gap: 10px;
          }
          
          .register-input {
            padding: 10px;
            font-size: 0.9rem;
          }
          
          .modal-btn {
            padding: 10px 14px;
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <div className="register-modal-content">
        <h2 className="register-modal-header">Register for {eventTitle}</h2>
        <form onSubmit={handleSubmit}>
          {participants.map((p, idx)=>(
            <div key={idx} className="participant-card">
              <div className="participant-header">Participant {idx + 1}</div>
              <div className="input-group">
                <input 
                  required 
                  placeholder="Name" 
                  value={p.name} 
                  onChange={e=>updateField(idx,'name',e.target.value)}
                  className="register-input"
                />
                <input 
                  required 
                  type="email"
                  placeholder="Email" 
                  value={p.email} 
                  onChange={e=>updateField(idx,'email',e.target.value)}
                  className="register-input"
                />
                <input 
                  required 
                  type="tel"
                  placeholder="Phone" 
                  value={p.phone} 
                  onChange={e=>updateField(idx,'phone',e.target.value)}
                  className="register-input"
                />
              </div>
              {idx > 0 && (
                <button type="button" onClick={()=>removeParticipant(idx)} className="remove-btn">
                  Remove Participant
                </button>
              )}
            </div>
          ))}
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={addParticipant} 
              disabled={participants.length>=4}
              className="modal-btn add"
            >
              Add Participant
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="modal-btn submit"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              onClick={onRequestClose}
              className="modal-btn close"
            >
              Close
            </button>
          </div>
          
          {success === true && (
            <div className="status-message success">
              ✓ Registration sent successfully!
            </div>
          )}
          {success === false && (
            <div className="status-message error">
              ✗ Failed to send. Please try again.
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
