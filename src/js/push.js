// Import Capacitor core and PushNotifications plugin
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Make functions available globally
window.PushNotificationHandler = {
  theToken: 'not_set',
  token_sent: 0,

  // Initialize push notifications with Capacitor
  async initPushNotifications() {
      if (!Capacitor.isNativePlatform()) {
          console.log('Push notifications not available on web');
          return;
      }

      try {
          const permStatus = await PushNotifications.requestPermissions();
          
          if (permStatus.receive === 'granted') {
              await PushNotifications.register();
              this.setupPushListeners();
          } else {
              console.log('Push notification permission denied');
          }
      } catch (error) {
          console.error('Error initializing push notifications:', error);
      }
  },

  // Setup event listeners for push notifications
  setupPushListeners() {
      PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token:', token.value);
          
          this.theToken = token.value;
          window.the_token = token.value; // Update global variable for compatibility
          
          if (typeof window.the_patient !== 'undefined' && window.the_patient !== null && !this.token_sent) {
              this.uploadToken();
          } else {
              localStorage.setItem('pendingPushToken', token.value);
          }
      });
      
      PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration failed:', error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
      });
  },

  // Upload token to server
  uploadToken(type = null) {
      console.log("Uploading token to server:", this.theToken);
      
      $.ajax({
          async: true,
          url: window.rootPath+'/_sudiv3/ar_engine/token_device.php',
          type: 'POST',
          data: {
              the_patient: window.the_patient, 
              token: this.theToken
          }
      }).done((data) => {
          console.log('Token upload result:', data);
          this.token_sent = 1;
      }).fail((error) => {
          console.error('Error uploading token:', error);
      });
  },

  // Check for pending token
  checkPendingToken() {
      const pendingToken = localStorage.getItem('pendingPushToken');
      
      if (pendingToken && typeof window.the_patient !== 'undefined' && 
          window.the_patient !== null && !this.token_sent) {
          console.log('Found pending token, sending to server');
          
          this.theToken = pendingToken;
          window.the_token = pendingToken;
          
          this.uploadToken();
          localStorage.removeItem('pendingPushToken');
      }
  }
};

// Initialize when device is ready
document.addEventListener('deviceready', function() {
  PushNotificationHandler.initPushNotifications();
}, false);

// Check for pending token when app starts
document.addEventListener('DOMContentLoaded', function() {
  PushNotificationHandler.checkPendingToken();
});