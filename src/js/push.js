import PushNotifications from '@capacitor/push-notifications';

let theToken = 'not_set';

// Inicializa Pushwoosh con los datos de tu app
const PUSHWOOSH_CONFIG = {
  appCode: "DE31D-FA23F", // Tu código de Pushwoosh
  fcmSenderId: "YOUR_FIREBASE_SENDER_ID", // Tu sender ID de Firebase
};

async function onPushwooshInitialized() {
  console.log("Initializing Pushwoosh");

  try {
    // Inicializa Pushwoosh con tu appCode y fcmSenderId
    PushNotifications.register()
      .then(() => {
        console.log("Pushwoosh SDK initialized successfully.");
      })
      .catch((err) => {
        console.error("Error initializing Pushwoosh SDK:", err);
      });

    // Solicita permisos para notificaciones push
    const permissionStatus = await PushNotifications.requestPermissions();

    if (permissionStatus.receive === 'granted') {
      PushNotifications.register();

      // Obtener token del dispositivo
      PushNotifications.addListener('registration', (token) => {
        console.info('Push token: ', token.value);
        theToken = token.value;

        // Sube el token a tu servidor
        uploadToken();
      });

      // Manejo de notificaciones
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push Notification Received:', notification);
      });

      // Manejo de acciones de notificación
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push Notification Action Performed:', notification);
      });

    } else {
      console.error('Permiso para notificaciones denegado.');
    }
  } catch (error) {
    console.error('Error inicializando Pushwoosh: ', error);
  }
}

async function uploadToken() {
  if (theToken !== 'not_set') {
    console.log("Uploading token to the server:", theToken);
    // Agrega aquí tu lógica para enviar el token al servidor
  } else {
    console.log("Token no disponible para cargar.");
  }
}

// Inicializa Pushwoosh cuando la app esté lista
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded. Initializing Pushwoosh...');
  onPushwooshInitialized();
});

// Para debuggear el token desde un botón (opcional)
document.querySelector('#profile')?.addEventListener('click', () => {
  console.log('Push Token:', theToken);
});
