import Foundation
import Firebase
import FirebaseFirestore

class ClipsViewModel: ObservableObject {
    @Published var clips: [Clip] = []
    private let db = Firestore.firestore()

    func loadClips() {
        guard let userId = Auth.auth().currentUser?.uid else { return }

        db.collection("clips")
            .whereField("userId", isEqualTo: userId)
            .order(by: "startTime", descending: true)
            .addSnapshotListener { [weak self] snapshot, error in
                guard let documents = snapshot?.documents else {
                    print("Error fetching clips: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }

                self?.clips = documents.compactMap { doc in
                    try? doc.data(as: Clip.self)
                }
            }
    }

    func purchaseClip(clipId: String, completion: @escaping (Bool) -> Void) {
        let functions = Functions.functions()
        functions.httpsCallable("createCheckoutSession").call(["clipId": clipId]) { result, error in
            if let error = error {
                print("Purchase error: \(error.localizedDescription)")
                completion(false)
                return
            }

            completion(true)
        }
    }

    func downloadClip(clipId: String, compositionType: String, completion: @escaping (URL?) -> Void) {
        let functions = Functions.functions()
        functions.httpsCallable("generateDownloadUrl").call([
            "clipId": clipId,
            "compositionType": compositionType
        ]) { result, error in
            if let error = error {
                print("Download error: \(error.localizedDescription)")
                completion(nil)
                return
            }

            if let data = result?.data as? [String: Any],
               let urlString = data["downloadUrl"] as? String,
               let url = URL(string: urlString) {
                completion(url)
            } else {
                completion(nil)
            }
        }
    }
}
