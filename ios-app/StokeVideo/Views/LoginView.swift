import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showingAlert = false
    @State private var alertMessage = ""

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "video.fill")
                    .resizable()
                    .frame(width: 100, height: 80)
                    .foregroundColor(.blue)

                Text("Stoke Video")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                Text("Capture your best moments")
                    .font(.subheadline)
                    .foregroundColor(.gray)

                VStack(spacing: 15) {
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)

                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.password)

                    Button(action: login) {
                        Text("Sign In")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }

                    Button("Create Account") {
                        authViewModel.signUp(email: email, password: password) { error in
                            if let error = error {
                                alertMessage = error.localizedDescription
                                showingAlert = true
                            }
                        }
                    }
                    .foregroundColor(.blue)
                }
                .padding()

                Spacer()
            }
            .padding()
            .navigationBarHidden(true)
            .alert("Error", isPresented: $showingAlert) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(alertMessage)
            }
        }
    }

    private func login() {
        authViewModel.signIn(email: email, password: password) { error in
            if let error = error {
                alertMessage = error.localizedDescription
                showingAlert = true
            }
        }
    }
}
