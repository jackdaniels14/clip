// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "StokeVideo",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "StokeVideo",
            targets: ["StokeVideo"])
    ],
    dependencies: [
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "10.20.0")
    ],
    targets: [
        .target(
            name: "StokeVideo",
            dependencies: [
                .product(name: "FirebaseAuth", package: "firebase-ios-sdk"),
                .product(name: "FirebaseFirestore", package: "firebase-ios-sdk"),
                .product(name: "FirebaseStorage", package: "firebase-ios-sdk"),
                .product(name: "FirebaseFunctions", package: "firebase-ios-sdk"),
            ],
            path: "StokeVideo"
        )
    ]
)
