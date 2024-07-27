import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Images } from "../assets/Themes";
import { colors } from "../assets/Themes/colors";
import { router } from "expo-router";
import ProfilePicture from "./ProfilePicture";

export default function MainBar(props) {
  const user = props.user;

  const renderButton = () => {
    return (
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.login]}
          onPress={() => props.toggleSignUp(false)}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signup]}
          onPress={() => props.toggleSignUp(true)}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Images.logo} />
      {props.isLoggedIn ? (
        <ProfilePicture userId={user._id} height={50} width={50} />
      ) : (
        renderButton()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.bar,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 20,
  },
  profileImage: {
    display: "flex",
    maxHeight: "100%",
    maxWidth: "100%",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    fontFamily: "Inter",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    color: colors.white,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },
  login: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primaryGreen,
    color: colors.black,
  },
  signup: { borderWidth: 2, borderColor: colors.primaryGreen },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
