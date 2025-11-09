import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Spaceboard() {
  const navigate = useNavigate();
  return (
    <main style={{ padding: 24 }}>
      <h1>Page</h1>
      <p>This is the new page opened from the card's Page button.</p>
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => navigate(-1)}>Go back</button>
      </div>
    </main>
  );
}
