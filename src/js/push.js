const PUSHWOOSH_CONFIG = {
  applicationCode: "DE31D-FA23F",
  safariWebsitePushID: "web.com.armoniaestetica", // Reemplaza con tu ID real si es necesario
  defaultNotificationTitle: "Armonia Estetica",
  defaultNotificationImage: "https://armoniaestetica.com/_images/general/logo2.png",
  logLevel: "debug" // Cambia a 'error' en producción
};

async function onPushwooshInitialized() {
  console.log("Initializing Pushwoosh");

  try {
      // Inicializa Pushwoosh
      await Pushwoosh.init(PUSHWOOSH_CONFIG);
      console.log("Pushwoosh SDK initialized successfully.");

      // Registrar para notificaciones push
      const status = await Pushwoosh.registerForPushNotifications();
      if (status.isSubscribed) {
          console.log("Subscribed to Pushwoosh notifications.");
          const pushToken = await Pushwoosh.getPushToken();
          console.log("Pushwoosh device token:", pushToken);
          await uploadToken(pushToken);
      } else {
          console.log("Not subscribed to Pushwoosh notifications.");
      }

      // Obtener HWID del dispositivo
      const hwid = await Pushwoosh.getHWID();
      console.log("Pushwoosh HWID:", hwid);

      // Manejo de notificaciones
      Pushwoosh.onPushReceived((notification) => {
          console.log("Push Notification Received:", notification);
      });

      Pushwoosh.onPushDelivered((notification) => {
          console.log("Push Notification Clicked:", notification);
      });

  } catch (error) {
      console.error("Error initializing Pushwoosh:", error);
  }
}

async function uploadToken(token) {
  if (token) {
      console.log("Uploading token to the server:", token);
      // Agrega aquí la lógica para enviar el token a tu servidor
      // Por ejemplo:
      // await fetch('/api/register-push-token', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ token })
      // });
  } else {
      console.log("Token no disponible para cargar.");
  }
}

// No es necesario agregar otro event listener aquí, ya que se llama desde index.html