import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { photoStorage } from '../services/photoStorage';
import { UploadedPhoto } from '../types';

/**
 * AllPhotosScreen
 * --------------------------------------------------------------------------
 * Event-scoped gallery. Called from EventsScreen with the event's params and
 * shows that event's uploaded photos, latest first.  The \"Upload Photos\"
 * button routes into the select-photos flow for the same event.
 *
 * Without an eventId param it still renders gracefully (empty state) — keeps
 * navigation safe if someone deep-links here.
 */

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 10;
const GRID_COLS = 3;
const TILE_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
const TILE_HEIGHT = TILE_WIDTH * 0.82;
const PAGE_SIZE = 24;

export default function AllPhotosScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    eventId?: string;
    title?: string;
    date?: string;
    image?: string;
    guests?: string;
  }>();

  const eventId = params.eventId ?? '';
  const eventTitle = params.title ?? 'Event Photos';
  const eventDate = params.date ?? '';
  const eventImage = params.image ?? '';

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadPhotos = useCallback(
    async (page: number, isRefresh: boolean) => {
      if (!eventId) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const result = await photoStorage.getEventPhotosWithPagination(
          eventId,
          page,
          PAGE_SIZE,
        );
        setPhotos((prev) =>
          page === 0 || isRefresh ? result.photos : [...prev, ...result.photos],
        );
        setHasMore(result.hasMore);
        setTotalCount(result.total);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId],
  );

  // Refresh whenever the screen comes back into focus (e.g. after an upload).
  useFocusEffect(
    useCallback(() => {
      loadPhotos(0, false);
    }, [loadPhotos]),
  );

  const handleRefresh = useCallback(() => loadPhotos(0, true), [loadPhotos]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) loadPhotos(currentPage + 1, false);
  }, [loading, hasMore, currentPage, loadPhotos]);

  const goToUpload = useCallback(() => {
    router.push({
      pathname: '/(tabs)/select-photos',
      params: {
        eventId,
        title: eventTitle,
        date: eventDate,
        image: eventImage,
        guests: params.guests ?? '',
      },
    });
  }, [eventId, eventTitle, eventDate, eventImage, params.guests]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
          testID="all-photos-back-btn"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {eventTitle}
          </Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} photo{totalCount !== 1 ? 's' : ''}
            {eventDate ? ` · ${eventDate}` : ''}
          </Text>
        </View>
      </View>

      {/* Event cover strip */}
      {eventImage ? (
        <View style={styles.coverWrap}>
          <Image source={{ uri: eventImage }} style={styles.coverImage} />
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 96 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {photos.length === 0 && !loading ? (
          <View style={styles.emptyState} testID="all-photos-empty-state">
            <Ionicons name="images-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload your first photos to start this gallery
            </Text>
            <TouchableOpacity
              style={styles.emptyUploadBtn}
              onPress={goToUpload}
              activeOpacity={0.85}
              testID="empty-upload-btn"
            >
              <Ionicons name="cloud-upload-outline" size={18} color={Colors.white} />
              <Text style={styles.emptyUploadText}>Upload Photos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.tile}
                  activeOpacity={0.85}
                  testID={`gallery-photo-${photo.id}`}
                >
                  <Image source={{ uri: photo.uri }} style={styles.tileImage} />
                </TouchableOpacity>
              ))}
            </View>

            {hasMore && !loading && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
                activeOpacity={0.8}
                testID="load-more-btn"
              >
                <Text style={styles.loadMoreText}>Load More Photos</Text>
              </TouchableOpacity>
            )}

            {loading && !refreshing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading photos...</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Upload CTA — only when we already have photos. Empty state
          renders its own bigger button inline. */}
      {photos.length > 0 && (
        <TouchableOpacity
          style={[
            styles.floatingUpload,
            { bottom: Math.max(insets.bottom, 16) + 12 },
          ]}
          activeOpacity={0.9}
          onPress={goToUpload}
          testID="floating-upload-btn"
        >
          <Ionicons name="cloud-upload-outline" size={20} color={Colors.white} />
          <Text style={styles.floatingUploadText}>Upload Photos</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPink,
  },
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
    fontSize: 22,
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
  coverWrap: {
    marginHorizontal: GRID_PADDING,
    height: 96,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
    backgroundColor: Colors.primarySoft,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 12,
  },
  emptyUploadText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
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
  floatingUpload: {
    position: 'absolute',
    right: GRID_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  floatingUploadText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});