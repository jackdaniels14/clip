# Next Steps - Implementation Guide

This document outlines the remaining features to implement for a complete production-ready system.

## Completed Components ✅

- System architecture and database schema
- Firebase project structure with Firestore and Storage rules
- Backend Cloud Functions with REST API
- Video ingestion server with RTMP support
- Circular buffer implementation for video delay
- Admin dashboard for camera management
- iOS user app with authentication and session management
- Camera apparatus organization system

---

## Priority 1: Video Composition Engine (Critical)

### What's Needed

The video composition engine automatically creates edited videos from multiple camera angles.

### Implementation Steps

1. **Create Composition Templates**
   - File: `backend/composition/src/templates/`
   - Templates to create:
     - Dual View (side-by-side)
     - Picture-in-Picture
     - Sequential (best angles)
     - Quad Split
     - Action Highlight

2. **FFmpeg Processing Pipeline**
   - File: `backend/composition/src/ffmpeg/processor.ts`
   - Functions needed:
     ```typescript
     - syncVideos(cameras: VideoFile[], syncPoint: number)
     - applyTemplate(videos: VideoFile[], template: Template)
     - addTransitions(clips: VideoClip[])
     - addSlowMotion(clip: VideoClip, segments: TimeRange[])
     - addBranding(video: VideoFile, intro: VideoFile, outro: VideoFile)
     ```

3. **Worker Queue System**
   - Use BullMQ for job queue
   - File: `backend/composition/src/workers/queue.ts`
   - Process clips asynchronously
   - Priority queue for paid vs free users

4. **Template JSON Schema**
   ```json
   {
     "name": "dual_view",
     "layout": "horizontal_split",
     "cameras": [
       { "position": "left", "priority": 1 },
       { "position": "right", "priority": 2 }
     ],
     "transitions": {
       "type": "crossfade",
       "duration": 0.5
     },
     "effects": {
       "slowMotion": true,
       "actionDetection": true
     }
   }
   ```

### Example Code

```typescript
// backend/composition/src/ffmpeg/processor.ts
import ffmpeg from 'fluent-ffmpeg';

export async function createDualView(
  video1: string,
  video2: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(video1)
      .input(video2)
      .complexFilter([
        '[0:v]scale=960:1080[left]',
        '[1:v]scale=960:1080[right]',
        '[left][right]hstack=inputs=2[v]'
      ])
      .outputOptions('-map', '[v]')
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}
```

---

## Priority 2: Live Session Streaming

### What's Needed

Users can watch their session live (with delay) from the iOS app.

### Implementation Steps

1. **HLS Stream Generation**
   - Already configured in ingestion server
   - Exposed at: `http://localhost:8000/live/{cameraId}/index.m3u8`

2. **Update Session API**
   - Add `liveStreamUrl` when session starts
   - File: `backend/functions/src/api/sessions.ts`
   ```typescript
   const liveStreamUrl = `https://your-server.com/live/${cameraId}/index.m3u8`;
   ```

3. **iOS Video Player**
   - Create `VideoPlayerView.swift`
   - Use AVPlayer for HLS playback
   ```swift
   import AVKit

   struct VideoPlayerView: View {
       let streamUrl: URL

       var body: some View {
           VideoPlayer(player: AVPlayer(url: streamUrl))
               .frame(height: 300)
       }
   }
   ```

4. **Add to SessionsView**
   - Show live player when session is recording
   - Auto-refresh stream status

---

## Priority 3: Payment Integration

### What's Needed

Implement Stripe payment flow for purchasing videos.

### Implementation Steps

1. **Stripe Setup**
   - Create account at https://stripe.com
   - Get API keys (test and production)
   - Add to environment variables

2. **Update Cloud Functions**
   - File: `backend/functions/src/api/stripe.ts` (already created)
   - Add webhook handler:
   ```typescript
   export const stripeWebhook = functions.https.onRequest(async (req, res) => {
     const sig = req.headers['stripe-signature'];
     const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);

     if (event.type === 'checkout.session.completed') {
       const session = event.data.object;
       // Create purchase record
       await createPurchase(session.metadata.userId, session.metadata.clipId);
     }

     res.json({ received: true });
   });
   ```

3. **iOS Purchase Flow**
   - Add to `ClipsViewModel.swift`
   - Open Stripe checkout in WebView or Safari
   - Handle return URL for success/failure

4. **Purchase History**
   - Query `purchases` collection
   - Show in ProfileView
   - Enable download for purchased clips

---

## Priority 4: Advanced Features

### Action Detection (ML-based)

Use ML to detect tricks/jumps and auto-create highlights.

**Tools:**
- Google Cloud Video Intelligence API
- Or custom TensorFlow model

**Implementation:**
```typescript
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';

async function detectActions(videoUri: string) {
  const client = new VideoIntelligenceServiceClient();

  const [operation] = await client.annotateVideo({
    inputUri: videoUri,
    features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION'],
  });

  const [results] = await operation.promise();
  // Process labels to find action moments
  return results;
}
```

### Social Sharing

**iOS Implementation:**
```swift
import Social

