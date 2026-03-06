# Stoke Mountain Video Delay System

A comprehensive multi-camera video capture, auto-composition, and distribution system for action sports facilities.

## 🎯 Project Overview

This system provides three main components:

1. **Admin Dashboard** - Web interface for camera setup and session management
2. **Video Processing Backend** - Multi-camera capture, buffering, and auto-composition
3. **iOS User App** - Customer app for session check-in, live preview, and video downloads

## 📁 Project Structure

```
stoke-video-system/
├── backend/                    # Node.js + Firebase backend
│   ├── functions/             # Firebase Cloud Functions
│   │   ├── src/
│   │   │   ├── api/          # REST API endpoints
│   │   │   ├── processing/   # Video processing workers
│   │   │   ├── triggers/     # Firestore triggers
│   │   │   └── utils/        # Shared utilities
│   │   └── package.json
│   ├── ingestion/            # Video ingestion server
│   │   ├── src/
│   │   │   ├── stream/       # RTMP/WebRTC handlers
│   │   │   ├── buffer/       # Circular buffer management
│   │   │   └── sync/         # Multi-camera synchronization
│   │   └── package.json
│   └── composition/          # Video composition engine
│       ├── src/
│       │   ├── templates/    # Composition templates
│       │   ├── ffmpeg/       # FFmpeg processing
│       │   └── workers/      # Processing queue workers
│       └── package.json
├── admin-dashboard/           # React admin web app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── services/        # Firebase services
│   └── package.json
├── ios-app/                   # iOS user application
│   ├── StokeVideo/
│   │   ├── Models/          # Data models
│   │   ├── Views/           # SwiftUI views
│   │   ├── ViewModels/      # View models
│   │   ├── Services/        # Firebase services
│   │   └── Utils/           # Utilities
│   └── StokeVideo.xcodeproj
├── shared/                    # Shared code and types
│   └── types/                # TypeScript type definitions
├── firebase.json             # Firebase configuration
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── ARCHITECTURE.md          # System architecture documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- FFmpeg installed: `brew install ffmpeg` (macOS)
- Xcode 15+ (for iOS development)
- Firebase project created at https://console.firebase.google.com

### Initial Setup

1. **Clone and install dependencies**
   ```bash
   cd stoke-video-system

   # Install backend dependencies
   cd backend/functions && npm install
   cd ../ingestion && npm install
   cd ../composition && npm install

   # Install admin dashboard dependencies
   cd ../../admin-dashboard && npm install
   ```

2. **Firebase Setup**
   ```bash
   # Login to Firebase
   firebase login

   # Initialize Firebase project
   firebase init
   # Select: Functions, Firestore, Storage, Hosting
   # Choose your Firebase project
   # Use default options
   ```

3. **Environment Configuration**

   Create `.env` file in `backend/functions/`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   STRIPE_SECRET_KEY=your-stripe-key
   RTMP_SERVER_PORT=1935
   VIDEO_PROCESSING_CONCURRENCY=4
   ```

4. **Deploy Firebase Rules**
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

5. **Start Development Servers**

   Terminal 1 - Backend Functions:
   ```bash
   cd backend/functions
   npm run serve
   ```

   Terminal 2 - Ingestion Server:
   ```bash
   cd backend/ingestion
   npm run dev
   ```

   Terminal 3 - Admin Dashboard:
   ```bash
   cd admin-dashboard
   npm start
   ```

### iOS App Setup

1. **Install dependencies**
   ```bash
   cd ios-app
   pod install  # If using CocoaPods
   ```

2. **Configure Firebase**
   - Download `GoogleService-Info.plist` from Firebase Console
   - Add to Xcode project

3. **Open in Xcode**
   ```bash
   open StokeVideo.xcworkspace
   ```

## 📱 Features

### Admin Dashboard
- ✅ Camera registration and management
- ✅ Apparatus labeling system with QR codes
- ✅ Live camera preview grid
- ✅ Session monitoring and controls
- ✅ Analytics and reporting

### Video Processing
- ✅ Multi-camera RTMP/WebRTC ingestion
- ✅ Configurable delay buffer (5-60 seconds)
- ✅ Automatic clip detection
- ✅ Multi-camera synchronization
- ✅ Auto-composition with templates
- ✅ Slow-motion highlights

### iOS User App
- ✅ User authentication
- ✅ Session check-in via QR code
- ✅ Live session preview
- ✅ Video library and downloads
- ✅ In-app purchases
- ✅ Social media sharing
- ✅ Push notifications

## 🎬 Video Composition Templates

1. **Dual View** - Two angles side-by-side
2. **Follow Cam** - Main angle with PIP
3. **Sequential** - Best angles in sequence
4. **Quad Split** - Four cameras grid
5. **Action Highlight** - Auto slow-mo moments

## 🔐 Security

- Firebase Authentication for users and admins
- Role-based access control (RBAC)
- Encrypted video streams (RTMPS)
- Signed download URLs with expiration
- PCI-compliant payment processing

## 📊 Database Collections

- `cameras` - Camera devices and settings
- `sessions` - Recording sessions
- `clips` - Individual video clips
- `users` - User accounts
- `purchases` - Purchase history

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed schema.

## 🎯 Camera Apparatus Organization

Each camera is labeled with apparatus + angle:
- `TRAM-1-FRONT` - Trampoline 1, Front View
- `TRAM-1-SIDE` - Trampoline 1, Side View
- `SKI-JUMP-LEFT` - Ski Jump, Left Angle
- `FOAM-PIT-OVER` - Foam Pit, Overhead

Cameras auto-route to sessions based on apparatus selection.

## 💰 Pricing & Monetization

- **Pay-per-clip**: $5-15 per composed video
- **Monthly subscription**: $30 for unlimited downloads
- **Session package**: $50 for 5 sessions
- **Premium edits**: $25 for custom compositions

## 🚀 Deployment

### Backend Deployment
```bash
# Deploy Cloud Functions
cd backend/functions
firebase deploy --only functions

# Deploy ingestion server to Cloud Run
gcloud run deploy video-ingestion \
  --source ./backend/ingestion \
  --region us-central1 \
  --allow-unauthenticated
```

### Admin Dashboard Deployment
```bash
cd admin-dashboard
npm run build
firebase deploy --only hosting
```

### iOS App Deployment
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

## 📈 Performance Targets

- Camera stream latency: < 2 seconds
- Clip processing: < 2 minutes for 30-second clip
- App load time: < 3 seconds
- Video download start: < 5 seconds
- Concurrent cameras: 50+
- Concurrent users: 100+

## 🛠️ Tech Stack

**Backend**:
- Node.js 18+ with Express
- Firebase Cloud Functions
- Firebase Firestore & Storage
- FFmpeg for video processing
- WebRTC/RTMP for streaming

**Frontend**:
- React 18 with TypeScript
- Material-UI components
- Firebase SDK
- WebRTC for live previews

**iOS**:
- Swift 5.9
- SwiftUI
- Firebase iOS SDK
- AVFoundation for video

## 📝 Development Commands

```bash
# Backend
npm run serve          # Run functions locally
npm run deploy         # Deploy to Firebase
npm run logs           # View function logs

# Admin Dashboard
npm start             # Development server
npm run build         # Production build
npm test              # Run tests

# iOS
# Use Xcode for building and running
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Proprietary - Stoke Mountain 2026

## 📞 Support

For issues or questions:
- Documentation: See ARCHITECTURE.md
- Email: support@stokemountain.com
- GitHub Issues: Create an issue in this repository

---

Built with ❤️ for Stoke Mountain by Claude Code
