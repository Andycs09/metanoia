# Google Apps Script Setup for Image Upload

This guide will help you set up Google Apps Script to handle image uploads to Google Drive from your registration form.

## Setup Instructions

### 1. Create a Google Drive Folder
1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder for storing participant images (e.g., "Event Registration Images")
3. Right-click the folder → Share → Copy link
4. Extract the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

### 2. Create Google Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `ImageUploadScript.js`
4. Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your actual folder ID from step 1

### 3. Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Description: "Image Upload Service"
4. Execute as: "Me"
5. Who has access: "Anyone" (required for CORS)
6. Click "Deploy"
7. Copy the web app URL

### 4. Update React App
1. In `Register.jsx`, find the `GOOGLE_DRIVE_SCRIPT_URL` constant
2. Replace `YOUR_DRIVE_SCRIPT_ID` with your web app URL

```javascript
const GOOGLE_DRIVE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
```

### 5. Test the Setup
1. Run your React app
2. Go to the registration page
3. Try uploading an image for a participant
4. Check your Google Drive folder for the uploaded image

## Features

- **File Validation**: Only allows image files (JPEG, PNG, GIF, WebP)
- **Size Limit**: Maximum 5MB per image
- **Organization**: Creates subfolders by event and date
- **Security**: Files are set to "viewable by anyone with link"
- **Error Handling**: Comprehensive error messages
- **CORS Support**: Handles cross-origin requests

## Folder Structure

Your Google Drive folder will be organized like this:
```
Event Registration Images/
├── Event_uno-frame_2025-01-24/
│   ├── participant_0_1706123456789.jpg
│   ├── participant_1_1706123567890.png
│   └── ...
├── Event_wild-card-auction_2025-01-24/
│   └── ...
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the web app is deployed with "Anyone" access
2. **Upload Fails**: Check that the folder ID is correct and the folder exists
3. **File Not Found**: Verify the Google Apps Script URL is correct
4. **Permission Denied**: Ensure the script has permission to access Google Drive

### Debug Steps:

1. Check the Google Apps Script logs (View → Logs)
2. Test the web app URL directly in a browser
3. Verify folder permissions in Google Drive
4. Check browser console for JavaScript errors

## Security Notes

- Images are stored with "anyone with link" permissions for easy access
- File names include timestamps to prevent conflicts
- Only image files are accepted
- File size is limited to prevent abuse
- Each event gets its own subfolder for organization

## Customization

You can modify the script to:
- Change allowed file types in `ALLOWED_MIME_TYPES`
- Adjust file size limit in `MAX_FILE_SIZE`
- Modify folder naming convention
- Add additional metadata to uploaded files
- Implement different permission levels