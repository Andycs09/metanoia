import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import events from '../data/events';

// Import home page background theme
import bgImage from '../assets/home page theme.png';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhuJj7PF5mczobJ2OcZVYXjHlp0a-u9jBllv-SugjDTc5UG6QUXL0KEvOPD_vy-Nmb/exec'; // Replace this with your actual deployed Google Apps Script Web App URL

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// PERF: move video URL compute outside component
const videoUrl = new URL('../../images/ac.mp4', import.meta.url).href;

// PERF: cache GSAP dynamic import (avoid multiple network + parse)
let gsapPromise;
function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import(/* @vite-ignore */ 'gsap').catch(() => null);
  }
  return gsapPromise.then(mod => mod?.gsap || mod?.default || null);
}

// Clean, responsive register page styles
const REGISTER_STYLE = `
  .register-page { 
    font-family: 'Poppins', sans-serif; 
    color: #e2e8f0;
  }
  .register-card {
    background: rgba(128, 128, 128, 0.3);
    border: 4px solid #0080ff;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 0 30px rgba(0, 128, 255, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0;
    transform: translateY(40px);
    position: relative;
    z-index: 1;
    max-width: 700px;
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: auto;
  }
  
  .register-header {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 100%;
    text-align: center;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .register-header.hidden {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
    pointer-events: none;
  }
  
  .register-card h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 0;
    background: linear-gradient(45deg, #1a237e, #ffffff, #9c27b0, #e91e63, #1a237e);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba(156, 39, 176, 0.5), 0 0 40px rgba(26, 35, 126, 0.3);
    animation: gradientShift 3s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(156, 39, 176, 0.6));
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .participants {
    max-height: none;
    overflow: visible;
  }
  
  .participant-fieldset {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
  
  .participant-fieldset.complete {
    border-color: rgba(76, 175, 80, 0.4);
    background: rgba(76, 175, 80, 0.05);
  }
  
  .participant-fieldset.incomplete {
    border-color: rgba(255, 152, 0, 0.4);
    background: rgba(255, 152, 0, 0.05);
  }
  
  .row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .row .input {
    flex: 1;
  }
  
  .stacked-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .stacked-fields .input {
    width: 100%;
  }
  
  .participant-fieldset legend {
    color: #00d4ff;
    font-weight: 600;
    padding: 0 0.5rem;
  }
  
  .participant-fieldset.complete legend {
    color: #4caf50;
  }
  
  .participant-fieldset.incomplete legend {
    color: #ff9800;
  }
  
  .input.required-missing {
    border-color: rgba(255, 152, 0, 0.6) !important;
    background: rgba(255, 152, 0, 0.1) !important;
  }
  
  .input.required-missing:focus {
    border-color: #ff9800 !important;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.4) !important;
  }
  
  .team-fieldset {
    border-color: rgba(255, 152, 0, 0.3) !important;
    background: rgba(255, 152, 0, 0.05) !important;
    animation: teamFieldsetEnter 0.3s ease-out;
    margin-top: 1rem;
  }
  
  .team-fieldset legend {
    color: #ff9800 !important;
  }
  
  .team-fieldset .input.team {
    width: 100%;
  }
  
  @keyframes teamFieldsetEnter {
    0% { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* Form content area */
  .form-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  /* Card footer for controls */
  .card-footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 2px solid rgba(0, 128, 255, 0.3);
    background: rgba(0, 0, 0, 0.2);
    margin: 1.5rem -2rem -2rem -2rem;
    padding: 1.5rem 2rem;
    border-radius: 0 0 16px 16px;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .btn.primary {
    background: linear-gradient(135deg, #0080ff, #0066cc);
    border-color: #0080ff;
  }
  
  .btn.primary:hover {
    background: linear-gradient(135deg, #0066cc, #0052a3);
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn.link {
    background: transparent;
    border: none;
    color: #ff6b6b;
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .btn.link:hover {
    color: #ff5252;
    background: rgba(255, 107, 107, 0.1);
  }
  
  .msg {
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    animation: messageSlideIn 0.3s ease-out;
  }
  
  @keyframes messageSlideIn {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .msg.error {
    background: rgba(255, 107, 107, 0.2);
    border: 2px solid rgba(255, 107, 107, 0.5);
    color: #ff6b6b;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
  }
  
  .msg.success {
    background: rgba(76, 175, 80, 0.2);
    border: 2px solid rgba(76, 175, 80, 0.5);
    color: #4caf50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
  
  .register-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(128, 128, 128, 0.3);
    border-top: 2px solid #0080ff;
    padding: 1rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 100;
  }
  @keyframes cardEnter { 0% { opacity:0; transform:translateY(40px); } 100% { opacity:1; transform:translateY(0); } }
  .register-card.enter { animation: cardEnter .9s cubic-bezier(.17,.67,.33,1) forwards; }

  /* Existing flip helpers */
  .register-bg-overlay { pointer-events:none; }

  /* --- Flip-card interaction fixes --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  .flip-card .flip-front, .flip-card .flip-back { backface-visibility: hidden; transform-style: preserve-3d; }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Stay flipped while focused OR explicitly locked via .is-flipped class (no :hover) */
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  /* Ensure front/back pointer-events are controlled by class, not hover */
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  /* Button-like anchors inside cards (bigger hit-area) */
  .flip-card .card-actions a,
  .flip-card a.card-btn,
  .flip-card a.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    min-height: 36px;
    border-radius: 10px;
    background: rgba(0,0,0,.55);
    color: #fff;
    text-decoration: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .flip-card .card-actions a:focus-visible,
  .flip-card a.card-btn:focus-visible,
  .flip-card a.btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(255,255,255,.4);
  }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { 
    font-size:16px; 
    color:#fff; 
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
  }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input.team { 
    color:#ff9800; 
    border-color: rgba(255, 152, 0, 0.4);
    background: rgba(255, 152, 0, 0.05);
  } 
  .input.team::placeholder { color:rgba(255,152,0,0.7); }
  .input.team:focus {
    border-color: #ff9800;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
  }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }
  .input:focus {
    outline: none;
    border-color: #0080ff;
    box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
  }
  
  .native-select { 
    background: transparent; 
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: #fff;
  }
  .native-select:focus {
    outline: none;
    border-color: #0080ff;
    box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
  }
  .event-display {
    background: transparent;
    border: 1px solid rgba(0, 128, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: #0080ff;
  }

  .flip-card.locked .flip-inner { transform: rotateY(180deg); }

  .back-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  .back-actions button.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    min-height: 38px;
    border-radius: 10px;
    background: rgba(0,0,0,.55);
    color:#fff;
    font: inherit;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.15);
    text-decoration: none;
  }
  .back-actions button.btn.primary {
    background: linear-gradient(90deg, rgba(240,202,66,0.14), rgba(191,240,66,0.08));
    border:1px solid rgba(255,255,255,0.18);
  }
  .back-actions button.btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.4);
  }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { font-size:16px; color:#fff; }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }

  /* --- Flip-card interaction fixes (global) --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  /* Stay flipped while hovered OR any child (buttons) is focused */
  .flip-card:hover .flip-inner,
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  .flip-card .flip-front, .flip-card .flip-back {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Route clicks to back; prevent front from stealing events when flipped */
  .flip-card:hover .flip-front,
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:hover .flip-back,
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  /* Ensure front/back stacking and pointer behavior when flipped */
  .flip-card.is-flipped .flip-card-front {
    pointer-events: none;
  }
  .flip-card.is-flipped .flip-card-back {
    pointer-events: auto;
  }

  /* Reliable 3D flip layout and stacking (ensures back face can receive clicks) */
  .flip-card {
    position: relative;
    perspective: 1000px;
  }
  .flip-card-inner,
  .flip-card .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform .6s;
  }
  /* when flipped (JS toggles .is-flipped on .flip-card) rotate inner */
  .flip-card.is-flipped .flip-card-inner,
  .flip-card.is-flipped .flip-inner {
    transform: rotateY(180deg);
  }

  /* front/back are absolute stacked faces */
  .flip-card-front,
  .flip-front,
  .flip-card-back,
  .flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* front sits above by default */
  .flip-card-front,
  .flip-front {
    z-index: 2;
    transform: rotateY(0deg);
  }

  /* back rotated and placed behind; when flipped it will be above due to z-index logic in JS */
  .flip-card-back,
  .flip-back {
    transform: rotateY(180deg);
    z-index: 1;
    pointer-events: none; /* disabled by default */
  }

  /* when flipped, allow back to receive pointer events */
  .flip-card.is-flipped .flip-card-back,
  .flip-card.is-flipped .flip-back {
    pointer-events: auto;
    z-index: 3;
  }

  /* ensure buttons area is interactive */
  .back-actions { display:flex; gap:12px; }
  .back-actions .btn { pointer-events: auto; }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { font-size:16px; color:#fff; }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }

  /* --- Flip-card interaction fixes (global) --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  /* Stay flipped while hovered OR any child (buttons) is focused */
  .flip-card:hover .flip-inner,
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  .flip-card .flip-front, .flip-card .flip-back {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Route clicks to back; prevent front from stealing events when flipped */
  .flip-card:hover .flip-front,
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:hover .flip-back,
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  
  /* Mobile and responsive design */
  @media (max-width: 768px) {
    .register-page {
      padding: 0.5rem;
      padding-top: 1rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .register-header {
      position: static;
      transform: none;
      left: auto;
      width: 100%;
      text-align: center;
      margin-bottom: 1rem;
      z-index: 10;
    }
    
    .register-header h2 {
      font-size: 1.6rem;
      letter-spacing: 1px;
      padding: 1rem;
      margin: 0;
      text-align: center;
    }
    
    .register-card {
      width: 100%;
      max-width: none;
      padding: 1rem;
      margin: 0;
      max-height: none;
      min-height: auto;
      border-radius: 12px;
      border-width: 2px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .form-content {
      overflow-y: visible;
      padding-right: 0;
      flex: 1;
    }
    
    .participant-fieldset {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .participant-fieldset legend {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .stacked-fields {
      gap: 0.75rem;
      width: 100%;
    }
    
    .row {
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
    
    .input, .native-select {
      padding: 0.875rem;
      font-size: 16px; /* Prevents zoom on iOS */
      border-radius: 6px;
      border-width: 2px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .event-display {
      padding: 0.875rem;
      font-size: 0.9rem;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .controls {
      flex-direction: column;
      gap: 0.75rem;
      padding: 0;
      width: 100%;
    }
    
    .btn {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      min-height: 48px; /* Touch-friendly size */
      border-radius: 8px;
      font-weight: 600;
      box-sizing: border-box;
    }
    
    .card-footer {
      padding: 1rem;
      margin: 1rem -1rem -1rem -1rem;
      border-radius: 0 0 12px 12px;
      width: calc(100% + 2rem);
      box-sizing: border-box;
    }
    
    .msg {
      margin: 1rem 0;
      font-size: 0.95rem;
      padding: 1rem;
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Image upload mobile styles */
    .image-upload-section {
      padding: 1rem !important;
      margin-top: 1rem !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    
    .image-upload-section img {
      width: 100px !important;
      height: 100px !important;
    }
    
    .image-upload-section label,
    .image-upload-section button {
      padding: 0.75rem 1rem !important;
      font-size: 0.85rem !important;
      min-height: 40px;
    }
    
    /* Team fieldset mobile */
    .team-fieldset {
      width: 100%;
      box-sizing: border-box;
    }
    
    .team-fieldset .input.team {
      width: 100%;
      box-sizing: border-box;
    }
  }
  
  @media (max-width: 480px) {
    .register-page {
      padding: 0.25rem;
      padding-top: 0.5rem;
    }
    
    .register-header {
      margin-bottom: 0.75rem;
    }
    
    .register-header h2 {
      font-size: 1.4rem;
      letter-spacing: 0.5px;
      padding: 0.75rem;
    }
    
    .register-card {
      padding: 0.75rem;
      border-radius: 10px;
    }
    
    .participant-fieldset {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      border-radius: 6px;
    }
    
    .participant-fieldset legend {
      font-size: 0.9rem;
      padding: 0 0.25rem;
    }
    
    .stacked-fields {
      gap: 0.625rem;
    }
    
    .input, .native-select {
      padding: 0.75rem;
      font-size: 16px;
      border-radius: 5px;
    }
    
    .event-display {
      padding: 0.75rem;
      font-size: 0.85rem;
      border-radius: 5px;
    }
    
    .controls {
      gap: 0.625rem;
    }
    
    .btn {
      padding: 0.875rem;
      font-size: 0.9rem;
      min-height: 44px;
      border-radius: 6px;
    }
    
    .btn.link {
      padding: 0.625rem;
      font-size: 0.85rem;
      min-height: auto;
    }
    
    .card-footer {
      padding: 0.75rem;
      margin: 0.75rem -0.75rem -0.75rem -0.75rem;
      width: calc(100% + 1.5rem);
    }
    
    /* Image upload smaller mobile styles */
    .image-upload-section {
      padding: 0.75rem !important;
    }
    
    .image-upload-section img {
      width: 80px !important;
      height: 80px !important;
    }
    
    .image-upload-section label,
    .image-upload-section button {
      padding: 0.625rem 0.875rem !important;
      font-size: 0.8rem !important;
    }
  }
  
  @media (max-width: 360px) {
    .register-page {
      padding: 0.125rem;
      padding-top: 0.25rem;
    }
    
    .register-header h2 {
      font-size: 1.2rem;
      padding: 0.5rem;
    }
    
    .register-card {
      padding: 0.5rem;
      border-radius: 8px;
    }
    
    .participant-fieldset {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .participant-fieldset legend {
      font-size: 0.85rem;
      padding: 0 0.125rem;
    }
    
    .input, .native-select, .event-display {
      padding: 0.625rem;
      font-size: 15px;
    }
    
    .btn {
      padding: 0.75rem;
      font-size: 0.85rem;
      min-height: 40px;
    }
    
    .card-footer {
      padding: 0.5rem;
      margin: 0.5rem -0.5rem -0.5rem -0.5rem;
      width: calc(100% + 1rem);
    }
    
    /* Very small mobile image upload */
    .image-upload-section img {
      width: 70px !important;
      height: 70px !important;
    }
  }
  
  /* Landscape orientation adjustments */
  @media (max-height: 600px) and (orientation: landscape) {
    .register-card {
      max-height: calc(100vh - 140px);
      margin-top: 3rem;
    }
    
    .register-header {
      top: 50px;
    }
    
    .register-header h2 {
      font-size: 1.1rem;
    }
    
    .participant-fieldset {
      margin-bottom: 0.75rem;
      padding: 1rem;
    }
  }
  
  /* QR Code Section Responsive Styles - Inside Register Card */
  @media (max-width: 768px) {
    .register-card img[alt="Registration QR Code"] {
      width: 200px !important;
      height: 200px !important;
    }
    
    .register-card div[style*="width: 250px"] {
      width: 200px !important;
      height: 200px !important;
    }
  }
  
  @media (max-width: 480px) {
    .register-card img[alt="Registration QR Code"] {
      width: 160px !important;
      height: 160px !important;
    }
    
    .register-card div[style*="width: 250px"] {
      width: 160px !important;
      height: 160px !important;
    }
    
    .register-card div[style*="fontSize: '4rem'"] {
      font-size: 3rem !important;
    }
    
    .register-card div[style*="fontSize: '1.5rem'"] {
      font-size: 1.2rem !important;
    }
  }
  
  @media (max-width: 360px) {
    .register-card img[alt="Registration QR Code"] {
      width: 140px !important;
      height: 140px !important;
    }
    
    .register-card div[style*="width: 250px"] {
      width: 140px !important;
      height: 140px !important;
    }
  }
  
  /* Image Upload Section Styles */
  .image-upload-section {
    transition: all 0.3s ease;
  }
  
  .image-upload-section:hover {
    border-color: rgba(0, 128, 255, 0.5) !important;
    background: rgba(0, 128, 255, 0.1) !important;
  }
  
  .image-upload-section label:hover {
    background: linear-gradient(135deg, #0066cc, #0052a3) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 128, 255, 0.3);
  }
  
  .image-upload-section button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  /* Mobile responsive styles for image upload */
  @media (max-width: 768px) {
    .image-upload-section img {
      width: 80px !important;
      height: 80px !important;
    }
  }
  
  @media (max-width: 480px) {
    .image-upload-section {
      padding: 0.75rem !important;
    }
    
    .image-upload-section img {
      width: 60px !important;
      height: 60px !important;
    }
    
    .image-upload-section label,
    .image-upload-section button {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.75rem !important;
    }
  }
`;

