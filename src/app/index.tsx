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
} from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export default function HomeScreen() {
  const [candidateName, setCandidateName] = useState("");
  const [candidateNumber, setCandidateNumber] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // SAVE CANDIDATE DATA
  // =========================
  const handleSave = async () => {
    // Candidate Name validation
    if (!candidateName.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter candidate name."
      );
      return;
    }

    // Candidate Number validation
    if (!candidateNumber.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter candidate number."
      );
      return;
    }

    // Mobile Number validation
    if (!mobileNo.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter mobile number."
      );
      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.post(
        "http://10.239.211.72:5001/api/candidates",
        {
          candidateName: candidateName.trim(),
          candidateNumber: candidateNumber.trim(),
          mobileNo: mobileNo.trim(),
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Candidate data saved successfully."
        );

        // Clear form after successful save
        setCandidateName("");
        setCandidateNumber("");
        setMobileNo("");
      } else {
        Alert.alert(
          "Error",
          response.data.message ||
            "Failed to save candidate data."
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

  const handleDownloadExcel = async () => {
  try {
    const response = await fetch(
      "http://10.239.211.72:5001/api/download-excel"
    );

    if (!response.ok) {
      throw new Error("Failed to download Excel file.");
    }

    const blob = await response.blob();

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64data = reader.result?.toString().split(",")[1];

        if (!base64data) {
          throw new Error("Failed to read Excel file.");
        }

        const fileUri =
          FileSystem.documentDirectory + "Candidate_Info.xlsx";

        await FileSystem.writeAsStringAsync(
  fileUri,
  base64data,
  {
    encoding: FileSystem.EncodingType.Base64,
  }
);

Alert.alert(
  "Download Complete",
  "Candidate_Info.xlsx has been downloaded successfully.",
  [
    {
      text: "Open / Share",
      onPress: async () => {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Open Candidate Excel",
          });
        }
      },
    },
    {
      text: "OK",
      style: "cancel",
    },
  ]
);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Download Candidate Excel",
          });
        } else {
          Alert.alert(
            "Success",
            "Excel file downloaded successfully."
          );
        }
      } catch (error) {
        console.error("File save error:", error);

        Alert.alert(
          "Error",
          "Could not save the Excel file."
        );
      }
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Download error:", error);

    Alert.alert(
      "Download Error",
      "Could not download the Excel file."
    );
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          {/* TITLE */}
          <Text style={styles.title}>
            Candidate Form
          </Text>

          <Text style={styles.subtitle}>
            Enter candidate details below
          </Text>

          {/* CANDIDATE NAME */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Candidate Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Candidate Name"
              placeholderTextColor="#999999"
              value={candidateName}
              onChangeText={setCandidateName}
              autoCapitalize="words"
            />
          </View>

          {/* CANDIDATE NUMBER */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Candidate Number
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Candidate Number"
              placeholderTextColor="#999999"
              value={candidateNumber}
              onChangeText={setCandidateNumber}
              autoCapitalize="characters"
            />
          </View>

          {/* MOBILE NUMBER */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Mobile No.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#999999"
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="phone-pad"
              maxLength={10}
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

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadExcel}
          >
            <Text style={styles.downloadButtonText}>
              Download Excel
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
  downloadButton: {
  backgroundColor: "#2e7d32",
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 15,
},

downloadButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
});

