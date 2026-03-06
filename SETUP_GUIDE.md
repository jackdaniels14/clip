# Stoke Mountain Video System - Setup Guide

This guide will walk you through setting up the entire Stoke Mountain Video Delay System from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Backend Setup](#backend-setup)
4. [Admin Dashboard Setup](#admin-dashboard-setup)
5. [iOS App Setup](#ios-app-setup)
6. [Camera Setup](#camera-setup)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Firebase CLI** - Install with: `npm install -g firebase-tools`
- **FFmpeg** - Install with: `brew install ffmpeg` (macOS) or [Download](https://ffmpeg.org/download.html)
- **Xcode 15+** (for iOS development) - [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Git** - [Download](https://git-scm.com/)

### Optional Tools
- **Postman** or **Insomnia** - For API testing
- **Firebase Emulator Suite** - For local development

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project (e.g., "stoke-video-system")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### Step 2: Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** authentication
4. (Optional) Enable **Google Sign-In** for easier admin access

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll deploy rules later)
4. Choose your region (e.g., us-central1)
5. Click "Enable"

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **production mode**
4. Choose your region (same as Firestore)
5. Click "Done"

### Step 3: Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"
5. Copy the User UID

### Step 4: Set Admin Role

1. Go to **Firestore Database**
2. Start collection: `users`
3. Document ID: (paste the User UID from step 3)
4. Add fields:
   ```
   userId: <your-admin-uid>
   email: "admin@stokemountain.com"
   name: "Admin"
   role: "admin"
   phone: ""
   sessions: []
   purchases: []
   credits: 0
   subscriptionTier: "admin"
   createdAt: (current timestamp)
   updatedAt: (current timestamp)
   ```
5. Save

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web app** icon (</>) to add a web app
4. Register app with name "Stoke Admin Dashboard"
5. Copy the `firebaseConfig` object
6. Click **iOS** icon to add an iOS app
7. Register app with bundle ID: `com.stokemountain.video`
8. Download `GoogleService-Info.plist`

---

## Backend Setup

### Step 1: Navigate to Project Directory

```bash
cd stoke-video-system
```

### Step 2: Install Dependencies

```bash
# Backend Functions
cd backend/functions
npm install

# Ingestion Server
cd ../ingestion
npm install

cd ../..
```

### Step 3: Configure Firebase

```bash
# Login to Firebase
firebase login

# Select your project
firebase use --add
# Select your project from the list
# Give it an alias (e.g., "default")
```

### Step 4: Configure Environment Variables

Create `.env` file in `backend/functions/`:

```env
FIREBASE_PROJECT_ID=your-project-id
STRIPE_SECRET_KEY=sk_test_your_stripe_key
RTMP_SERVER_PORT=1935
VIDEO_PROCESSING_CONCURRENCY=4
APP_URL=http://localhost:3000
```

Create `.env` file in `backend/ingestion/`:

```env
PORT=3000
RTMP_SERVER_PORT=1935
FIREBASE_PROJECT_ID=your-project-id
LOG_LEVEL=info
NODE_ENV=development
```

### Step 5: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### Step 6: Deploy Cloud Functions (Optional - for production)

```bash
cd backend/functions
npm run deploy
```

### Step 7: Start Development Servers

**Terminal 1 - Cloud Functions:**
```bash
cd backend/functions
npm run serve
```

**Terminal 2 - Ingestion Server:**
```bash
cd backend/ingestion
npm run dev
```

You should see:
- Functions running at: http://localhost:5001
- Ingestion server at: http://localhost:3000
- RTMP server at: rtmp://localhost:1935

---

## Admin Dashboard Setup

### Step 1: Install Dependencies

```bash
cd admin-dashboard
npm install
```

### Step 2: Configure Firebase

Create `.env` file in `admin-dashboard/`:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Replace with values from your Firebase config (from Firebase Setup Step 5).

### Step 3: Start Development Server

```bash
npm run dev
```

Dashboard will be available at: http://localhost:3000

### Step 4: Login

1. Open http://localhost:3000
2. Login with your admin credentials
3. You should see the dashboard

---

## iOS App Setup

### Step 1: Add Firebase to iOS Project

1. Open Xcode
2. Create new project or open existing:
   ```bash
   cd ios-app
   open StokeVideo.xcodeproj
   ```
3. Drag `GoogleService-Info.plist` (from Firebase Setup) into Xcode project
4. Make sure "Copy items if needed" is checked

### Step 2: Install Firebase SDK via Swift Package Manager

1. In Xcode, go to **File** → **Add Package Dependencies**
2. Enter URL: `https://github.com/firebase/firebase-ios-sdk`
3. Select version: 10.20.0 or later
4. Add these libraries:
   - FirebaseAuth
   - FirebaseFirestore
   - FirebaseStorage
   - FirebaseFunctions

### Step 3: Configure App

1. Open `StokeVideoApp.swift`
2. Firebase is already initialized in the code
3. Update bundle identifier to match: `com.stokemountain.video`

### Step 4: Build and Run

1. Select a simulator or connected device
2. Click **Run** (⌘R)
3. App should build and launch

### Step 5: Test Login

1. Create a test user in Firebase Authentication console
2. Use those credentials to login in the app

---

## Camera Setup

### Understanding Camera Configuration

Each camera needs:
1. **Unique ID** - Automatically generated (e.g., `cam_abc123`)
2. **Apparatus** - Location/equipment (e.g., "Trampoline 1")
3. **Angle** - View position (e.g., "Front View", "Side View")
4. **RTMP Stream** - Video feed URL

### Step 1: Add Camera in Admin Dashboard

1. Login to admin dashboard
2. Navigate to **Cameras**
3. Click **Add Camera**
4. Fill in:
   - Apparatus: "Trampoline 1"
   - Angle: "Front View"
   - Resolution: "1080p"
   - FPS: 60
   - Delay: 30 seconds
5. Click **Save**
6. Note the Camera ID and QR code displayed

### Step 2: Configure Physical Camera

For IP cameras or webcams, you'll need to stream to RTMP server.

#### Option A: Using OBS Studio (for testing)

1. Download [OBS Studio](https://obsproject.com/)
2. Add your video source (webcam, screen capture, etc.)
3. Go to **Settings** → **Stream**
4. Set:
   - Service: Custom
   - Server: `rtmp://localhost:1935/live`
   - Stream Key: `cam_abc123` (your camera ID)
5. Click **Start Streaming**

#### Option B: Using IP Camera

For IP cameras with RTMP support:
```
rtmp://your-server-ip:1935/live/cam_abc123
```

Configure your camera to stream to this URL.

#### Option C: Using FFmpeg (for testing)

Stream a video file:
```bash
ffmpeg -re -i test_video.mp4 -c:v libx264 -preset veryfast -maxrate 3000k \
  -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://localhost:1935/live/cam_abc123
```

### Step 3: Verify Camera Stream

1. Go to admin dashboard
2. Navigate to **Cameras**
3. Your camera should show status: "active" with a green indicator
4. You should see live preview (if implemented)

### Step 4: Label Cameras Physically

1. Print the QR code from the dashboard
2. Attach it near the camera
3. This helps staff identify cameras during setup

---

## Testing

### Test 1: Camera Registration

1. Add a camera via admin dashboard
2. Verify it appears in Firestore `cameras` collection
3. Verify QR code is generated

### Test 2: Video Streaming

1. Start streaming from a camera (using OBS or FFmpeg)
2. Check ingestion server logs for connection
3. Verify camera status updates to "active"

### Test 3: Session Creation

#### Via API (using Postman):

```http
POST http://localhost:5001/your-project/us-central1/api/sessions
Authorization: Bearer <your-firebase-id-token>
Content-Type: application/json

{
  "apparatus": ["Trampoline 1"],
  "ticketNumber": "STOKE-12345"
}
```

#### Via iOS App:

1. Login to iOS app
2. Go to **Sessions** tab
3. Click **Check In**
4. Enter ticket number: STOKE-12345
5. Verify session appears

### Test 4: Clip Creation

```http
POST http://localhost:3000/clip/cam_abc123
Content-Type: application/json

{
  "duration": 10,
  "startOffset": -5
}
```

This creates a 10-second clip starting 5 seconds ago.

### Test 5: Admin Dashboard

1. Login to dashboard
2. Navigate through all pages:
   - Dashboard (stats)
   - Cameras (list and management)
   - Sessions (active sessions)
   - Analytics (placeholder)

---

## Deployment

### Deploy to Firebase Hosting (Admin Dashboard)

```bash
cd admin-dashboard
npm run build
firebase deploy --only hosting
```

Your dashboard will be at: `https://your-project.web.app`

### Deploy Cloud Functions

```bash
cd backend/functions
npm run deploy
```

### Deploy Ingestion Server to Cloud Run

```bash
cd backend/ingestion

# Build container
gcloud builds submit --tag gcr.io/your-project-id/video-ingestion

# Deploy to Cloud Run
gcloud run deploy video-ingestion \
  --image gcr.io/your-project-id/video-ingestion \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=your-project-id
```

### Submit iOS App to App Store

1. Archive app in Xcode
2. Upload to App Store Connect
3. Fill in app metadata
4. Submit for review

---

## Troubleshooting

### Issue: Firebase Functions not deploying

**Solution:**
```bash
# Ensure you're logged in
firebase login

# Check current project
firebase use

# Try deploying with verbose logging
firebase deploy --only functions --debug
```

### Issue: Camera stream not connecting

**Solution:**
1. Check ingestion server is running
2. Verify RTMP port (1935) is not blocked by firewall
3. Check camera ID matches exactly
4. Review ingestion server logs

### Issue: Admin dashboard can't authenticate

**Solution:**
1. Verify Firebase config in `.env` is correct
2. Check that Email/Password authentication is enabled in Firebase
3. Ensure user exists in Firebase Authentication
4. Check that user has `role: "admin"` in Firestore

### Issue: iOS app build fails

**Solution:**
1. Clean build folder: Product → Clean Build Folder (⇧⌘K)
2. Update Swift packages: File → Packages → Update to Latest Package Versions
3. Verify `GoogleService-Info.plist` is in project
4. Check bundle identifier matches Firebase iOS app

### Issue: Video clips not processing

**Solution:**
1. Verify FFmpeg is installed: `ffmpeg -version`
2. Check Cloud Functions logs: `firebase functions:log`
3. Ensure video files are being uploaded to Firebase Storage
4. Review composition engine logs

---

## Next Steps

Now that your system is set up, you can:

1. **Add More Cameras**
   - Register additional cameras for different apparatus
   - Create multi-angle setups

2. **Configure Video Templates**
   - Implement composition templates in `backend/composition/`
   - Add custom transitions and effects

3. **Set Up Payments**
   - Configure Stripe account
   - Add Stripe keys to environment variables
   - Test purchase flow

4. **Customize Branding**
   - Add your logo to admin dashboard
   - Customize iOS app colors and icons
   - Create branded video intros/outros

5. **Go Live**
   - Set up production Firebase project
   - Deploy all components to production
   - Configure custom domain
   - Submit iOS app to App Store

---

## Support

For issues or questions:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [README.md](./README.md) for quick reference
- Open an issue on GitHub
- Contact: support@stokemountain.com

---

**Congratulations!** Your Stoke Mountain Video System is now set up and ready to capture amazing action sports moments!