// NEW: memoized participant fieldset component to reduce re-renders
const ParticipantFieldset = React.memo(function ParticipantFieldset({ idx, data, updateField, removeParticipant, removable, uploadImage }) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(data.imageUrl || null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Google Drive
      const imageUrl = await uploadImage(file, idx);
      updateField(idx, 'imageUrl', imageUrl);
      
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    updateField(idx, 'imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if all required fields are filled
  const isComplete = data.name && data.email && data.phone && data.registrationNo && data.imageUrl;

  return (
    <fieldset className={`participant-fieldset ${isComplete ? 'complete' : 'incomplete'}`}>
      <legend>
        Participant {idx + 1} 
        {isComplete ? ' ✅' : ' ⚠️'}
      </legend>
      <div className="stacked-fields">
        <input 
          placeholder="Name *" 
          value={data.name} 
          onChange={e => updateField(idx, 'name', e.target.value)} 
          required 
          className={`input name ${!data.name ? 'required-missing' : ''}`}
        />
        <input 
          placeholder="Class" 
          value={data.cls} 
          onChange={e => updateField(idx, 'cls', e.target.value)} 
          className="input cls" 
        />
        <input 
          placeholder="Email *" 
          value={data.email} 
          onChange={e => updateField(idx, 'email', e.target.value)} 
          required 
          className={`input email ${!data.email ? 'required-missing' : ''}`}
        />
        <input 
          placeholder="Phone *" 
          value={data.phone} 
          onChange={e => updateField(idx, 'phone', e.target.value)} 
          required 
          className={`input phone ${!data.phone ? 'required-missing' : ''}`}
        />
        <input 
          placeholder="Registration No *" 
          value={data.registrationNo} 
          onChange={e => updateField(idx, 'registrationNo', e.target.value)} 
          required 
          className={`input regno ${!data.registrationNo ? 'required-missing' : ''}`}
        />
        
        {/* Image Upload Section */}
        <div className={`image-upload-section ${!data.imageUrl ? 'required-missing' : ''}`} style={{
          marginTop: '1rem',
          padding: '1rem',
          border: `2px dashed ${!data.imageUrl ? 'rgba(255, 107, 107, 0.5)' : 'rgba(0, 128, 255, 0.3)'}`,
          borderRadius: '8px',
          background: !data.imageUrl ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 128, 255, 0.05)',
          textAlign: 'center'
        }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id={`image-upload-${idx}`}
          />
          
          {!imagePreview ? (
            <div>
              <label 
                htmlFor={`image-upload-${idx}`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: !data.imageUrl ? 'linear-gradient(135deg, #ff6b6b, #ff5252)' : 'linear-gradient(135deg, #0080ff, #0066cc)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  opacity: uploading ? 0.6 : 1,
                  marginBottom: '0.75rem'
                }}
              >
                {uploading ? '📤 Uploading...' : '📷 Upload Payment Receipt *'}
              </label>
              <br />
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                margin: '0.75rem 0 0 0',
                fontWeight: '500'
              }}>
                (After Scanning Qr Code Go to Events → Stall-Metanoia) for fee payment
              </p>
              {!data.imageUrl && (
                <p style={{
                  color: 'rgba(255, 107, 107, 0.8)',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0',
                  fontStyle: 'italic'
                }}>
                  Payment receipt is required
                </p>
              )}
            </div>
          ) : (
            <div>
              <img 
                src={imagePreview} 
                alt={`Participant ${idx + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid rgba(76, 175, 80, 0.5)',
                  marginBottom: '0.75rem'
                }}
              />
              <br />
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                margin: '0.75rem 0 0.5rem 0',
                fontWeight: '500'
              }}>
                (Go to Events -→ Metanoia) for fee payment
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <label 
                  htmlFor={`image-upload-${idx}`}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 128, 255, 0.2)',
                    color: '#0080ff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    border: '1px solid rgba(0, 128, 255, 0.3)'
                  }}
                >
                  Change
                </label>
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    border: '1px solid rgba(255, 107, 107, 0.3)'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {removable && <button type="button" className="btn link" onClick={() => removeParticipant(idx)}>Remove</button>}
    </fieldset>
  );
});

export default function RegisterPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const initialEventId = query.get('event') || events[0].id;
  const [eventId, setEventId] = useState(initialEventId);
  const videoRef = useRef(null);

  // MEMO: compute selectedEvent + maxParticipants once per eventId change
  const selectedEvent = useMemo(() => {
    // Handle the split Draw 4 Arena events
    if (eventId === 'draw-4-arena-valorant' || eventId === 'draw-4-arena-cod') {
      return events.find(e => e.id === 'draw-4-arena') || events[0];
    }
    return events.find(e => e.id === eventId) || events[0];
  }, [eventId]);
  const maxParticipants = useMemo(() => Math.min(4, selectedEvent.maxParticipants || 1), [selectedEvent]);
  // MEMO: static event option data
  const eventOptions = useMemo(() => {
    const options = [];
    events.forEach(ev => {
      if (ev.closed) {
        // Add closed events with CLOSED label but make them unselectable
        options.push({
          id: ev.id,
          title: `${ev.title} - CLOSED`,
          max: Math.min(4, ev.maxParticipants || 1),
          closed: true
        });
      } else if (ev.id === 'draw-4-arena') {
        // Split Draw 4 Arena into two separate options
        options.push({
          id: 'draw-4-arena-valorant',
          title: 'Draw 4 Arena: The Ultimate Esports Showdown  Valorant',
          max: Math.min(4, ev.maxParticipants || 1)
        });
        options.push({
          id: 'draw-4-arena-cod',
          title: 'Draw 4 Arena: The Ultimate Esports Showdown  Call of Duty',
          max: Math.min(4, ev.maxParticipants || 1)
        });
      } else {
        options.push({
          id: ev.id,
          title: ev.title,
          max: Math.min(4, ev.maxParticipants || 1)
        });
      }
    });
    return options;
  }, []);

  const [participants, setParticipants] = useState(() => [{ name: '', cls: '', email: '', phone: '', registrationNo: '', imageUrl: '' }]);
  const [teamName, setTeamName] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  const formRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Normalize participants only if limit changed
    setParticipants(prev => {
      const limit = Math.max(1, maxParticipants);
      if (prev.length === limit && prev.every(p => 'registrationNo' in p && 'imageUrl' in p)) return prev;
      let arr = prev.slice(0, limit);
      if (arr.length === 0) arr = [{ name: '', cls: '', email: '', phone: '', registrationNo: '', imageUrl: '' }];
      return arr.map(p => ({ 
        registrationNo: p.registrationNo || '', 
        imageUrl: p.imageUrl || '', 
        ...p 
      }));
    });
  }, [eventId, maxParticipants]);

  // DEFER GSAP entrance: CSS anim first, then upgrade after first interaction
  useEffect(() => {
    if (cardRef.current) cardRef.current.classList.add('enter');
    const firstInteraction = () => {
      loadGsap().then(gsap => {
        if (gsap && cardRef.current) gsap.set(cardRef.current, { opacity: 1, y: 0 });
      });
    };
    window.addEventListener('pointerdown', firstInteraction, { passive: true, once: true });
  }, []);

  // SEO: dynamic title + meta description
  useEffect(() => {
    document.title = `${selectedEvent.title} Registration`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = `Register participants for ${selectedEvent.title}.`;
  }, [selectedEvent.title]);

  // Scroll handler for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;
      
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current && headerVisible) {
          // Scrolling down - hide header
          setHeaderVisible(false);
        } else if (currentScrollY < lastScrollY.current && !headerVisible) {
          // Scrolling up - show header
          setHeaderVisible(true);
        }
      } else {
        // At top of page - always show header
        if (!headerVisible) setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerVisible]);

  // Reduced motion & visibility pause for video
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && videoRef.current) videoRef.current.pause();
    function handleVis() {
      if (!videoRef.current) return;
      if (document.hidden) videoRef.current.pause();
      else if (!prefersReducedMotion) videoRef.current.play();
    }
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // CALLBACKS: stabilize to reduce child re-renders
  const updateField = useCallback((idx, field, value) => {
    setParticipants(prev => {
      const copy = prev.slice();
      copy[idx] = { ...(copy[idx] || {}), [field]: value };
      return copy;
    });
  }, []);

  const addParticipant = useCallback(() => {
    setParticipants(prev => (prev.length < maxParticipants ? [...prev, { name: '', cls: '', email: '', phone: '', registrationNo: '', imageUrl: '' }] : prev));
    loadGsap().then(gsap => {
      if (gsap && formRef.current) gsap.fromTo(formRef.current, { scale: 0.995 }, { scale: 1, duration: 0.26, ease: 'back.out(1.2)' });
    });
  }, [maxParticipants]);

  // Image upload function - Convert file to base64 and include in participant data
  const uploadImage = useCallback(async (file, participantIndex) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        // Update participant with base64 image data
        updateField(participantIndex, 'imageUrl', base64Data);
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [updateField]);

  const removeParticipant = useCallback((idx) => {
    setParticipants(prev => prev.filter((_, i) => i !== idx));
    loadGsap().then(gsap => {
      if (gsap && formRef.current) gsap.to(formRef.current, { scale: 0.995, duration: 0.12, yoyo: true, repeat: 1 });
    });
  }, []);

  useEffect(() => {
    performance.mark?.('register-mounted');
    try {
      performance.measure?.('register-render-to-mounted', 'register-render-start', 'register-mounted');
    } catch {}
  }, []);

  // Form validation function
  const isFormValid = useCallback(() => {
    // Check if selected event is closed
    const selectedEventData = events.find(e => e.id === eventId);
    if (selectedEventData?.closed) return false;
    
    // Check if team name is filled
    if (!teamName.trim()) return false;
    
    // Check if all participants have required fields and image
    return participants.every(p => 
      p.name && 
      p.email && 
      p.phone && 
      p.registrationNo && 
      p.imageUrl
    );
  }, [participants, teamName, eventId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    // Validate all participants have required fields
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.name || !p.email || !p.phone || !p.registrationNo) {
        setMessage({ type: 'error', text: `Participant ${i+1}: All fields (Name, Email, Phone, Registration No) are required.` });
        setSending(false);
        return;
      }
      
      // Validate image upload
      if (!p.imageUrl) {
        setMessage({ type: 'error', text: `Participant ${i+1}: Payment receipt image is required.` });
        setSending(false);
        return;
      }
    }

    // Validate team name for all participants
    if (!teamName.trim()) {
      setMessage({ type: 'error', text: 'Team name is required.' });
      setSending(false);
      return;
    }

    // Determine the game type for Draw 4 Arena events
    let gameType = null;
    let eventTitle = selectedEvent.title;
    
    if (eventId === 'draw-4-arena-valorant') {
      gameType = 'Valorant';
      eventTitle = 'Draw 4 Arena: The Ultimate Esports Showdown - Valorant';
    } else if (eventId === 'draw-4-arena-cod') {
      gameType = 'Call of Duty';
      eventTitle = 'Draw 4 Arena: The Ultimate Esports Showdown - Call of Duty';
    }

    // Add team name and game type to all participants and prepare payload
    const participantsWithTeam = participants.map((p, index) => ({ 
      ...p, 
      teamName: teamName.trim(),
      participantNumber: index + 1,
      ...(gameType && { gameType })
    }));

    const payload = {
      eventId,
      eventTitle,
      participants: participantsWithTeam,
      timestamp: new Date().toISOString(),
      ...(gameType && { gameType })
    };

    console.log('Sending payload:', payload);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload)
      });

      // Show success message with green background
      setMessage({
        type: "success",
        text: "✅ Registration submitted successfully! Redirecting to events page..."
      });

      // Success animation using GSAP if available
      try {
        const gsap = await loadGsap();
        if (gsap && cardRef.current) {
          gsap.to(cardRef.current, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1 });
          gsap.to(cardRef.current, { opacity: 0.96, duration: 0.2, delay: 0.4 });
        }
      } catch {}

      // Redirect to events page after 2 seconds
      setTimeout(() => navigate('/events'), 2000);
    } catch (err) {
      console.error(err);
      // Show error message with red background
      setMessage({ 
        type: 'error', 
        text: '❌ Failed to submit registration. Please check your internet connection and try again.' 
      });
    } finally {
      setSending(false);
    }
  }

  async function handleCancel() {
    try {
      const gsap = await loadGsap();
      if (gsap && cardRef.current) {
        await new Promise(resolve => {
          gsap.to(cardRef.current, { scale: 0.88, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: resolve });
        });
      }
    } catch {}
    finally {
      navigate('/events');
    }
  }

  return (
    <div className="register-page" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      padding: '2rem 1rem',
      paddingTop: '120px',
      paddingBottom: '2rem',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'flex-start',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
      overflowY: 'auto'
    }}>
      <style>{REGISTER_STYLE}</style>
      
      {/* Background overlay for better readability - more blue tint */}
      <div className="register-bg-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 50, 100, 0.6)',
        zIndex: 0,
        pointerEvents: 'none'
      }} aria-hidden />

      {/* Header positioned at top middle */}
      <div ref={headerRef} className={`register-header ${!headerVisible ? 'hidden' : ''}`}>
        <h2 id="register-heading">Register for Event</h2>
      </div>

      <div ref={cardRef} className="register-card" role="region" aria-labelledby="register-heading" style={{ 
        marginTop: '6rem',
        width: '100%',
        maxWidth: '700px'
      }}>
        
        <div className="form-content">
          <form ref={formRef} id="register-form" onSubmit={handleSubmit}>
          <label className="field" style={{ position: 'relative' }}>
            Event
            <div className="event-select">
              <select value={eventId} onChange={e => setEventId(e.target.value)} className="input native-select">
                {eventOptions.map(opt => (
                  <option 
                    key={opt.id} 
                    value={opt.id} 
                    disabled={opt.closed}
                    style={opt.closed ? { color: '#999', backgroundColor: '#333' } : {}}
                  >
                    {opt.title} (max {opt.max})
                  </option>
                ))}
              </select>
              <div className="event-display animated-gradient" aria-hidden>
                {selectedEvent.title} (max {maxParticipants})
              </div>
            </div>
          </label>

          {/* Closed Event Message */}
          {events.find(e => e.id === eventId)?.closed && (
            <div className="msg error" style={{ 
              background: 'rgba(255, 107, 107, 0.2)',
              border: '2px solid rgba(255, 107, 107, 0.5)',
              color: '#ff6b6b',
              padding: '1rem',
              borderRadius: '8px',
              margin: '1rem 0',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              ❌ Registration for this event is currently closed. Please select a different event.
            </div>
          )}

          <div className="participants">
            {!events.find(e => e.id === eventId)?.closed && participants.map((p, idx) => (
              <ParticipantFieldset
                key={idx}
                idx={idx}
                data={p}
                updateField={updateField}
                removeParticipant={removeParticipant}
                removable={idx > 0}
                uploadImage={uploadImage}
              />
            ))}
          </div>

          <fieldset className="participant-fieldset team-fieldset">
            <legend>Team Information</legend>
            <div style={{ marginBottom: '0.75rem', color: '#ff9800', fontSize: '0.9rem', opacity: 0.8 }}>
              {participants.length === 1 
                ? 'Team name for this participant' 
                : `This team name will be assigned to all ${participants.length} participants`
              }
            </div>
            <div className="row">
              <input 
                placeholder="Enter team name" 
                value={teamName} 
                onChange={e => setTeamName(e.target.value)} 
                required 
                className="input team" 
              />
            </div>
          </fieldset>

          {message && <div className={`msg ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}
          
          {/* QR Code Section - Inside the register card at the bottom */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(0, 128, 255, 0.1)',
            border: '2px solid rgba(0, 128, 255, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <img 
                src={new URL('../assets/qr/a.jpeg', import.meta.url).href}
                alt="Registration QR Code" 
                style={{
                  width: '250px',
                  height: '250px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onError={(e) => {
                  console.log('QR Image failed to load in Register page');
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
                onLoad={() => console.log('QR Image loaded successfully in Register page')}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.borderColor = '#0080ff';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 128, 255, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              />
              <div style={{ 
                display: 'none',
                width: '250px',
                height: '250px',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '12px' }}>📱</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>QR Code</div>
                <div style={{ fontSize: '1rem', opacity: '0.7' }}>Loading...</div>
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                margin: '0',
                fontWeight: '600'
              }}>
                Scan to pay ₹ 100 (Upload Receipt ScreenShot)
              </p>
            </div>
          </div>
        </form>
      </div>

        {/* Card Footer with participant buttons */}
        <div className="card-footer">
          <div className="controls">
            <button type="button" className="btn" onClick={addParticipant} disabled={participants.length >= maxParticipants}>Add participant</button>
            <button 
              type="submit" 
              form={formRef.current?.id || 'register-form'} 
              className="btn primary" 
              disabled={sending || !isFormValid()}
            >
              {sending ? 'Submitting…' : 'Submit Registration'}
            </button>
            <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
