import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { colors } from "../assets/Themes/colors";
import { Images } from "../assets/Themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const Config = require("../config/config.json");

export default function MentorshipCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = await AsyncStorage.getItem("uid");
      const token = await AsyncStorage.getItem("token");
      const url = new URL(`${Config.apiurl}/api/users/${uid}`);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setData(userData.profile); // Make sure to set profile data correctly
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.header}>You have</Text>
        <View style={styles.line}>
          <Image source={Images.trophy} style={styles.image} />
          <Text style={styles.header}>connected with </Text>
          <Text
            style={[
              styles.header,
              { color: colors.primaryGreen, fontSize: 42, marginBottom: 10 },
            ]}
          >
            {data.connections}
          </Text>
          <Text style={styles.header}> schools</Text>
        </View>
        <View style={styles.line}>
          <Image source={Images.trophy} style={styles.image} />
          <Text style={styles.header}>reached </Text>
          <Text
            style={[
              styles.header,
              { color: colors.primaryGreen, fontSize: 42, marginBottom: 10 },
            ]}
          >
            {data.numStudents}
          </Text>
          <Text style={styles.header}> FGLI students</Text>
        </View>
        <View style={styles.line}>
          <Image source={Images.trophy} style={styles.image} />
          <Text style={styles.header}>dedicated </Text>
          <Text
            style={[
              styles.header,
              { color: colors.primaryGreen, fontSize: 42, marginBottom: 10 },
            ]}
          >
            {data.hours}
          </Text>
          <Text style={styles.header}> hours to peer mentoring</Text>
        </View>
        <Text style={styles.header}>Keep up the good work!</Text>
      </View>
      <View>
        <Image
          source={Images.mentor}
          style={{ width: windowWidth * 0.2, resizeMode: "contain" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 50,
    padding: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 50,
    minWidth: windowWidth * 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    gap: 20,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
});
