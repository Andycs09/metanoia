import React, { useState, useEffect } from 'react';
import '../styles/UnoGame.css';
import bgImage from '../assets/home page theme.png';

// Card colors and types
const COLORS = ['red', 'blue', 'green', 'yellow'];
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Create a simplified UNO deck (numbers, +2, +4 only - no wildcards)
const createDeck = () => {
  const deck = [];
  
  // Number cards (0 has 1 card per color, 1-9 have 2 cards per color)
  COLORS.forEach(color => {
    deck.push({ color, value: 0, type: 'number' });
    NUMBERS.slice(1).forEach(num => {
      deck.push({ color, value: num, type: 'number' });
      deck.push({ color, value: num, type: 'number' });
    });
  });
  
  // +2 cards (2 per color)
  COLORS.forEach(color => {
    deck.push({ color, value: 'draw2', type: 'special' });
    deck.push({ color, value: 'draw2', type: 'special' });
  });
  
  // +4 cards (1 per color - no wild functionality)
  COLORS.forEach(color => {
    deck.push({ color, value: 'draw4', type: 'special' });
  });
  
  return deck;
};

// Shuffle deck
const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function UnoGame() {
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(3);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showRegistration, setShowRegistration] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    email: '',
    phone: '',
    registrationNo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle registration submit
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          class: formData.class,
          email: formData.email,
          phone: formData.phone,
          registrationNo: formData.registrationNo,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowRegistration(false);
      startGame();
    }, 1000);
  };

  // Initialize game
  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const newPlayers = [];
    
    // Deal 7 cards to each player
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push({
        id: i,
        name: i === 0 ? 'You' : `Player ${i + 1}`,
        hand: newDeck.splice(0, 7),
        score: 0
      });
    }
    
    // Find a valid starting card (not wild or special)
    let startCard;
    let startIndex = 0;
    do {
      startCard = newDeck[startIndex];
      startIndex++;
    } while (startCard.type !== 'number' && startIndex < newDeck.length);
    
    newDeck.splice(startIndex - 1, 1);
    
    setPlayers(newPlayers);
    setDeck(newDeck);
    setDiscardPile([startCard]);
    setCurrentPlayer(0);
    setDirection(1);
    setGameStarted(true);
    setWinner(null);
    setMessage(`${newPlayers[0].name} starts!`);
  };

  // Draw card from deck
  const drawCard = (playerIndex) => {
    if (deck.length === 0) {
      // Reshuffle discard pile into deck
      const topCard = discardPile[discardPile.length - 1];
      const newDeck = shuffleDeck(discardPile.slice(0, -1));
      setDeck(newDeck);
      setDiscardPile([topCard]);
      return;
    }
    
    const newPlayers = [...players];
    const card = deck[0];
    newPlayers[playerIndex].hand.push(card);
    setPlayers(newPlayers);
    setDeck(deck.slice(1));
  };

  // Check if card can be played
  const canPlayCard = (card, topCard) => {
    if (card.color === topCard.color) return true;
    if (card.value === topCard.value) return true;
    return false;
  };

  // Play a card
  const playCard = (playerIndex, cardIndex) => {
    if (playerIndex !== currentPlayer) return;
    
    const card = players[playerIndex].hand[cardIndex];
    const topCard = discardPile[discardPile.length - 1];
    
    if (!canPlayCard(card, topCard)) {
      setMessage('Invalid move! Card cannot be played.');
      return;
    }
    
    // Remove card from player's hand
    const newPlayers = [...players];
    newPlayers[playerIndex].hand.splice(cardIndex, 1);
    
    // Check for winner
    if (newPlayers[playerIndex].hand.length === 0) {
      setWinner(newPlayers[playerIndex]);
      setGameStarted(false);
      setMessage(`${newPlayers[playerIndex].name} wins!`);
      return;
    }
    
    setPlayers(newPlayers);
    setDiscardPile([...discardPile, card]);
    
    // Handle special cards
    handleSpecialCard(card);
  };

  // Handle special card effects
  const handleSpecialCard = (card) => {
    let nextPlayer = currentPlayer;
    
    if (card.value === 'draw2') {
      const targetPlayer = (currentPlayer + direction + numPlayers) % numPlayers;
      drawCard(targetPlayer);
      drawCard(targetPlayer);
      nextPlayer = (targetPlayer + direction + numPlayers) % numPlayers;
      setMessage(`${players[targetPlayer].name} draws 2 cards!`);
    } else if (card.value === 'draw4') {
      const targetPlayer = (currentPlayer + direction + numPlayers) % numPlayers;
      for (let i = 0; i < 4; i++) {
        drawCard(targetPlayer);
      }
      nextPlayer = (targetPlayer + direction + numPlayers) % numPlayers;
      setMessage(`${players[targetPlayer].name} draws 4 cards!`);
    } else {
      nextPlayer = (currentPlayer + direction + numPlayers) % numPlayers;
    }
    
    setCurrentPlayer(nextPlayer);
  };



  // AI turn
  useEffect(() => {
    if (!gameStarted || currentPlayer === 0) return;
    
    const timer = setTimeout(() => {
      const player = players[currentPlayer];
      const topCard = discardPile[discardPile.length - 1];
      
      // Find playable card
      const playableIndex = player.hand.findIndex(card => canPlayCard(card, topCard));
      
      if (playableIndex !== -1) {
        playCard(currentPlayer, playableIndex);
      } else {
        // Draw card
        drawCard(currentPlayer);
        setMessage(`${player.name} draws a card`);
        setCurrentPlayer((currentPlayer + direction + numPlayers) % numPlayers);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentPlayer, gameStarted]);

  // Player draws card
  const handlePlayerDraw = () => {
    if (currentPlayer !== 0) return;
    drawCard(0);
    setMessage('You drew a card');
    setCurrentPlayer((currentPlayer + direction + numPlayers) % numPlayers);
  };

  const topCard = discardPile[discardPile.length - 1];

  // Render a card with proper UNO styling
  const renderCard = (card, isClickable = false, onClick = null) => {
    const cardColor = card.color;
    
    return (
      <div 
        className={`card card-${cardColor} ${isClickable && showRecommendations ? 'playable' : ''} ${isClickable && !showRecommendations ? 'clickable-no-glow' : ''}`}
        onClick={onClick}
      >
        <div className="card-inner">
          {/* Top left corner */}
          <div className="card-corner card-corner-top">
            <div className="corner-value">
              {renderCardSymbol(card)}
            </div>
          </div>
          
          {/* Center */}
          <div className="card-center">
            <div className="card-center-oval">
              <div className="card-center-value">
                {renderCardSymbol(card)}
              </div>
            </div>
          </div>
          
          {/* Bottom right corner */}
          <div className="card-corner card-corner-bottom">
            <div className="corner-value">
              {renderCardSymbol(card)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render card symbol/value
  const renderCardSymbol = (card) => {
    if (card.value === 'draw2') return <span className="symbol-draw">+2</span>;
    if (card.value === 'draw4') return <span className="symbol-draw">+4</span>;
    return card.value;
  };

  return (
    <div className="uno-game" style={{ backgroundImage: `url(${bgImage})` }}>
      {showRegistration ? (
        <div className="registration-overlay">
          <div className="register-card">
            <h1 className="register-title">Register for UNO Tournament</h1>
            
            <form onSubmit={handleRegistrationSubmit} className="register-form">
              <h3 className="participant-label">Player Details</h3>
              
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="form-input name-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="class"
                  placeholder="Class"
                  value={formData.class}
                  onChange={handleFormChange}
                  required
                  className="form-input class-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="form-input email-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="form-input phone-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="registrationNo"
                  placeholder="Registration No"
                  value={formData.registrationNo}
                  onChange={handleFormChange}
                  required
                  className="form-input regno-input"
                />
              </div>

              <div className="form-group">
                <label className="player-count-label">
                  Number of Players:
                  <select 
                    value={numPlayers} 
                    onChange={(e) => setNumPlayers(Number(e.target.value))}
                    className="player-select"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Starting Game...' : 'Start Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="uno-header">
            <h1>UNO GAME</h1>
            {winner && (
              <div className="winner-message">
                <h2>🎉 {winner.name} Wins! 🎉</h2>
                <button onClick={() => { setShowRegistration(true); setWinner(null); setGameStarted(false); }} className="start-btn">Play Again</button>
              </div>
            )}
          </div>

          {gameStarted && (
            <>
              <div className="game-info">
            <div className="current-player">
              <strong>{players[currentPlayer]?.name}'s Turn</strong>
            </div>
            <div className="direction">
              Direction: {direction === 1 ? '↻ Clockwise' : '↺ Counter-clockwise'}
            </div>
            <div className="message">{message}</div>
            <div className="recommendation-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={showRecommendations}
                  onChange={(e) => setShowRecommendations(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                {showRecommendations ? '✨ Hints ON' : '💡 Hints OFF'}
              </span>
            </div>
          </div>

          <div className="game-board">
            {/* Other players */}
            <div className="other-players">
              {players.slice(1).map((player, idx) => (
                <div key={player.id} className={`player-info ${currentPlayer === player.id ? 'active' : ''}`}>
                  <h3>{player.name}</h3>
                  <div className="player-cards">
                    {player.hand.map((_, cardIdx) => (
                      <div key={cardIdx} className="card card-back">
                        <div className="card-back-design">
                          <div className="card-back-circle"></div>
                          <div className="card-back-text">UNO</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card-count">{player.hand.length} cards</div>
                </div>
              ))}
            </div>

            {/* Center area */}
            <div className="center-area">
              <div className="deck-area">
                <div className="deck" onClick={handlePlayerDraw}>
                  <div className="card card-back">
                    <div className="card-back-design">
                      <div className="card-back-circle"></div>
                      <div className="card-back-text">UNO</div>
                    </div>
                  </div>
                  <div className="deck-count">{deck.length}</div>
                </div>
                
                <div className="discard-pile">
                  {topCard && renderCard(topCard)}
                </div>
              </div>
            </div>

            {/* Player hand */}
            <div className="player-hand">
              <h3>Your Hand</h3>
              <div className="hand-cards">
                {players[0]?.hand.map((card, idx) => (
                  <div key={idx}>
                    {renderCard(
                      card, 
                      canPlayCard(card, topCard) && currentPlayer === 0,
                      () => currentPlayer === 0 && playCard(0, idx)
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

            </>
          )}
        </>
      )}
    </div>
  );
}
