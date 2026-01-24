# Event Data Management

This directory contains JSON files for managing event data in the UnoVerse application.

## Files Overview

### 1. `events.json`
Main events data file containing basic information for all events.

**Structure:**
```json
{
  "events": [
    {
      "id": "unique-event-id",
      "title": "Event Title",
      "image": "image-filename.png",
      "short": "Short description for cards",
      "details": "Longer description",
      "maxParticipants": 4,
      "category": "Category Name",
      "difficulty": "Easy/Medium/Hard",
      "featured": true/false
    }
  ],
  "categories": ["Mystery", "Strategy", "Creative", ...],
  "difficulties": ["Easy", "Medium", "Hard"],
  "metadata": { ... }
}
```

### 2. `eventDetails.json`
Detailed information for each event, used for event detail pages.

**Structure:**
```json
{
  "event-id": {
    "id": "event-id",
    "title": "Event Title",
    "subtitle": "Event Subtitle",
    "description": "Short description",
    "longDescription": "Detailed description",
    "category": "Category",
    "difficulty": "Easy/Medium/Hard",
    "duration": "2 hours",
    "teamSize": {
      "min": 1,
      "max": 4,
      "recommended": 2
    },
    "venue": "Venue name or TBA",
    "date": "24-25 Nov",
    "time": "TBA",
    "prizes": {
      "first": "₹5,000",
      "second": "₹3,000",
      "third": "₹1,500"
    },
    "rules": ["Rule 1", "Rule 2", ...],
    "requirements": ["Requirement 1", "Requirement 2", ...],
    "aboutEvent": "Comprehensive description",
    "contactInfo": {
      "coordinator": "Name",
      "email": "email@domain.com",
      "phone": "+91-XXXXXXXXXX"
    }
  }
}
```

### 3. `eventTemplate.json`
Template file with instructions for adding new events.

## How to Add a New Event

### Step 1: Add Basic Event Info
1. Open `events.json`
2. Add a new event object to the `events` array:
```json
{
  "id": "new-event-id",
  "title": "New Event Title",
  "image": "new-event-image.png",
  "short": "Short description",
  "details": "Longer description",
  "maxParticipants": 4,
  "category": "Category",
  "difficulty": "Medium",
  "featured": false
}
```

### Step 2: Add Detailed Event Info
1. Open `eventDetails.json`
2. Add a new event details object using the same ID:
```json
"new-event-id": {
  // Copy from eventTemplate.json and fill in details
}
```

### Step 3: Update Categories (if needed)
If adding a new category, update the `categories` array in `events.json`.

## Field Descriptions

### Basic Event Fields (`events.json`)
- **id**: Unique identifier (lowercase, hyphen-separated)
- **title**: Display name of the event
- **image**: Image filename (should exist in assets folder)
- **short**: Brief description for event cards
- **details**: Longer description for tooltips/previews
- **maxParticipants**: Maximum team size
- **category**: Event category for filtering
- **difficulty**: Difficulty level (Easy/Medium/Hard)
- **featured**: Whether to show in featured events section

### Detailed Event Fields (`eventDetails.json`)
- **subtitle**: Category or theme description
- **longDescription**: Comprehensive event description
- **duration**: How long the event runs
- **teamSize**: Object with min, max, and recommended team sizes
- **venue**: Event location
- **date**: Event date
- **time**: Event time
- **prizes**: Prize structure for winners
- **rules**: Array of event rules
- **requirements**: Array of participant requirements
- **aboutEvent**: Detailed about section content
- **contactInfo**: Coordinator contact details

## Data Validation

Use the `eventDataManager.js` utility functions to validate data:

```javascript
import { validateEventData, validateEventDetails } from '../utils/eventDataManager';

// Validate basic event data
const validation = validateEventData(eventObject);
if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}

// Validate detailed event data
const detailsValidation = validateEventDetails(detailsObject);
if (!detailsValidation.isValid) {
  console.log('Errors:', detailsValidation.errors);
}
```

## Best Practices

1. **Consistent IDs**: Use lowercase, hyphen-separated IDs
2. **Image Names**: Ensure image files exist in the assets folder
3. **Categories**: Use existing categories when possible
4. **Validation**: Always validate data before adding to production
5. **Backup**: Keep backups of JSON files before making changes
6. **Testing**: Test events display properly after adding new data

## Utility Functions

The `eventDataManager.js` file provides helpful functions:
- `getAllEvents()`: Get all events
- `getEventById(id)`: Get specific event
- `getEventDetails(id)`: Get detailed event info
- `getEventsByCategory(category)`: Filter by category
- `getFeaturedEvents()`: Get featured events only
- `searchEvents(term)`: Search events
- `validateEventData(data)`: Validate event structure

## Example Usage in Components

```javascript
import { getEventDetails, getAllEvents } from '../utils/eventDataManager';

// In a component
const EventDetailPage = ({ eventId }) => {
  const eventDetails = getEventDetails(eventId);
  
  if (!eventDetails) {
    return <div>Event not found</div>;
  }
  
  return (
    <div>
      <h1>{eventDetails.title}</h1>
      <p>{eventDetails.longDescription}</p>
      {/* ... rest of component */}
    </div>
  );
};
```

## Troubleshooting

### Common Issues:
1. **Event not displaying**: Check if ID matches between files
2. **Image not loading**: Verify image file exists in assets folder
3. **Validation errors**: Use validation functions to check data structure
4. **Category not showing**: Ensure category exists in categories array

### Debug Tips:
- Use browser console to check for JSON parsing errors
- Validate JSON syntax using online JSON validators
- Check network tab for failed image loads
- Use React DevTools to inspect component props