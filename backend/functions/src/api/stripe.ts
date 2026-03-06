import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

const db = admin.firestore();

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { clipId, compositionType } = data;

  if (!clipId) {
    throw new functions.https.HttpsError('invalid-argument', 'Clip ID is required');
  }

  try {
    const clipDoc = await db.collection('clips').doc(clipId).get();

    if (!clipDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Clip not found');
    }

    const clipData = clipDoc.data();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Video Clip - ${compositionType || 'Standard'}`,
              description: `Session: ${clipData?.sessionId}`,
            },
            unit_amount: Math.round((clipData?.price || 9.99) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/clips/${clipId}`,
      metadata: {
        userId: context.auth.uid,
        clipId,
        compositionType: compositionType || 'standard'
      }
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});
