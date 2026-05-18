import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/src/constants/colors";
import {
  brandingMock,
  watermarkPositions,
  watermarkSizes,
  WatermarkPosition,
  WatermarkSize,
} from "@/src/constants/mockData";

export default function BrandingScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(brandingMock.enabled);
  const [logoUri, setLogoUri] = useState<string | null>(brandingMock.logoUri);
  const [position, setPosition] = useState<WatermarkPosition>(
    brandingMock.position,
  );
  const [size, setSize] = useState<WatermarkSize>(brandingMock.size);
  const [opacity, setOpacity] = useState<number>(brandingMock.opacity);
  const [marginH, setMarginH] = useState<number>(brandingMock.marginH);
  const [marginV, setMarginV] = useState<number>(brandingMock.marginV);

  const pickLogo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      if (!perm.canAskAgain && Platform.OS !== "web") {
        Alert.alert(
          "Permission needed",
          "Allow photo access from Settings to upload a studio logo.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
          ],
        );
      }
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const positionLabel =
    watermarkPositions.find((p) => p.id === position)?.label ?? "Top Left";
  const sizeLabel = watermarkSizes.find((s) => s.id === size)?.label ?? "Medium";

  const handleSave = () => {
    // Production: POST to /api/branding with payload below.
    const payload = {
      enabled,
      logoUri,
      position,
      size,
      opacity,
      marginH,
      marginV,
    };
    Alert.alert("Branding saved", JSON.stringify(payload, null, 2));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="branding-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            testID="branding-back"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
            testID="branding-save"
          >
            <Ionicons name="save-outline" size={16} color={Colors.primary} />
            <Text style={styles.saveBtnText}>Save Branding</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Branding & Theme</Text>
        <Text style={styles.subtitle}>
          Customize your own branding and watermark
        </Text>

        {/* 1. Enable watermark */}
        <View style={styles.card}>
          <NumBadge n={1} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Enable Watermark</Text>
            <Text style={styles.cardSub}>Apply to all new uploads</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: "#EAD3DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            testID="watermark-toggle"
          />
        </View>

        {/* 2. Studio Logo */}
        <View style={styles.cardBlock}>
          <View style={styles.blockHeader}>
            <NumBadge n={2} />
            <Text style={styles.cardTitle}>Studio Logo</Text>
          </View>

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.85}
            onPress={pickLogo}
            testID="logo-upload"
          >
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.uploadedLogo} />
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.uploadTitle}>Upload Studio Logo</Text>
                <Text style={styles.uploadHint}>
                  {brandingMock.logoSpec.format}
                </Text>
                <Text style={styles.uploadHint}>
                  Recommended size: {brandingMock.logoSpec.recommendedSize}
                </Text>
                <Text style={styles.uploadMax}>
                  Max {brandingMock.logoSpec.maxSizeMb}MB
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeLogoBtn}
            onPress={pickLogo}
            activeOpacity={0.85}
            testID="change-logo"
          >
            <Ionicons name="pencil-outline" size={14} color={Colors.primary} />
            <Text style={styles.changeLogoText}>Change Logo</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Live Preview */}
        <View style={styles.cardBlock}>
          <View style={styles.blockHeader}>
            <NumBadge n={3} />
            <View>
              <Text style={styles.cardTitle}>Live Preview</Text>
              <Text style={styles.cardSub}>Updates instantly</Text>
            </View>
          </View>

          <View style={styles.previewWrap}>
            <Image
              source={{ uri: brandingMock.previewImage }}
              style={styles.previewImage}
            />
            <View
              style={[
                styles.previewWatermark,
                wmPositionStyle(position, marginH, marginV),
                { opacity: opacity / 100 },
              ]}
            >
              {logoUri ? (
                <Image
                  source={{ uri: logoUri }}
                  style={[
                    styles.wmLogo,
                    size === "small" && { width: 18, height: 18 },
                    size === "large" && { width: 32, height: 32 },
                  ]}
                />
              ) : (
                <Ionicons name="rose" size={size === "small" ? 14 : size === "large" ? 22 : 18} color={Colors.primary} />
              )}
              <Text
                style={[
                  styles.wmText,
                  size === "small" && { fontSize: 9 },
                  size === "large" && { fontSize: 13 },
                ]}
                numberOfLines={1}
              >
                {brandingMock.studioName}
              </Text>
            </View>
          </View>

          <View style={styles.previewMetaRow}>
            <Text style={styles.previewMeta}>
              Position: <Text style={styles.previewMetaValue}>{positionLabel}</Text>
            </Text>
            <Text style={styles.previewMeta}>
              Size: <Text style={styles.previewMetaValue}>{sizeLabel}</Text>
            </Text>
            <Text style={styles.previewMeta}>
              Opacity: <Text style={styles.previewMetaValue}>{opacity}%</Text>
            </Text>
          </View>
        </View>

        {/* 4. Watermark position grid */}
        <View style={styles.cardBlock}>
          <View style={styles.blockHeader}>
            <NumBadge n={4} />
            <Text style={styles.cardTitle}>Watermark Position</Text>
          </View>

          <View style={styles.posGrid}>
            {watermarkPositions.map((p) => {
              const active = p.id === position;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.posCell, active && styles.posCellActive]}
                  onPress={() => setPosition(p.id)}
                  activeOpacity={0.85}
                  testID={`position-${p.id}`}
                >
                  {active ? (
                    <View style={styles.posCellDot} />
                  ) : null}
                  <Ionicons
                    name="contract-outline"
                    size={16}
                    color={active ? Colors.primary : Colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.posLabel,
                      active && { color: Colors.primary, fontWeight: "700" },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Watermark options */}
        <View style={styles.cardBlock}>
          <View style={styles.blockHeader}>
            <NumBadge n={5} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Watermark Options</Text>
            </View>
            <Ionicons
              name="options-outline"
              size={18}
              color={Colors.primary}
            />
          </View>

          {/* Size segmented */}
          <Text style={styles.optLabel}>Size</Text>
          <View style={styles.segment}>
            {watermarkSizes.map((s) => {
              const active = s.id === size;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.segmentItem, active && styles.segmentActive]}
                  onPress={() => setSize(s.id)}
                  activeOpacity={0.85}
                  testID={`size-${s.id}`}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sliders */}
          <SliderRow
            label="Opacity"
            value={opacity}
            suffix="%)"
            onChange={setOpacity}
            min={0}
            max={100}
            testID="slider-opacity"
          />
          <SliderRow
            label="Horizontal Margin"
            value={marginH}
            suffix="%)"
            onChange={setMarginH}
            min={0}
            max={20}
            testID="slider-margin-h"
          />
          <SliderRow
            label="Vertical Margin"
            value={marginV}
            suffix="%)"
            onChange={setMarginV}
            min={0}
            max={20}
            testID="slider-margin-v"
          />
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
          <Text style={styles.noteText}>
            <Text style={styles.noteHead}>Note: </Text>
            {brandingMock.note}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Small subcomponents ──────────────────────────────────────────────────────

const NumBadge = ({ n }: { n: number }) => (
  <View style={styles.numBadge}>
    <Text style={styles.numBadgeText}>{n}</Text>
  </View>
);

type SliderRowProps = {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
  testID?: string;
};

const SliderRow = ({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
  testID,
}: SliderRowProps) => {
  const pct = ((value - min) / (max - min)) * 100;
  const stepDown = () => onChange(Math.max(min, value - (max - min) / 20));
  const stepUp = () => onChange(Math.min(max, value + (max - min) / 20));
  return (
    <View style={styles.sliderRow} testID={testID}>
      <View style={styles.sliderHead}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>
          {Math.round(value)}
          {suffix}
        </Text>
      </View>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${pct}%` }]} />
        <View style={[styles.sliderThumb, { left: `${pct}%` }]} />
      </View>
      <View style={styles.sliderBtnRow}>
        <TouchableOpacity onPress={stepDown} style={styles.stepBtn} testID={`${testID}-down`}>
          <Ionicons name="remove" size={14} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stepUp} style={styles.stepBtn} testID={`${testID}-up`}>
          <Ionicons name="add" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Map watermark position → absolute style on the preview image.
const wmPositionStyle = (
  pos: WatermarkPosition,
  marginH: number,
  marginV: number,
) => {
  const h = `${marginH}%` as const;
  const v = `${marginV}%` as const;
  switch (pos) {
    case "top-left":
      return { top: v, left: h };
    case "top-center":
      return { top: v, alignSelf: "center" as const };
    case "top-right":
      return { top: v, right: h };
    case "mid-left":
      return { top: "45%" as const, left: h };
    case "center":
      return { top: "45%" as const, alignSelf: "center" as const };
    case "mid-right":
      return { top: "45%" as const, right: h };
    case "bottom-left":
      return { bottom: v, left: h };
    case "bottom-center":
      return { bottom: v, alignSelf: "center" as const };
    case "bottom-right":
      return { bottom: v, right: h };
  }
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 16 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  saveBtnText: { color: Colors.primary, fontWeight: "700", fontSize: 13 },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.7,
    marginTop: 14,
    fontFamily: "Georgia",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 6,
  },
  cardBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15.5, fontWeight: "700", color: Colors.textDark },
  cardSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },

  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  numBadgeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },

  uploadBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    backgroundColor: Colors.bgPinkSoft,
    paddingVertical: 22,
    alignItems: "center",
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadTitle: { fontWeight: "700", color: Colors.textDark, fontSize: 14 },
  uploadHint: { color: Colors.textMuted, fontSize: 11.5, marginTop: 2 },
  uploadMax: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 11.5,
    marginTop: 6,
  },
  uploadedLogo: { width: 110, height: 110, borderRadius: 10 },

  changeLogoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 10,
  },
  changeLogoText: { color: Colors.primary, fontWeight: "700", fontSize: 13 },

  previewWrap: {
    width: "100%",
    height: 130,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F4DCE3",
  },
  previewImage: { width: "100%", height: "100%" },
  previewWatermark: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  wmLogo: { width: 24, height: 24, borderRadius: 4 },
  wmText: { color: Colors.textDark, fontWeight: "700", fontSize: 11 },

  previewMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 8,
  },
  previewMeta: { color: Colors.textMuted, fontSize: 11.5 },
  previewMetaValue: { color: Colors.primary, fontWeight: "700" },

  posGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  posCell: {
    width: "31%",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: Colors.divider,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  posCellActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaint,
  },
  posCellDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 8,
    right: 8,
  },
  posLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
    marginTop: 4,
  },

  optLabel: {
    color: Colors.textBody,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 8,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F1E1E7",
    borderRadius: 22,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: Colors.primary },
  segmentText: { color: Colors.textBody, fontWeight: "600", fontSize: 13 },
  segmentTextActive: { color: "#FFFFFF", fontWeight: "700" },

  sliderRow: { marginTop: 18 },
  sliderHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderLabel: { color: Colors.textBody, fontWeight: "500", fontSize: 13 },
  sliderValue: { color: Colors.textDark, fontWeight: "700", fontSize: 13 },
  sliderTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primarySoft,
    marginTop: 8,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  sliderThumb: {
    position: "absolute",
    top: -5,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sliderBtnRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
  },

  noteCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FFE6EE",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  noteText: { flex: 1, color: Colors.primary, fontSize: 12, lineHeight: 17 },
  noteHead: { fontWeight: "800" },
});