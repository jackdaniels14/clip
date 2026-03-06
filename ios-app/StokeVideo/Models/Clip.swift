import Foundation
import FirebaseFirestore

struct Clip: Identifiable, Codable {
    @DocumentID var id: String?
    let clipId: String
    let sessionId: String
    let userId: String
    let startTime: Date?
    let duration: Int
    let cameras: [String]
    let rawVideos: [String: String]?
    let composedVideos: [String: String]?
    let thumbnail: String?
    let status: String
    let price: Double
    let processingProgress: Int

    var isPurchased: Bool {
        // This should be checked against purchases collection
        // For now, returning false - implement with purchase check
        return false
    }

    enum CodingKeys: String, CodingKey {
        case id
        case clipId
        case sessionId
        case userId
        case startTime
        case duration
        case cameras
        case rawVideos
        case composedVideos
        case thumbnail
        case status
        case price
        case processingProgress
    }
}
