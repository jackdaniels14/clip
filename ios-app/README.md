# StokeVideo iOS App

## Quick Start

### 1. Create the Xcode Project

**Option A: Automatic (Run Script)**
```bash
cd /Users/landongriffith/stoke-video-system/ios-app
./create-xcode-project.sh
```

**Option B: Manual (Create in Xcode)**

1. Open Xcode
2. File → New → Project
3. Choose "iOS" → "App"
4. Configure:
   - Product Name: **StokeVideo**
   - Team: (Select your team or None)
   - Organization Identifier: **com.stokemountain**
   - Bundle Identifier: **com.stokemountain.video**
   - Interface: **SwiftUI**
   - Language: **Swift**
5. Save to: `/Users/landongriffith/stoke-video-system/ios-app/`
6. **Uncheck** "Create Git repository"

### 2. Add Firebase

1. Download `GoogleService-Info.plist` from Firebase Console
2. Drag into Xcode project (check "Copy items if needed")
3. Add Firebase SDK:
   - File → Add Package Dependencies
   - URL: `https://github.com/firebase/firebase-ios-sdk`
   - Select: FirebaseAuth, FirebaseFirestore, FirebaseStorage, FirebaseFunctions

### 3. Organize Files

The Swift files are already created in the `StokeVideo` folder. In Xcode:

1. Create groups: Models, ViewModels, Views
2. Drag files into appropriate groups
3. All files are in `/Users/landongriffith/stoke-video-system/ios-app/StokeVideo/`

### 4. Run the App

1. Select iPhone simulator
2. Press ⌘R to run
3. Test with Firebase credentials

## Project Structure

```
StokeVideo/
├── StokeVideoApp.swift          # Main app entry point
├── ContentView.swift            # Root view
├── Models/
│   ├── Session.swift           # Session data model
│   ├── Clip.swift              # Video clip model
│   └── UserProfile.swift       # User profile model
├── ViewModels/
│   ├── AuthViewModel.swift     # Authentication logic
│   ├── SessionsViewModel.swift # Session management
│   ├── ClipsViewModel.swift    # Clip management
│   └── ProfileViewModel.swift  # Profile management
└── Views/
    ├── LoginView.swift         # Login screen
    ├── MainTabView.swift       # Main tab navigation
    ├── SessionsView.swift      # Sessions list
    ├── ClipsView.swift         # Clips gallery
    └── ProfileView.swift       # User profile
```

## Features

- ✅ User authentication with Firebase
- ✅ Session check-in via ticket number
- ✅ Browse and download video clips
- ✅ View profile and purchase history
- ✅ Modern SwiftUI interface

## Detailed Setup

See `XCODE_SETUP.md` for step-by-step instructions.

## Next Steps

After setup:
1. Create test user in Firebase Console
2. Test login flow
3. Test session check-in
4. Add app icon
5. Test on real device
6. Submit to App Store (optional)

## Need Help?

- See `XCODE_SETUP.md` for detailed instructions
- See `/stoke-video-system/SETUP_GUIDE.md` for full system setup
- Check Firebase Console for backend status
