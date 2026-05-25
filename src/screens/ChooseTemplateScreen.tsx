import { useScroll } from '@/src/context/ScrollContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PINK = '#EC4070';
const PINK_SOFT = '#FFE3EC';
const BG = '#FFFFFF';
const TEXT = '#1A1A1A';
const MUTED = '#8E8E93';

type Design = {
  id: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  primary: string;
  secondary: string;
  title: string;
  partner: string;
  date: string;
  name: string;
  category: 'Wedding' | 'Events' | 'Sports';
};

const designs: Design[] = [
  { id: '1', badge: 'POPULAR', badgeBg: '#FFFFFF', badgeColor: '#1A1A1A', primary: '#7C3AED', secondary: '#5B21B6', title: 'Rahul', partner: '& Priya', date: '14 Feb 2026', name: 'Lavender Dream', category: 'Wedding' },
  { id: '2', badge: 'HOT', badgeBg: '#FFE4D1', badgeColor: '#A23E00', primary: '#B45309', secondary: '#92400E', title: 'Amit', partner: '& Neha', date: '21 Mar 2026', name: 'Golden Royal', category: 'Wedding' },
  { id: '3', badge: 'GRAND', badgeBg: '#FFDEE6', badgeColor: '#7F1D1D', primary: '#7F1D1D', secondary: '#450A0A', title: 'Vikram', partner: '& Ananya', date: '05 Dec 2026', name: 'Maroon Majesty', category: 'Wedding' },
  { id: '4', badge: 'CLASSIC', badgeBg: '#FFF4D1', badgeColor: '#7A5300', primary: '#D97706', secondary: '#B45309', title: 'Karan', partner: '& Preethi', date: '13 Jan 2026', name: 'Golden Glow', category: 'Wedding' },
  { id: '5', badge: 'TRENDING', badgeBg: '#D1FAE5', badgeColor: '#065F46', primary: '#065F46', secondary: '#064E3B', title: 'Rohan', partner: '& Meera', date: '06 Apr 2026', name: 'Floral Garden', category: 'Wedding' },
  { id: '6', badge: 'ELEGANT', badgeBg: '#D6E3FF', badgeColor: '#1E3A8A', primary: '#1E3A8A', secondary: '#0F172A', title: 'Arjun', partner: '& Kavya', date: '30 Nov 2026', name: 'Midnight Shadow', category: 'Wedding' },
];

const categories = [
  { key: 'Wedding', icon: 'heart-outline' as const },
  { key: 'Events', icon: 'business-outline' as const },
  { key: 'Sports', icon: 'football-outline' as const },
];

function DesignCard({ item, selected, onSelect }: { item: Design; selected: boolean; onSelect: () => void }) {
  return (
    <TouchableOpacity
      testID={`design-${item.id}`}
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.9}
      onPress={onSelect}
    >
      <View style={[styles.cardInner, { backgroundColor: item.primary }]}>
        <View style={[styles.badgePill, { backgroundColor: item.badgeBg }]}>
          <Text style={[styles.badgePillText, { color: item.badgeColor }]}>{item.badge}</Text>
        </View>
        {selected && (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={14} color={PINK} />
          </View>
        )}
        <View style={styles.cardCenter}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardPartner}>{item.partner}</Text>
          <View style={styles.cardDatePill}>
            <Text style={styles.cardDateText}>{item.date}</Text>
          </View>
        </View>
        <View style={[styles.cardMini, { backgroundColor: item.secondary }]} />
      </View>
      <Text style={styles.cardName}>{item.name}</Text>
    </TouchableOpacity>
  );
}

