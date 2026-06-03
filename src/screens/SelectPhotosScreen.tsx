import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import UploadOptionsSheet from '../components/UploadOptionsSheet';
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

// ─── Mock gallery photos (replace with API / device gallery later) ────────────
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

// Build 24 items so the gallery fills the grid like the design.
const GALLERY_PHOTOS = Array.from({ length: 24 }, (_, i) => ({
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
  // Pre-select all photos to mirror the design (\"24 Selected\").
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(GALLERY_PHOTOS.map((p) => p.id)),
  );
  const [optionsVisible, setOptionsVisible] = useState(false);

  const selectedCount = selected.size;

  const togglePhoto = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const headerInfo = useMemo(
    () => ({ title: eventTitle, date: eventDate, image: eventImage }),
    [eventTitle, eventDate, eventImage],
  );

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
                onPress={() => setActiveSource(tab.key)}
                activeOpacity={0.8}
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
          {GALLERY_PHOTOS.map((photo) => {
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
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[styles.uploadBtn, selectedCount === 0 && styles.uploadBtnDisabled]}
          activeOpacity={0.9}
          disabled={selectedCount === 0}
          onPress={() => setOptionsVisible(true)}
          testID="upload-options-btn"
        >
          <Text style={styles.uploadBtnText}>Upload Options</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Options bottom sheet */}
      <UploadOptionsSheet
        visible={optionsVisible}
        photoCount={selectedCount}
        onClose={() => setOptionsVisible(false)}
        onUpload={() => setOptionsVisible(false)}
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
  uploadBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});