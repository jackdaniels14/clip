import SwiftUI

struct SessionsView: View {
    @StateObject private var viewModel = SessionsViewModel()
    @State private var showingCheckIn = false
    @State private var ticketNumber = ""

    var body: some View {
        NavigationView {
            List(viewModel.sessions) { session in
                SessionRow(session: session)
            }
            .navigationTitle("My Sessions")
            .toolbar {
                Button("Check In") {
                    showingCheckIn = true
                }
            }
            .sheet(isPresented: $showingCheckIn) {
                CheckInView(ticketNumber: $ticketNumber) {
                    viewModel.checkIn(ticketNumber: ticketNumber)
                    showingCheckIn = false
                }
            }
            .onAppear {
                viewModel.loadSessions()
            }
        }
    }
}

struct SessionRow: View {
    let session: Session

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(session.apparatus.joined(separator: ", "))
                    .font(.headline)

                Spacer()

                StatusBadge(status: session.status)
            }

            Text("Ticket: \(session.ticketNumber)")
                .font(.subheadline)
                .foregroundColor(.gray)

            if let startTime = session.startTime {
                Text("Started: \(startTime, style: .time)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 4)
    }
}

struct StatusBadge: View {
    let status: String

    var color: Color {
        switch status {
        case "recording": return .red
        case "processing": return .orange
        case "completed": return .green
        default: return .gray
        }
    }

    var body: some View {
        Text(status.capitalized)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.2))
            .foregroundColor(color)
            .cornerRadius(8)
    }
}

struct CheckInView: View {
    @Binding var ticketNumber: String
    let onCheckIn: () -> Void
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "qrcode")
                    .resizable()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.blue)

                Text("Enter Ticket Number")
                    .font(.headline)

                TextField("STOKE-XXXXX", text: $ticketNumber)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                Button("Check In") {
                    onCheckIn()
                }
                .buttonStyle(.borderedProminent)

                Spacer()
            }
            .padding()
            .navigationTitle("Session Check-In")
            .navigationBarItems(trailing: Button("Cancel") {
                dismiss()
            })
        }
    }
}
