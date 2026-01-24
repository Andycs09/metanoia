// Event Data Management Utilities
import eventsData from '../data/events.json';
import eventDetailsData from '../data/eventDetails.json';

/**
 * Get all events
 * @returns {Array} Array of all events
 */
export const getAllEvents = () => {
  return eventsData.events;
};

/**
 * Get event by ID
 * @param {string} eventId - The event ID
 * @returns {Object|null} Event object or null if not found
 */
export const getEventById = (eventId) => {
  return eventsData.events.find(event => event.id === eventId) || null;
};

/**
 * Get detailed event information by ID
 * @param {string} eventId - The event ID
 * @returns {Object|null} Detailed event object or null if not found
 */
export const getEventDetails = (eventId) => {
  return eventDetailsData[eventId] || null;
};

/**
 * Get events by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of events in the specified category
 */
export const getEventsByCategory = (category) => {
  return eventsData.events.filter(event => 
    event.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get events by difficulty
 * @param {string} difficulty - The difficulty level (Easy/Medium/Hard)
 * @returns {Array} Array of events with the specified difficulty
 */
export const getEventsByDifficulty = (difficulty) => {
  return eventsData.events.filter(event => 
    event.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
};

/**
 * Get featured events
 * @returns {Array} Array of featured events
 */
export const getFeaturedEvents = () => {
  return eventsData.events.filter(event => event.featured === true);
};

/**
 * Get all available categories
 * @returns {Array} Array of category names
 */
export const getCategories = () => {
  return eventsData.categories;
};

/**
 * Get all difficulty levels
 * @returns {Array} Array of difficulty levels
 */
export const getDifficulties = () => {
  return eventsData.difficulties;
};

/**
 * Search events by title or description
 * @param {string} searchTerm - The search term
 * @returns {Array} Array of matching events
 */
export const searchEvents = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return eventsData.events.filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.short.toLowerCase().includes(term) ||
    event.details.toLowerCase().includes(term)
  );
};

/**
 * Validate event data structure
 * @param {Object} eventData - Event data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateEventData = (eventData) => {
  const errors = [];
  const requiredFields = ['id', 'title', 'image', 'short', 'details', 'maxParticipants', 'category', 'difficulty'];
  
  requiredFields.forEach(field => {
    if (!eventData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (eventData.maxParticipants && (eventData.maxParticipants < 1 || eventData.maxParticipants > 10)) {
    errors.push('maxParticipants must be between 1 and 10');
  }

  if (eventData.difficulty && !['Easy', 'Medium', 'Hard'].includes(eventData.difficulty)) {
    errors.push('difficulty must be Easy, Medium, or Hard');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate detailed event data structure
 * @param {Object} detailsData - Detailed event data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateEventDetails = (detailsData) => {
  const errors = [];
  const requiredFields = [
    'id', 'title', 'subtitle', 'description', 'longDescription', 
    'category', 'difficulty', 'duration', 'teamSize', 'aboutEvent'
  ];
  
  requiredFields.forEach(field => {
    if (!detailsData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (detailsData.teamSize) {
    if (!detailsData.teamSize.min || !detailsData.teamSize.max) {
      errors.push('teamSize must have min and max values');
    }
    if (detailsData.teamSize.min > detailsData.teamSize.max) {
      errors.push('teamSize min cannot be greater than max');
    }
  }

  if (detailsData.rules && !Array.isArray(detailsData.rules)) {
    errors.push('rules must be an array');
  }

  if (detailsData.requirements && !Array.isArray(detailsData.requirements)) {
    errors.push('requirements must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get event statistics
 * @returns {Object} Statistics about events
 */
export const getEventStatistics = () => {
  const events = getAllEvents();
  const categories = {};
  const difficulties = {};
  
  events.forEach(event => {
    categories[event.category] = (categories[event.category] || 0) + 1;
    difficulties[event.difficulty] = (difficulties[event.difficulty] || 0) + 1;
  });

  return {
    totalEvents: events.length,
    featuredEvents: events.filter(e => e.featured).length,
    categoriesCount: categories,
    difficultiesCount: difficulties,
    averageMaxParticipants: Math.round(
      events.reduce((sum, e) => sum + e.maxParticipants, 0) / events.length
    )
  };
};

// Export default object with all functions
export default {
  getAllEvents,
  getEventById,
  getEventDetails,
  getEventsByCategory,
  getEventsByDifficulty,
  getFeaturedEvents,
  getCategories,
  getDifficulties,
  searchEvents,
  validateEventData,
  validateEventDetails,
  getEventStatistics
};