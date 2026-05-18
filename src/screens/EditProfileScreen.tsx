import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Colors } from "@/src/constants/colors";
import {
  profileMock,
  industryOptions,
  eventsPerYearOptions,
} from "@/src/constants/mockData";

export default function EditProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState(profileMock.fullName);
  const [mobileNumber, setMobileNumber] = useState(profileMock.mobileNumber);
  const [studioName, setStudioName] = useState(profileMock.studioName);
  const [industry, setIndustry] = useState(profileMock.industry);
  const [eventsPerYear, setEventsPerYear] = useState(profileMock.eventsPerYear);
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  const handleSave = () => {
    console.log("Profile saved:", {
      fullName,
      mobileNumber,
      studioName,
      industry,
      eventsPerYear,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="edit-profile-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            testID="back-button"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.textFaint}
                  testID="input-full-name"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.inputText}>{profileMock.email}</Text>
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            {/* Mobile Number */}
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="+91 00000 00000"
                  placeholderTextColor={Colors.textFaint}
                  keyboardType="phone-pad"
                  testID="input-mobile"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Business Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Business Details</Text>
          </View>

          <View style={styles.card}>
            {/* Studio Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Studio Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="home-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={studioName}
                  onChangeText={setStudioName}
                  placeholder="Your Studio Name"
                  placeholderTextColor={Colors.textFaint}
                  testID="input-studio-name"
                />
              </View>
            </View>

            {/* Industry */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Industry</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowIndustryPicker(true)}
                testID="industry-picker-button"
              >
                <Ionicons
                  name="diamond-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.inputText,
                    !industry && { color: Colors.textFaint },
                  ]}
                >
                  {industry || "Select Industry"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Events Per Year */}
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <Text style={styles.label}>Events Per Year</Text>
              <View style={styles.eventsRow}>
                {eventsPerYearOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.eventBtn,
                      eventsPerYear === option && styles.eventBtnActive,
                    ]}
                    onPress={() => setEventsPerYear(option)}
                    testID={`event-option-${option}`}
                  >
                    <Text
                      style={[
                        styles.eventBtnText,
                        eventsPerYear === option && styles.eventBtnTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          testID="save-button"
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Industry Picker Modal */}
      <Modal
        visible={showIndustryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIndustryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Industry</Text>
              <TouchableOpacity
                onPress={() => setShowIndustryPicker(false)}
                testID="close-picker"
              >
                <Ionicons name="close" size={24} color={Colors.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {industryOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setIndustry(option);
                    setShowIndustryPicker(false);
                  }}
                  testID={`industry-${option}`}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                  {industry === option && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.2,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },

  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textBody,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgPinkSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: "500",
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 11.5,
    color: Colors.primary,
    marginTop: 6,
    marginLeft: 4,
  },

  eventsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  eventBtn: {
    flex: 1,
    minWidth: "22%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  eventBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  eventBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textBody,
  },
  eventBtnTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.bgPinkSoft,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textDark,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalOptionText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: "500",
  },
});