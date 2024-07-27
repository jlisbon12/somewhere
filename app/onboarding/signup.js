import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import { colors } from "../../assets/Themes/colors";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, router } from "expo-router";
import { auth } from "../../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
const Config = require("../../config/config.json");

const windowWidth = Dimensions.get("window").width;

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const convertErrorMessage = (err) => {
    switch (err) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-disabled":
        return "The user corresponding to the given email has been disabled.";
      case "auth/user-not-found":
        return "There is no user corresponding to the given email.";
      case "auth/wrong-password":
        return "The password is invalid for the given email.";
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled.";
      case "auth/weak-password":
        return "The password is too weak. Password should contain at least 6 characters.";
      case "auth/requires-recent-login":
        return "This operation is sensitive and requires recent authentication. Please log in again.";
      case "auth/invalid-credential":
        return "Incorrect email or password. Please try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const isValidOrgEmail = (email) => {
    const forbiddenDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      // Add more personal email domains if needed
    ];
    const allowedTlds = ["edu", "org", "com"];
    const domain = email.split("@")[1];
    if (!domain) return false;
    const topLevelDomain = domain.split(".").pop();
    return (
      !forbiddenDomains.includes(domain) && allowedTlds.includes(topLevelDomain)
    );
  };

  const handleSignUp = async () => {
    if (!isValidOrgEmail(email)) {
      setErrMsg("Please use an organizational or educational email address.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const userInfo = {
        uid: user.uid,
        email: user.email,
        profile: {
          email: user.email,
        },
      };
      await AsyncStorage.setItem("uid", user.uid);
      await AsyncStorage.setItem("token", token);
      const url = new URL(`${Config.apiurl}/api/users/addUser`);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      });
      if (response.ok) {
        router.push("/onboarding/role");
      } else {
        const errorData = await response.json();
        console.error("Failed to store user data:", errorData);
        setErrMsg(
          `Failed to store user data: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (err) {
      setErrMsg(convertErrorMessage(err.code));
      console.log(err);
    }
  };

  const passwordGuidelines = [
    { rule: "At least 6 characters", test: (password) => password.length >= 6 },
    {
      rule: "At least 1 uppercase letter",
      test: (password) => /[A-Z]/.test(password),
    },
    { rule: "At least 1 number", test: (password) => /\d/.test(password) },
    {
      rule: "At least 1 special character",
      test: (password) => /[!@#$%^&*]/.test(password),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Sign Up</Text>
        <View style={styles.formField}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.midGray}
            inputMode="email-address"
            onChangeText={(text) => {
              setEmail(text);
              setErrMsg("");
            }}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.labelText}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.midGray}
              onChangeText={(text) => {
                setPassword(text);
                setErrMsg("");
                setShowGuidelines(true);
              }}
              secureTextEntry={!showPassword}
              onFocus={() => setShowGuidelines(true)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.midGray}
              />
            </TouchableOpacity>
          </View>
          {showGuidelines && (
            <View style={styles.guidelines}>
              {passwordGuidelines.map((guideline, index) => (
                <View style={styles.guidelineItem} key={index}>
                  <Icon
                    name={
                      guideline.test(password)
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={guideline.test(password) ? "green" : "red"}
                  />
                  <Text
                    style={{
                      color: guideline.test(password) ? "green" : "red",
                      marginLeft: 10,
                    }}
                  >
                    {guideline.rule}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.errMessage}>{errMsg ? errMsg : ""}</Text>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text
            style={[styles.text, { color: colors.white, textAlign: "center" }]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.signUp}>
          <Text style={styles.text}>Already have an account?</Text>
          <TouchableOpacity onPress={() => props.toggleSignUp(false)}>
            <Text style={[styles.text, { color: colors.primaryGreen }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: colors.mainBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    display: "flex",
    backgroundColor: colors.white,
    borderRadius: 20,
    width: windowWidth / 2.5,
    paddingVertical: 60,
    paddingHorizontal: 60,
    justifyContent: "center",
    gap: 30,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 30,
    alignSelf: "center",
  },
  input: {
    backgroundColor: colors.lightGray,
    height: 40,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  button: {
    fontFamily: "Inter-Regular",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    color: colors.white,
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "white",
  },
  formField: {
    display: "flex",
    gap: 15,
  },
  signUp: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  labelText: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
  },
  errMessage: {
    fontFamily: "Inter-Regular",
    color: "red",
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 5,
  },
  eyeIcon: {
    padding: 10,
  },
  guidelines: {
    marginTop: 10,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  forgotPassword: {
    marginTop: 10,
    alignSelf: "center",
  },
});
