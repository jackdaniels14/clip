# Stoke Mountain Video Delay System - Architecture

## System Overview

A multi-camera video delay and auto-composition system for capturing and selling action sports videos to customers at Stoke Mountain facility.

## Core Components

### 1. Admin Camera Management System (Web Dashboard)
**Purpose**: Allow facility admins to configure and manage multiple cameras

**Features**:
- Camera registration with unique identifiers (QR codes/NFC tags)
- Camera apparatus labeling system (e.g., "Trampoline 1 - Front", "Ski Jump - Side Angle")
- Live camera preview grid
- Camera health monitoring and status indicators
- Recording session controls (start/stop/pause)
- Camera calibration and sync settings

**Tech Stack**:
- React.js web dashboard
- Firebase Authentication (admin roles)
- Firebase Realtime Database for camera status
- WebRTC for live camera previews

### 2. Video Ingestion & Processing Backend
**Purpose**: Capture, buffer, and process multi-camera video streams

**Features**:
- Multi-stream video capture with configurable delay (5-60 seconds typical)
- Circular buffer for instant replay capability
- Camera synchronization using timestamps
- Automatic clip detection (motion-based or manual triggers)
- Video encoding and compression
- Multi-camera angle composition

**Tech Stack**:
- Node.js/Express backend
- FFmpeg for video processing
- Firebase Cloud Functions for serverless processing
- Firebase Storage for video files
- WebRTC/RTMP for video streaming

### 3. Auto-Composition Engine
**Purpose**: Automatically create compelling multi-angle videos

**Features**:
- Template-based video layouts (split-screen, picture-in-picture, sequential)
- Intelligent angle switching based on action detection
- Transitions and effects (slow-mo highlights, freeze frames)
- Branded intro/outro with Stoke Mountain logo
- Audio mixing from multiple sources
- Export presets (social media formats, high-quality downloads)

**Composition Templates**:
- "Dual View" - Two angles side-by-side
- "Follow Cam" - Main angle with PIP for alternate views
- "Sequential" - Best angles played in sequence
- "Quad Split" - Four cameras grid view
- "Action Highlight" - Auto-detected best moments with slow-mo

**Tech Stack**:
- FFmpeg for video composition
- Node.js worker processes
- Template system with JSON configurations
- Optional: ML-based action detection (future enhancement)

### 4. iOS User App
**Purpose**: Customer-facing app for session management and video downloads

**Features**:
- User authentication (email/social login)
- Session check-in with QR code/ticket number
- Live session preview (see yourself performing)
- Video library of past sessions
- Purchase/download videos
- Share directly to social media
- Clip trimming and favorites
- Push notifications when videos are ready

**Tech Stack**:
- Swift/SwiftUI for iOS
- Firebase Authentication
- Firebase Firestore for user data
- Firebase Storage for video delivery
- Stripe/Apple Pay for payments

## Database Schema (Firestore)

### Collections

#### `cameras`
```json
{
  "cameraId": "cam_001",
  "apparatus": "Trampoline 1",
  "angle": "Front View",
  "position": {
    "lat": 47.1234,
    "long": -122.5678,
    "height": "3m"
  },
  "status": "active|inactive|error",
  "streamUrl": "rtmp://...",
  "lastHeartbeat": "timestamp",
  "settings": {
    "resolution": "1080p",
    "fps": 60,
    "delaySeconds": 30
  }
}
```

#### `sessions`
```json
{
  "sessionId": "sess_20260305_001",
  "userId": "user_123",
  "startTime": "timestamp",
  "endTime": "timestamp",
  "apparatus": ["Trampoline 1", "Ski Jump"],
  "cameras": ["cam_001", "cam_002", "cam_005"],
  "status": "recording|processing|completed",
  "clips": ["clip_001", "clip_002"],
  "liveStreamUrl": "https://...",
  "ticketNumber": "STOKE-12345"
}
```

#### `clips`
```json
{
  "clipId": "clip_001",
  "sessionId": "sess_20260305_001",
  "userId": "user_123",
  "startTime": "timestamp",
  "duration": 15,
  "cameras": ["cam_001", "cam_002"],
  "rawVideos": {
    "cam_001": "gs://bucket/raw/clip_001_cam_001.mp4",
    "cam_002": "gs://bucket/raw/clip_001_cam_002.mp4"
  },
  "composedVideos": {
    "dual_view": "gs://bucket/composed/clip_001_dual.mp4",
    "highlight": "gs://bucket/composed/clip_001_highlight.mp4"
  },
  "thumbnail": "gs://bucket/thumbnails/clip_001.jpg",
  "status": "processing|ready|purchased",
  "price": 9.99,
  "processingProgress": 75
}
```

