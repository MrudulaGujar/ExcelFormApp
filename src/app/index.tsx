import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // =========================
  // SAVE EMPLOYEE DATA
  // =========================
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }

    if (!employeeId.trim()) {
      Alert.alert("Validation Error", "Please enter your Employee ID.");
      return;
    }

    if (!department.trim()) {
      Alert.alert("Validation Error", "Please enter your department.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.post(
        "http://10.227.132.72:5001/api/employees",
        {
          name: name.trim(),
          employeeId: employeeId.trim(),
          department: department.trim(),
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Employee data saved successfully."
        );

        // Clear form after successful save
        setName("");
        setEmployeeId("");
        setDepartment("");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to save data."
        );
      }
    } catch (error) {
      console.error("Save error:", error);

      Alert.alert(
        "Connection Error",
        "Could not connect to the backend server."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // DOWNLOAD / OPEN PDF
  // =========================
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);

      const pdfUrl =
        "http://10.227.132.72:5001/api/employees/pdf?t=${Date.now()}";

      const supported = await Linking.canOpenURL(pdfUrl);

      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert(
          "Error",
          "Unable to open the employee PDF."
        );
      }
    } catch (error) {
      console.error("PDF error:", error);

      Alert.alert(
        "Error",
        "Could not open the employee PDF."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          {/* TITLE */}
          <Text style={styles.title}>
            Employee Form
          </Text>

          <Text style={styles.subtitle}>
            Enter employee details below
          </Text>

          {/* NAME */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              placeholderTextColor="#999999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* EMPLOYEE ID */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Employee ID
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Employee ID"
              placeholderTextColor="#999999"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="characters"
            />
          </View>

          {/* DEPARTMENT */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Department
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Department"
              placeholderTextColor="#999999"
              value={department}
              onChangeText={setDepartment}
              autoCapitalize="words"
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              isSaving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isSaving ? "SAVING..." : "SAVE"}
            </Text>
          </TouchableOpacity>

          {/* DOWNLOAD PDF BUTTON */}
          <TouchableOpacity
            style={[
              styles.pdfButton,
              isDownloading && styles.buttonDisabled,
            ]}
            onPress={handleDownloadPDF}
            disabled={isDownloading}
            activeOpacity={0.8}
          >
            <Text style={styles.pdfButtonText}>
              {isDownloading
                ? "OPENING PDF..."
                : "DOWNLOAD PDF"}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111827",
  },

  // SAVE BUTTON
  button: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  // PDF BUTTON
  pdfButton: {
    height: 52,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  pdfButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});

