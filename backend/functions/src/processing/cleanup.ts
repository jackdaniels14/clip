import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Scheduled function to cleanup old sessions (runs daily)
export const cleanupOldSessions = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Cleaning up old sessions...');

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldSessionsSnapshot = await db.collection('sessions')
        .where('endTime', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .where('status', '==', 'completed')
        .get();

      if (oldSessionsSnapshot.empty) {
        console.log('No old sessions to cleanup');
        return null;
      }

      const batch = db.batch();
      let count = 0;

      oldSessionsSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          liveStreamUrl: null, // Remove live stream URL to save storage
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        count++;
      });

      await batch.commit();

      console.log(`Cleaned up ${count} old sessions`);
      return null;
    } catch (error) {
      console.error('Error in cleanupOldSessions:', error);
      return null;
    }
  });
