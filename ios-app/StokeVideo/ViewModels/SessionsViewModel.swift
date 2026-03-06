import Foundation
import Firebase
import FirebaseFirestore

class SessionsViewModel: ObservableObject {
    @Published var sessions: [Session] = []
    private let db = Firestore.firestore()

    func loadSessions() {
        guard let userId = Auth.auth().currentUser?.uid else { return }

        db.collection("sessions")
            .whereField("userId", isEqualTo: userId)
            .order(by: "startTime", descending: true)
            .addSnapshotListener { [weak self] snapshot, error in
                guard let documents = snapshot?.documents else {
                    print("Error fetching sessions: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }

                self?.sessions = documents.compactMap { doc in
                    try? doc.data(as: Session.self)
                }
            }
    }

    func checkIn(ticketNumber: String) {
        // Call Firebase function to check in with ticket number
        let functions = Functions.functions()
        functions.httpsCallable("checkIn").call(["ticketNumber": ticketNumber]) { result, error in
            if let error = error {
                print("Check-in error: \(error.localizedDescription)")
            }
        }
    }
}
