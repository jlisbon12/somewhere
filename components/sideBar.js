import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../assets/Themes/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth, signOut } from "firebase/auth";
import ProfilePicture from "./ProfilePicture";

export default function SideBar(props) {
  const user = props.user;
  const [selected, setSelected] = useState("Home");
  const auth = getAuth();

  const handleClick = (selected) => {
    setSelected(selected);
    props.setSelectedTab(selected);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Logout successfully.");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <ProfilePicture userId={user._id} />
        <Text style={styles.name}>
          {user.profile.firstName} {user.profile.lastName}
        </Text>
        <TouchableOpacity style={styles.buttonText}>
          View Profile
        </TouchableOpacity>
      </View>
      <View style={styles.navBar}>
        <View style={styles.navBarTop}>
          <TouchableOpacity
            style={styles.navComponent}
            onPress={() => handleClick("Home")}
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={selected === "Home" ? colors.primaryGreen : colors.midGray}
            />
            <Text
              style={[
                styles.tabTitle,
                { color: selected === "Home" ? colors.black : colors.midGray },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navComponent}
            onPress={() => handleClick("Booking")}
          >
            <Ionicons
              name="calendar-clear-outline"
              size={24}
              color={
                selected === "Booking" ? colors.primaryGreen : colors.midGray
              }
            />
            <Text
              style={[
                styles.tabTitle,
                {
                  color: selected === "Booking" ? colors.black : colors.midGray,
                },
              ]}
            >
              Booking
            </Text>
          </TouchableOpacity>
          <View style={[styles.navComponent, styles.disabledComponent]}>
            <Ionicons name="grid-outline" size={24} color={colors.midGray} />
            <Text style={[styles.tabTitle, { color: colors.midGray }]}>
              Network
            </Text>
            <View style={styles.comingSoonOverlay}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
          <View style={[styles.navComponent, styles.disabledComponent]}>
            <Ionicons name="chatbox-outline" size={24} color={colors.midGray} />
            <Text style={[styles.tabTitle, { color: colors.midGray }]}>
              Message
            </Text>
            <View style={styles.comingSoonOverlay}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 25,
  },
  profile: {
    gap: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: colors.midGray,
  },
  navBar: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navBarTop: {
    flexDirection: "column",
    gap: 18,
  },
  navComponent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tabTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
  },
  logoutButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "white",
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    color: colors.white,
  },
  disabledComponent: {
    position: "relative",
    opacity: 0.6,
  },
  comingSoonOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  comingSoonText: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    color: colors.primaryGreen,
    textTransform: "uppercase",
  },
});
