import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Global variables
var theToken = 'not_set';
var the_token = 'not_set'; // Keep both variables for compatibility
var token_sent = 0;

// Initialize push notifications with Capacitor
async function initPushNotifications() {
  // Check if running on a native platform
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications not available on web');
    return;
  }

  try {
    // Request permission to use push notifications
    const permStatus = await PushNotifications.requestPermissions();
    
    if (permStatus.receive === 'granted') {
      // Register with FCM/APNS
      await PushNotifications.register();
      
      // Setup event listeners
      setupPushListeners();
    } else {
      console.log('Push notification permission denied');
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
}

// Setup event listeners for push notifications
function setupPushListeners() {
  // On registration success
  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token:', token.value);
    
    // Update global variables
    theToken = token.value;
    the_token = token.value;
    
    // Try to send token to server if user is authenticated
    if (typeof the_patient !== 'undefined' && the_patient !== null && token_sent === 0) {
      uploadToken();
    } else {
      console.log('Token not sent. User not authenticated or token already sent.');
      // Save token for later
      localStorage.setItem('pendingPushToken', token.value);
    }
  });
  
  // On registration error
  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration failed:', error);
  });
  
  // On push notification received
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received:', notification);
  });
  
  // On push notification action performed
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push notification action performed:', action);
  });
}

// Check for pending token when user logs in
function checkPendingToken() {
  const pendingToken = localStorage.getItem('pendingPushToken');
  
  if (pendingToken && typeof the_patient !== 'undefined' && the_patient !== null && token_sent === 0) {
    console.log('Found pending token, sending to server');
    
    // Update global variables
    theToken = pendingToken;
    the_token = pendingToken;
    
    // Send token to server
    uploadToken();
    
    // Clear pending token
    localStorage.removeItem('pendingPushToken');
  }
}

// Function to upload token to server (keep your existing function)
function uploadToken(type=null) {
  console.log("Uploading token to server:", the_token);
  
  // AJAX - Load Records
  $.ajax({
    async: true,
    url: rootPath+'/_sudiv3/ar_engine/token_device.php',
    type: 'POST',
    data: {the_patient: the_patient, token: the_token}
  }).done(function(data) {
    console.log('Token upload result:', data);
    token_sent = 1;
  }).fail(function(error) {
    console.error('Error uploading token:', error);
  });
}

// Initialize when device is ready
document.addEventListener('deviceready', function() {
  initPushNotifications();
}, false);

// Check for pending token when app starts
document.addEventListener('DOMContentLoaded', function() {
  checkPendingToken();
});

// Function to call after successful login
function onLoginSuccess(patientId) {
  the_patient = patientId;
  checkPendingToken();
}

// Export functions and variables
export {
  theToken,
  the_token,
  initPushNotifications,
  uploadToken,
  onLoginSuccess
};