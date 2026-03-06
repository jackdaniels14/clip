import { logger } from '../utils/logger';

interface StreamInfo {
  streamKey: string;
  streamPath: string;
  startTime: number;
  viewers: number;
}

export class StreamManager {
  private streams: Map<string, StreamInfo> = new Map();

  /**
   * Add a new stream
   */
  addStream(streamKey: string, streamPath: string): void {
    const streamInfo: StreamInfo = {
      streamKey,
      streamPath,
      startTime: Date.now(),
      viewers: 0
    };

    this.streams.set(streamKey, streamInfo);
    logger.info(`Stream added: ${streamKey}`);
  }

  /**
   * Remove a stream
   */
  removeStream(streamKey: string): void {
    if (this.streams.has(streamKey)) {
      this.streams.delete(streamKey);
      logger.info(`Stream removed: ${streamKey}`);
    }
  }

  /**
   * Get stream info
   */
  getStream(streamKey: string): StreamInfo | undefined {
    return this.streams.get(streamKey);
  }

  /**
   * Get all active streams
   */
  getActiveStreams(): StreamInfo[] {
    return Array.from(this.streams.values());
  }

  /**
   * Update viewer count
   */
  updateViewers(streamKey: string, count: number): void {
    const stream = this.streams.get(streamKey);
    if (stream) {
      stream.viewers = count;
    }
  }

  /**
   * Get stream uptime in seconds
   */
  getUptime(streamKey: string): number {
    const stream = this.streams.get(streamKey);
    if (!stream) return 0;

    return Math.floor((Date.now() - stream.startTime) / 1000);
  }

  /**
   * Check if stream is active
   */
  isActive(streamKey: string): boolean {
    return this.streams.has(streamKey);
  }
}
