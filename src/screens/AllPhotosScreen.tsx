import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { photoStorage } from '../services/photoStorage';
import { UploadedPhoto } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 10;
const GRID_COLS = 3;
const TILE_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
const TILE_HEIGHT = TILE_WIDTH * 0.82;
const PAGE_SIZE = 24;

export default function AllPhotosScreen() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadPhotos = useCallback(async (page: number = 0, isRefresh: boolean = false) => {
    if (loading && !isRefresh) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await photoStorage.getUploadedPhotosWithPagination(page, PAGE_SIZE);
      
      if (page === 0 || isRefresh) {
        setPhotos(result.photos);
      } else {
        setPhotos(prev => [...prev, ...result.photos]);
      }
      
      setHasMore(result.hasMore);
      setTotalCount(result.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    loadPhotos(0);
  }, []);

  const handleRefresh = useCallback(() => {
    loadPhotos(0, true);
  }, [loadPhotos]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPhotos(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, loadPhotos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>All Photos</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} photo{totalCount !== 1 ? 's' : ''} uploaded
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Photos Yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload photos to your events to see them here
            </Text>
          </View>
        ) : (
          <>
            {/* Photo grid */}
            <View style={styles.grid}>
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.tile}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: photo.uri }} style={styles.tileImage} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Load more button */}
            {hasMore && !loading && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
                activeOpacity={0.8}
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
    paddingBottom: 24,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginTop: 16,
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
});