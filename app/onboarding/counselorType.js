import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../assets/Themes/colors";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import EmptyBar from "../../components/emptyBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const Config = require("../../config/config.json");

export default function CounselorType() {
  const router = useRouter();

  const updateUserType = async (type) => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const token = await AsyncStorage.getItem("token");
      if (!uid) {
        console.log("uid not found");
        return;
      }
      const url = new URL(`${Config.apiurl}/api/users/updateUser`);
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, type }),
      });
      if (response.ok) {
        router.push(`/onboarding/onboarding?role=counselor&type=${type}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to store user data:", errorData);
      }
    } catch (err) {
      console.log("Error updating user type:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <EmptyBar />
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.header}>
            Please provide your organization type!
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateUserType("highSchool")}
            >
              <FontAwesome6
                name="school"
                size={44}
                color="black"
                style={styles.schoolIcon}
              />
              <Text style={styles.buttonText}>
                School, District, or Charter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateUserType("nonProfit")}
            >
              <Octicons
                name="organization"
                size={44}
                color="black"
                style={styles.buildingIcon}
              />
              <Text style={styles.buttonText}>
                Nonprofit or Community-Based Organization
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF2E9",
    justifyContent: "center",
  },
  mainContainer: {
    alignSelf: "center",
    justifyContent: "center",
    gap: 30,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 30,
    textAlign: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C8E59C",
    padding: 20,
    width: "85%",
    flexDirection: "row",
    borderRadius: 99,
    borderWidth: 2,
    borderColor: colors.white,
    height: 105,
  },
  buildingIcon: {
    marginLeft: 35,
  },
  schoolIcon: {
    marginRight: 32,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 22,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
});
