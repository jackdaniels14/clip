# 🚀 Quick Start - Get Running in 30 Minutes!

## What You Need RIGHT NOW

### Software (Install These First)
1. **Xcode** - Already opening! ✅
2. **Node.js** - Download: https://nodejs.org (select LTS version)
3. **Firebase CLI** - Run: `npm install -g firebase-tools`

### Accounts (Create Free Accounts)
1. **Firebase** - https://console.firebase.google.com
2. **Stripe** (optional for now) - https://stripe.com

---

## 30-Minute Setup Path

### Step 1: Create Firebase Project (5 min)

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: `stoke-video-test`
4. Disable Google Analytics (for now)
5. Click "Create project"

**Enable Services:**
- Click "Authentication" → "Get started" → Enable "Email/Password"
- Click "Firestore Database" → "Create database" → Start in production mode
- Click "Storage" → "Get started" → Start in production mode

### Step 2: Create iOS App in Xcode (10 min)

Xcode should be open now. In Xcode:

1. **File** → **New** → **Project**
2. Select **iOS** → **App** → **Next**
3. Fill in:
   - Product Name: `StokeVideo`
   - Organization Identifier: `com.stokemountain`
   - Interface: **SwiftUI**
   - Language: **Swift**
4. Save location: `/Users/landongriffith/stoke-video-system/ios-app/`
5. **Uncheck** "Create Git repository"
6. Click **Create**

**Get Firebase Config:**
1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" → Click iOS icon
3. Register app with Bundle ID: `com.stokemountain.video`
4. **Download GoogleService-Info.plist**
5. Drag it into your Xcode project (check "Copy items")

**Add Firebase SDK:**
1. In Xcode: **File** → **Add Package Dependencies**
2. URL: `https://github.com/firebase/firebase-ios-sdk`
3. Add packages: FirebaseAuth, FirebaseFirestore, FirebaseStorage, FirebaseFunctions

### Step 3: Test the iOS App (5 min)

1. In Xcode, press **⌘R** to run
2. Select any iPhone simulator
3. App should launch!

**Create Test User:**
1. Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `test@test.com`, Password: `test123`
4. In iOS app, login with these credentials

### Step 4: Backend Setup (10 min)

Open Terminal:

```bash
# Navigate to project
cd /Users/landongriffith/stoke-video-system

# Login to Firebase
firebase login

# Initialize Firebase
firebase init
# Select: Functions, Firestore, Storage, Hosting
# Use existing project: stoke-video-test
# Accept defaults

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules

# Install backend dependencies
cd backend/functions
npm install

# Start locally (optional - for testing)
npm run serve
```

---

## What You Can Test Now

### ✅ iOS App
- Login/Signup
- Profile view
- Basic navigation

### 🚧 Not Working Yet (Need More Setup)
- Camera streaming (need cameras)
- Video clips (need backend running)
- Payments (need Stripe)

---

## Next Steps (When Ready)

### To Add Cameras
1. See: `SETUP_GUIDE.md` → "Camera Setup" section
2. Start with 1-2 test cameras (can use phone/webcam)
3. Use OBS Studio for testing

### To Enable Video Processing
1. Install FFmpeg: `brew install ffmpeg`
2. Implement composition engine (see `NEXT_STEPS.md`)

### To Add Payments
1. Create Stripe account
2. Add API keys to backend `.env`
3. Test purchase flow

---

## Full Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview and quick reference |
| `REQUIREMENTS.md` | **Complete list of what you need** |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `ARCHITECTURE.md` | System design and database schema |
| `NEXT_STEPS.md` | Features to implement next |
| `ios-app/XCODE_SETUP.md` | iOS app detailed setup |

---

## What You Have Now

✅ **Complete system architecture** - Database, API, everything planned
✅ **Firebase backend** - Cloud Functions, Firestore, Storage
✅ **Admin dashboard** - Web app for camera management
✅ **iOS user app** - Customer-facing app
✅ **Video ingestion server** - Multi-camera RTMP streaming with delay buffer
✅ **Camera organization** - Apparatus labeling system to prevent confusion
✅ **Security rules** - Firestore and Storage protection

## What's Not Done Yet

⏳ **Video composition engine** - Auto-editing multiple angles (Priority #1)
⏳ **Live streaming** - Real-time preview in app (simple to add)
⏳ **Payment integration** - Stripe checkout (mostly done, needs testing)

See `NEXT_STEPS.md` for implementation details with code examples!

---

## Cost Summary

### To Start Testing (Today)
- **$0** - Everything is free tier!

### For Production
- **One-time**: $2,400 (12 cameras) or $1,200 (budget option)
- **Monthly**: $150-400 (hosting, internet)
- **Revenue potential**: $1,000-2,000+/month

See `REQUIREMENTS.md` for detailed breakdown.

---

## Getting Help

### If Something Doesn't Work

1. **Check the docs** - SETUP_GUIDE.md has troubleshooting
2. **Check Firebase Console** - Look for errors in Functions logs
3. **Check Xcode Console** - Look for error messages
4. **Clean and rebuild** - In Xcode: Shift+⌘+K, then ⌘B

### Common Issues

**"No such module Firebase"**
→ Add Firebase package in Xcode (File → Add Package Dependencies)

**"GoogleService-Info.plist not found"**
→ Make sure you dragged it into Xcode with "Copy items" checked

**Backend functions not deploying**
→ Run `firebase login` and `firebase use your-project-id`

---

## Your Project Location

Everything is in:
```
/Users/landongriffith/stoke-video-system/
```

### Key Directories
- `admin-dashboard/` - React web app for admins
- `backend/functions/` - Firebase Cloud Functions API
- `backend/ingestion/` - Video streaming server
- `ios-app/` - iOS app (currently in Xcode!)
- `*.md` files - Documentation

---

## Ready? Let's Go! 🎬

1. ✅ Xcode is open - Create the project now!
2. ⏭️ Follow Step 1-4 above
3. 🎉 Test the app!

**Time to completion: ~30 minutes**

After that, explore the other docs and add features as needed!
