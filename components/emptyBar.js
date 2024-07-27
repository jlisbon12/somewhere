import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { Images } from "../assets/Themes";
import { useState } from "react";
import { colors } from "../assets/Themes/colors";
import { Link } from "expo-router";

export default function EmptyBar() {
  return (
    <View style={styles.barContainer}>
      <Image style={styles.logo} source={Images.logo}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    display: "flex",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
});
