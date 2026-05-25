import { Colors } from "@/src/constants/colors";
import { userMock } from "@/src/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


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
  const [fullName, setFullName] = useState(userMock.fullName || "Sathiya");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [studioName, setStudioName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    // Save logic here
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="edit-profile-screen">
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom + 110, 150) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            testID="back-button"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Personal Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
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
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={userMock.email}
                  editable={false}
                  placeholderTextColor={Colors.textFaint}
                />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            {/* Mobile Number */}
            <View style={styles.fieldGroup}>
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
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.textFaint}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Business Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Business Details</Text>
          </View>

          <View style={styles.card}>
            {/* Studio Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Studio Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={studioName}
                  onChangeText={setStudioName}
                  placeholder="Your Studio"
                  placeholderTextColor={Colors.textFaint}
                />
              </View>
            </View>

            {/* Industry Dropdown */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Industry</Text>
              <TouchableOpacity
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
            </View>

            {/* Events Per Year */}
            <View style={styles.fieldGroup}>
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
          </View>
        </View>
      </ScrollView>

      {/* Fixed Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
          testID="save-button"
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
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
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.5,
  },

  section: { marginTop: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },

  fieldGroup: { marginBottom: 20 },
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
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: "500",
  },
  inputTextDisabled: {
    color: Colors.textMuted,
  },
  helperText: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 6,
    marginLeft: 4,
    fontStyle: "italic",
  },

  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: "500",
  },
  dropdownPlaceholder: {
    color: Colors.textFaint,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.bgPinkSoft,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.bgPinkSoft,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 5,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
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
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
