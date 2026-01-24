/**
 * Google Apps Script for handling image uploads to Google Drive
 * Deploy this as a web app with execute permissions set to "Anyone"
 */

// Configuration
const DRIVE_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID'; // Replace with your folder ID
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function doPost(e) {
  try {
    // Enable CORS
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    };

    // Handle preflight OPTIONS request
    if (e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders(response.headers);
    }

    // Get parameters
    const participantIndex = e.parameter.participantIndex;
    const eventId = e.parameter.eventId;
    const timestamp = e.parameter.timestamp;

    // Get the uploaded file
    const fileBlob = e.parameter.image;
    
    if (!fileBlob) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    const mimeType = fileBlob.getContentType();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Validate file size
    const fileSize = fileBlob.getBytes().length;
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum 5MB allowed.');
    }

    // Get or create the target folder
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Create a subfolder for the event if it doesn't exist
    const eventFolderName = `Event_${eventId}_${new Date().toISOString().split('T')[0]}`;
    let eventFolder;
    const existingFolders = folder.getFoldersByName(eventFolderName);
    if (existingFolders.hasNext()) {
      eventFolder = existingFolders.next();
    } else {
      eventFolder = folder.createFolder(eventFolderName);
    }

    // Generate unique filename
    const fileExtension = getFileExtension(mimeType);
    const fileName = `participant_${participantIndex}_${Date.now()}.${fileExtension}`;

    // Upload file to Google Drive
    const file = eventFolder.createFile(fileBlob.setName(fileName));
    
    // Set file permissions to be viewable by anyone with the link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get the file URL
    const fileUrl = `https://drive.google.com/file/d/${file.getId()}/view`;
    const directImageUrl = `https://drive.google.com/uc?id=${file.getId()}`;

    // Log the upload
    console.log(`Image uploaded: ${fileName}, URL: ${fileUrl}`);

    // Return success response
    const result = {
      success: true,
      imageUrl: directImageUrl,
      fileId: file.getId(),
      fileName: fileName,
      participantIndex: participantIndex,
      eventId: eventId,
      uploadTime: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(response.headers);

  } catch (error) {
    console.error('Upload error:', error);
    
    const errorResult = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
  }
}

function doGet(e) {
  // Handle CORS preflight for GET requests
  return ContentService
    .createTextOutput('Image upload service is running')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
}

function getFileExtension(mimeType) {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
  };
  return extensions[mimeType] || 'jpg';
}

// Test function to verify the script works
function testUpload() {
  console.log('Image upload script is ready!');
  console.log('Folder ID:', DRIVE_FOLDER_ID);
  console.log('Allowed types:', ALLOWED_MIME_TYPES);
  console.log('Max file size:', MAX_FILE_SIZE / (1024 * 1024), 'MB');
}