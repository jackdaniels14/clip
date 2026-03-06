# iOS App Xcode Setup Guide

## Creating the Xcode Project

Since the Xcode project doesn't exist yet, follow these steps to create it:

### Option 1: Create Project in Xcode (Recommended)

1. **Open Xcode**
   ```bash
   open /Applications/Xcode.app
   ```

2. **Create New Project**
   - Click "Create a new Xcode project"
   - Select **iOS** → **App**
   - Click **Next**

3. **Configure Project**
   - Product Name: `StokeVideo`
   - Team: Select your team (or "None" for now)
   - Organization Identifier: `com.stokemountain`
   - Bundle Identifier: `com.stokemountain.video`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **None**
   - Include Tests: ✓ (optional)
   - Click **Next**

4. **Choose Location**
   - Navigate to: `/Users/landongriffith/stoke-video-system/ios-app/`
   - **IMPORTANT**: Uncheck "Create Git repository" (we already have one)
   - Click **Create**

5. **Replace Generated Files**
   - Xcode created some default files
   - We'll replace them with our custom files in the next steps

### Option 2: Use Command Line (Advanced)

I've created a script to automate the setup:

```bash
cd /Users/landongriffith/stoke-video-system/ios-app
./create-xcode-project.sh
```

---

## Adding Firebase to the Project

### Step 1: Get GoogleService-Info.plist

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the **gear icon** → **Project Settings**
4. Scroll to "Your apps"
5. Click **iOS** icon (or "Add app" if no iOS app exists)
6. Register app:
   - iOS bundle ID: `com.stokemountain.video`
   - App nickname: `StokeVideo`
   - App Store ID: (leave blank for now)
7. Click **Register app**
8. **Download GoogleService-Info.plist**

### Step 2: Add GoogleService-Info.plist to Xcode

1. In Xcode, right-click on the `StokeVideo` folder (blue icon)
2. Select **Add Files to "StokeVideo"...**
3. Select the downloaded `GoogleService-Info.plist`
4. **Make sure "Copy items if needed" is CHECKED**
5. Click **Add**

### Step 3: Add Firebase SDK

1. In Xcode, go to **File** → **Add Package Dependencies...**
2. Enter package URL: `https://github.com/firebase/firebase-ios-sdk`
3. Version: Select "Up to Next Major Version" with `10.20.0`
4. Click **Add Package**
5. Select these products:
   - ✓ FirebaseAuth
   - ✓ FirebaseFirestore
   - ✓ FirebaseStorage
   - ✓ FirebaseFunctions
   - ✓ FirebaseMessaging (for push notifications)
6. Click **Add Package**

---

## Adding Project Files

Now we need to organize the Swift files I created into the Xcode project.

### Step 1: Organize Project Structure

In Xcode, create this folder structure:

```
StokeVideo/
├── StokeVideoApp.swift (main app file)
├── ContentView.swift
├── GoogleService-Info.plist
├── Models/
│   ├── Session.swift
│   ├── Clip.swift
│   └── UserProfile.swift
├── ViewModels/
│   ├── AuthViewModel.swift
│   ├── SessionsViewModel.swift
│   ├── ClipsViewModel.swift
│   └── ProfileViewModel.swift
└── Views/
    ├── LoginView.swift
    ├── MainTabView.swift
    ├── SessionsView.swift
    ├── ClipsView.swift
    └── ProfileView.swift
```

### Step 2: Create Groups in Xcode

1. Right-click on `StokeVideo` folder
2. Select **New Group**
3. Name it `Models`
4. Repeat for `ViewModels` and `Views`

### Step 3: Move Files

The files are already created in the StokeVideo folder. In Xcode:

1. Select the files to move
2. Drag them into the appropriate group
3. They'll be organized visually but stay in the same directory

---

## Project Configuration

### Step 1: Configure Info.plist

1. Select the **StokeVideo** target (blue icon at top)
2. Go to **Info** tab
3. Add these keys (right-click → **Add Row**):

```xml
NSCameraUsageDescription: "We need camera access to scan QR codes"
NSPhotoLibraryUsageDescription: "We need photo library access to save videos"
```

### Step 2: Configure App Capabilities

1. Select **StokeVideo** target
2. Go to **Signing & Capabilities** tab
3. Add capabilities:
   - **Push Notifications** (+ Capability button)
   - **Background Modes** → Select "Remote notifications"

### Step 3: Configure Build Settings

1. Select **StokeVideo** target
2. Go to **Build Settings** tab
3. Search for "Other Linker Flags"
4. Add: `-ObjC` (if not present)

---

## Building and Running

### Step 1: Select Simulator

1. At the top of Xcode, click the device selector
2. Choose **iPhone 15 Pro** (or any simulator)

### Step 2: Build

1. Press **⌘B** or click **Product** → **Build**
2. Wait for build to complete
3. Fix any errors (shouldn't be any!)

### Step 3: Run

1. Press **⌘R** or click **Product** → **Run**
2. Simulator will launch
3. App should appear!

---

## Troubleshooting

### Error: "No such module 'Firebase'"

**Solution:**
1. Make sure Firebase package is added (File → Add Package Dependencies)
2. Clean build folder: **Shift + ⌘ + K**
3. Build again: **⌘B**

### Error: "GoogleService-Info.plist not found"

**Solution:**
1. Make sure the file is in the Xcode project (visible in sidebar)
2. Check target membership (select file, check "Target Membership" in inspector)

### Error: "Failed to register bundle identifier"

**Solution:**
1. Go to **Signing & Capabilities**
2. Change bundle identifier to something unique
3. Or sign in with your Apple ID in Xcode preferences

### App crashes on launch

**Solution:**
1. Check Firebase is initialized (in StokeVideoApp.swift)
2. Make sure GoogleService-Info.plist is correct
3. Check console for error messages

---

## Next Steps After Xcode Setup

1. **Test the app** - Run on simulator
2. **Create test user** - In Firebase Console → Authentication
3. **Test login** - Use test user credentials
4. **Test on device** - Connect iPhone and run on real hardware
5. **Add app icon** - Create app icon set in Assets.xcassets

---

## Deploying to TestFlight (Optional)

1. **Set up App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Create new app
   - Bundle ID: `com.stokemountain.video`

2. **Archive the app**
   - In Xcode: **Product** → **Archive**
   - Wait for archive to complete
   - Organizer window will open

3. **Upload to App Store**
   - Click **Distribute App**
   - Select **App Store Connect**
   - Follow wizard

4. **Invite testers**
   - In App Store Connect → TestFlight
   - Add internal/external testers
   - They'll get email to install app

---

## File Reference

All the Swift files are in:
```
/Users/landongriffith/stoke-video-system/ios-app/StokeVideo/
```

Files created:
- ✓ StokeVideoApp.swift
- ✓ ContentView.swift
- ✓ Models/Session.swift
- ✓ Models/Clip.swift
- ✓ Models/UserProfile.swift
- ✓ ViewModels/AuthViewModel.swift
- ✓ ViewModels/SessionsViewModel.swift
- ✓ ViewModels/ClipsViewModel.swift
- ✓ ViewModels/ProfileViewModel.swift
- ✓ Views/LoginView.swift
- ✓ Views/MainTabView.swift
- ✓ Views/SessionsView.swift
- ✓ Views/ClipsView.swift
- ✓ Views/ProfileView.swift

---

Ready to create the project? Open Xcode and follow the steps above! 🚀
