<<<<<<< ours
var theToken = 'not_set';  

function onPushwooshInitialized(pushNotification) {

    //if you need push token at a later time you can always get it from Pushwoosh plugin
    pushNotification.getPushToken(function(token) {
      console.info('push token: ' + token);
    }
    );
    
    //and HWID if you want to communicate with Pushwoosh API
    pushNotification.getPushwooshHWID(function(token) {
      console.info('Pushwoosh HWID: ' + token);
    }
    ); 
    
    //settings tags
    pushNotification.setTags({
      tagName: "tagValue",
      intTagName: 10
    },
    function(status) {
     console.log('setTags success: ' + JSON.stringify(status));
   },
   function(status) {
     console.log('setTags failed');
   }
   );
    
    pushNotification.getTags(function(status) {
       console.log('getTags success: ' + JSON.stringify(status));
     },
     function(status) {
       console.log('getTags failed');
     }
     );
    
    //start geo tracking.
    //pushNotification.startLocationTracking();
  }

  function initPushwoosh() {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    
    //set push notifications handler
    document.addEventListener('push-notification',
      function(event) {
        var message = event.notification.message;
        var userData = event.notification.userdata;

	  //dump custom data to the console if it exists
	  if (typeof(userData) != "undefined") {
		console.warn('user data: ' + JSON.stringify(userData));
	  }
	}
	);
    
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({
    	projectid: "578524963473",
     	appid: "96698-47E03",
     	serviceName: "dr-luevano-ios"
   	});
	  
	  
    //register for push notifications
    pushNotification.registerDevice(
      function(status) {
		  
		theToken = status.pushToken;
		the_token = theToken;
		 
		// Registro de Token
	//if( the_token != 'not_set' && token_sent == 0){
    if(the_patient != null && the_token != 'not_set' && token_sent == 0){

			uploadToken();
		}else{
			console.log('Token no enviado: '+token_sent)
		}
		  
        //document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
        onPushwooshInitialized(pushNotification);
		  console.log(status.pushToken);
      },
      function(status) {
        console.log("failed to register: " + status);
        console.warn(JSON.stringify(['failed to register ', status]));
      }
      );
  }

  var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      initPushwoosh();
      app.receivedEvent('deviceready');
		
		/*universalLinks.subscribe('ul_feedEvent', function (eventData) {
			// do some work
			// in eventData you'll see url и and parsed url with schema, host, path and arguments
			console.log('Did launch application from the link: ' + JSON.stringify(eventData));
			alert('Did launch application from the link: ' + JSON.stringify(eventData));
		});		
		console.log('universal');
		*/
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      "use strict";
		/*var parentElement = document.getElementById(id);
      	var listeningElement = parentElement.querySelector('.listening');
      	var receivedElement = parentElement.querySelector('.received');

      	listeningElement.setAttribute('style', 'display:none;');
      	receivedElement.setAttribute('style', 'display:block;');

      	console.log('Received Event: ' + id);*/
    }
  };

  app.initialize();

	$(document).on('click','#profile',function(){
		console.log(theToken);
    // ons.notification.toast({message: theToken, timeout: 3500});

		//alert("the_token" + theToken);
	});
=======
(function () {
  const capacitor = window.Capacitor || {};
  const plugins = capacitor.Plugins || {};
  const PushNotifications = plugins.PushNotifications;

  const isNativePlatform = (() => {
    if (typeof capacitor.isNativePlatform === 'function') {
      return capacitor.isNativePlatform();
    }
    if (typeof capacitor.getPlatform === 'function') {
      return capacitor.getPlatform() !== 'web';
    }
    return capacitor.platform && capacitor.platform !== 'web';
  })();

  function cachePendingToken(token) {
    if (!token) {
      return;
    }
    try {
      localStorage.setItem('pendingPushToken', token);
    } catch (error) {
      console.warn('Unable to cache pending push token:', error);
    }
  }

  window.PushNotificationHandler = {
    theToken: 'not_set',
    token_sent: 0,

    async initPushNotifications() {
      if (!isNativePlatform) {
        console.log('Push notifications are only available on native platforms.');
        return;
      }

      if (!PushNotifications) {
        console.warn('Capacitor PushNotifications plugin not available.');
        return;
      }

      try {
        const permStatus = await PushNotifications.requestPermissions();
        if (permStatus.receive !== 'granted') {
          console.warn('Push notification permission denied:', permStatus);
          return;
        }

        this.setupPushListeners();
        await PushNotifications.register();
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    },

    setupPushListeners() {
      if (!PushNotifications) {
        return;
      }

      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        this.handleToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration failed:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });
    },

    handleToken(tokenValue) {
      if (!tokenValue) {
        return;
      }

      this.theToken = tokenValue;
      window.the_token = tokenValue;

      if (typeof window.sendPushToken === 'function') {
        window.sendPushToken(tokenValue);
      } else if (typeof window.the_patient !== 'undefined' && window.the_patient !== null) {
        this.uploadToken();
      } else {
        cachePendingToken(tokenValue);
      }
    },

    uploadToken(type = null) {
      if (!this.theToken || !window.the_patient) {
        cachePendingToken(this.theToken);
        return;
      }

      if (typeof window.sendPushToken === 'function') {
        window.sendPushToken(this.theToken);
        return;
      }

      console.log('Uploading token to server:', this.theToken);

      $.ajax({
        async: true,
        url: window.rootPath + '/_sudiv3/ar_engine/token_device.php',
        type: 'POST',
        data: {
          the_patient: window.the_patient,
          token: this.theToken,
        },
      })
        .done((data) => {
          console.log('Token upload result:', data);
          this.token_sent = 1;
        })
        .fail((error) => {
          console.error('Error uploading token:', error);
          this.token_sent = 0;
          cachePendingToken(this.theToken);
        });
    },

    checkPendingToken() {
      let pendingToken = null;
      try {
        pendingToken = localStorage.getItem('pendingPushToken');
      } catch (error) {
        console.warn('Unable to read pending push token:', error);
      }

      if (!pendingToken) {
        return;
      }

      console.log('Found pending token, attempting to send.');
      this.theToken = pendingToken;
      window.the_token = pendingToken;

      if (typeof window.sendPushToken === 'function') {
        window.sendPushToken(pendingToken);
      } else {
        this.uploadToken();
      }
    },
  };

  document.addEventListener(
    'deviceready',
    function () {
      window.PushNotificationHandler.initPushNotifications();
    },
    false
  );

  document.addEventListener('DOMContentLoaded', function () {
    window.PushNotificationHandler.checkPendingToken();
  });
})();
>>>>>>> theirs
