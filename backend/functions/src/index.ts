import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import route handlers
import { cameraRoutes } from './api/cameras';
import { sessionRoutes } from './api/sessions';
import { clipRoutes } from './api/clips';
import { userRoutes } from './api/users';
import { purchaseRoutes } from './api/purchases';

// API Routes
app.use('/cameras', cameraRoutes);
app.use('/sessions', sessionRoutes);
app.use('/clips', clipRoutes);
app.use('/users', userRoutes);
app.use('/purchases', purchaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export the API as a Cloud Function
export const api = functions.https.onRequest(app);

// Firestore Triggers
export { onClipCreated } from './triggers/clip-triggers';
export { onSessionCompleted } from './triggers/session-triggers';
export { onPurchaseCreated } from './triggers/purchase-triggers';

// Scheduled Functions
export { processVideoQueue } from './processing/video-processor';
export { cleanupOldSessions } from './processing/cleanup';

// Callable Functions
export { createCheckoutSession } from './api/stripe';
export { generateDownloadUrl } from './api/downloads';
