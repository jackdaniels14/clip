import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onSessionCompleted = functions.firestore
  .document('sessions/{sessionId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const sessionId = context.params.sessionId;

    // Check if session status changed to 'completed'
    if (beforeData.status !== 'completed' && afterData.status === 'completed') {
      console.log(`Session completed: ${sessionId}`);

      try {
        // Send push notification to user
        const userId = afterData.userId;
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (userData?.fcmToken) {
          await admin.messaging().send({
            token: userData.fcmToken,
            notification: {
              title: 'Your videos are ready! 🎬',
              body: `${afterData.clips?.length || 0} clips from your session are ready to view.`
            },
            data: {
              sessionId,
              type: 'session_completed'
            }
          });
        }

        console.log(`Notification sent to user ${userId}`);
      } catch (error) {
        console.error(`Error processing session completion: ${sessionId}`, error);
      }
    }
  });
