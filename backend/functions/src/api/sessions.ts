import { Router } from 'express';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

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
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const requireAdmin = async (req: any, res: any, next: any) => {
  const userDoc = await db.collection('users').doc(req.user.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET /sessions - List sessions
router.get('/', requireAuth, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    let query: any = db.collection('sessions');

    if (!isAdmin) {
      // Regular users can only see their own sessions
      query = query.where('userId', '==', req.user.uid);
    }

    const { limit = 20, offset = 0, status } = req.query;

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('startTime', 'desc')
                 .limit(Number(limit))
                 .offset(Number(offset));

    const sessionsSnapshot = await query.get();
    const sessions = sessionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ sessions, total: sessions.length });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /sessions/:id - Get session by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const sessionDoc = await db.collection('sessions').doc(req.params.id).get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    // Check if user has access to this session
    if (!isAdmin && sessionData?.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ id: sessionDoc.id, ...sessionData });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST /sessions - Create a new session
router.post('/', requireAuth, async (req, res) => {
  try {
    const { apparatus, ticketNumber } = req.body;

    if (!apparatus || !Array.isArray(apparatus) || apparatus.length === 0) {
      return res.status(400).json({ error: 'Apparatus array is required' });
    }

    // Generate session ID
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const sessionId = `sess_${dateStr}_${uuidv4().split('-')[0]}`;

    // Get cameras for the selected apparatus
    const camerasSnapshot = await db.collection('cameras')
      .where('apparatus', 'in', apparatus)
      .where('status', '==', 'active')
      .get();

    const cameras = camerasSnapshot.docs.map(doc => doc.id);

    if (cameras.length === 0) {
      return res.status(400).json({ error: 'No active cameras found for selected apparatus' });
    }

    const session = {
      sessionId,
      userId: req.user.uid,
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      endTime: null,
      apparatus,
      cameras,
      status: 'recording',
      clips: [],
      liveStreamUrl: null, // Will be populated by ingestion server
      ticketNumber: ticketNumber || `STOKE-${Date.now()}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('sessions').doc(sessionId).set(session);

    res.status(201).json({
      message: 'Session created successfully',
      session: { id: sessionId, ...session }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT /sessions/:id - Update session
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const sessionDoc = await db.collection('sessions').doc(req.params.id).get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    // Check permissions
    if (!isAdmin && sessionData?.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, liveStreamUrl } = req.body;

    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.endTime = admin.firestore.FieldValue.serverTimestamp();
      }
    }

    if (liveStreamUrl !== undefined) {
      updateData.liveStreamUrl = liveStreamUrl;
    }

    await db.collection('sessions').doc(req.params.id).update(updateData);

    const updatedSession = await db.collection('sessions').doc(req.params.id).get();

    res.json({
      message: 'Session updated successfully',
      session: { id: updatedSession.id, ...updatedSession.data() }
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// POST /sessions/:id/end - End a session
router.post('/:id/end', requireAuth, async (req, res) => {
  try {
    const sessionDoc = await db.collection('sessions').doc(req.params.id).get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userDoc.data()?.role === 'admin';

    if (!isAdmin && sessionData?.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('sessions').doc(req.params.id).update({
      status: 'processing',
      endTime: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Session ended, processing clips' });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// POST /sessions/checkin - Check in to a session with ticket number
router.post('/checkin', requireAuth, async (req, res) => {
  try {
    const { ticketNumber } = req.body;

    if (!ticketNumber) {
      return res.status(400).json({ error: 'Ticket number is required' });
    }

    const sessionsSnapshot = await db.collection('sessions')
      .where('ticketNumber', '==', ticketNumber)
      .where('status', '==', 'recording')
      .limit(1)
      .get();

    if (sessionsSnapshot.empty) {
      return res.status(404).json({ error: 'No active session found with this ticket number' });
    }

    const sessionDoc = sessionsSnapshot.docs[0];

    res.json({
      message: 'Checked in successfully',
      session: { id: sessionDoc.id, ...sessionDoc.data() }
    });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

export const sessionRoutes = router;
