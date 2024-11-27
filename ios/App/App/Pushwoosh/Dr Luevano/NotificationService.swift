import UserNotifications
import PushwooshFramework

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        // Guarda el contentHandler para usarlo en caso de que expire el tiempo
        self.contentHandler = contentHandler
        
        // Convierte el contenido de la notificación a un mutableCopy para modificarlo si es necesario
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        // Manejo de la notificación con Pushwoosh
        PWNotificationExtensionManager.shared().handle(request, contentHandler: contentHandler)
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Este método se llama justo antes de que el sistema cierre la extensión por tiempo excedido
        if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
            // Devuelve el contenido "mejor esfuerzo" si no se alcanzó a procesar todo
            contentHandler(bestAttemptContent)
        }
    }
}
