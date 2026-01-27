// Import event-specific logo images
import colorChaosLogo from '../assets/logo/colorchaos.png';
import draw4ArenaLogo from '../assets/logo/draw4arena.png';
import logicReverseLogo from '../assets/logo/logicreverse.png';
import murderMysteryLogo from '../assets/logo/murdermystry.png';
import skipTheObviousLogo from '../assets/logo/skiptheobvious.png';
import unoFrameLogo from '../assets/logo/unoframe.png';
import unoReverseAlibiLogo from '../assets/logo/unoreversealibi.png';
import wildCardAuctionLogo from '../assets/logo/wildcardauction.png';

// Map event IDs to their specific logo images
const eventLogoMap = {
  'color-chaos-quiz': colorChaosLogo,
  'draw-4-arena': draw4ArenaLogo,
  'logic-reverse': logicReverseLogo,
  'uno-reverse-alibi': unoReverseAlibiLogo,
  'uno-reverse-alibi-2': murderMysteryLogo, // WILD PROMPT event
  'skip-the-obvious': skipTheObviousLogo,
  'uno-frame': unoFrameLogo,
  'wild-card-auction': wildCardAuctionLogo
};

/**
 * Get the event-specific logo for a given event ID
 * @param {string} eventId - The event ID
 * @param {string} fallback - Fallback image if no specific logo found
 * @returns {string} - The logo image source
 */
export const getEventLogo = (eventId, fallback = null) => {
  return eventLogoMap[eventId] || fallback;
};

export default eventLogoMap;