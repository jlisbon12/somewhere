import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";

export default function MentorCard({ student }) {
  return (
    <View style={styles.card}>
      <Image
        source={require("../assets/default_pfp.jpg")}
        style={styles.image}
      />
      <Text style={styles.name}>{student.name}</Text>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <FontAwesome5 name="university" size={25} color="#0FA958" />
          <Text style={styles.detailText}>{student.detail1}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="graduation-cap" size={21} color="#0FA958" />
          <Text style={styles.detailText}>{student.detail2}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="home" size={22} color="#0FA958" />
          <Text style={styles.detailText}>{student.detail3}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.bookButton]}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={styles.actionText.color}
          />
          <Text style={styles.actionText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
          <FontAwesome6
            name="message"
            size={16}
            color={styles.chatButtonText.color}
          />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
    width: 250,
    height: 350,
    marginHorizontal: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#777",
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  actionButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bookButton: {
    backgroundColor: "#08962E",
  },
  chatButton: {
    backgroundColor: "#F9F9F9",
  },
  actionText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
  chatButtonText: {
    color: "#08962E",
    fontWeight: "500",
    marginLeft: 8,
  },
});
