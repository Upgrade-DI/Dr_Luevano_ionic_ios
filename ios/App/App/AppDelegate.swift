import UIKit
import Capacitor
import PushwooshFramework

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, PWMessagingDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        Pushwoosh.sharedInstance().delegate = self
        
        // AÑADIDO: Configurar el App ID de Pushwoosh
        Pushwoosh.sharedInstance().applicationCode = "DE31D-FA23F"
        
        Pushwoosh.sharedInstance().registerForPushNotifications()
        
        // AÑADIDO: Registrar para notificaciones cuando el ID del paciente cambie
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(patientIdChanged),
            name: NSNotification.Name("patientIdChanged"),
            object: nil
        )
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    //handle token received from APNS
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // Registrar el token con Pushwoosh
        Pushwoosh.sharedInstance().handlePushRegistration(deviceToken)
        
        // AÑADIDO: Convertir el token a string
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("🔥 Token del dispositivo: \(token)")
        
        // AÑADIDO: Guardar el token para uso posterior
        UserDefaults.standard.set(token, forKey: "pushToken")
        
        // AÑADIDO: Intentar enviar el token al servidor
        checkAndSendToken()
    }

    //handle token receiving error
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("❌ Error al registrar para notificaciones: \(error.localizedDescription)")
        Pushwoosh.sharedInstance().handlePushRegistrationFailure(error)
    }

    //this is for iOS < 10 and for silent push notifications
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        Pushwoosh.sharedInstance().handlePushReceived(userInfo)
        completionHandler(.noData)
    }

    //this event is fired when the push gets received
    func pushwoosh(_ pushwoosh: Pushwoosh, onMessageReceived message: PWMessage) {
        print("onMessageReceived: ", message.payload!.description)
    }

    // Fired when a user taps the notification
    func pushwoosh(_ pushwoosh: Pushwoosh, onMessageOpened message: PWMessage) {
        print("onMessageOpened: ", message.payload!.description)
    }
    
    // AÑADIDO: Método para verificar y enviar el token
    func checkAndSendToken() {
        // Verificar si tenemos el token
        guard let token = UserDefaults.standard.string(forKey: "pushToken") else {
            print("⚠️ No hay token disponible para enviar")
            return
        }
        
        // Intentar obtener el ID del paciente desde JavaScript
        getPatientIdFromJS { [weak self] patientId in
            guard let self = self else { return }
            
            if let patientId = patientId, !patientId.isEmpty {
                print("✅ ID de paciente obtenido: \(patientId)")
                self.sendTokenToServer(token: token, patientId: patientId)
            } else {
                print("⚠️ No se pudo obtener el ID del paciente, el token se enviará cuando esté disponible")
                // El token ya está guardado en UserDefaults, se enviará cuando el ID esté disponible
            }
        }
    }
    
    // AÑADIDO: Método para obtener el ID del paciente desde JavaScript
    func getPatientIdFromJS(completion: @escaping (String?) -> Void) {
        guard let webView = window?.rootViewController as? CAPBridgeViewController else {
            completion(nil)
            return
        }
        
        let script = "localStorage.getItem('id_pat')"
        webView.webView?.evaluateJavaScript(script) { (result, error) in
            if let error = error {
                print("❌ Error al acceder a localStorage: \(error.localizedDescription)")
                completion(nil)
                return
            }
            
            if let patientId = result as? String, !patientId.isEmpty {
                completion(patientId)
            } else {
                completion(nil)
            }
        }
    }
    
    // AÑADIDO: Método llamado cuando el ID del paciente cambia
    @objc func patientIdChanged(notification: Notification) {
        if let patientId = notification.userInfo?["patientId"] as? String {
            print("🔄 ID de paciente actualizado: \(patientId)")
            
            // Si tenemos un token guardado, enviarlo ahora
            if let token = UserDefaults.standard.string(forKey: "pushToken") {
                sendTokenToServer(token: token, patientId: patientId)
            }
        }
    }
    
    // AÑADIDO: Método para enviar el token al servidor
    func sendTokenToServer(token: String, patientId: String) {
        // Verificar si el token ya fue enviado
        if UserDefaults.standard.bool(forKey: "tokenSent") {
            print("ℹ️ Token ya enviado anteriormente")
            return
        }
        
        // Crear la URL para la solicitud
        guard let serverURL = URL(string: "https://armoniaestetica.com/_sudiv3/ar_engine/token_device.php") else {
            print("❌ URL del servidor inválida")
            return
        }
        
        // Crear los parámetros
        let parameters = [
            "the_patient": patientId,
            "token": token
        ]
        
        // Crear la solicitud
        var request = URLRequest(url: serverURL)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        // Convertir parámetros a formato form-urlencoded
        let postString = parameters.map { "\($0.key)=\($0.value)" }.joined(separator: "&")
        request.httpBody = postString.data(using: .utf8)
        
        // Realizar la solicitud
        let task = URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let self = self else { return }
            
            if let error = error {
                print("❌ Error al enviar token: \(error.localizedDescription)")
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                if httpResponse.statusCode == 200 {
                    print("✅ Token enviado exitosamente al servidor")
                    UserDefaults.standard.set(true, forKey: "tokenSent")
                } else {
                    print("❌ Error del servidor: \(httpResponse.statusCode)")
                }
            }
            
            if let data = data, let responseString = String(data: data, encoding: .utf8) {
                print("📝 Respuesta del servidor: \(responseString)")
            }
        }
        
        task.resume()
    }
}
