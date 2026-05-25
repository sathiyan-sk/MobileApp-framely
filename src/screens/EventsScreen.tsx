import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { myEvents } from '../constants/mockData';
import { useScroll } from '../context/ScrollContext';
import { useContentInsets } from '../hooks/useContentInsets';


type FilterType = 'all' | 'live' | 'scheduled' | 'drafts';

export default function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets();

  const filters = [
    { key: 'all', label: 'All', count: myEvents.length },
    { key: 'live', label: 'Live', count: myEvents.filter(e => e.status === 'live').length },
    { key: 'scheduled', label: 'Scheduled', count: myEvents.filter(e => e.status === 'scheduled').length },
    { key: 'drafts', label: 'Drafts', count: myEvents.filter(e => e.status === 'draft').length },
  ];

  const filteredEvents = myEvents.filter((event) => {
    if (selectedFilter === 'all') return true;
    return event.status === selectedFilter || 
           (selectedFilter === 'drafts' && event.status === 'draft');
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity> */}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Events</Text>
            <Text style={styles.headerSubtitle}>All your events in one place</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} testID="events-search-btn\">
              <Ionicons name="search" size={22} color={Colors.black} />
            </TouchableOpacity>
                       <TouchableOpacity
              style={[styles.iconButton, styles.createButton]}
              onPress={() => router.push('/(tabs)/newEvent' as any)}
              testID="events-create-btn"
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by name or date..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.key && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter.key as FilterType)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.key && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                {filter.count > 0 && (
                  <View
                    style={[
                      styles.filterBadge,
                      selectedFilter === filter.key && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        selectedFilter === filter.key && styles.filterBadgeTextActive,
                      ]}
                    >
                      {filter.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.sortButton}>
            <MaterialCommunityIcons name="menu-down" size={16} color={Colors.primary} />
            <Text style={styles.sortText}>Newest</Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.eventsListContent, { paddingBottom: contentBottomPadding }]}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {filteredEvents.map((event) => (
            < EventListItem 
              key={event.id} 
              title={event.title}
              location={event.location}
              date={event.date}
              photos={event.photos}
              guests={event.guests}
              status={event.status}
              image={event.image} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.gray,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
    createButton: {
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  filterScroll: {
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
  filterTextActive: {
    color: Colors.white,
  },
  filterBadge: {
    backgroundColor: Colors.grayLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black,
  },
  filterBadgeTextActive: {
    color: Colors.white,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  sortText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  eventsList: {
    flex: 1,
    marginTop: 16,
  },
  eventsListContent: {
    paddingHorizontal: 20,
  },
});