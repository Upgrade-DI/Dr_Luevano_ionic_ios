const PUSHWOOSH_CONFIG = {
  appCode: "DE31D-FA23F", // Tu código de Pushwoosh
  serviceWorkerUrl: "/pushwoosh-service-worker.js", // Asegúrate de que este archivo exista
};

async function onPushwooshInitialized() {
  console.log("Initializing Pushwoosh");

  try {
      // Inicializa Pushwoosh
      await Pushwoosh.init(PUSHWOOSH_CONFIG);
      console.log("Pushwoosh SDK initialized successfully.");

      // Solicitar permiso para notificaciones
      const isSubscribed = await Pushwoosh.subscribe();
      if (isSubscribed) {
          console.log("Subscribed to Pushwoosh notifications.");
      } else {
          console.error("Failed to subscribe to Pushwoosh notifications.");
      }

      // Obtener HWID del dispositivo
      const hwid = Pushwoosh.getHWID();
      console.log("Pushwoosh HWID:", hwid);

      // Manejo de notificaciones
      Pushwoosh.onNotificationReceived((notification) => {
          console.log("Push Notification Received:", notification);
      });

      Pushwoosh.onNotificationClicked((notification) => {
          console.log("Push Notification Clicked:", notification);
      });
  } catch (error) {
      console.error("Error initializing Pushwoosh:", error);
  }
}

async function uploadToken() {
  const hwid = Pushwoosh.getHWID();
  if (hwid) {
      console.log("Uploading token to the server:", hwid);
      // Agrega aquí la lógica para enviar el HWID a tu servidor
  } else {
      console.log("Token no disponible para cargar.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded. Initializing Pushwoosh...');
  onPushwooshInitialized();
});
