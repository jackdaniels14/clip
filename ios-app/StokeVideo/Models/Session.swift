import Foundation
import FirebaseFirestore

struct Session: Identifiable, Codable {
    @DocumentID var id: String?
    let sessionId: String
    let userId: String
    let startTime: Date?
    let endTime: Date?
    let apparatus: [String]
    let cameras: [String]
    let status: String
    let clips: [String]
    let liveStreamUrl: String?
    let ticketNumber: String

    enum CodingKeys: String, CodingKey {
        case id
        case sessionId
        case userId
        case startTime
        case endTime
        case apparatus
        case cameras
        case status
        case clips
        case liveStreamUrl
        case ticketNumber
    }
}