export default function ChooseDesign() {
  const [selectedId, setSelectedId] = useState('1');
  const [category, setCategory] = useState<'Wedding' | 'Events' | 'Sports'>('Wedding');
  const insets = useSafeAreaInsets();
  const { onScroll } = useScroll();

  const selectedItem = designs.find((d) => d.id === selectedId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          testID="back-btn"
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={TEXT} />
        </TouchableOpacity>
        <View style={styles.crumbWrap}>
          <Text style={styles.crumbMuted}>Events</Text>
          <Ionicons name="chevron-forward" size={14} color={MUTED} />
          <Text style={styles.crumbActive}>Create event</Text>
        </View>
        <TouchableOpacity style={styles.draftBtn} activeOpacity={0.8}>
          <Ionicons name="bookmark-outline" size={14} color={PINK} />
          <Text style={styles.draftText}>Save draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 150, 160) }]} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        {/* Hero */}
        <View style={styles.heroRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.kicker}>STEP 2 OF 2</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={styles.heroH1}>Choose your </Text>
              <Text style={styles.heroH1Accent}>gallery design</Text>
            </View>
            <Text style={styles.heroLead}>
              Pick a style that best matches your event vibe.{''}You can customize it later.
            </Text>
            <View style={styles.stepperPill}>
              <View style={styles.stepWrap}>
                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
                <Text style={styles.stepLabelDone}>Event details</Text>
              </View>
              <View style={styles.stepperLine} />
              <View style={styles.stepWrap}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                  <Text style={[styles.stepNum, { color: '#fff' }]}>2</Text>
                </View>
                <Text style={styles.stepLabelDone}>Choose design</Text>
              </View>
            </View>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="images" size={36} color={PINK} />
          </View>
        </View>

        {/* Event summary strip */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>EVENT</Text>
              <Text style={styles.summaryValue}>School Last Day</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>TYPE</Text>
              <Text style={styles.summaryValue}>School Event</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>START</Text>
              <Text style={styles.summaryValue}>May 01, 2026</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>END</Text>
              <Text style={styles.summaryValue}>May 08, 2026</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>EXPIRES</Text>
              <Text style={styles.summaryValue}>—</Text>
            </View>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8, alignItems: 'center' }]}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>LOCATION</Text>
              <Text style={styles.summaryValue}>Synedy</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
              <Ionicons name="create-outline" size={13} color={PINK} />
              <Text style={styles.editText}>Edit details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category tabs */}
        <View style={styles.tabs}>
          {categories.map((c) => {
            const active = category === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                activeOpacity={0.85}
                onPress={() => setCategory(c.key as any)}
              >
                <Ionicons name={c.icon} size={14} color={active ? PINK : MUTED} />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{c.key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Design grid */}
        <View style={styles.grid}>
          {designs.map((d) => (
            <DesignCard
              key={d.id}
              item={d}
              selected={selectedId === d.id}
              onSelect={() => setSelectedId(d.id)}
            />
          ))}
        </View>

        {/* Selected bar */}
        <View style={styles.selectedBar}>
          <View style={[styles.selectedDot, { backgroundColor: selectedItem?.primary || PINK }]} />
          <Text style={styles.selectedText}>
            Selected: <Text style={{ fontWeight: '700', color: TEXT }}>{selectedItem?.name}</Text>
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.changeableText}>Changeable in event settings</Text>
            <Ionicons name="chevron-forward" size={14} color={MUTED} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          testID="back-action-btn"
          style={styles.backActionBtn}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color={TEXT} />
          <Text style={styles.backActionText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="create-event-btn"
          style={styles.createBtn}
          activeOpacity={0.9}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.createEmoji}>🎉</Text>
          <Text style={styles.createText}>Create event</Text>
          <Text style={styles.createEmoji}>✨</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crumbWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  crumbMuted: { color: MUTED, fontSize: 13 },
  crumbActive: { color: TEXT, fontSize: 13, fontWeight: '600' },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PINK_SOFT,
    gap: 4,
  },
  draftText: { color: PINK, fontWeight: '600', fontSize: 12 },

  scrollContent: { paddingHorizontal: 16 },
  heroRow: { flexDirection: 'row', marginTop: 4, marginBottom: 16 },
  kicker: { color: PINK, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  heroH1: { fontSize: 24, fontWeight: '700', color: TEXT, lineHeight: 30 },
  heroH1Accent: { fontSize: 24, fontWeight: '700', color: PINK, fontStyle: 'italic', lineHeight: 30 },
  heroLead: { color: MUTED, fontSize: 12, marginTop: 8, lineHeight: 16 },
  heroIcon: {
    width: 110,
    height: 100,
    borderRadius: 18,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  stepperLine: { width: 40, height: 1, backgroundColor: PINK, marginHorizontal: 8 },
  stepWrap: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  stepCircleActive: { backgroundColor: PINK },
  stepCircleDone: { backgroundColor: PINK },
  stepNum: { color: MUTED, fontSize: 11, fontWeight: '700' },
  stepLabelDone: { color: TEXT, fontSize: 12, fontWeight: '600' },

  summaryCard: {
    backgroundColor: '#F7F7F8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  summaryItem: { flex: 1, minWidth: 80 },
  summaryLabel: { color: MUTED, fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  summaryValue: { color: TEXT, fontSize: 13, fontWeight: '600', marginTop: 2 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PINK_SOFT,
    gap: 4,
  },
  editText: { color: PINK, fontSize: 12, fontWeight: '600' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F8',
    borderRadius: 26,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
  },
  tabBtnActive: { backgroundColor: PINK_SOFT },
  tabText: { color: MUTED, fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: PINK, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: { borderColor: PINK },
  cardInner: {
    borderRadius: 12,
    height: 180,
    padding: 10,
    overflow: 'hidden',
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCenter: { alignItems: 'center', marginTop: 18 },
  cardTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },
  cardPartner: { color: '#fff', fontSize: 14, marginTop: 2, opacity: 0.95 },
  cardDatePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  cardDateText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  cardMini: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 50,
    height: 24,
    borderRadius: 4,
    left: '50%',
    marginLeft: -25,
    opacity: 0.6,
  },
  cardName: { textAlign: 'center', color: TEXT, fontSize: 12, fontWeight: '600', marginTop: 8, paddingBottom: 4 },

  selectedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  selectedDot: { width: 10, height: 10, borderRadius: 5 },
  selectedText: { flex: 1, color: MUTED, fontSize: 12 },
  changeableText: { color: MUTED, fontSize: 11 },

  actionBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  backActionBtn: {
    paddingHorizontal: 22,
    height: 50,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  backActionText: { color: TEXT, fontWeight: '600', fontSize: 14 },
  createBtn: {
    flex: 1,
    height: 50,
    borderRadius: 28,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  createText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  createEmoji: { fontSize: 16 },
});