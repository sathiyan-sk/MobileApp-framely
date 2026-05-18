import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface EventListItemProps {
  title: string;
  location: string;
  date: string;
  photos: number;
  guests: number;
  status: 'live' | 'scheduled' | 'completed' | 'expired' | 'draft';
  image: string;
  onPress?: () => void;
}

const statusConfig = {
  live: { color: Colors.live, text: 'Live' },
  scheduled: { color: Colors.scheduled, text: 'Scheduled' },
  completed: { color: Colors.completed, text: 'Completed' },
  expired: { color: Colors.expired, text: 'Expired' },
  draft: { color: Colors.draft, text: 'Draft' },
};

export const EventListItem: React.FC<EventListItemProps> = ({
  title,
  location,
  date,
  photos,
  guests,
  status,
  image,
  onPress,
}) => {
  const statusInfo = statusConfig[status];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={20} color={Colors.grayDark} />
          </TouchableOpacity>
        </View>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color={Colors.gray} />
          <Text style={styles.location} numberOfLines={1}>{location}</Text>
        </View>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="calendar" size={14} color={Colors.gray} />
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="image-multiple" size={16} color={Colors.gray} />
              <Text style={styles.statText}>{photos}</Text>
              <Text style={styles.statLabel}>PHOTOS</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={16} color={Colors.gray} />
              <Text style={styles.statText}>{guests}</Text>
              <Text style={styles.statLabel}>GUESTS</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 140,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    color: Colors.gray,
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: Colors.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});