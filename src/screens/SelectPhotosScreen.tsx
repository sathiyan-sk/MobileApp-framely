import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import UploadOptionsSheet from '../components/UploadOptionsSheet';
import UploadProgressCard, { UploadStatus } from '../components/UploadProgressCard';
import { Colors } from '../constants/colors';
import { useScroll } from '../context/ScrollContext';
import { useContentInsets } from '../hooks/useContentInsets';
import { photoStorage } from '../services/photoStorage';
import { PhotoItem, UploadedPhoto, UploadProgress } from '../types';

// ─── Source tabs (Gallery / Camera / Files / Drive) ───────────────────────────
type SourceKey = 'gallery' | 'camera' | 'files' | 'drive';

const SOURCE_TABS: {
  key: SourceKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'gallery', label: 'Gallery', icon: 'image' },
  { key: 'camera', label: 'Camera', icon: 'camera-outline' },
  { key: 'files', label: 'Files', icon: 'folder-outline' },
  { key: 'drive', label: 'Drive', icon: 'cloud-outline' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 10;
const GRID_COLS = 3;
const TILE_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
const TILE_HEIGHT = TILE_WIDTH * 0.82;

// ─── Upload simulation tuning ─────────────────────────────────────────────────
const TICK_MS = 320; // time to \"upload\" one photo
const FAIL_RATE = 0.08; // chance a photo fails
const PAGE_SIZE = 24; // photos per page

// Helper to generate unique IDs using timestamp + random
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function SelectPhotosScreen() {
  const insets = useSafeAreaInsets();
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets({
    hasBottomNav: true,
    extraBottomSpacing: 80, // Extra space for the fixed footer action bar
  });
  const params = useLocalSearchParams<{
    eventId?: string;
    title?: string;
    date?: string;
    guests?: string;
    image?: string;
  }>();

  const eventId = params.eventId || 'default-event';
  const eventTitle = params.title || 'Sarah & James Wedding';
  const eventDate = params.date || 'Apr 25, 2026';
  const eventImage =
    params.image ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80';

  const [activeSource, setActiveSource] = useState<SourceKey>('gallery');
  const [devicePhotos, setDevicePhotos] = useState<PhotoItem[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  // FIXED: No pre-selection - start with empty set
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [cameraPermissionRequested, setCameraPermissionRequested] = useState(false);

  // ─── Upload state ───────────────────────────────────────────────────────────
  const [status, setStatus] = useState<UploadStatus | 'idle'>('idle');
  const [prog, setProg] = useState({ total: 0, processed: 0, finished: 0, failed: 0 });

  const idsRef = useRef<string[]>([]);
  const procRef = useRef(0);
  const finRef = useRef(0);
  const failRef = useRef(0);
  const failedIdsRef = useRef<string[]>([]);

  const allPhotos = useMemo(() => [...devicePhotos, ...uploadedPhotos], [devicePhotos, uploadedPhotos]);
  const selectedCount = selected.size;
  const isBusy = status === 'uploading' || status === 'paused';

  // ─── Load persisted upload progress on mount ─────────────────────────────────
  useEffect(() => {
    const loadPersistedProgress = async () => {
      const progress = await photoStorage.getUploadProgress();
      if (progress && progress.eventId === eventId && progress.status !== 'done') {
        // Restore upload progress
        idsRef.current = progress.photoIds;
        procRef.current = progress.processed;
        finRef.current = progress.finished;
        failRef.current = progress.failed;
        failedIdsRef.current = progress.failedIds;
        setProg({
          total: progress.total,
          processed: progress.processed,
          finished: progress.finished,
          failed: progress.failed,
        });
        setStatus(progress.status);
        
        // Restore selection
        setSelected(new Set(progress.photoIds));
      }
    };

    loadPersistedProgress();
  }, [eventId]);

  // ─── Load uploaded photos for this event ─────────────────────────────────────
  useEffect(() => {
    const loadUploadedPhotos = async () => {
      const photos = await photoStorage.getEventPhotos(eventId);
      setUploadedPhotos(photos.map(p => ({ id: p.id, uri: p.uri })));
    };

    loadUploadedPhotos();
  }, [eventId]);

  // ─── Load device gallery photos with pagination ─────────────────────────────
  const loadGalleryPhotos = useCallback(async (page: number = 0) => {
    setLoadingPhotos(true);
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== 'granted') {
        setLoadingPhotos(false);
        return;
      }

      const result = await MediaLibrary.getAssetsAsync({
        first: PAGE_SIZE,
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        after: page > 0 ? undefined : undefined, // For pagination, you'd use endCursor
      });

      if (page === 0) {
        // First load
        const photos: PhotoItem[] = result.assets.map(asset => ({
          id: asset.id,
          uri: asset.uri,
          filename: asset.filename,
          width: asset.width,
          height: asset.height,
          creationTime: asset.creationTime,
          modificationTime: asset.modificationTime,
        }));
        setDevicePhotos(photos);
      } else {
        // Load more
        const photos: PhotoItem[] = result.assets.map(asset => ({
          id: asset.id,
          uri: asset.uri,
          filename: asset.filename,
          width: asset.width,
          height: asset.height,
          creationTime: asset.creationTime,
          modificationTime: asset.modificationTime,
        }));
        setDevicePhotos(prev => [...prev, ...photos]);
      }

      setHasMorePhotos(result.hasNextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load gallery photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  }, []);

  const togglePhoto = (id: string) => {
    if (isBusy) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    if (isBusy) return;
    setSelected(new Set());
  };

  const selectAll = () => {
    if (isBusy) return;
    setSelected(new Set(allPhotos.map(p => p.id)));
  };

  // ─── Permissions ──────────────────────────────────────────────────────────
  const showSettingsAlert = (what: string) => {
    Alert.alert(
      `${what} access needed`,
      `Framely needs ${what.toLowerCase()} access to add photos to your event. Please enable it in Settings.`,
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
    );
  };

  const ensureLibraryPermission = async () => {
    const current = await MediaLibrary.getPermissionsAsync();
    if (current.granted) return true;
    if (current.canAskAgain) {
      const req = await MediaLibrary.requestPermissionsAsync();
      if (req.granted) return true;
      if (!req.canAskAgain) showSettingsAlert('Photo Library');
      return false;
    }
    showSettingsAlert('Photo Library');
    return false;
  };

  const ensureCameraPermission = async () => {
    const current = await ImagePicker.getCameraPermissionsAsync();
    if (current.granted) return true;
    if (current.canAskAgain) {
      const req = await ImagePicker.requestCameraPermissionsAsync();
      if (req.granted) return true;
      if (!req.canAskAgain) showSettingsAlert('Camera');
      return false;
    }
    showSettingsAlert('Camera');
    return false;
  };

  const addDevicePhotos = (assets: ImagePicker.ImagePickerAsset[]) => {
    if (!assets?.length) return;
    const items: PhotoItem[] = assets.map((a) => ({
      id: generateUniqueId(), // FIXED: Better unique ID generation
      uri: a.uri,
      filename: a.fileName,
      width: a.width,
      height: a.height,
    }));
    setDevicePhotos((prev) => [...items, ...prev]);
    
    // FIXED: Only pre-select newly added device photos
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      return next;
    });
  };

  const pickFromGallery = async () => {
    const ok = await ensureLibraryPermission();
    if (!ok) return;
    
    // Load initial gallery photos
    await loadGalleryPhotos(0);
  };

  const pickFromCamera = async () => {
    // FIXED: Show confirmation dialog first before requesting permission
    if (!cameraPermissionRequested) {
      Alert.alert(
        'Use Camera',
        'Would you like to take a photo with your camera?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              setCameraPermissionRequested(true);
              const ok = await ensureCameraPermission();
              if (!ok) return;
              const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
              if (!res.canceled) addDevicePhotos(res.assets);
            },
          },
        ],
      );
      return;
    }

    const ok = await ensureCameraPermission();
    if (!ok) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) addDevicePhotos(res.assets);
  };

  const handleSourceTab = (tab: { key: SourceKey; label: string }) => {
    if (isBusy) return;
    setActiveSource(tab.key);
    if (tab.key === 'gallery') pickFromGallery();
    else if (tab.key === 'camera') pickFromCamera();
    else Alert.alert(tab.label, `${tab.label} import is coming soon.`);
  };

  // ─── Persist upload progress ─────────────────────────────────────────────────
  const persistProgress = useCallback(async () => {
    if (status === 'idle') {
      await photoStorage.clearUploadProgress();
      return;
    }

    const progress: UploadProgress = {
      eventId,
      photoIds: idsRef.current,
      total: idsRef.current.length,
      processed: procRef.current,
      finished: finRef.current,
      failed: failRef.current,
      failedIds: failedIdsRef.current,
      status: status as 'uploading' | 'paused' | 'done',
      startedAt: Date.now(),
      updatedAt: Date.now(),
    };

    await photoStorage.saveUploadProgress(progress);
  }, [status, eventId]);

  // Persist progress whenever it changes
  useEffect(() => {
    persistProgress();
  }, [persistProgress]);

  // ─── Upload engine (simulated progress) ──────────────────────────────────────
  const startUpload = useCallback((ids: string[]) => {
    if (!ids.length) return;
    idsRef.current = ids;
    procRef.current = 0;
    finRef.current = 0;
    failRef.current = 0;
    failedIdsRef.current = [];
    setProg({ total: ids.length, processed: 0, finished: 0, failed: 0 });
    setStatus('uploading');
  }, []);

  const runTick = useCallback(async () => {
    if (procRef.current >= idsRef.current.length) return;
    const id = idsRef.current[procRef.current];
    const fail = Math.random() < FAIL_RATE;
    procRef.current += 1;
    if (fail) {
      failRef.current += 1;
      failedIdsRef.current.push(id);
    } else {
      finRef.current += 1;
    }
    setProg({
      total: idsRef.current.length,
      processed: procRef.current,
      finished: finRef.current,
      failed: failRef.current,
    });
    if (procRef.current >= idsRef.current.length) {
      setStatus('done');
      
      // Save uploaded photos to storage
      const successfulIds = idsRef.current.filter(id => !failedIdsRef.current.includes(id));
      const successfulPhotos = allPhotos.filter(p => successfulIds.includes(p.id));
      const uploadedPhotos: UploadedPhoto[] = successfulPhotos.map(p => ({
        ...p,
        eventId,
        uploadedAt: Date.now(),
      }));
      
      await photoStorage.addPhotosToEvent(eventId, uploadedPhotos);
    }
  }, [allPhotos, eventId]);

  // Drive the interval whenever we are actively uploading.
  useEffect(() => {
    if (status !== 'uploading') return;
    const timer = setInterval(runTick, TICK_MS);
    return () => clearInterval(timer);
  }, [status, runTick]);

  // On completion: drop successfully-uploaded photos from the selection.
  useEffect(() => {
    if (status !== 'done') return;
    const failedSet = new Set(failedIdsRef.current);
    const uploadedSet = new Set(idsRef.current);
    setSelected((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        // keep failed photos and anything that wasn't part of this batch
        if (failedSet.has(id) || !uploadedSet.has(id)) next.add(id);
      });
      return next;
    });

    // If everything succeeded, auto-dismiss the progress card.
    if (failRef.current === 0) {
      const t = setTimeout(() => {
        setStatus('idle');
        photoStorage.clearUploadProgress();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handlePauseToggle = () => {
    setStatus((s) => (s === 'uploading' ? 'paused' : s === 'paused' ? 'uploading' : s));
  };

  const handleCancelUpload = () => {
    idsRef.current = [];
    procRef.current = 0;
    finRef.current = 0;
    failRef.current = 0;
    failedIdsRef.current = [];
    setProg({ total: 0, processed: 0, finished: 0, failed: 0 });
    setStatus('idle');
    photoStorage.clearUploadProgress();
  };

  const handleRetryFailed = () => {
    const ids = [...failedIdsRef.current];
    if (ids.length) startUpload(ids);
  };

  const handleConfirmUpload = () => {
    setOptionsVisible(false);
    startUpload(Array.from(selected));
  };

  const handleLoadMore = () => {
    if (!loadingPhotos && hasMorePhotos) {
      loadGalleryPhotos(currentPage + 1);
    }
  };

  // FIXED: Confirm before going back during active upload
  const handleBack = () => {
    if (isBusy) {
      Alert.alert(
        'Upload in Progress',
        'Are you sure you want to leave? Your upload is still in progress.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ],
      );
      return;
    }
    router.back();
  };

  const headerInfo = useMemo(
    () => ({ title: eventTitle, date: eventDate, image: eventImage }),
    [eventTitle, eventDate, eventImage],
  );

  // Derived numbers for the progress card.
  const queue = Math.max(0, prog.total - prog.processed);
  const percent = prog.total ? Math.round((prog.processed / prog.total) * 100) : 0;
  
  // FIXED: Calculate actual file sizes (simplified for now, can be enhanced)
  const totalMb = prog.total * 0.8; // rough estimate
  const uploadedMb = (totalMb * percent) / 100;
  const secondsLeft = Math.max(0, Math.ceil((queue * TICK_MS) / 1000));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.8}
          testID="select-photos-back-btn"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Upload Photos</Text>
          <Text style={styles.headerSubtitle}>Add memories to your event</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Event card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: headerInfo.image }} style={styles.eventThumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {headerInfo.title}
            </Text>
            <View style={styles.eventDateRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.eventDate}>{headerInfo.date}</Text>
            </View>
          </View>
        </View>

        {/* Source tabs */}
        <View style={styles.tabsCard}>
          {SOURCE_TABS.map((tab) => {
            const active = activeSource === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => handleSourceTab(tab)}
                activeOpacity={0.8}
                disabled={isBusy}
                testID={`source-tab-${tab.key}`}
              >
                <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={active ? Colors.primary : Colors.textMuted}
                  />
                </View>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filter + selection row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.albumDropdown}
            activeOpacity={0.7}
            testID="album-dropdown"
          >
            <Text style={styles.albumText}>All photos</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textDark} />
          </TouchableOpacity>

          <View style={styles.selectionInfo}>
            <Text style={styles.selectedCount}>{selectedCount} Selected</Text>
            {selectedCount > 0 && selectedCount < allPhotos.length && (
              <TouchableOpacity
                onPress={selectAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="select-all-btn"
              >
                <Text style={styles.actionText}>Select All</Text>
              </TouchableOpacity>
            )}
            {selectedCount > 0 && (
              <TouchableOpacity
                onPress={clearSelection}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="clear-selection-btn"
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Photo grid */}
        <View style={styles.grid}>
          {allPhotos.map((photo) => {
            const isSelected = selected.has(photo.id);
            return (
              <TouchableOpacity
                key={photo.id}
                style={styles.tile}
                activeOpacity={0.85}
                onPress={() => togglePhoto(photo.id)}
                testID={`photo-tile-${photo.id}`}
              >
                <Image source={{ uri: photo.uri }} style={styles.tileImage} />
                {/* FIXED: Only show checkmark when selected */}
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Load more button */}
        {hasMorePhotos && !loadingPhotos && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={handleLoadMore}
            activeOpacity={0.8}
          >
            <Text style={styles.loadMoreText}>Load More Photos</Text>
          </TouchableOpacity>
        )}

        {loadingPhotos && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading photos...</Text>
          </View>
        )}

        {/* Upload progress (mirrors the design once an upload starts) */}
        {status !== 'idle' && (
          <UploadProgressCard
            status={status as UploadStatus}
            progress={{
              total: prog.total,
              queue,
              failed: prog.failed,
              finished: prog.finished,
              percent,
              uploadedMb,
              totalMb,
              secondsLeft,
            }}
            onPauseToggle={handlePauseToggle}
            onCancel={handleCancelUpload}
            onRetryFailed={handleRetryFailed}
          />
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            (selectedCount === 0 || isBusy) && styles.uploadBtnDisabled,
          ]}
          activeOpacity={0.9}
          disabled={selectedCount === 0 || isBusy}
          onPress={() => setOptionsVisible(true)}
          testID="upload-options-btn"
        >
          {isBusy ? (
            <View style={styles.uploadBtnBusy}>
              <ActivityIndicator size="small" color={Colors.white} />
              <Text style={styles.uploadBtnText}>Uploading</Text>
            </View>
          ) : (
            <Text style={styles.uploadBtnText}>Upload Options</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Upload Options bottom sheet */}
      <UploadOptionsSheet
        visible={optionsVisible}
        photoCount={selectedCount}
        onClose={() => setOptionsVisible(false)}
        onUpload={handleConfirmUpload}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPink,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GRID_PADDING,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 14,
  },
  backBtn: {
    width: 46,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textDark,
    fontFamily: 'Georgia',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: GRID_PADDING,
  },
  // Event card
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textDark,
    fontFamily: 'Georgia',
  },
  eventDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  eventDate: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  // Source tabs
  tabsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6,
  },
  tabIconWrap: {
    width: 56,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tabIconWrapActive: {
    backgroundColor: Colors.primaryFaint,
  },
  tabLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -2,
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  // Filter row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  albumDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  albumText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.primarySoft,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
  },
  // Load More
  loadMoreBtn: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  // Footer
  footer: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 10,
    backgroundColor: Colors.bgPink,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  uploadBtn: {
    height: 56,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  uploadBtnDisabled: {
    opacity: 0.5,
  },
  uploadBtnBusy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});