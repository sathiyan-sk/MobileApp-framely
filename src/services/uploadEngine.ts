import { PhotoItem, UploadedPhoto } from '../types';
import { photoStorage } from './photoStorage';

/**
 * Upload Engine
 * ----------------
 * Simulated upload pipeline. Drives the UploadProgressScreen and persists
 * state through `photoStorage` so progress survives navigation / app reloads.
 *
 * Designed as an event-emitter so screens can subscribe to live updates
 * without prop-drilling.  When the real backend is ready, only the
 * `processPhoto` and `addUploadedPhoto` calls need to be swapped for the
 * actual REST/multipart upload — the public surface (start / pause / resume
 * / cancel / retryFailed / subscribe / getState) stays identical.
 */

export type UploadStatus = 'idle' | 'uploading' | 'paused' | 'done';

export interface UploadState {
  status: UploadStatus;
  eventId: string | null;
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  total: number;
  processed: number;
  finished: number;
  failed: number;
  failedIds: string[];
  photos: PhotoItem[];
  startedAt: number;
}

type Listener = (state: UploadState) => void;

// Tunables for the simulation. Keep small so the UI feels alive.
const TICK_MS = 320;
const FAIL_RATE = 0.08;

const defaultState = (): UploadState => ({
  status: 'idle',
  eventId: null,
  eventTitle: '',
  eventDate: '',
  eventImage: '',
  total: 0,
  processed: 0,
  finished: 0,
  failed: 0,
  failedIds: [],
  photos: [],
  startedAt: 0,
});

class UploadEngine {
  private state: UploadState = defaultState();
  private listeners = new Set<Listener>();
  private timer: ReturnType<typeof setInterval> | null = null;

  // ─── Public API ──────────────────────────────────────────────────────────

  getState(): UploadState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  start(args: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventImage: string;
    photos: PhotoItem[];
  }) {
    if (!args.photos.length) return;
    this.stopTimer();
    this.state = {
      status: 'uploading',
      eventId: args.eventId,
      eventTitle: args.eventTitle,
      eventDate: args.eventDate,
      eventImage: args.eventImage,
      total: args.photos.length,
      processed: 0,
      finished: 0,
      failed: 0,
      failedIds: [],
      photos: args.photos,
      startedAt: Date.now(),
    };
    this.emit();
    this.startTimer();
  }

  pause() {
    if (this.state.status !== 'uploading') return;
    this.state = { ...this.state, status: 'paused' };
    this.stopTimer();
    this.emit();
  }

  resume() {
    if (this.state.status !== 'paused') return;
    this.state = { ...this.state, status: 'uploading' };
    this.emit();
    this.startTimer();
  }

  cancel() {
    this.stopTimer();
    this.state = defaultState();
    this.emit();
  }

  retryFailed() {
    if (!this.state.failedIds.length) return;
    const failedSet = new Set(this.state.failedIds);
    const retry = this.state.photos.filter((p) => failedSet.has(p.id));
    if (!retry.length) return;
    this.stopTimer();
    this.state = {
      ...this.state,
      status: 'uploading',
      photos: retry,
      total: retry.length,
      processed: 0,
      finished: 0,
      failed: 0,
      failedIds: [],
      startedAt: Date.now(),
    };
    this.emit();
    this.startTimer();
  }

  // ─── Internals ───────────────────────────────────────────────────────────

  private startTimer() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick() {
    const { state } = this;
    if (state.status !== 'uploading') return;
    if (state.processed >= state.total) return;

    const photo = state.photos[state.processed];
    const failed = Math.random() < FAIL_RATE;

    if (failed) {
      this.state = {
        ...state,
        processed: state.processed + 1,
        failed: state.failed + 1,
        failedIds: [...state.failedIds, photo.id],
      };
    } else {
      this.state = {
        ...state,
        processed: state.processed + 1,
        finished: state.finished + 1,
      };
      // Persist the successful upload to the event's gallery.
      const uploaded: UploadedPhoto = {
        ...photo,
        eventId: state.eventId ?? 'unknown',
        uploadedAt: Date.now(),
      };
      try {
        await photoStorage.addPhotosToEvent(state.eventId ?? 'unknown', [uploaded]);
      } catch (err) {
        // Storage write failure shouldn't crash the engine.
         
        console.warn('uploadEngine: failed to persist photo', err);
      }
    }

    if (this.state.processed >= this.state.total) {
      this.state = { ...this.state, status: 'done' };
      this.stopTimer();
    }
    this.emit();
  }

  private emit() {
    const snapshot = this.state;
    this.listeners.forEach((l) => l(snapshot));
  }
}

export const uploadEngine = new UploadEngine();