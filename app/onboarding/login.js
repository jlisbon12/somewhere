import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { colors } from "../../assets/Themes/colors";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        return "The password is too weak.";
      case "auth/requires-recent-login":
        return "This operation is sensitive and requires recent authentication. Please log in again.";
      case "auth/invalid-credential":
        return "Incorrect email or password. Please try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        router.replace("/trailblazer/trailblazerDashboard");
      })
      .catch((err) => {
        setErrMsg(convertErrorMessage(err.code));
        console.log(err.code);
      });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrMsg("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setErrMsg("Password reset email sent.");
    } catch (err) {
      setErrMsg(convertErrorMessage(err.code));
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Welcome Back!</Text>
        <View style={styles.formField}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.midGray}
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
              }}
              secureTextEntry={!showPassword}
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
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.errMessage}>{errMsg ? errMsg : ""}</Text>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.signUp}>
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => props.toggleSignUp(true)}>
            <Text style={[styles.text, { color: colors.primaryGreen }]}>
              Sign Up
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
  labelText: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primaryGreen,
    fontFamily: "Inter-Regular",
  },
});