#### `users`
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "sessions": ["sess_20260305_001"],
  "purchases": ["clip_001", "clip_003"],
  "credits": 2,
  "subscriptionTier": "free|basic|pro"
}
```

#### `purchases`
```json
{
  "purchaseId": "pur_001",
  "userId": "user_123",
  "clipId": "clip_001",
  "amount": 9.99,
  "timestamp": "timestamp",
  "downloadUrl": "https://...",
  "downloadExpiry": "timestamp",
  "paymentMethod": "stripe|apple_pay"
}
```

## Video Flow Architecture

### Camera Setup Flow
1. Admin accesses dashboard
2. Registers new camera with apparatus label (e.g., "Trampoline 1 - Angle A")
3. Camera receives unique ID and QR code
4. Physical QR code placed near camera for reference
5. Camera begins streaming to ingestion server

### Session Recording Flow
1. Customer checks in at facility (gets ticket/QR code)
2. Customer scans QR code or enters ticket number in app
3. System links customer to active session
4. Cameras at selected apparatus begin recording to circular buffer
5. Motion detection or manual trigger creates clip markers
6. Customer can view live preview in app (delayed stream)
7. Session ends, clips are queued for processing

### Video Processing Flow
1. Raw multi-camera clips extracted from buffer
2. Clips synchronized using timestamps
3. Auto-composition engine generates multiple versions:
   - Each camera angle individually
   - Template-based composed videos
4. Thumbnails generated from key frames
5. Videos uploaded to Firebase Storage
6. User notified via push notification

### Video Purchase & Download Flow
1. User browses video library in app
2. Selects clip and composition style
3. Previews watermarked version
4. Purchases via Stripe/Apple Pay
5. Receives download link (valid for 30 days)
6. Can re-download from purchase history

## Camera Apparatus Organization System

### Physical Setup
- Each apparatus area (trampoline, ski jump, foam pit) has designated camera positions
- Cameras labeled with apparatus + angle (e.g., "TRAM-1-FRONT", "SKI-SIDE")
- QR codes on camera housings for quick identification
- Color-coded labels for visual reference

### Software Organization
- Cameras grouped by apparatus in admin dashboard
- Drag-and-drop interface to assign cameras to apparatus
- Templates map to apparatus types (e.g., "trampoline" templates vs "ski jump" templates)
- Auto-routing: session at "Trampoline 1" automatically uses TRAM-1-* cameras

### Scaling for Multiple Cameras
- Microservices architecture: separate ingestion servers per apparatus
- Load balancing across processing workers
- Distributed storage with CDN for delivery
- Camera health monitoring prevents bottlenecks
- Automatic failover if camera goes offline

## System Components Diagram

```
[Cameras] --RTMP--> [Ingestion Servers] --Store--> [Firebase Storage]
                           |
                           v
                    [Circular Buffer]
                           |
                    [Clip Detection]
                           |
                           v
                  [Processing Queue] ---> [Composition Workers]
                           |                      |
                           v                      v
                    [Firebase Storage] <------ [FFmpeg]
                           |
                           v
                    [iOS App / Web Dashboard]
                           |
                           v
                      [Users]
```

## Security Considerations

- Admin dashboard requires authentication and admin role
- Camera streams encrypted (RTMPS)
- Video files access-controlled via Firebase Security Rules
- Download URLs use signed tokens with expiration
- User data encrypted at rest
- PCI compliance for payment processing (Stripe handles this)
- GDPR compliance: user data deletion on request

## Deployment Architecture

### Development Environment
- Local Node.js server for testing
- Firebase Emulator Suite
- Test cameras (webcams or phone cameras)

### Production Environment
- Firebase Cloud Functions for serverless backend
- Firebase Hosting for admin dashboard
- Firebase Storage with CDN for video delivery
- Cloud Run for long-running video processing workers
- Load balancer for camera ingestion

## Performance Targets

- Camera stream latency: < 2 seconds
- Clip processing time: < 2 minutes for 30-second clip
- App load time: < 3 seconds
- Video download start: < 5 seconds
- Concurrent camera support: 50+ cameras
- Concurrent user sessions: 100+ users

## Future Enhancements

1. **AI-Powered Features**
   - Automatic trick recognition and labeling
   - Quality scoring for clip ranking
   - Smart highlights (best moments detection)

2. **Social Features**
   - User profiles and following
   - Leaderboards and challenges
   - Community clip sharing

3. **Advanced Editing**
   - User-controlled clip editing
   - Custom music overlay
   - AR effects and filters

4. **Business Intelligence**
   - Analytics dashboard for facility operators
   - Popular apparatus tracking
   - Revenue reports

5. **Multi-Location Support**
   - Support multiple Stoke Mountain locations
   - User account works across locations
   - Unified video library

## Cost Estimation

### Monthly Operating Costs (estimated)
- Firebase Storage (1TB): ~$26
- Cloud Functions (100k invocations): ~$0.40
- Video processing (Cloud Run): ~$50-200 depending on usage
- CDN bandwidth (500GB): ~$40
- Total: ~$120-270/month base + variable by usage

### Revenue Model
- Pay-per-clip: $5-15 per composed video
- Subscription: Unlimited downloads for $30/month
- Session package: 5 sessions with all clips for $50
- Premium edits: Custom compositions for $25

---

**Version**: 1.0
**Last Updated**: March 5, 2026
**Author**: Claude Code for Stoke Mountain
