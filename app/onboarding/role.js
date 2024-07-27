// role.js
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../assets/Themes/colors";
import EmptyBar from "../../components/emptyBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Counseling from "../../components/icons/Counseling";
const windowWidth = Dimensions.get("window").width;
const Config = require("../../config/config.json");

export default function Role() {
  const router = useRouter();
  const updateUserRole = async (role) => {
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
        body: JSON.stringify({ uid, role }), // include role in the request body
      });
      if (response.ok) {
        if (role === "counselor") {
          router.push("/onboarding/counselorType");
        } else {
          router.push({
            pathname: "/onboarding/onboarding",
            params: { role },
          });
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to store user data:", errorData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <EmptyBar />
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.header}>Hello👋 What brings you here?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateUserRole("counselor")}
            >
              <Counseling />
              <Text style={styles.buttonText}>
                I'm a counselor/administrator
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateUserRole("mentor")}
            >
              <Text style={styles.buttonText}>I'm a college student</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>
            We are creating a national network of first-gens to uplift one
            another through community and mentorship
          </Text>
          <Text style={[styles.text, { textAlign: "right" }]}>
            ––Trailblazer
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF2E9",
    justifyContent: "center",
  },
  mainContainer: {
    marginTop: windowWidth * 0.1,
    alignSelf: "center",
    justifyContent: "center",
    gap: 30,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C8E59C",
    padding: 10,
    width: "85%",
    height: 105,
    aspectRatio: 1,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: colors.white,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 22,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 50,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    width: windowWidth * 0.2 * 2 + 50,
  },
});
