import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onPurchaseCreated = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate(async (snap, context) => {
    const purchaseData = snap.data();
    const purchaseId = context.params.purchaseId;

    console.log(`New purchase: ${purchaseId}`);

    try {
      // Update user's purchases array
      if (purchaseData.userId) {
        await db.collection('users').doc(purchaseData.userId).update({
          purchases: admin.firestore.FieldValue.arrayUnion(purchaseData.clipId),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Update clip status
      if (purchaseData.clipId) {
        await db.collection('clips').doc(purchaseData.clipId).update({
          status: 'purchased',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Send purchase confirmation notification
      const userDoc = await db.collection('users').doc(purchaseData.userId).get();
      const userData = userDoc.data();

      if (userData?.fcmToken) {
        await admin.messaging().send({
          token: userData.fcmToken,
          notification: {
            title: 'Purchase successful! ✅',
            body: 'Your video is ready to download.'
          },
          data: {
            clipId: purchaseData.clipId,
            type: 'purchase_success'
          }
        });
      }

      console.log(`Purchase confirmation sent for ${purchaseId}`);
    } catch (error) {
      console.error(`Error processing purchase: ${purchaseId}`, error);
    }
  });
