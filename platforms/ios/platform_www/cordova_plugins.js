cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-calendar.Calendar",
      "file": "plugins/cordova-plugin-calendar/www/Calendar.js",
      "pluginId": "cordova-plugin-calendar",
      "clobbers": [
        "Calendar"
      ]
    },
    {
      "id": "cordova-plugin-camera.Camera",
      "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "Camera"
      ]
    },
    {
      "id": "cordova-plugin-camera.CameraPopoverOptions",
      "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "CameraPopoverOptions"
      ]
    },
    {
      "id": "cordova-plugin-camera.camera",
      "file": "plugins/cordova-plugin-camera/www/Camera.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "navigator.camera"
      ]
    },
    {
      "id": "cordova-plugin-camera.CameraPopoverHandle",
      "file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "CameraPopoverHandle"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.Coordinates",
      "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "Coordinates"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.PositionError",
      "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "PositionError"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.Position",
      "file": "plugins/cordova-plugin-geolocation/www/Position.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "Position"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.geolocation",
      "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "navigator.geolocation"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "cordova-plugin-network-information.network",
      "file": "plugins/cordova-plugin-network-information/www/network.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "navigator.connection",
        "navigator.network.connection"
      ]
    },
    {
      "id": "cordova-plugin-network-information.Connection",
      "file": "plugins/cordova-plugin-network-information/www/Connection.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "Connection"
      ]
    },
    {
      "id": "cordova-plugin-qrscanner.QRScanner",
      "file": "plugins/cordova-plugin-qrscanner/www/www.min.js",
      "pluginId": "cordova-plugin-qrscanner",
      "clobbers": [
        "QRScanner"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova-plugin-test-framework.cdvtests",
      "file": "plugins/cordova-plugin-test-framework/www/tests.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.jasmine_helpers",
      "file": "plugins/cordova-plugin-test-framework/www/jasmine_helpers.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.medic",
      "file": "plugins/cordova-plugin-test-framework/www/medic.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.main",
      "file": "plugins/cordova-plugin-test-framework/www/main.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-vibration.notification",
      "file": "plugins/cordova-plugin-vibration/www/vibration.js",
      "pluginId": "cordova-plugin-vibration",
      "merges": [
        "navigator.notification",
        "navigator"
      ]
    },
    {
      "id": "pushwoosh-cordova-plugin.PushNotification",
      "file": "plugins/pushwoosh-cordova-plugin/www/PushNotification.js",
      "pluginId": "pushwoosh-cordova-plugin",
      "clobbers": [
        "plugins.pushNotification"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-add-swift-support": "2.0.2",
    "cordova-plugin-calendar": "5.1.5",
    "cordova-plugin-camera": "4.1.0",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-plugin-geolocation": "4.0.2",
    "cordova-plugin-inappbrowser": "4.0.0",
    "cordova-plugin-network-information": "2.0.2",
    "cordova-plugin-qrscanner": "3.0.1",
    "cordova-plugin-splashscreen": "6.0.0",
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-plugin-test-framework": "1.1.6",
    "cordova-plugin-vibration": "2.1.6",
    "cordova-plugin-whitelist": "1.3.4",
    "pushwoosh-cordova-plugin": "7.18.11"
  };
});