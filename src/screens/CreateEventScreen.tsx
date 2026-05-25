import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '../context/ScrollContext';

const PINK = '#EC4070';
const PINK_SOFT = '#FFE3EC';
const BG = '#F7F7F8';
const CARD = '#FFFFFF';
const TEXT = '#1A1A1A';
const MUTED = '#8E8E93';

const HERO =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80';

function StepBadge({ active, done, label, sub }: { active?: boolean; done?: boolean; label: string; sub: string }) {
  return (
    <View style={styles.stepWrap}>
      <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
        {done ? (
          <Ionicons name="checkmark" size={14} color="#fff" />
        ) : (
          <Text style={[styles.stepNum, active && { color: '#fff' }]}>{label}</Text>
        )}
      </View>
      <Text style={[styles.stepLabel, active && { color: TEXT, fontWeight: '700' }]}>{sub}</Text>
    </View>
  );
}

function SectionHeader({ num, title, hint }: { num: string; title: string; hint?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionNum}>
        <Text style={styles.sectionNumText}>{num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

function AddOnRow({
  icon,
  title,
  badge,
  badgeStyle,
  desc,
  link,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  badge?: string;
  badgeStyle?: 'pro' | 'new';
  desc: string;
  link?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.addonRow}>
      <View style={styles.addonIcon}>
        <Ionicons name={icon} size={18} color={PINK} />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.addonTitle}>{title}</Text>
          {badge ? (
            <View style={[styles.addonBadge, badgeStyle === 'new' && styles.addonBadgeNew]}>
              <Text style={[styles.addonBadgeText, badgeStyle === 'new' && { color: '#EC4070' }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.addonDesc}>{desc}</Text>
        {link ? <Text style={styles.addonLink}>{link}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E5E5EA', true: PINK }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function CreateEvent() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [startDate, setStartDate] = useState('Apr 06, 2026');
  const [endDate, setEndDate] = useState('Jun 25, 2026');
  const [photoSales, setPhotoSales] = useState(false);
  const [reelAI, setReelAI] = useState(false);
  const [branding, setBranding] = useState(false);
  const { onScroll } = useScroll();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {/* Hero header */}
          <View style={styles.heroSection}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.kicker}>NEW EVENT  ·  STEP 1 OF 2</Text>
              <Text style={styles.heroH1}>Let's create something</Text>
              <Text style={styles.heroH1Accent}>memorable</Text>
              <Text style={styles.heroLead}>
                Start with the essentials. You'll choose a gallery design next, then go live.
              </Text>
              <View style={styles.stepperPill}>
                <StepBadge active label="1" sub="Event details" />
                <View style={styles.stepperLine} />
                <StepBadge label="2" sub="Choose design" />
              </View>
            </View>
            <Image source={{ uri: HERO }} style={styles.heroImg} />
          </View>

          {/* 01 Event name */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionHeader num="01" title="Event name" />
              <Text style={styles.counterText}>{name.length}/50</Text>
            </View>
            <View style={styles.inputWrap}>
              <Ionicons name="sparkles" size={16} color={PINK} style={{ marginRight: 8 }} />
              <TextInput
                testID="event-name-input"
                style={styles.input}
                placeholder="e.g. Destination Weddings"
                placeholderTextColor="#B5B5B5"
                value={name}
                onChangeText={(t) => setName(t.slice(0, 50))}
              />
            </View>
          </View>

          {/* 02 Schedule */}
          <View style={styles.card}>
            <SectionHeader num="02" title="Schedule" hint="Guests can upload and view photos only between these dates." />
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Start date</Text>
                <TouchableOpacity style={styles.dateInput} activeOpacity={0.85}>
                  <Ionicons name="calendar-outline" size={16} color={PINK} />
                  <Text style={styles.dateText}>{startDate}</Text>
                  <Ionicons name="chevron-down" size={14} color={MUTED} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End date</Text>
                <TouchableOpacity style={styles.dateInput} activeOpacity={0.85}>
                  <Ionicons name="calendar-outline" size={16} color={PINK} />
                  <Text style={styles.dateText}>{endDate}</Text>
                  <Ionicons name="chevron-down" size={14} color={MUTED} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={14} color={PINK} />
              <Text style={styles.infoBannerText}>
                Photos uploaded after end date will be expires automatically.
              </Text>
            </View>
          </View>

          {/* 03 Type & place */}
          <View style={styles.card}>
            <SectionHeader num="03" title="Type & place" />
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Event type</Text>
                <TouchableOpacity style={styles.dateInput} activeOpacity={0.85}>
                  <Ionicons name="pie-chart-outline" size={16} color={PINK} />
                  <Text style={[styles.dateText, !eventType && { color: '#B5B5B5' }]}>
                    {eventType || 'Select a type'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={MUTED} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Location</Text>
                <View style={styles.dateInput}>
                  <Ionicons name="locate-outline" size={16} color={PINK} />
                  <TextInput
                    testID="location-input"
                    style={[styles.dateText, { flex: 1, padding: 0 }]}
                    placeholder="e.g. Taj Mahal, Agra"
                    placeholderTextColor="#B5B5B5"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
              Description <Text style={{ color: MUTED, fontWeight: '400' }}>(optional)</Text>
            </Text>
            <View style={styles.textareaWrap}>
              <TextInput
                testID="desc-input"
                style={styles.textarea}
                placeholder="About event note for guests — Describe function, schedule, etc."
                placeholderTextColor="#B5B5B5"
                multiline
                value={description}
                onChangeText={(t) => setDescription(t.slice(0, 300))}
              />
              <Text style={styles.textareaCount}>{description.length}/300</Text>
            </View>
          </View>

          {/* 04 Add-ons */}
          <View style={styles.card}>
            <SectionHeader num="04" title="Add-ons" hint="Optional — change these any time." />
            <View style={{ marginTop: 8 }}>
              <AddOnRow
                icon="bag-outline"
                title="Photo sales"
                badge="PRO"
                badgeStyle="pro"
                desc="Let guests purchase prints and digital downloads. You keep 85%."
                link="Requires Pro plan — learn more →"
                value={photoSales}
                onChange={setPhotoSales}
              />
              <AddOnRow
                icon="videocam-outline"
                title="Reel AI"
                badge="NEW"
                badgeStyle="new"
                desc="Auto-generate a short highlight reel for each guest, delivered the morning after."
                value={reelAI}
                onChange={setReelAI}
              />
              <AddOnRow
                icon="color-palette-outline"
                title="Event branding"
                desc="Apply your logo, colors, and custom domain to the guest gallery."
                value={branding}
                onChange={setBranding}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom action bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            testID="cancel-btn"
            style={styles.cancelBtn}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="continue-btn"
            style={styles.continueBtn}
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/choose-template' as any)}          >
            <Text style={styles.continueText}>Continue to design</Text>
            <Ionicons name="sparkles" size={14} color="#fff" style={{ marginLeft: 8 }} />
            <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: BG,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE3EC',
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

  heroSection: { flexDirection: 'row', marginTop: 4, marginBottom: 16 },
  kicker: { color: PINK, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  heroH1: { fontSize: 26, fontWeight: '700', color: TEXT, lineHeight: 30 },
  heroH1Accent: { fontSize: 26, fontWeight: '700', color: PINK, fontStyle: 'italic', lineHeight: 30 },
  heroLead: { color: MUTED, fontSize: 12, marginTop: 8, lineHeight: 16 },
  heroImg: { width: 130, height: 130, borderRadius: 16, backgroundColor: '#eee' },

  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 6,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  stepperLine: { width: 30, height: 1, backgroundColor: PINK, marginHorizontal: 8 },
  stepWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
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
  stepLabel: { color: MUTED, fontSize: 11 },

  card: { backgroundColor: CARD, borderRadius: 18, padding: 16, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sectionNum: {
    width: 30,
    height: 22,
    borderRadius: 11,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumText: { color: PINK, fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: TEXT },
  sectionHint: { fontSize: 11, color: MUTED, marginTop: 4 },
  counterText: { color: PINK, fontSize: 11, fontWeight: '700' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFF0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 12,
    height: 46,
  },
  input: { flex: 1, fontSize: 14, color: TEXT },

  dateRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  fieldLabel: { fontSize: 12, color: TEXT, fontWeight: '600', marginBottom: 6 },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFF0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
    gap: 8,
  },
  dateText: { flex: 1, color: TEXT, fontSize: 13 },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PINK_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  infoBannerText: { flex: 1, color: '#7A2B45', fontSize: 11 },

  textareaWrap: {
    borderWidth: 1,
    borderColor: '#EFEFF0',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    minHeight: 100,
  },
  textarea: { fontSize: 13, color: TEXT, minHeight: 60, textAlignVertical: 'top' },
  textareaCount: { position: 'absolute', right: 12, bottom: 8, fontSize: 10, color: MUTED },

  addonRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  addonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addonTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  addonBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  addonBadgeNew: { backgroundColor: PINK_SOFT },
  addonBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  addonDesc: { color: MUTED, fontSize: 11, marginTop: 2, lineHeight: 15 },
  addonLink: { color: PINK, fontSize: 11, fontWeight: '600', marginTop: 4 },

  actionBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: TEXT, fontWeight: '600', fontSize: 14 },
  continueBtn: {
    flex: 1,
    height: 50,
    borderRadius: 28,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
