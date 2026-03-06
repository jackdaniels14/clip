import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// GET /users/me - Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      // Create user profile if it doesn't exist
      const newUser = {
        userId: req.user.uid,
        email: req.user.email,
        name: req.user.name || '',
        phone: '',
        sessions: [],
        purchases: [],
        credits: 0,
        subscriptionTier: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('users').doc(req.user.uid).set(newUser);
      return res.json(newUser);
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /users/me - Update current user profile
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    await db.collection('users').doc(req.user.uid).update(updateData);

    const updatedUser = await db.collection('users').doc(req.user.uid).get();
    res.json({ id: updatedUser.id, ...updatedUser.data() });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export const userRoutes = router;
