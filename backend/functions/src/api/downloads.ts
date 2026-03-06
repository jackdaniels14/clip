import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const storage = admin.storage();

export const generateDownloadUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { clipId, compositionType } = data;

  if (!clipId) {
    throw new functions.https.HttpsError('invalid-argument', 'Clip ID is required');
  }

  try {
    // Check if user has purchased this clip
    const purchaseId = `${context.auth.uid}_${clipId}`;
    const purchaseDoc = await db.collection('purchases').doc(purchaseId).get();

    if (!purchaseDoc.exists) {
      throw new functions.https.HttpsError('permission-denied', 'Clip not purchased');
    }

    // Get clip data
    const clipDoc = await db.collection('clips').doc(clipId).get();

    if (!clipDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Clip not found');
    }

    const clipData = clipDoc.data();
    const filePath = clipData?.composedVideos?.[compositionType || 'dual_view'];

    if (!filePath) {
      throw new functions.https.HttpsError('not-found', 'Video file not found');
    }

    // Generate signed URL (valid for 1 hour)
    const bucket = storage.bucket();
    const file = bucket.file(filePath.replace('gs://' + bucket.name + '/', ''));

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return { downloadUrl: url };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate download URL');
  }
});
