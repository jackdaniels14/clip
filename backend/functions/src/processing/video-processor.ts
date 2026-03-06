import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Scheduled function to process video queue (runs every minute)
export const processVideoQueue = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    console.log('Processing video queue...');

    try {
      // Get clips with status 'processing' and no ongoing processing
      const clipsSnapshot = await db.collection('clips')
        .where('status', '==', 'processing')
        .where('processingProgress', '<', 100)
        .limit(5) // Process 5 clips at a time
        .get();

      if (clipsSnapshot.empty) {
        console.log('No clips to process');
        return null;
      }

      const processingPromises = clipsSnapshot.docs.map(async (doc) => {
        const clipId = doc.id;
        const clipData = doc.data();

        console.log(`Processing clip: ${clipId}`);

        try {
          // TODO: Trigger video composition worker
          // This would call the composition engine to process the clip

          // For now, just update progress
          await db.collection('clips').doc(clipId).update({
            processingProgress: 50,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`Clip ${clipId} processing updated`);
        } catch (error) {
          console.error(`Error processing clip ${clipId}:`, error);
        }
      });

      await Promise.all(processingPromises);

      console.log(`Processed ${clipsSnapshot.size} clips`);
      return null;
    } catch (error) {
      console.error('Error in processVideoQueue:', error);
      return null;
    }
  });
