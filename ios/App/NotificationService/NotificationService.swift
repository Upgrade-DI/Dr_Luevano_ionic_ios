import UserNotifications

final class NotificationService: UNNotificationServiceExtension {
    private var contentHandler: ((UNNotificationContent) -> Void)?
    private var bestAttemptContent: UNMutableNotificationContent?
    private var activeTask: URLSessionDownloadTask?

    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        self.contentHandler = contentHandler
        self.bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

        guard let bestAttemptContent = self.bestAttemptContent else {
            contentHandler(request.content)
            return
        }

        guard let imageURL = extractImageURL(from: bestAttemptContent.userInfo) else {
            contentHandler(bestAttemptContent)
            return
        }

        attachImage(from: imageURL, to: bestAttemptContent, fallbackContent: request.content)
    }

    override func serviceExtensionTimeWillExpire() {
        activeTask?.cancel()

        if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }

    private func extractImageURL(from userInfo: [AnyHashable: Any]) -> URL? {
        if let fcmOptions = userInfo["fcm_options"] as? [String: Any],
           let raw = fcmOptions["image"] as? String,
           let url = URL(string: raw), !raw.isEmpty {
            return url
        }

        let candidateKeys = [
            "image",
            "imageUrl",
            "image_url",
            "attachment-url",
            "attachment_url",
            "media-url",
            "media_url"
        ]

        for key in candidateKeys {
            if let raw = userInfo[key] as? String,
               let url = URL(string: raw), !raw.isEmpty {
                return url
            }
        }

        if let dataPayload = userInfo["data"] as? [String: Any] {
            for key in candidateKeys {
                if let raw = dataPayload[key] as? String,
                   let url = URL(string: raw), !raw.isEmpty {
                    return url
                }
            }
        }

        return nil
    }

    private func attachImage(
        from url: URL,
        to content: UNMutableNotificationContent,
        fallbackContent: UNNotificationContent
    ) {
        let session = URLSession(configuration: .ephemeral)
        activeTask = session.downloadTask(with: url) { [weak self] temporaryURL, response, _ in
            defer {
                if let handler = self?.contentHandler {
                    handler(content)
                }
            }

            guard let self = self, let temporaryURL = temporaryURL else {
                return
            }

            let fileExtension = self.preferredFileExtension(from: response, fallbackURL: url)
            let localURL = URL(fileURLWithPath: NSTemporaryDirectory())
                .appendingPathComponent(UUID().uuidString)
                .appendingPathExtension(fileExtension)

            do {
                try FileManager.default.moveItem(at: temporaryURL, to: localURL)
                let attachment = try UNNotificationAttachment(identifier: "image", url: localURL)
                content.attachments = [attachment]
            } catch {
                if let handler = self.contentHandler {
                    handler(fallbackContent)
                }
            }
        }

        activeTask?.resume()
    }

    private func preferredFileExtension(from response: URLResponse?, fallbackURL: URL) -> String {
        if let mimeType = response?.mimeType {
            switch mimeType {
            case "image/jpeg", "image/jpg":
                return "jpg"
            case "image/png":
                return "png"
            case "image/gif":
                return "gif"
            case "image/webp":
                return "webp"
            default:
                break
            }
        }

        let extensionFromURL = fallbackURL.pathExtension.trimmingCharacters(in: .whitespacesAndNewlines)
        return extensionFromURL.isEmpty ? "jpg" : extensionFromURL
    }
}
