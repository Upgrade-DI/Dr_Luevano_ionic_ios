var theToken = 'not_set';

(function () {
  var IOS_APNS_TOKEN_REGEX = /^[A-Fa-f0-9]{64}$/;
  var listenersRegistered = false;

  function isLikelyApnsToken(token) {
    return IOS_APNS_TOKEN_REGEX.test(token || '');
  }

  function getPlatform() {
    if (typeof Capacitor !== 'undefined' && typeof Capacitor.getPlatform === 'function') {
      return Capacitor.getPlatform();
    }

    if (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent || '')) {
      return 'android';
    }

    if (typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent || '')) {
      return 'ios';
    }

    return 'web';
  }

  function getPushNotificationsPlugin() {
    if (typeof Capacitor === 'undefined') {
      return null;
    }

    if (
      typeof Capacitor.isPluginAvailable === 'function' &&
      !Capacitor.isPluginAvailable('PushNotifications')
    ) {
      return null;
    }

    if (!Capacitor.Plugins || !Capacitor.Plugins.PushNotifications) {
      return null;
    }

    return Capacitor.Plugins.PushNotifications;
  }

  function cacheToken(token) {
    try {
      localStorage.setItem('fcm_token', token);
    } catch (error) {
      console.warn('No se pudo guardar fcm_token en localStorage', error);
    }
  }

  function hydrateCachedToken() {
    try {
      var cached = localStorage.getItem('fcm_token');
      if (!cached || cached === 'not_set') {
        return;
      }

      theToken = cached;
      window.the_token = cached;
    } catch (error) {
      console.warn('No se pudo leer fcm_token desde localStorage', error);
    }
  }

  function syncTokenIfReady() {
    if (typeof uploadToken === 'function') {
      uploadToken('fcm');
      return;
    }

    console.log('Token FCM listo, esperando contexto para sincronizar.');
  }

  async function onRegistration(token) {
    var tokenValue = token && token.value ? token.value : '';

    if (!tokenValue) {
      console.warn('Token push vacio recibido del plugin.');
      return;
    }

    if (getPlatform() === 'ios' && isLikelyApnsToken(tokenValue)) {
      console.log('Token APNs detectado en iOS. Se ignora hasta recibir token FCM real.');
      return;
    }

    theToken = tokenValue;
    window.the_token = tokenValue;
    cacheToken(tokenValue);
    syncTokenIfReady();
  }

  function onRegistrationError(error) {
    console.error('Error al registrar PushNotifications:', error);
  }

  function onPushNotificationReceived(notification) {
    console.log('Push recibida:', notification);
  }

  function registerListeners(pushNotifications) {
    if (listenersRegistered) {
      return;
    }

    pushNotifications.addListener('registration', onRegistration);
    pushNotifications.addListener('registrationError', onRegistrationError);
    pushNotifications.addListener('pushNotificationReceived', onPushNotificationReceived);
    listenersRegistered = true;
  }

  async function requestAndRegister(pushNotifications) {
    try {
      var permission = await pushNotifications.checkPermissions();
      var receivePermission = permission && permission.receive ? permission.receive : 'prompt';

      if (receivePermission !== 'granted') {
        var requested = await pushNotifications.requestPermissions();
        receivePermission = requested && requested.receive ? requested.receive : 'denied';
      }

      if (receivePermission !== 'granted') {
        console.warn('Permiso de notificaciones no concedido.');
        return;
      }

      await pushNotifications.register();
    } catch (error) {
      console.error('No se pudo completar el registro de notificaciones push', error);
    }
  }

  async function initFcmPush() {
    hydrateCachedToken();
    syncTokenIfReady();

    var pushNotifications = getPushNotificationsPlugin();

    if (!pushNotifications) {
      console.warn('PushNotifications no disponible en esta plataforma/contexto.');
      return;
    }

    registerListeners(pushNotifications);
    await requestAndRegister(pushNotifications);
  }

  document.addEventListener(
    'deviceready',
    function () {
      initFcmPush();
    },
    false
  );
})();
