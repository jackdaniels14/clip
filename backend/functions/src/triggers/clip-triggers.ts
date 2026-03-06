import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onClipCreated = functions.firestore
  .document('clips/{clipId}')
  .onCreate(async (snap, context) => {
    const clipData = snap.data();
    const clipId = context.params.clipId;

    console.log(`New clip created: ${clipId}`);

    try {
      // Add clip to session's clips array
      if (clipData.sessionId) {
        await db.collection('sessions').doc(clipData.sessionId).update({
          clips: admin.firestore.FieldValue.arrayUnion(clipId),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Add clip to user's clips array
      if (clipData.userId) {
        await db.collection('users').doc(clipData.userId).update({
          clips: admin.firestore.FieldValue.arrayUnion(clipId),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Queue clip for processing
      // TODO: Add to processing queue (BullMQ or Firebase Tasks)
      console.log(`Clip ${clipId} queued for processing`);

    } catch (error) {
      console.error(`Error processing clip creation: ${clipId}`, error);
    }
  });
