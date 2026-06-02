import { Colors } from "@/src/constants/colors";
import { userMock } from "@/src/constants/mockData";
import { useScroll } from "@/src/context/ScrollContext";
import { useContentInsets } from "@/src/hooks/useContentInsets";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INDUSTRIES = [
  "Photography",
  "Videography",
  "Event Planning",
  "Wedding Planning",
  "Corporate Events",
  "Other",
];

const EVENTS_PER_YEAR = ["1-5", "5-10", "25-50", "50+"];

export default function EditProfileScreen() {
  const router = useRouter();
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets();
  const [fullName, setFullName] = useState(userMock.fullName || "Sathiya");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [studioName, setStudioName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string | null>(null);

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="edit-profile-screen">
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: contentBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            testID="back-button"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Personal Details Section */}
        <View style={styles.card} testID="personal-details-card">
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={18}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              testID="full-name-input"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textFaint}
            />
          </View>

          {/* Email Address */}
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputWrapper, styles.inputDisabled]}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              testID="email-input"
              style={[styles.input, styles.inputTextDisabled]}
              value={userMock.email}
              editable={false}
              placeholderTextColor={Colors.textFaint}
            />
          </View>
          <Text style={styles.helperText}>Email cannot be changed</Text>

          {/* Mobile Number */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="call-outline"
              size={18}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              testID="mobile-input"
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              placeholderTextColor={Colors.textFaint}
            />
          </View>
        </View>

        {/* Business Details Section */}
        <View style={[styles.card, { marginTop: 16 }]} testID="business-details-card">
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Business Details</Text>
          </View>

          {/* Studio Name */}
          <Text style={styles.label}>Studio Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="home-outline"
              size={18}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              testID="studio-name-input"
              style={styles.input}
              value={studioName}
              onChangeText={setStudioName}
              placeholder="Your Studio"
              placeholderTextColor={Colors.textFaint}
            />
          </View>

          {/* Industry Dropdown */}
          <Text style={styles.label}>Industry</Text>
          <TouchableOpacity
            testID="industry-dropdown"
            style={styles.inputWrapper}
            onPress={() => setShowIndustryDropdown(!showIndustryDropdown)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <Text
              style={[
                styles.dropdownText,
                !selectedIndustry && styles.dropdownPlaceholder,
              ]}
            >
              {selectedIndustry || "Select Industry"}
            </Text>
            <Ionicons
              name={showIndustryDropdown ? "chevron-up" : "chevron-down"}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          {showIndustryDropdown && (
            <View style={styles.dropdown}>
              {INDUSTRIES.map((industry) => (
                <TouchableOpacity
                  key={industry}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedIndustry(industry);
                    setShowIndustryDropdown(false);
                  }}
                  testID={`industry-option-${industry}`}
                >
                  <Text style={styles.dropdownItemText}>{industry}</Text>
                  {selectedIndustry === industry && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Events Per Year */}
          <Text style={styles.label}>Events Per Year</Text>
          <View style={styles.chipContainer}>
            {EVENTS_PER_YEAR.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.chip,
                  selectedEvents === range && styles.chipActive,
                ]}
                onPress={() => setSelectedEvents(range)}
                activeOpacity={0.7}
                testID={`events-chip-${range}`}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedEvents === range && styles.chipTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Save Button — inside ScrollView so it's never hidden behind the bottom nav */}
        <View style={styles.saveButtonWrapper}>
          <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          testID="save-button"
        >
          <LinearGradient
            colors={["#EC407A", "#FF7EB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPinkSoft,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 20,
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
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textBody,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 16,
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: "500",
  },
  inputTextDisabled: {
    color: Colors.textMuted,
  },
  helperText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 4,
    fontStyle: "italic",
  },

  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: "500",
  },
  dropdownPlaceholder: {
    color: Colors.textFaint,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: -8,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: "500",
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#EEEEEE",
  },
  chipActive: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },

  saveButtonWrapper: {
    marginTop: 24,
    marginBottom: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});