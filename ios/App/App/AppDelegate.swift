import UIKit
import Capacitor
import Firebase
import Pushwoosh

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configurar Firebase
        FirebaseApp.configure()

        // Configurar Pushwoosh
        Pushwoosh.sharedInstance()?.initializePushNotifications()

        // Registrar notificaciones push
        UNUserNotificationCenter.current().delegate = self
        application.registerForRemoteNotifications()

        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // Manejar el registro del token con Pushwoosh
        Pushwoosh.sharedInstance()?.handlePushRegistration(deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        // Manejar errores de registro
        print("Error al registrar para notificaciones remotas: \(error.localizedDescription)")
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        // Manejar notificaciones recibidas con Pushwoosh
        Pushwoosh.sharedInstance()?.handlePushReceived(userInfo)
        completionHandler(.newData)
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Pausar tareas si la aplicación se vuelve inactiva
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Liberar recursos y guardar datos si la aplicación entra en segundo plano
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Preparar la aplicación para volver al primer plano
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Reiniciar tareas pausadas
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Guardar datos antes de que la aplicación se cierre
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Manejar URLs abiertas por la aplicación
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Manejar actividades continuadas, como enlaces universales
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

// Extensión para manejar notificaciones cuando la app está activa
extension AppDelegate: UNUserNotificationCenterDelegate {
    // Manejar notificaciones cuando la app está en primer plano
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        print("Notificación recibida en primer plano: \(notification.request.content.userInfo)")
        completionHandler([.banner, .sound, .badge])
    }

    // Manejar acciones de usuario en la notificación
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        print("Usuario interactuó con la notificación: \(response.notification.request.content.userInfo)")
        completionHandler()
    }
}
