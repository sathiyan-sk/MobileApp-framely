import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PINK = '#EC4070';
const PINK_SOFT = '#FFE3EC';
const PINK_FAINT = '#FFF1F5';
const CARD = '#FFFFFF';
const TEXT = '#1A1A1A';
const MUTED = '#8E8E93';
const BORDER = '#F1E1E7';

type Quality = 'high' | 'medium' | 'low';

// Rough per-photo size estimates (MB). Real numbers will come from the
// backend / device file metadata once the API is wired.
const PHOTO_SIZE_MB: Record<Quality, number> = {
  high: 0.76, // ≈ 18.2 MB for 24 photos to match the design
  medium: 0.45,
  low: 0.22,
};

const QUALITY_OPTIONS: { key: Quality; title: string; sub: string }[] = [
  { key: 'high', title: 'High', sub: 'Best quality' },
  { key: 'medium', title: 'Medium', sub: 'Balanced' },
  { key: 'low', title: 'Low', sub: 'Smaller size' },
];

type Props = {
  visible: boolean;
  photoCount: number;
  onClose: () => void;
  onUpload: (opts: {
    collection: string | null;
    compress: boolean;
    quality: Quality;
  }) => void;
};

export default function UploadOptionsSheet({
  visible,
  photoCount,
  onClose,
  onUpload,
}: Props) {
  const [collection, setCollection] = useState<string | null>(null);
  const [compress, setCompress] = useState(true);
  const [quality, setQuality] = useState<Quality>('high');

  const sizeMb = useMemo(() => {
    if (!compress) return (photoCount * PHOTO_SIZE_MB.high * 1.6).toFixed(1);
    return (photoCount * PHOTO_SIZE_MB[quality]).toFixed(1);
  }, [photoCount, compress, quality]);

  const qualityLabel = compress
    ? `${quality[0].toUpperCase()}${quality.slice(1)} quality selected`
    : 'Original quality (no compression)';

  const handleUpload = () => {
    onUpload({ collection, compress, quality });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        testID="upload-options-overlay"
        style={styles.overlay}
        onPress={onClose}
      >
        {/* stop the inner sheet from closing on press-through */}
        <Pressable style={styles.sheetWrap} onPress={() => {}}>
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
            <View style={styles.handle} />

            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.title}>Upload Options</Text>
              <Text style={styles.subtitle}>
                Choose your preferences before uploading
              </Text>
            </View>

            <ScrollView
              style={{ marginTop: 16 }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Add to Collection */}
              <View style={styles.card}>
                <View style={styles.folderIconBox}>
                  <Ionicons name="folder" size={20} color={PINK} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>
                    Add to Collection{' '}
                    <Text style={styles.optionalTag}>(optional)</Text>
                  </Text>
                  <Text style={styles.cardSub}>
                    Organize your photos in collections
                  </Text>
                </View>
                <TouchableOpacity
                  testID="collection-dropdown"
                  style={styles.collectionPill}
                  activeOpacity={0.7}
                  onPress={() => {
                    // TODO: open a real collection picker once available.
                  }}
                >
                  <Text style={styles.collectionPillText}>
                    {collection ?? 'No Collection'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={PINK} />
                </TouchableOpacity>
              </View>

              {/* Compress + Quality combined card */}
              <View style={[styles.card, styles.cardCol]}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={styles.cardTitle}>Compress Images</Text>
                    <Text style={styles.cardSub}>
                      Save storage by compressing images
                    </Text>
                  </View>
                  <Switch
                    testID="compress-toggle"
                    value={compress}
                    onValueChange={setCompress}
                    trackColor={{ false: '#E5E5EA', true: PINK }}
                    thumbColor="#fff"
                    ios_backgroundColor="#E5E5EA"
                  />
                </View>

                <View style={styles.divider} />

                <View style={[!compress && { opacity: 0.5 }]}>
                  <Text style={styles.cardTitle}>Compression Quality</Text>
                  <Text style={styles.cardSub}>
                    Choose the level of compression
                  </Text>

                  <View style={styles.qualityRow}>
                    {QUALITY_OPTIONS.map((opt) => {
                      const active = quality === opt.key && compress;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          testID={`quality-${opt.key}`}
                          style={[styles.qualityCard, active && styles.qualityCardActive]}
                          activeOpacity={0.85}
                          onPress={() => compress && setQuality(opt.key)}
                          disabled={!compress}
                        >
                          <Text
                            style={[
                              styles.qualityTitle,
                              active && styles.qualityTitleActive,
                            ]}
                          >
                            {opt.title}
                          </Text>
                          <Text
                            style={[
                              styles.qualitySub,
                              active && styles.qualitySubActive,
                            ]}
                          >
                            {opt.sub}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Estimated size banner */}
              <View style={styles.estimateBanner}>
                <View style={styles.pieIconBox}>
                  <Ionicons name="pie-chart" size={18} color={PINK} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.estimateTitle}>Estimated upload size</Text>
                  <Text style={styles.estimateLine}>
                    {photoCount} photos{'  '}·{'  '}
                    <Text style={styles.estimateMb}>~{sizeMb} MB total</Text>
                  </Text>
                  <Text style={styles.estimateNote}>{qualityLabel}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom action row */}
            <View style={styles.actions}>
              <TouchableOpacity
                testID="cancel-upload-btn"
                style={styles.cancelBtn}
                activeOpacity={0.85}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="confirm-upload-btn"
                style={styles.uploadBtn}
                activeOpacity={0.9}
                onPress={handleUpload}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 30, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetWrap: { width: '100%' },
  sheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    maxHeight: '88%',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D7D7DC',
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '800', color: TEXT },
  subtitle: { fontSize: 13, color: MUTED, marginTop: 4 },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  cardCol: { flexDirection: 'column', alignItems: 'stretch' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  cardSub: { fontSize: 12, color: MUTED, marginTop: 3 },
  optionalTag: { fontSize: 13, fontWeight: '500', color: MUTED },

  folderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  collectionPillText: { color: PINK, fontWeight: '700', fontSize: 13 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 14 },

  qualityRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  qualityCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: CARD,
    alignItems: 'center',
  },
  qualityCardActive: {
    borderColor: PINK,
    backgroundColor: PINK_FAINT,
  },
  qualityTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  qualityTitleActive: { color: PINK },
  qualitySub: { fontSize: 11, color: MUTED, marginTop: 2 },
  qualitySubActive: { color: PINK },

  // Estimate banner
  estimateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PINK_FAINT,
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  pieIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateTitle: { fontSize: 13, color: TEXT, fontWeight: '700' },
  estimateLine: { fontSize: 12, color: MUTED, marginTop: 2 },
  estimateMb: { color: PINK, fontWeight: '700' },
  estimateNote: { fontSize: 11, color: MUTED, marginTop: 2 },

  // Action row
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F6',
    backgroundColor: CARD,
  },
  cancelBtn: {
    paddingHorizontal: 26,
    height: 54,
    borderRadius: 28,
    backgroundColor: '#F2F2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: TEXT, fontWeight: '700', fontSize: 15 },
  uploadBtn: {
    flex: 1,
    height: 54,
    borderRadius: 28,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  uploadText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});