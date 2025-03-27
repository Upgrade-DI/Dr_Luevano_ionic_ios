import UIKit
import Capacitor
import PushwooshFramework

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, PWMessagingDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        // CORREGIDO: Inicializar Pushwoosh con el método correcto
        Pushwoosh.sharedInstance().initializeWithAppCode("DE31D-FA23F", appName: "Armonia")
        
        Pushwoosh.sharedInstance().delegate = self
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

    // Resto de métodos del ciclo de vida...
    
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

    // Resto de métodos para manejar notificaciones...
    
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
