import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

interface BufferSegment {
  timestamp: number;
  path: string;
  duration: number;
}

export class CircularBuffer {
  private buffers: Map<string, BufferSegment[]> = new Map();
  private maxDurations: Map<string, number> = new Map();
  private bufferDir: string = './buffer';

  constructor() {
    // Create buffer directory if it doesn't exist
    if (!fs.existsSync(this.bufferDir)) {
      fs.mkdirSync(this.bufferDir, { recursive: true });
    }
  }

  /**
   * Initialize circular buffer for a camera
   * @param cameraId Camera identifier
   * @param maxDurationSeconds Maximum buffer duration in seconds
   */
  initializeCamera(cameraId: string, maxDurationSeconds: number = 30): void {
    if (!this.buffers.has(cameraId)) {
      this.buffers.set(cameraId, []);
      this.maxDurations.set(cameraId, maxDurationSeconds);

      logger.info(`Initialized buffer for camera ${cameraId} with ${maxDurationSeconds}s capacity`);
    }
  }

  /**
   * Add a video segment to the circular buffer
   * @param cameraId Camera identifier
   * @param segmentPath Path to the video segment
   * @param duration Duration of the segment in seconds
   */
  addSegment(cameraId: string, segmentPath: string, duration: number): void {
    const buffer = this.buffers.get(cameraId);
    if (!buffer) {
      logger.warn(`Buffer not initialized for camera ${cameraId}`);
      return;
    }

    const segment: BufferSegment = {
      timestamp: Date.now(),
      path: segmentPath,
      duration
    };

    buffer.push(segment);

    // Remove old segments if buffer exceeds max duration
    this.trimBuffer(cameraId);
  }

  /**
   * Trim buffer to stay within max duration
   */
  private trimBuffer(cameraId: string): void {
    const buffer = this.buffers.get(cameraId);
    const maxDuration = this.maxDurations.get(cameraId);

    if (!buffer || !maxDuration) return;

    let totalDuration = buffer.reduce((sum, seg) => sum + seg.duration, 0);

    while (totalDuration > maxDuration && buffer.length > 1) {
      const removedSegment = buffer.shift();

      if (removedSegment) {
        // Delete old segment file
        try {
          if (fs.existsSync(removedSegment.path)) {
            fs.unlinkSync(removedSegment.path);
          }
        } catch (error) {
          logger.error(`Error deleting segment ${removedSegment.path}:`, error);
        }

        totalDuration -= removedSegment.duration;
      }
    }
  }

  /**
   * Extract a clip from the circular buffer
   * @param cameraId Camera identifier
   * @param duration Duration of clip in seconds
   * @param startOffset Offset from current time in seconds (0 = now, -10 = 10 seconds ago)
   * @returns Path to the extracted clip
   */
  async extractClip(cameraId: string, duration: number = 10, startOffset: number = 0): Promise<string> {
    const buffer = this.buffers.get(cameraId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`No buffer data available for camera ${cameraId}`);
    }

    const now = Date.now();
    const startTime = now + (startOffset * 1000);
    const endTime = startTime + (duration * 1000);

    // Find segments within the time range
    const relevantSegments = buffer.filter(seg =>
      seg.timestamp >= startTime - (seg.duration * 1000) &&
      seg.timestamp <= endTime
    );

    if (relevantSegments.length === 0) {
      throw new Error(`No segments found for specified time range`);
    }

    // Create output path
    const clipId = `clip_${cameraId}_${Date.now()}`;
    const outputPath = path.join(this.bufferDir, `${clipId}.mp4`);

    // Concatenate segments into a single clip
    await this.concatenateSegments(relevantSegments, outputPath, duration);

    logger.info(`Extracted clip for camera ${cameraId}: ${outputPath}`);

    return outputPath;
  }

  /**
   * Concatenate multiple video segments into a single clip
   */
  private async concatenateSegments(
    segments: BufferSegment[],
    outputPath: string,
    maxDuration: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (segments.length === 1) {
        // Single segment, just copy with duration limit
        ffmpeg(segments[0].path)
          .setDuration(maxDuration)
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      } else {
        // Multiple segments, concatenate
        const command = ffmpeg();

        segments.forEach(seg => {
          command.input(seg.path);
        });

        command
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .mergeToFile(outputPath, path.dirname(outputPath));
      }
    });
  }

  /**
   * Get buffer status for a camera
   */
  getBufferStatus(cameraId: string): any {
    const buffer = this.buffers.get(cameraId);
    const maxDuration = this.maxDurations.get(cameraId);

    if (!buffer) {
      return { error: 'Buffer not initialized' };
    }

    const totalDuration = buffer.reduce((sum, seg) => sum + seg.duration, 0);

    return {
      cameraId,
      segmentCount: buffer.length,
      totalDuration,
      maxDuration,
      utilizationPercent: (totalDuration / (maxDuration || 1)) * 100
    };
  }

  /**
   * Cleanup buffer for a camera
   */
  cleanup(cameraId: string): void {
    const buffer = this.buffers.get(cameraId);

    if (buffer) {
      // Delete all segment files
      buffer.forEach(seg => {
        try {
          if (fs.existsSync(seg.path)) {
            fs.unlinkSync(seg.path);
          }
        } catch (error) {
          logger.error(`Error deleting segment ${seg.path}:`, error);
        }
      });

      this.buffers.delete(cameraId);
      this.maxDurations.delete(cameraId);

      logger.info(`Cleaned up buffer for camera ${cameraId}`);
    }
  }

  /**
   * Get all active cameras with buffers
   */
  getActiveCameras(): string[] {
    return Array.from(this.buffers.keys());
  }
}
