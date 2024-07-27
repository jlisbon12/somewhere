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
import SignUp from "../../app/onboarding/signup";
import { useEffect, useState } from "react";
import Login from "../../app/onboarding/login";
const windowWidth = Dimensions.get("window").width;

export default function Authentication(props) {
  return (
    <View style={{ display: "flex", flex: 1 }}>
      {props.onSignUp ? (
        <SignUp toggleSignUp={props.toggleSignUp} />
      ) : (
        <Login toggleSignUp={props.toggleSignUp} />
      )}
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
    font: "Inter",
    paddingVertical: 60,
    paddingHorizontal: 60,
    justifyContent: "center",
    gap: 30,
  },
  header: {
    font: "Inter-Bold",
    fontSize: 30,
    alignSelf: "center",
  },
  input: {
    backgroundColor: colors.lightGray,
    height: 40,
    padding: 10,
    borderRadius: 5,
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
    width: "100px",
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Inter-Bold",
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
});
