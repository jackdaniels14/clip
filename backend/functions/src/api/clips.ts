import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

// Middleware to verify authentication
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

// GET /clips - List clips for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    let query: any = db.collection('clips');

    if (!isAdmin) {
      query = query.where('userId', '==', req.user.uid);
    }

    const { limit = 20, sessionId, status } = req.query;

    if (sessionId) {
      query = query.where('sessionId', '==', sessionId);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('startTime', 'desc').limit(Number(limit));

    const clipsSnapshot = await query.get();
    const clips = clipsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ clips });
  } catch (error) {
    console.error('Error fetching clips:', error);
    res.status(500).json({ error: 'Failed to fetch clips' });
  }
});

// GET /clips/:id - Get clip by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const clipDoc = await db.collection('clips').doc(req.params.id).get();

    if (!clipDoc.exists) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const clipData = clipDoc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    if (!isAdmin && clipData?.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ id: clipDoc.id, ...clipData });
  } catch (error) {
    console.error('Error fetching clip:', error);
    res.status(500).json({ error: 'Failed to fetch clip' });
  }
});

export const clipRoutes = router;
