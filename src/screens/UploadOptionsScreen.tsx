import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

type QualityKey = 'high' | 'medium' | 'low';

const QUALITY_OPTIONS: { key: QualityKey; label: string; sub: string; factor: number }[] = [
  { key: 'high', label: 'High', sub: 'Best quality', factor: 0.758 },
  { key: 'medium', label: 'Medium', sub: 'Balanced', factor: 0.45 },
  { key: 'low', label: 'Low', sub: 'Smaller size', factor: 0.25 },
];

interface UploadOptionsSheetProps {
  visible: boolean;
  photoCount: number;
  onClose: () => void;
}

export const UploadOptionsSheet: React.FC<UploadOptionsSheetProps> = ({
  visible,
  photoCount,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [compress, setCompress] = useState(true);
  const [quality, setQuality] = useState<QualityKey>('high');

  const activeQuality =
    QUALITY_OPTIONS.find((q) => q.key === quality) ?? QUALITY_OPTIONS[0];
  const estimatedMb = (photoCount * (compress ? activeQuality.factor : 1.1)).toFixed(1);
  const qualityLabel = compress ? activeQuality.label : 'Original';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
          onPress={() => {}}
        >
          {/* Grab handle */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.title}>Upload Options</Text>
          <Text style={styles.subtitle}>Choose your preferences before uploading</Text>

          {/* Add to collection */}
          <TouchableOpacity
            style={styles.collectionCard}
            activeOpacity={0.85}
            testID="add-to-collection"
          >
            <View style={styles.collectionIcon}>
              <Ionicons name="folder-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.collectionTitle}>Add to Collection (optional)</Text>
              <Text style={styles.collectionSub}>Organize your photos in collections</Text>
            </View>
            <View style={styles.collectionRight}>
              <Text style={styles.collectionValue}>No Collection</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Compress + quality */}
          <View style={styles.compressCard}>
            <View style={styles.compressRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.compressTitle}>Compress Images</Text>
                <Text style={styles.compressSub}>Save storage by compressing images</Text>
              </View>
              <Switch
                value={compress}
                onValueChange={setCompress}
                trackColor={{ false: '#E5E5EA', true: Colors.primary }}
                thumbColor={Colors.white}
                testID="compress-toggle"
              />
            </View>

            {compress && (
              <>
                <View style={styles.divider} />
                <Text style={styles.compressTitle}>Compression Quality</Text>
                <Text style={styles.compressSub}>Choose the level of compression</Text>

                <View style={styles.qualityRow}>
                  {QUALITY_OPTIONS.map((opt) => {
                    const active = quality === opt.key;
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        style={[styles.qualityOption, active && styles.qualityOptionActive]}
                        activeOpacity={0.85}
                        onPress={() => setQuality(opt.key)}
                        testID={`quality-${opt.key}`}
                      >
                        <Text style={[styles.qualityLabel, active && styles.qualityLabelActive]}>
                          {opt.label}
                        </Text>
                        <Text style={[styles.qualitySub, active && styles.qualitySubActive]}>
                          {opt.sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* Estimated size banner */}
          <View style={styles.estimateBanner}>
            <View style={styles.estimateIcon}>
              <Ionicons name="pie-chart" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.estimateLabel}>Estimated upload size</Text>
              <Text style={styles.estimateValue}>
                {photoCount} photos {'\u00b7'}{' '}
                <Text style={styles.estimateValueAccent}>~{estimatedMb} MB total</Text>
              </Text>
              <Text style={styles.estimateHint}>{qualityLabel} quality selected</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.85}
              onPress={onClose}
              testID="upload-cancel-btn"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={0.9}
              onPress={onClose}
              testID="upload-confirm-btn"
            >
              <Ionicons name="cloud-upload-outline" size={18} color={Colors.white} />
              <Text style={styles.confirmText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8D8DE',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textDark,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 13.5,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  // Collection
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  collectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textDark,
  },
  collectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  collectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  collectionValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  // Compress
  compressCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginTop: 14,
  },
  compressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  compressSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
  },
  qualityRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  qualityOption: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  qualityOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaint,
  },
  qualityLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  qualityLabelActive: {
    color: Colors.primary,
  },
  qualitySub: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 3,
  },
  qualitySubActive: {
    color: Colors.primary,
  },
  // Estimate
  estimateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryFaint,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    gap: 12,
  },
  estimateIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateLabel: {
    fontSize: 13,
    color: Colors.textBody,
    fontWeight: '500',
  },
  estimateValue: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '600',
    marginTop: 2,
  },
  estimateValueAccent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  estimateHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 28,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.textDark,
  },
  confirmBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});