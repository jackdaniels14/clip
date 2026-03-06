import SwiftUI

struct ClipsView: View {
    @StateObject private var viewModel = ClipsViewModel()

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 15) {
                    ForEach(viewModel.clips) { clip in
                        ClipCard(clip: clip)
                    }
                }
                .padding()
            }
            .navigationTitle("My Clips")
            .onAppear {
                viewModel.loadClips()
            }
        }
    }
}

struct ClipCard: View {
    let clip: Clip

    var body: some View {
        VStack(alignment: .leading) {
            // Thumbnail
            if let thumbnailURL = clip.thumbnail {
                AsyncImage(url: URL(string: thumbnailURL)) { image in
                    image
                        .resizable()
                        .aspectRatio(16/9, contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .aspectRatio(16/9, contentMode: .fill)
                        .overlay(
                            ProgressView()
                        )
                }
                .clipShape(RoundedRectangle(cornerRadius: 10))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("\(clip.duration)s")
                    .font(.caption)
                    .foregroundColor(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.black.opacity(0.7))
                    .cornerRadius(4)

                if clip.status == "ready" {
                    if clip.isPurchased {
                        Button("Download") {
                            // Download action
                        }
                        .font(.caption)
                        .foregroundColor(.blue)
                    } else {
                        Text("$\(String(format: "%.2f", clip.price))")
                            .font(.caption)
                            .fontWeight(.bold)
                    }
                } else {
                    Text("Processing...")
                        .font(.caption)
                        .foregroundColor(.orange)
                }
            }
        }
    }
}
