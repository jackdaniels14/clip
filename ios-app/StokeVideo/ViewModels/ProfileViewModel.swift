import Foundation
import Firebase
import FirebaseFirestore

class ProfileViewModel: ObservableObject {
    @Published var user: UserProfile?
    private let db = Firestore.firestore()

    func loadUserProfile() {
        guard let userId = Auth.auth().currentUser?.uid else { return }

        db.collection("users").document(userId)
            .addSnapshotListener { [weak self] snapshot, error in
                guard let data = snapshot?.data() else {
                    print("Error fetching user profile: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }

                self?.user = try? snapshot?.data(as: UserProfile.self)
            }
    }
}
