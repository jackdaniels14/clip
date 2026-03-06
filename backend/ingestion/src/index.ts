import express from 'express';
import NodeMediaServer from 'node-media-server';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { CircularBuffer } from './buffer/CircularBuffer';
import { StreamManager } from './stream/StreamManager';
import { logger } from './utils/logger';

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const app = express();
const PORT = process.env.PORT || 3000;
const RTMP_PORT = process.env.RTMP_SERVER_PORT || 1935;

// Initialize stream manager and buffer
const streamManager = new StreamManager();
const circularBuffer = new CircularBuffer();

// Node Media Server configuration for RTMP ingestion
const nmsConfig = {
  rtmp: {
    port: RTMP_PORT,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(nmsConfig);

// RTMP Event Handlers
nms.on('preConnect', (id: string, args: any) => {
  logger.info(`[RTMP] Pre-connect: ${id}`, args);
});

nms.on('postConnect', (id: string, args: any) => {
  logger.info(`[RTMP] Post-connect: ${id}`, args);
});

nms.on('doneConnect', (id: string, args: any) => {
  logger.info(`[RTMP] Done-connect: ${id}`, args);
});

nms.on('prePublish', async (id: string, StreamPath: string, args: any) => {
  logger.info(`[RTMP] Pre-publish: ${id}, StreamPath: ${StreamPath}`);

  try {
    // Extract camera ID from stream path (e.g., /live/cam_001)
    const streamKey = StreamPath.split('/').pop();

    if (!streamKey) {
      logger.error('Invalid stream key');
      return;
    }

    // Verify camera exists in Firestore
    const db = admin.firestore();
    const cameraDoc = await db.collection('cameras').doc(streamKey).get();

    if (!cameraDoc.exists) {
      logger.error(`Camera not found: ${streamKey}`);
      // Could reject the stream here if needed
      return;
    }

    // Update camera status
    await db.collection('cameras').doc(streamKey).update({
      status: 'active',
      streamUrl: `rtmp://localhost:${RTMP_PORT}/live/${streamKey}`,
      lastHeartbeat: admin.firestore.FieldValue.serverTimestamp()
    });

    // Initialize circular buffer for this camera
    const cameraData = cameraDoc.data();
    const bufferDuration = cameraData?.settings?.delaySeconds || 30;

    circularBuffer.initializeCamera(streamKey, bufferDuration);

    logger.info(`Camera ${streamKey} started streaming with ${bufferDuration}s buffer`);
  } catch (error) {
    logger.error('Error in prePublish:', error);
  }
});

nms.on('postPublish', (id: string, StreamPath: string, args: any) => {
  logger.info(`[RTMP] Post-publish: ${id}, StreamPath: ${StreamPath}`);

  const streamKey = StreamPath.split('/').pop();
  if (streamKey) {
    streamManager.addStream(streamKey, StreamPath);
  }
});

nms.on('donePublish', async (id: string, StreamPath: string, args: any) => {
  logger.info(`[RTMP] Done-publish: ${id}, StreamPath: ${StreamPath}`);

  try {
    const streamKey = StreamPath.split('/').pop();

    if (!streamKey) return;

    // Update camera status
    const db = admin.firestore();
    await db.collection('cameras').doc(streamKey).update({
      status: 'inactive',
      streamUrl: null,
      lastHeartbeat: admin.firestore.FieldValue.serverTimestamp()
    });

    // Remove stream
    streamManager.removeStream(streamKey);

    // Clean up buffer
    circularBuffer.cleanup(streamKey);

    logger.info(`Camera ${streamKey} stopped streaming`);
  } catch (error) {
    logger.error('Error in donePublish:', error);
  }
});

// Express API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeStreams: streamManager.getActiveStreams(),
    rtmpPort: RTMP_PORT
  });
});

app.get('/streams', (req, res) => {
  res.json({
    streams: streamManager.getActiveStreams()
  });
});

app.post('/clip/:cameraId', async (req, res) => {
  try {
    const { cameraId } = req.params;
    const { duration = 10, startOffset = 0 } = req.body;

    logger.info(`Creating clip for camera ${cameraId}, duration: ${duration}s`);

    const clipPath = await circularBuffer.extractClip(cameraId, duration, startOffset);

    res.json({
      message: 'Clip created successfully',
      clipPath
    });
  } catch (error: any) {
    logger.error('Error creating clip:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start servers
nms.run();

app.listen(PORT, () => {
  logger.info(`Ingestion server running on port ${PORT}`);
  logger.info(`RTMP server running on port ${RTMP_PORT}`);
  logger.info(`HLS/DASH server running on port 8000`);
  logger.info(`Stream URL format: rtmp://localhost:${RTMP_PORT}/live/{cameraId}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing servers');
  nms.stop();
  process.exit(0);
});
