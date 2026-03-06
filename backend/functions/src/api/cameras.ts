import { Router } from 'express';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const db = admin.firestore();

// Middleware to verify admin access
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// GET /cameras - List all cameras
router.get('/', requireAdmin, async (req, res) => {
  try {
    const camerasSnapshot = await db.collection('cameras').get();
    const cameras = camerasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ cameras });
  } catch (error) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ error: 'Failed to fetch cameras' });
  }
});

// GET /cameras/:id - Get camera by ID
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const cameraDoc = await db.collection('cameras').doc(req.params.id).get();

    if (!cameraDoc.exists) {
      return res.status(404).json({ error: 'Camera not found' });
    }

    res.json({ id: cameraDoc.id, ...cameraDoc.data() });
  } catch (error) {
    console.error('Error fetching camera:', error);
    res.status(500).json({ error: 'Failed to fetch camera' });
  }
});

// POST /cameras - Register a new camera
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { apparatus, angle, position, settings } = req.body;

    if (!apparatus || !angle) {
      return res.status(400).json({ error: 'Apparatus and angle are required' });
    }

    const cameraId = `cam_${uuidv4().split('-')[0]}`;

    const camera = {
      cameraId,
      apparatus,
      angle,
      position: position || { lat: 0, long: 0, height: '0m' },
      status: 'inactive',
      streamUrl: null,
      lastHeartbeat: admin.firestore.FieldValue.serverTimestamp(),
      settings: {
        resolution: settings?.resolution || '1080p',
        fps: settings?.fps || 60,
        delaySeconds: settings?.delaySeconds || 30
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('cameras').doc(cameraId).set(camera);

    res.status(201).json({
      message: 'Camera registered successfully',
      camera: { id: cameraId, ...camera }
    });
  } catch (error) {
    console.error('Error creating camera:', error);
    res.status(500).json({ error: 'Failed to create camera' });
  }
});

// PUT /cameras/:id - Update camera
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { apparatus, angle, position, status, settings, streamUrl } = req.body;

    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (apparatus) updateData.apparatus = apparatus;
    if (angle) updateData.angle = angle;
    if (position) updateData.position = position;
    if (status) updateData.status = status;
    if (settings) updateData.settings = settings;
    if (streamUrl !== undefined) updateData.streamUrl = streamUrl;

    await db.collection('cameras').doc(req.params.id).update(updateData);

    const updatedCamera = await db.collection('cameras').doc(req.params.id).get();

    res.json({
      message: 'Camera updated successfully',
      camera: { id: updatedCamera.id, ...updatedCamera.data() }
    });
  } catch (error) {
    console.error('Error updating camera:', error);
    res.status(500).json({ error: 'Failed to update camera' });
  }
});

// POST /cameras/:id/heartbeat - Update camera heartbeat
router.post('/:id/heartbeat', async (req, res) => {
  try {
    const { status } = req.body;

    await db.collection('cameras').doc(req.params.id).update({
      lastHeartbeat: admin.firestore.FieldValue.serverTimestamp(),
      status: status || 'active'
    });

    res.json({ message: 'Heartbeat updated' });
  } catch (error) {
    console.error('Error updating heartbeat:', error);
    res.status(500).json({ error: 'Failed to update heartbeat' });
  }
});

// DELETE /cameras/:id - Delete camera
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.collection('cameras').doc(req.params.id).delete();
    res.json({ message: 'Camera deleted successfully' });
  } catch (error) {
    console.error('Error deleting camera:', error);
    res.status(500).json({ error: 'Failed to delete camera' });
  }
});

// GET /cameras/apparatus/:apparatus - Get cameras by apparatus
router.get('/apparatus/:apparatus', requireAdmin, async (req, res) => {
  try {
    const camerasSnapshot = await db.collection('cameras')
      .where('apparatus', '==', req.params.apparatus)
      .get();

    const cameras = camerasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ cameras });
  } catch (error) {
    console.error('Error fetching cameras by apparatus:', error);
    res.status(500).json({ error: 'Failed to fetch cameras' });
  }
});

export const cameraRoutes = router;
