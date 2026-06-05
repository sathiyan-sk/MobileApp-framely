export interface PhotoItem {
  id: string;
  uri: string;
  filename?: string;
  width?: number;
  height?: number;
  creationTime?: number;
  modificationTime?: number;
  mediaType?: 'photo' | 'video';
  duration?: number;
  albumId?: string;
}

export interface UploadedPhoto extends PhotoItem {
  eventId: string;
  uploadedAt: number;
  size?: number;
  compressed?: boolean;
  quality?: 'high' | 'medium' | 'low';
}

export interface UploadProgress {
  eventId: string;
  photoIds: string[];
  total: number;
  processed: number;
  finished: number;
  failed: number;
  failedIds: string[];
  status: 'uploading' | 'paused' | 'done';
  startedAt: number;
  updatedAt: number;
}

export interface EventPhotos {
  eventId: string;
  photos: UploadedPhoto[];
  totalCount: number;
  lastUpdated: number;
}
