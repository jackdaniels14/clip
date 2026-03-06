import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            SessionsView()
                .tabItem {
                    Label("Sessions", systemImage: "play.circle")
                }

            ClipsView()
                .tabItem {
                    Label("Clips", systemImage: "film")
                }

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person")
                }
        }
    }
}
