// availability.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { colors } from "../../assets/Themes/colors";
import EmptyBar from "../../components/emptyBar";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
const Config = require("../../config/config.json");

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeZones = [
  { label: "Pacific Standard Time (PST) UTC-8", value: "PST" },
  { label: "Mountain Standard Time (MST) UTC-7", value: "MST" },
  { label: "Central Standard Time (CST) UTC-6", value: "CST" },
  { label: "Eastern Standard Time (EST) UTC-5", value: "EST" },
];

export default function Availability() {
  const router = useRouter();
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day,
      startTime: "",
      startPeriod: "AM",
      endTime: "",
      endPeriod: "PM",
      isAvailable: true,
    }))
  );
  const [openStartPeriod, setOpenStartPeriod] = useState({});
  const [openEndPeriod, setOpenEndPeriod] = useState({});
  const [timeZone, setTimeZone] = useState(null);
  const [openTimeZone, setOpenTimeZone] = useState(false);

  const handleTimeChange = (day, key, value) => {
    let correctedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    if (correctedValue.length === 3 && correctedValue.indexOf(":") === -1) {
      correctedValue =
        correctedValue.slice(0, -2) + ":" + correctedValue.slice(-2); // Add colon before the last two characters
    } else if (
      correctedValue.length === 4 &&
      correctedValue.indexOf(":") === -1
    ) {
      correctedValue =
        correctedValue.slice(0, -2) + ":" + correctedValue.slice(-2); // Add colon before the last two characters
    }
    // Limit the time input to 12:59 maximum
    if (correctedValue.length === 5) {
      let [hours, minutes] = correctedValue.split(":");
      if (parseInt(hours, 10) > 12) {
        hours = "12";
      }
      if (parseInt(minutes, 10) > 59) {
        minutes = "59";
      }
      correctedValue = `${hours}:${minutes}`;
    }
    setAvailability((prevState) =>
      prevState.map((item) =>
        item.day === day ? { ...item, [key]: correctedValue } : item
      )
    );
  };

  const handlePeriodChange = (day, key, value) => {
    setAvailability((prevState) =>
      prevState.map((item) =>
        item.day === day ? { ...item, [key]: value } : item
      )
    );
  };

  const handleToggleAvailability = (day) => {
    setAvailability((prevState) =>
      prevState.map((item) =>
        item.day === day ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleSubmit = async () => {
    const filteredAvailability = availability
      .filter((item) => item.isAvailable && item.startTime && item.endTime)
      .map((item) => ({
        day: item.day,
        startTime: `${item.startTime} ${item.startPeriod}`,
        endTime: `${item.endTime} ${item.endPeriod}`,
      }));

    if (!timeZone) {
      Alert.alert("Error", "Please select your time zone.");
      return;
    }

    if (filteredAvailability.length < 1) {
      Alert.alert(
        "Error",
        "Please enter valid times for at least one day or toggle the days off."
      );
      return;
    }

    try {
      const uid = await AsyncStorage.getItem("uid");
      const token = await AsyncStorage.getItem("token");
      if (!uid || !token) {
        console.log("UID or token not found");
        return;
      }

      const url = `${Config.apiurl}/api/users/updateUser`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid,
          availability: filteredAvailability,
          timeZone,
        }),
      });

      if (response.ok) {
        const role = await AsyncStorage.getItem("role"); // Retrieve the user role
        if (role === "counselor") {
          router.push("/counselor/counselorDashboard");
        } else if (role === "trailblazer") {
          router.push("/trailblazer/trailblazerDashboard");
        } else {
          router.push("/"); // Default to home page
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to store availability:", errorData);
        if (response.status === 403) {
          Alert.alert(
            "Error",
            "Unauthorized: Invalid token or insufficient permissions."
          );
        } else {
          Alert.alert(
            "Error",
            `Failed to update availability: ${errorData.message}`
          );
        }
      }
    } catch (err) {
      console.log("Error submitting availability:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <EmptyBar />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/onboarding/onboarding")}
      >
        <Ionicons name="chevron-back" size={24} color={colors.primaryGreen} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Set Your Availability</Text>
        <View style={styles.timeZoneContainer}>
          <Text style={styles.timeZoneLabel}>
            Select your time zone <Text style={styles.required}>*</Text>:
          </Text>
          <DropDownPicker
            open={openTimeZone}
            value={timeZone}
            items={timeZones}
            setOpen={setOpenTimeZone}
            setValue={setTimeZone}
            containerStyle={styles.timeZonePickerContainer}
            style={styles.timeZonePicker}
            dropDownContainerStyle={styles.timeZoneDropDown}
            placeholder="Select your time zone"
            zIndex={2000}
            zIndexInverse={1000}
          />
        </View>
        <View style={styles.gridContainer}>
          {availability.map((item, index) => (
            <View key={item.day} style={[styles.row, { zIndex: 1000 - index }]}>
              <View style={styles.dayContainer}>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <Switch
                    value={item.isAvailable}
                    onValueChange={() => handleToggleAvailability(item.day)}
                    trackColor={{ false: "#767577", true: colors.primaryGreen }}
                    thumbColor={item.isAvailable ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
                {item.isAvailable && (
                  <View style={styles.timeInputWrapper}>
                    <View style={styles.timeInputContainer}>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="Start Time"
                        value={item.startTime}
                        onChangeText={(text) =>
                          handleTimeChange(item.day, "startTime", text)
                        }
                        keyboardType="numeric"
                      />
                      <DropDownPicker
                        open={openStartPeriod[item.day]}
                        value={item.startPeriod}
                        items={[
                          { label: "AM", value: "AM" },
                          { label: "PM", value: "PM" },
                        ]}
                        setOpen={(value) =>
                          setOpenStartPeriod((prev) => ({
                            ...prev,
                            [item.day]: value,
                          }))
                        }
                        setValue={(callback) =>
                          handlePeriodChange(
                            item.day,
                            "startPeriod",
                            callback()
                          )
                        }
                        containerStyle={styles.periodPickerContainer}
                        style={styles.periodPicker}
                        dropDownContainerStyle={styles.periodDropDown}
                        zIndex={1000 - index}
                        zIndexInverse={1000}
                      />
                    </View>
                    <View style={styles.timeInputContainer}>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="End Time"
                        value={item.endTime}
                        onChangeText={(text) =>
                          handleTimeChange(item.day, "endTime", text)
                        }
                        keyboardType="numeric"
                      />
                      <DropDownPicker
                        open={openEndPeriod[item.day]}
                        value={item.endPeriod}
                        items={[
                          { label: "AM", value: "AM" },
                          { label: "PM", value: "PM" },
                        ]}
                        setOpen={(value) =>
                          setOpenEndPeriod((prev) => ({
                            ...prev,
                            [item.day]: value,
                          }))
                        }
                        setValue={(callback) =>
                          handlePeriodChange(item.day, "endPeriod", callback())
                        }
                        containerStyle={styles.periodPickerContainer}
                        style={styles.periodPicker}
                        dropDownContainerStyle={styles.periodDropDown}
                        zIndex={1000 - index}
                        zIndexInverse={1000}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="checkmark" size={24} color={colors.white} />
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF2E9",
  },
  contentContainer: {
    justifyContent: "flex-start",
  },
  backButton: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 8,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    fontWeight: 300,
    color: colors.primaryGreen,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    marginHorizontal: 500,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  timeZoneContainer: {
    marginBottom: 20,
    width: "100%",
    zIndex: 2000,
  },
  timeZoneLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    marginBottom: 10,
  },
  required: {
    color: "red",
  },
  timeZonePickerContainer: {
    width: "100%",
  },
  timeZonePicker: {
    backgroundColor: "white",
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  timeZoneDropDown: {
    backgroundColor: "white",
    borderColor: colors.lightGray,
  },
  gridContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
  },
  dayContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dayTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dayText: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    marginRight: 10,
  },
  availabilityContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  timeInputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    zIndex: 1,
    width: "48%",
  },
  timeInput: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 6,
    width: "60%",
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  periodPickerContainer: {
    width: "40%",
    zIndex: 100,
  },
  periodPicker: {
    backgroundColor: "white",
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  periodDropDown: {
    backgroundColor: "white",
    borderColor: colors.lightGray,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 22,
    fontWeight: 300,
    color: "white",
  },
  listContent: {
    flexGrow: 1,
  },
});
