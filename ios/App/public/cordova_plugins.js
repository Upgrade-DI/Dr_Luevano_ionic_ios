
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "pushwoosh-cordova-plugin.PushNotification",
          "file": "plugins/pushwoosh-cordova-plugin/www/PushNotification.js",
          "pluginId": "pushwoosh-cordova-plugin",
        "clobbers": [
          "plugins.pushNotification"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "pushwoosh-cordova-plugin": "8.3.33"
    };
    // BOTTOM OF METADATA
    });
    