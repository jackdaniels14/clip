import Foundation
import FirebaseFirestore

struct UserProfile: Identifiable, Codable {
    @DocumentID var id: String?
    let userId: String
    let email: String
    let name: String
    let phone: String
    let sessions: [String]
    let purchases: [String]
    let credits: Int
    let subscriptionTier: String

    enum CodingKeys: String, CodingKey {
        case id
        case userId
        case email
        case name
        case phone
        case sessions
        case purchases
        case credits
        case subscriptionTier
    }
}
