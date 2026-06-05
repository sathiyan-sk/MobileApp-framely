import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventPhotos, UploadedPhoto, UploadProgress } from '../types';

// Storage keys
const KEYS = {
  UPLOADED_PHOTOS: '@framely/uploaded_photos',
  UPLOAD_PROGRESS: '@framely/upload_progress',
  EVENT_PHOTOS: '@framely/event_photos',
};

/**
 * Photo Storage Service
 * Currently uses AsyncStorage, but structured to easily switch to API calls
 */
class PhotoStorageService {
  // ========== Upload Progress ==========
  
  async saveUploadProgress(progress: UploadProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.UPLOAD_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save upload progress:', error);
      throw error;
    }
  }

  async getUploadProgress(): Promise<UploadProgress | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.UPLOAD_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get upload progress:', error);
      return null;
    }
  }

  async clearUploadProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.UPLOAD_PROGRESS);
    } catch (error) {
      console.error('Failed to clear upload progress:', error);
    }
  }

  // ========== Event Photos ==========
  
  async saveEventPhotos(eventId: string, photos: UploadedPhoto[]): Promise<void> {
    try {
      const key = `${KEYS.EVENT_PHOTOS}_${eventId}`;
      const eventPhotos: EventPhotos = {
        eventId,
        photos,
        totalCount: photos.length,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(eventPhotos));
      
      // Also update the global uploaded photos list
      await this.addToUploadedPhotos(photos);
    } catch (error) {
      console.error('Failed to save event photos:', error);
      throw error;
    }
  }

  async getEventPhotos(eventId: string): Promise<UploadedPhoto[]> {
    try {
      const key = `${KEYS.EVENT_PHOTOS}_${eventId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return [];
      
      const eventPhotos: EventPhotos = JSON.parse(data);
      // Always return latest first, regardless of insertion order on disk.
      return [...eventPhotos.photos].sort(
        (a, b) => (b.uploadedAt ?? 0) - (a.uploadedAt ?? 0),
      );    } 
      catch (error) {
      console.error('Failed to get event photos:', error);
      return [];
    }
  }
    async getEventPhotosWithPagination(
    eventId: string,
    page: number = 0,
    pageSize: number = 24,
  ): Promise<{ photos: UploadedPhoto[]; hasMore: boolean; total: number }> {
    try {
      const all = await this.getEventPhotos(eventId);
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        photos: all.slice(start, end),
        hasMore: end < all.length,
        total: all.length,
      };
    } catch (error) {
      console.error('Failed to get paginated event photos:', error);
      return { photos: [], hasMore: false, total: 0 };
    }
  }

  async addPhotosToEvent(eventId: string, photos: UploadedPhoto[]): Promise<void> {
    try {
      const existing = await this.getEventPhotos(eventId);
      const merged = [...photos, ...existing];
      await this.saveEventPhotos(eventId, merged);
    } catch (error) {
      console.error('Failed to add photos to event:', error);
      throw error;
    }
  }

  // ========== All Uploaded Photos ==========
  
  async addToUploadedPhotos(photos: UploadedPhoto[]): Promise<void> {
    try {
      const existing = await this.getAllUploadedPhotos();
      const existingIds = new Set(existing.map(p => p.id));
      const newPhotos = photos.filter(p => !existingIds.has(p.id));
      const merged = [...newPhotos, ...existing];
      await AsyncStorage.setItem(KEYS.UPLOADED_PHOTOS, JSON.stringify(merged));
    } catch (error) {
      console.error('Failed to add uploaded photos:', error);
    }
  }

  async getAllUploadedPhotos(): Promise<UploadedPhoto[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.UPLOADED_PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get all uploaded photos:', error);
      return [];
    }
  }

  async getUploadedPhotosWithPagination(page: number = 0, pageSize: number = 24): Promise<{
    photos: UploadedPhoto[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const allPhotos = await this.getAllUploadedPhotos();
      const start = page * pageSize;
      const end = start + pageSize;
      const photos = allPhotos.slice(start, end);
      
      return {
        photos,
        hasMore: end < allPhotos.length,
        total: allPhotos.length,
      };
    } catch (error) {
      console.error('Failed to get paginated photos:', error);
      return { photos: [], hasMore: false, total: 0 };
    }
  }

  // ========== Utility Methods ==========
  
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.UPLOADED_PHOTOS, KEYS.UPLOAD_PROGRESS]);
      // Also clear all event-specific keys
      const allKeys = await AsyncStorage.getAllKeys();
      const eventKeys = allKeys.filter(key => key.startsWith(KEYS.EVENT_PHOTOS));
      if (eventKeys.length > 0) {
        await AsyncStorage.multiRemove(eventKeys);
      }
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }
}

export const photoStorage = new PhotoStorageService();
