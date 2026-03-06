import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        NavigationView {
            List {
                Section("Account") {
                    if let user = viewModel.user {
                        HStack {
                            Text("Email")
                            Spacer()
                            Text(user.email)
                                .foregroundColor(.gray)
                        }

                        HStack {
                            Text("Name")
                            Spacer()
                            Text(user.name)
                                .foregroundColor(.gray)
                        }

                        HStack {
                            Text("Subscription")
                            Spacer()
                            Text(user.subscriptionTier.capitalized)
                                .foregroundColor(.blue)
                        }
                    }
                }

                Section("Statistics") {
                    if let user = viewModel.user {
                        HStack {
                            Text("Sessions")
                            Spacer()
                            Text("\(user.sessions.count)")
                                .foregroundColor(.gray)
                        }

                        HStack {
                            Text("Purchases")
                            Spacer()
                            Text("\(user.purchases.count)")
                                .foregroundColor(.gray)
                        }

                        HStack {
                            Text("Credits")
                            Spacer()
                            Text("\(user.credits)")
                                .foregroundColor(.gray)
                        }
                    }
                }

                Section {
                    Button("Sign Out") {
                        authViewModel.signOut()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Profile")
            .onAppear {
                viewModel.loadUserProfile()
            }
        }
    }
}
