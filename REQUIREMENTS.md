# Complete Requirements for Stoke Video System

## 🖥️ Software Requirements

### Required Software (Free)
- **Node.js 18+** - [Download](https://nodejs.org/) - For backend development
- **Firebase CLI** - `npm install -g firebase-tools` - For deployment
- **Git** - [Download](https://git-scm.com/) - Version control
- **FFmpeg** - `brew install ffmpeg` - Video processing
- **Xcode 15+** - [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835) - iOS development (Mac only)
- **Web Browser** - Chrome/Safari/Firefox

### Optional Software
- **Visual Studio Code** - [Download](https://code.visualstudio.com/) - Code editor
- **Postman** - [Download](https://www.postman.com/) - API testing
- **OBS Studio** - [Download](https://obsproject.com/) - Camera testing

---

## 📱 Hardware Requirements

### Cameras
**Option 1: IP Cameras (Recommended for Production)**
- RTMP-capable IP cameras
- Examples:
  - Axis M-series cameras (~$400-800 each)
  - Hikvision DS-2CD series (~$150-300 each)
  - Reolink RLC-series (~$100-200 each)
- Features needed:
  - RTMP streaming support
  - 1080p @ 60fps minimum
  - Network connectivity (WiFi or Ethernet)
  - Mounting hardware

**Option 2: Webcams + Computer (Budget Option)**
- Logitech C920/C922 webcams (~$70 each)
- Mac Mini or PC to run streaming software
- OBS Studio or similar to stream to RTMP

**Option 3: Smartphone Cameras (Testing)**
- iPhones/Android phones
- IP Webcam apps (for streaming)
- Tripods/mounts

### Recommended Camera Setup per Apparatus
- **Trampoline**: 2-3 cameras (front, side, overhead)
- **Ski Jump**: 2-3 cameras (approach, side, landing)
- **Foam Pit**: 2 cameras (approach, pit view)

**Example Setup (5 apparatus, 12 cameras total):**
```
Trampoline 1: 3 cameras
Trampoline 2: 3 cameras
Ski Jump: 3 cameras
Foam Pit: 2 cameras
Rails Park: 1 camera
Total: 12 cameras × $200 = ~$2,400
```

### Server Hardware

**Development/Testing:**
- Your Mac (can run everything locally)

**Production Option 1: Cloud (Recommended)**
- No physical server needed
- Everything runs on Firebase/Google Cloud
- Pay-as-you-go pricing

**Production Option 2: On-Premise Server**
- Mac Mini or Linux server
- Minimum specs:
  - 16GB RAM
  - 500GB SSD
  - Good network connection (100+ Mbps upload)
  - Quad-core CPU (for video processing)
- Cost: ~$800-1,500

### Network Infrastructure
- **Router** - Gigabit Ethernet support
- **Network Switch** - If using wired cameras (24-port ~$100-300)
- **WiFi Access Points** - For wireless cameras (Ubiquiti UniFi recommended)
- **Internet Connection** - 100+ Mbps upload (critical for cloud hosting)

### Miscellaneous
- **QR Code Labels** - For camera identification (~$20)
- **Cable Management** - Ethernet cables, mounts (~$100-200)
- **Backup Power** - UPS for server (~$100-300)
- **Display for Admin Station** - Monitor/iPad for admin dashboard

---

## 💳 Service Accounts & Subscriptions

### Required (Free Tier Available)
1. **Firebase/Google Cloud Account**
   - Sign up: https://console.firebase.google.com
   - Free tier includes:
     - 1GB storage
     - 10GB bandwidth/month
     - 50K reads/day
   - Paid tier: ~$25-100/month depending on usage

2. **Stripe Account** (for payments)
   - Sign up: https://stripe.com
   - No monthly fee
   - 2.9% + $0.30 per transaction

3. **Apple Developer Account** (for iOS app)
   - Required for App Store
   - $99/year
   - Sign up: https://developer.apple.com

### Optional
4. **GitHub Account** (for code hosting)
   - Free for private repos
   - Sign up: https://github.com

5. **Domain Name** (for custom URL)
   - ~$10-15/year
   - Providers: Namecheap, Google Domains, GoDaddy

6. **SSL Certificate** (for HTTPS)
   - Free with Firebase Hosting
   - Or use Let's Encrypt (free)

---

## 💰 Estimated Costs

### Initial Setup (One-Time)
| Item | Cost | Notes |
|------|------|-------|
| 12 IP Cameras | $2,400 | Budget option: $1,200 |
| Network Equipment | $400 | Switch, cables, mounts |
| Apple Developer | $99 | Annual fee |
| Domain Name | $12 | Annual fee |
| Backup Power (UPS) | $150 | Optional but recommended |
| **Total Initial** | **~$3,061** | **Budget: ~$1,861** |

### Monthly Operating Costs
| Item | Cost | Notes |
|------|------|-------|
| Firebase/Google Cloud | $50-200 | Depends on usage |
| Internet (Business) | $100-200 | If upgrading |
| Stripe Fees | Variable | 2.9% of sales |
| Apple Developer | $8 | $99/year amortized |
| **Total Monthly** | **~$158-408** | **Plus payment processing** |

### Revenue Potential
| Scenario | Monthly Income |
|----------|----------------|
| 100 clips/month @ $10 | $1,000 |
| 200 clips/month @ $10 | $2,000 |
| 50 subscriptions @ $30 | $1,500 |

**Break-even:** ~16-41 clips/month (depending on costs)

---

## 🔧 Technical Skills Needed

### Essential
- **Basic computer skills** - File management, software installation
- **Network basics** - IP addresses, WiFi setup
- **Camera setup** - Physical mounting and configuration

### Nice to Have (for customization)
- **JavaScript/TypeScript** - For backend modifications
- **React** - For admin dashboard changes
- **Swift** - For iOS app modifications
- **Firebase** - For database management
- **FFmpeg** - For video processing tweaks

**Don't worry!** The system is mostly set up. You mainly need to:
1. Follow the setup guide
2. Mount cameras
3. Configure settings via admin dashboard

---

## 📋 Pre-Launch Checklist

### Step 1: Software Setup (1-2 days)
- [ ] Install Node.js
- [ ] Install Firebase CLI
- [ ] Install FFmpeg
- [ ] Install Xcode (for iOS)
- [ ] Clone/download project code

### Step 2: Firebase Setup (2-4 hours)
- [ ] Create Firebase account
- [ ] Create new project
- [ ] Enable Authentication
- [ ] Enable Firestore
- [ ] Enable Storage
- [ ] Deploy security rules

### Step 3: Backend Setup (2-4 hours)
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Deploy Cloud Functions
- [ ] Test API endpoints
- [ ] Start ingestion server

### Step 4: Camera Setup (4-8 hours)
- [ ] Mount cameras physically
- [ ] Connect to network
- [ ] Configure RTMP streaming
- [ ] Register in admin dashboard
- [ ] Test video feeds
- [ ] Print and attach QR codes

### Step 5: Admin Dashboard (1-2 hours)
- [ ] Install dependencies
- [ ] Configure Firebase connection
- [ ] Deploy to Firebase Hosting
- [ ] Create admin account
- [ ] Test camera management

### Step 6: iOS App (4-8 hours)
- [ ] Open in Xcode
- [ ] Add GoogleService-Info.plist
- [ ] Install Firebase SDK
- [ ] Test on simulator
- [ ] Test on real device
- [ ] Submit to App Store (optional)

### Step 7: Testing (2-4 days)
- [ ] Test camera streaming
- [ ] Test session creation
- [ ] Test clip creation
- [ ] Test user check-in
- [ ] Test payment flow
- [ ] Load testing

### Step 8: Go Live! (1 day)
- [ ] Deploy to production
- [ ] Train staff
- [ ] Create user documentation
- [ ] Monitor for issues

**Total Time Estimate:** 2-3 weeks for full setup

---

## 🎯 What You Need RIGHT NOW to Get Started

### Today (30 minutes):
1. **Firebase Account** - Create at https://console.firebase.google.com
2. **Node.js** - Download and install from https://nodejs.org

### This Week:
3. **Stripe Account** - For payments (can test without this first)
4. **Apple Developer** - If you want to publish iOS app
5. **1-2 Test Cameras** - Even your phone or webcam works for testing

### This Month:
6. **Production Cameras** - Order the cameras you need
7. **Network Setup** - Ensure good WiFi/Ethernet coverage

---

## 🤝 Support Options

### DIY (Free)
- Follow the setup guides I provided
- Use provided documentation
- Debug issues yourself

### Hire Developer ($2,000-10,000)
- Complete setup and customization
- Video composition engine implementation
- Custom features
- Training

### Managed Service ($500-2,000/month)
- Hosting and maintenance
- Technical support
- Updates and improvements
- 24/7 monitoring

---

## 🚀 Quick Start Path

**Minimal setup to see it working:**

1. Install Node.js and Firebase CLI (10 min)
2. Create Firebase project (15 min)
3. Run backend locally (30 min)
4. Open admin dashboard (10 min)
5. Use OBS or phone as test camera (20 min)
6. See live video feed!

**Total: ~90 minutes to first working demo**

---

## ❓ FAQ

**Q: Can I start with just 1-2 cameras?**
A: Yes! Start small and add more as needed.

**Q: Do I need a Mac?**
A: Only for iOS development. Backend and admin dashboard work on any OS.

**Q: Can I use existing cameras?**
A: If they support RTMP streaming, yes!

**Q: How much bandwidth do I need?**
A: ~5 Mbps upload per HD camera. 12 cameras = ~60 Mbps upload minimum.

**Q: Can customers use Android?**
A: Currently iOS only, but can be built for Android (React Native version recommended).

**Q: How long are videos stored?**
A: Configurable. Default: 30 days for unpurchased, unlimited for purchased.

---

## 📞 Next Steps

1. **Review this document** and make sure you have/can get what you need
2. **Follow SETUP_GUIDE.md** to get started
3. **Start with a test setup** (1-2 cameras) before full deployment
4. **Test with friends/staff** before going live with customers

**Ready to start?** Open `SETUP_GUIDE.md` and let's go! 🚀
