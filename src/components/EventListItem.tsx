import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import type { EventActivityStatus, EventPublishStatus } from '../constants/mockData';

interface EventListItemProps {
  title: string;
  date: string;
  location: string;
  photos: number;
  guests: number;
  publishStatus: EventPublishStatus;
  eventStatus: EventActivityStatus;
  image: string;
  onPress?: () => void;
  onMenuAction?: (action: string, eventId: string) => void;
  eventId: string;
}

const eventStatusConfig = {
  active: { color: Colors.activeStatus, bg: Colors.activeStatusBg, text: 'Live' },
  upcoming: { color: Colors.upcomingStatus, bg: Colors.upcomingStatusBg, text: 'Upcoming' },
  expired: { color: Colors.expiredStatus, bg: Colors.expiredStatusBg, text: 'Expired' },
};

const publishBadgeConfig = {
  published: { bg: Colors.publishedBadge, text: 'Published' },
  unpublished: { bg: Colors.unpublishedBadge, text: 'Unpublished' },
};

const MENU_ACTIONS = [
  { key: 'unpublish', label: 'Unpublish event', icon: 'eye-off-outline' as const },
  { key: 'edit', label: 'Edit event', icon: 'create-outline' as const },
  { key: 'share', label: 'Share event', icon: 'share-social-outline' as const },
  { key: 'upload', label: 'Upload photos', icon: 'cloud-upload-outline' as const },
  { key: 'delete', label: 'Delete event', icon: 'trash-outline' as const },
];

export const EventListItem: React.FC<EventListItemProps> = ({
  title,
  date,
  location,
  photos,
  guests,
  publishStatus,
  eventStatus,
  image,
  onPress,
  onMenuAction,
  eventId,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const statusInfo = eventStatusConfig[eventStatus];
  const publishInfo = publishBadgeConfig[publishStatus];

  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    onMenuAction?.(action, eventId);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      data-testid={`event-card-${eventId}`}
    >
      {/* Event Image with Publish Badge */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={[styles.publishBadge, { backgroundColor: publishInfo.bg }]}>
          <Text style={styles.publishBadgeText}>{publishInfo.text}</Text>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.content}>
        {/* title + Dots Menu Row */}
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            data-testid={`event-menu-${eventId}`}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.grayDark}
            />
          </TouchableOpacity>
        </View>

        {/* Location Row */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={Colors.gray} />
          <Text style={styles.infoText} numberOfLines={1}>
            {location}
          </Text>
                  </View>

        {/* Date Row + Status Badge */}
        <View style={styles.dateRow}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.gray} />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusInfo.color }]}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="image-outline" size={16} color={Colors.gray} />
            <View>
              <Text style={styles.statNumber}>{photos}</Text>
              <Text style={styles.statLabel}>PHOTOS</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="person-outline" size={16} color={Colors.gray} />
            <View>
              <Text style={styles.statNumber}>{guests}</Text>
              <Text style={styles.statLabel}>GUESTS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Three-dot Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            <View style={styles.menuDivider} />
            {MENU_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.menuItem}
                onPress={() => handleMenuAction(action.key)}
                data-testid={`menu-action-${action.key}`}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={
                    action.key === 'delete' ? Colors.red : Colors.textBody
                  }
                />
                <Text
                  style={[
                    styles.menuItemText,
                    action.key === 'delete' && { color: Colors.red },
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  publishBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  publishBadgeText: {
    color: Colors.white,
    fontSize: 10.5,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
    flex: 1,
    lineHeight: 20,
  },
    infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  infoText: {
    fontSize: 12.5,
    color: Colors.textBody,
    fontWeight: '500',
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statNumber: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 9.5,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textBody,
  },
});