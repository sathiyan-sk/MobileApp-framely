import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';

export type UploadStatus = 'uploading' | 'paused' | 'done';

export interface UploadProgress {
  total: number;
  queue: number;
  failed: number;
  finished: number;
  percent: number; // 0 - 100
  uploadedMb: number;
  totalMb: number;
  secondsLeft: number;
}

interface UploadProgressCardProps {
  status: UploadStatus;
  progress: UploadProgress;
  onPauseToggle: () => void;
  onCancel: () => void;
  onRetryFailed: () => void;
}

// Colors for each status row.
const QUEUE_COLOR = '#3B82F6';
const QUEUE_BG = '#E8F0FE';
const FAILED_COLOR = Colors.red;
const FAILED_BG = '#FDECEC';
const DONE_COLOR = Colors.green;
const DONE_BG = Colors.greenSoft;

function StatusRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  countLabel,
  countColor,
  ratio,
  barColor,
  onPress,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  countLabel: string;
  countColor: string;
  ratio: number; // 0 - 1
  barColor: string;
  onPress?: () => void;
  testID?: string;
}) {
  const RowWrapper: any = onPress ? TouchableOpacity : View;
  return (
    <RowWrapper
      style={styles.statusRow}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      testID={testID}
    >
      <View style={[styles.statusIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.statusBody}>
        <View style={styles.statusTopLine}>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={[styles.statusCount, { color: countColor }]}>{countLabel}</Text>
        </View>
        <Text style={styles.statusSub}>{subtitle}</Text>
        <View style={styles.miniTrack}>
          <View
            style={[
              styles.miniFill,
              { backgroundColor: barColor, width: `${Math.min(100, Math.max(0, ratio * 100))}%` },
            ]}
          />
        </View>
      </View>
    </RowWrapper>
  );
}

const UploadProgressCard: React.FC<UploadProgressCardProps> = ({
  status,
  progress,
  onPauseToggle,
  onCancel,
  onRetryFailed,
}) => {
  const { total, queue, failed, finished, percent, uploadedMb, totalMb, secondsLeft } = progress;
  const safeTotal = total || 1;

  const headerLabel =
    status === 'done'
      ? failed > 0
        ? 'Upload finished'
        : `Uploaded ${finished} Photos`
      : status === 'paused'
        ? 'Upload Paused'
        : `Uploading ${total} Photos`;

  return (
    <View style={styles.card} testID="upload-progress-card">
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Upload Progress</Text>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.cardHeaderLabel}>{headerLabel}</Text>
          {status !== 'done' && (
            <TouchableOpacity
              onPress={onCancel}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID="upload-cancel-icon"
            >
              <Ionicons name="close-circle" size={22} color={Colors.textFaint} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* In Queue */}
      <StatusRow
        icon="cloud-upload"
        iconColor={QUEUE_COLOR}
        iconBg={QUEUE_BG}
        title={`In Queue (${queue})`}
        subtitle="Waiting to upload"
        countLabel={`${queue} Photos`}
        countColor={QUEUE_COLOR}
        ratio={queue / safeTotal}
        barColor={QUEUE_COLOR}
        testID="upload-queue-row"
      />

      {/* Failed */}
      <StatusRow
        icon="close"
        iconColor={FAILED_COLOR}
        iconBg={FAILED_BG}
        title={`Failed (${failed})`}
        subtitle={failed > 0 ? 'Tap to retry' : 'No failures'}
        countLabel={`${failed} Photos`}
        countColor={FAILED_COLOR}
        ratio={failed / safeTotal}
        barColor={FAILED_COLOR}
        onPress={failed > 0 ? onRetryFailed : undefined}
        testID="upload-failed-row"
      />

      {/* Finished */}
      <StatusRow
        icon="checkmark"
        iconColor={DONE_COLOR}
        iconBg={DONE_BG}
        title={`Finished (${finished})`}
        subtitle="Uploaded successfully"
        countLabel={`${finished} Photos`}
        countColor={DONE_COLOR}
        ratio={finished / safeTotal}
        barColor={DONE_COLOR}
        testID="upload-finished-row"
      />

      <View style={styles.divider} />

      {/* Overall progress */}
      <View style={styles.overallTopLine}>
        <Text style={styles.overallLabel} numberOfLines={1}>
          {status === 'done' ? 'Upload complete' : `Uploading ${total} photos\u2026`}
        </Text>
        <Text style={styles.overallPercent}>{percent}%</Text>
      </View>
      <View style={styles.overallTrack}>
        <View style={[styles.overallFill, { width: `${Math.min(100, percent)}%` }]} />
      </View>

      {/* Footer line: size + control */}
      <View style={styles.overallFooter}>
        <Text style={styles.overallMeta} numberOfLines={1}>
          {status === 'done'
            ? `${totalMb.toFixed(1)} MB uploaded`
            : `${uploadedMb.toFixed(1)} MB of ${totalMb.toFixed(1)} MB \u00b7 ${secondsLeft} sec left`}
        </Text>

        {status !== 'done' && (
          <TouchableOpacity
            style={styles.pausePill}
            activeOpacity={0.85}
            onPress={onPauseToggle}
            testID="upload-pause-btn"
          >
            <Ionicons
              name={status === 'paused' ? 'play' : 'pause'}
              size={14}
              color={Colors.primary}
            />
            <Text style={styles.pausePillText}>
              {status === 'paused' ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UploadProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textDark,
    fontFamily: 'Georgia',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderLabel: {
    fontSize: 12.5,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  // Status rows
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBody: {
    flex: 1,
  },
  statusTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  statusCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
    marginBottom: 7,
  },
  miniTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.divider,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 14,
  },
  // Overall
  overallTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overallLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textDark,
    flex: 1,
    paddingRight: 10,
  },
  overallPercent: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  overallTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  overallFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  overallMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    paddingRight: 10,
  },
  pausePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.primaryFaint,
  },
  pausePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});