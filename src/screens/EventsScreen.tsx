import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EventListItem } from '../components/EventListItem';
import { Colors } from '../constants/colors';
import {
  eventsWorkspaceData,
  EventWorkspaceItem,
} from '../constants/mockData';
import { useScroll } from '../context/ScrollContext';
import { useContentInsets } from '../hooks/useContentInsets';

type FilterType = 'all' | 'published' | 'unpublished' | 'expired';
type SortType = 'newest' | 'oldest';

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'unpublished', label: 'Unpublished' },
  { key: 'expired', label: 'Expired' },
];

const SORT_OPTIONS: { key: SortType; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
];

export default function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [events, setEvents] = useState<EventWorkspaceItem[]>(eventsWorkspaceData);
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets();

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply tab filter
    if (selectedFilter === 'published') {
      result = result.filter((e) => e.publishStatus === 'published');
    } else if (selectedFilter === 'unpublished') {
      result = result.filter((e) => e.publishStatus === 'unpublished');
    } else if (selectedFilter === 'expired') {
      result = result.filter((e) => e.eventStatus === 'expired');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.date.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) =>
      sortOrder === 'newest'
        ? b.sortTimestamp - a.sortTimestamp
        : a.sortTimestamp - b.sortTimestamp
    );

    return result;
  }, [events, selectedFilter, searchQuery, sortOrder]);

  const navigateToEventGallery = (event: EventWorkspaceItem) => {
    router.push({
      pathname: '/(tabs)/all-photos',
      params: {
        eventId: event.id,
        title: event.title,
        date: event.date,
        guests: String(event.guests),
        image: event.image,
      },
    });
  };


  const navigateToUpload = (event: EventWorkspaceItem) => {
    router.push({
      pathname: '/(tabs)/select-photos',
      params: {
        eventId: event.id,
        title: event.title,
        date: event.date,
        guests: String(event.guests),
        image: event.image,
      },
    });
  };

  const handleMenuAction = (action: string, eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    switch (action) {
      case 'unpublish':
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  publishStatus:
                    e.publishStatus === 'published' ? 'unpublished' : 'published',
                }
              : e
          )
        );
        break;
      case 'edit':
        Alert.alert('Edit Event', `Editing \"${event.title}\"`);
        break;
      case 'share':
        Alert.alert('Share Event', `Share link for \"${event.title}\"`);
        break;
      case 'upload':
        navigateToUpload(event);
        break;
      case 'delete':
        Alert.alert('Delete Event', `Are you sure you want to delete \"${event.title}\"?`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () =>
              setEvents((prev) => prev.filter((e) => e.id !== eventId)),
          },
        ]);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Top nav row */}
          <View style={styles.headerNavRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              data-testid="events-back-btn"
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              data-testid="events-filter-icon"
            >
              <Ionicons name="funnel-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Title block */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Events</Text>
            <Text style={styles.headerSubtitle}>Workspace</Text>
            <Text style={styles.headerDescription}>
              5 events across all over. Manage covers, galleries, photo sales,
              and guest access.
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                selectedFilter === tab.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(tab.key)}
              data-testid={`filter-tab-${tab.key}`}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === tab.key && styles.filterTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search + Sort Row */}
        <View style={styles.searchSortRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={Colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events by name or date..."
              placeholderTextColor={Colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              data-testid="events-search-input"
            />
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortDropdownVisible(true)}
            data-testid="events-sort-btn"
          >
            <MaterialCommunityIcons
              name="sort-variant"
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.sortText}>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.eventsListContent,
            { paddingBottom: contentBottomPadding },
          ]}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventListItem
                key={event.id}
                eventId={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                photos={event.photos}
                guests={event.guests}
                publishStatus={event.publishStatus}
                eventStatus={event.eventStatus}
                image={event.image}
                onPress={() => navigateToEventGallery(event)}
                onMenuAction={handleMenuAction}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={Colors.gray}
              />
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Sort Dropdown Modal */}
        <Modal
          visible={sortDropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSortDropdownVisible(false)}
        >
          <Pressable
            style={styles.sortModalOverlay}
            onPress={() => setSortDropdownVisible(false)}
          >
            <View style={styles.sortMenuContainer}>
              <Text style={styles.sortMenuTitle}>Sort by</Text>
              <View style={styles.sortMenuDivider} />
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.sortMenuItem}
                  onPress={() => {
                    setSortOrder(option.key);
                    setSortDropdownVisible(false);
                  }}
                  data-testid={`sort-option-${option.key}`}
                >
                  <Text
                    style={[
                      styles.sortMenuItemText,
                      sortOrder === option.key && styles.sortMenuItemActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortOrder === option.key && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPink,
  },
  container: {
    flex: 1,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    alignItems: 'flex-start',
    marginTop: 6,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textDark,
    fontFamily: 'Georgia',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 18,
    color: Colors.primary,
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    marginTop: -2,
  },
    headerDescription: {
    fontSize: 12.5,
    color: Colors.textMuted,
    marginTop: 6,
    lineHeight: 18,
  },
  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: Colors.primary,
  },
  filterText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.textDark,
    fontWeight: '600',
  },
  // Search + Sort
  searchSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textDark,
    padding: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortText: {
    fontSize: 13,
    color: Colors.textDark,
    fontWeight: '500',
  },
  // Events List
  eventsList: {
    flex: 1,
    marginTop: 14,
  },
  eventsListContent: {
    paddingHorizontal: 20,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  // Sort Modal
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sortMenuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sortMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 6,
  },
  sortMenuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sortMenuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textBody,
  },
  sortMenuItemActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});