func shareVideo(url: URL) {
    let activityVC = UIActivityViewController(
        activityItems: [url],
        applicationActivities: nil
    )
    present(activityVC, animated: true)
}
```

### Push Notifications

**Setup:**
1. Enable FCM in Firebase
2. Get APNs certificate for iOS
3. Update iOS app with capabilities
4. Send notifications from Cloud Functions (already implemented in triggers)

---

## Priority 5: Production Readiness

### Security Hardening

1. **API Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

2. **Input Validation**
   - Use Joi or Zod for request validation
   - Sanitize all user inputs
   - Validate file uploads

3. **Error Handling**
   - Centralized error handler
   - Don't expose internal errors to users
   - Log errors to Cloud Logging

### Monitoring & Analytics

1. **Firebase Performance Monitoring**
   - Add to iOS app
   - Track app startup time
   - Monitor network requests

2. **Custom Analytics**
   - Track user behavior
   - Monitor conversion rates (free → paid)
   - A/B test pricing

3. **Alerts**
   - Set up Firebase Alerts for errors
   - Monitor function execution times
   - Alert on failed payments

### Scaling Considerations

1. **Video Storage**
   - Implement lifecycle policies (delete after 90 days)
   - Use Cloud CDN for faster delivery
   - Consider AWS S3 for cost savings

2. **Processing Queue**
   - Scale composition workers based on queue length
   - Use Cloud Run with autoscaling
   - Prioritize paid clips

3. **Database Optimization**
   - Add composite indexes (already in firestore.indexes.json)
   - Implement pagination for large lists
   - Cache frequently accessed data

---

## Priority 6: User Experience Enhancements

### Admin Dashboard

1. **Real-Time Analytics**
   - Live session count
   - Revenue dashboard
   - Popular apparatus tracking
   - User engagement metrics

2. **Bulk Operations**
   - Bulk camera configuration
   - Mass session management
   - Batch clip processing

3. **Camera Health Monitoring**
   - Stream quality metrics
   - Offline camera alerts
   - Bandwidth monitoring

### iOS App

1. **Onboarding Flow**
   - Tutorial on first launch
   - QR code scanning guide
   - Feature highlights

2. **Video Editing**
   - User-selectable clip length
   - Trim functionality
   - Custom music overlay

3. **Subscription Tiers**
   - Free: 1 video/month
   - Basic ($9.99/mo): 5 videos/month
   - Pro ($29.99/mo): Unlimited + HD

---

## Testing Checklist

### Unit Tests
- [ ] Camera CRUD operations
- [ ] Session lifecycle
- [ ] Clip creation and processing
- [ ] Purchase flow
- [ ] Authentication

### Integration Tests
- [ ] End-to-end session flow
- [ ] Multi-camera synchronization
- [ ] Video composition pipeline
- [ ] Payment processing

### Load Tests
- [ ] 50+ concurrent cameras
- [ ] 100+ simultaneous users
- [ ] Video processing under load

---

## Deployment Checklist

### Pre-Launch
- [ ] Set up production Firebase project
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Enable Firebase Extensions (image resizing, etc.)
- [ ] Configure backup strategies

### Launch
- [ ] Deploy Cloud Functions
- [ ] Deploy ingestion server to Cloud Run
- [ ] Deploy admin dashboard to Firebase Hosting
- [ ] Submit iOS app to App Store
- [ ] Set up monitoring and alerts

### Post-Launch
- [ ] Monitor error rates
- [ ] Track user feedback
- [ ] Iterate on composition templates
- [ ] Optimize costs

---

## Recommended Development Order

1. **Week 1-2**: Video Composition Engine
   - This is critical for the core functionality
   - Start with simple templates
   - Test with sample videos

2. **Week 3**: Live Streaming
   - Enhance user experience
   - Relatively straightforward with HLS

3. **Week 4**: Payment Integration
   - Essential for monetization
   - Test thoroughly in sandbox

4. **Week 5-6**: Production Readiness
   - Security, monitoring, optimization
   - Beta testing with real users

5. **Week 7-8**: Advanced Features
   - ML action detection
   - Social sharing
   - Polish UI/UX

---

## Resources

### Documentation
- [FFmpeg Filters](https://ffmpeg.org/ffmpeg-filters.html)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Stripe API](https://stripe.com/docs/api)
- [AVKit Documentation](https://developer.apple.com/documentation/avkit)

### Sample Code
- [FFmpeg Video Composition Examples](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [Firebase iOS SDK Samples](https://github.com/firebase/quickstart-ios)
- [Stripe iOS Integration](https://github.com/stripe/stripe-ios)

### Tools
- [OBS Studio](https://obsproject.com/) - For camera testing
- [Postman](https://www.postman.com/) - API testing
- [Charles Proxy](https://www.charlesproxy.com/) - Network debugging

---

## Questions to Consider

1. **Pricing Strategy**
   - How much should clips cost?
   - Subscription vs pay-per-clip?
   - Different pricing for different compositions?

2. **Storage Limits**
   - How long to keep videos?
   - Archive old sessions?
   - Tiered storage (hot/cold)?

3. **Customization**
   - Allow users to choose compositions?
   - Custom music library?
   - Branded templates for gyms?

4. **Multi-Location**
   - Support multiple facilities?
   - Centralized vs separate systems?
   - User accounts work everywhere?

---

Good luck with the implementation! You've got a solid foundation to build upon.
