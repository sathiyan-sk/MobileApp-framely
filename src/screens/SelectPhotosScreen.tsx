import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

// ─── Mock gallery photos (shown alongside real device photos) ─────────────────
const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
  'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80',
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
  'https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?w=400&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80',
];

type PhotoItem = { id: string; uri: string };

// Build 24 items so the gallery fills the grid like the design.
const GALLERY_PHOTOS: PhotoItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `photo-${i}`,
  uri: PHOTO_URLS[i % PHOTO_URLS.length],
}));

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 10;
const GRID_COLS = 3;
const TILE_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
const TILE_HEIGHT = TILE_WIDTH * 0.82;

// ─── Upload simulation tuning ─────────────────────────────────────────────────
const PER_PHOTO_MB = 0.8; // rough per-photo size estimate
const TICK_MS = 320; // time to \"upload\" one photo
const FAIL_RATE = 0.08; // chance a photo fails

export default function SelectPhotosScreen() {
  const insets = useSafeAreaInsets();
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets({
    hasBottomNav: true,
    extraBottomSpacing: 80, // Extra space for the fixed footer action bar
  });
  const params = useLocalSearchParams<{
    title?: string;
    date?: string;
    guests?: string;
    image?: string;
  }>();

  const eventTitle = params.title || 'Sarah & James Wedding';
  const eventDate = params.date || 'Apr 25, 2026';
  const eventImage =
    params.image ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80';

  const [activeSource, setActiveSource] = useState<SourceKey>('gallery');
  const [devicePhotos, setDevicePhotos] = useState<PhotoItem[]>([]);
  // Pre-select all mock photos to mirror the design (\"24 Selected\").
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(GALLERY_PHOTOS.map((p) => p.id)),
  );
  const [optionsVisible, setOptionsVisible] = useState(false);

  // ─── Upload state ───────────────────────────────────────────────────────────
  const [status, setStatus] = useState<UploadStatus | 'idle'>('idle');
  const [prog, setProg] = useState({ total: 0, processed: 0, finished: 0, failed: 0 });

  const idsRef = useRef<string[]>([]);
  const procRef = useRef(0);
  const finRef = useRef(0);
  const failRef = useRef(0);
  const failedIdsRef = useRef<string[]>([]);

  const allPhotos = useMemo(() => [...devicePhotos, ...GALLERY_PHOTOS], [devicePhotos]);
  const selectedCount = selected.size;
  const isBusy = status === 'uploading' || status === 'paused';

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
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (current.granted) return true;
    if (current.canAskAgain) {
      const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    const stamp = Date.now();
    const items: PhotoItem[] = assets.map((a, i) => ({
      id: `device-${stamp}-${i}`,
      uri: a.uri,
    }));
    setDevicePhotos((prev) => [...items, ...prev]);
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      return next;
    });
  };

  const pickFromGallery = async () => {
    const ok = await ensureLibraryPermission();
    if (!ok) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 0,
      quality: 0.8,
    });
    if (!res.canceled) addDevicePhotos(res.assets);
  };

  const pickFromCamera = async () => {
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

  const runTick = useCallback(() => {
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
    }
  }, []);

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
      const t = setTimeout(() => setStatus('idle'), 1500);
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
  };

  const handleRetryFailed = () => {
    const ids = [...failedIdsRef.current];
    if (ids.length) startUpload(ids);
  };

  const handleConfirmUpload = () => {
    setOptionsVisible(false);
    startUpload(Array.from(selected));
  };

  const headerInfo = useMemo(
    () => ({ title: eventTitle, date: eventDate, image: eventImage }),
    [eventTitle, eventDate, eventImage],
  );

  // Derived numbers for the progress card.
  const queue = Math.max(0, prog.total - prog.processed);
  const percent = prog.total ? Math.round((prog.processed / prog.total) * 100) : 0;
  const totalMb = prog.total * PER_PHOTO_MB;
  const uploadedMb = (totalMb * percent) / 100;
  const secondsLeft = Math.max(0, Math.ceil((queue * TICK_MS) / 1000));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
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
            <TouchableOpacity
              onPress={clearSelection}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="clear-selection-btn"
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
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
                <View
                  style={[
                    styles.checkCircle,
                    isSelected ? styles.checkCircleOn : styles.checkCircleOff,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

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
  },
  checkCircleOn: {
    backgroundColor: Colors.primary,
  },
  checkCircleOff: {
    backgroundColor: 'rgba(0,0,0,0.18)',
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