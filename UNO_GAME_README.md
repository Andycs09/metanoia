# UNO Game Feature

## Overview
A fully functional UNO card game integrated into your React app with a dedicated "Play UNO" button in the navbar.

## Features

### Game Mechanics
- **2-4 Players**: Choose to play with 2, 3, or 4 players (you vs AI opponents)
- **Full UNO Deck**: Complete 108-card deck including:
  - Number cards (0-9) in 4 colors (Red, Blue, Green, Yellow)
  - Special cards: Skip, Reverse, Draw 2
  - Wild cards: Wild and Wild Draw 4
- **AI Opponents**: Smart AI players that make strategic moves
- **Game Rules**: All standard UNO rules implemented:
  - Match by color or number
  - Skip turns
  - Reverse direction
  - Draw cards
  - Wild card color selection

### UI Features
- **Beautiful Card Design**: Gradient-styled cards with color-coded backgrounds
- **Responsive Layout**: Works on desktop and mobile devices
- **Visual Feedback**: 
  - Playable cards glow and can be clicked
  - Current player highlighted
  - Game direction indicator
  - Real-time messages
- **Color Chooser**: Modal popup for selecting wild card colors
- **Score Tracking**: Track cards remaining for each player

## How to Play

1. Click the "🎮 Play UNO" button in the navbar
2. Select number of players (2-4)
3. Click "Start Game"
4. On your turn:
   - Click a playable card (glowing cards) to play it
   - Click the deck to draw a card if you can't play
5. Match cards by color or number
6. Use special cards strategically
7. First player to empty their hand wins!

## Navigation
- The UNO game button appears in both:
  - Home page custom navbar
  - Global header (on other pages)
- Route: `/game`

## Technical Details
- Built with React hooks (useState, useEffect)
- No external game libraries required
- Fully self-contained game logic
- Responsive CSS with animations
- AI logic for computer opponents

## Game Controls
- **Click Card**: Play a card from your hand
- **Click Deck**: Draw a card
- **Color Chooser**: Select color when playing wild cards
- **Start/Restart**: Begin a new game

Enjoy playing UNO! 🎮🃏
