import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { colors } from "../assets/Themes/colors";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Config = require("../config/config.json");

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BookingForm({ user }) {
  const [mentors, setMentors] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("");
  const [topicName, setTopicName] = useState("");
  const [topicType, setTopicType] = useState("Panel");
  const [type, setType] = useState("panel");

  useEffect(() => {
    fetchUsers("mentor", setMentors);
    fetchUsers("mentee", setMentees);
  }, []);

  const fetchUsers = async (role, setUsers) => {
    try {
      const url = new URL(`${Config.apiurl}/api/users`);
      url.searchParams.append("role", role);
      const response = await fetch(url.toString());
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(`Failed to fetch ${role}s`, err);
    }
  };

  const toggleSelection = (id, selected, setSelected) => {
    setSelected((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((item) => item !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const token = await AsyncStorage.getItem("token");
      if (!uid) {
        console.log("uid not found");
        return;
      }
      const url = new URL(`${Config.apiurl}/api/appointments`);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          counselorId: uid,
          mentorIds: selectedMentors,
          menteeIds: selectedMentees,
          scheduledTime,
          duration,
          topicName,
          topicType,
          type,
        }),
      });
      if (response.ok) {
        router.push("/trailblazerDashboard"); // Navigate to the dashboard
      } else {
        const errorData = await response.json();
        console.error("Failed to create appointment:", errorData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book a Panel Discussion</Text>
      <TextInput
        style={styles.input}
        placeholder="Topic Name"
        value={topicName}
        onChangeText={setTopicName}
      />
      <TextInput
        style={styles.input}
        placeholder="Scheduled Time (e.g., 2024-07-01T14:00:00Z)"
        value={scheduledTime}
        onChangeText={setScheduledTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={duration}
        onChangeText={setDuration}
      />
      <Text style={styles.subHeader}>Select Mentors</Text>
      <FlatList
        data={mentors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.userItem,
              selectedMentors.includes(item._id) && styles.selected,
            ]}
            onPress={() =>
              toggleSelection(item._id, selectedMentors, setSelectedMentors)
            }
          >
            <Text>{`${item.profile.firstName} ${item.profile.lastName}`}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.subHeader}>Select Mentees</Text>
      <FlatList
        data={mentees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.userItem,
              selectedMentees.includes(item._id) && styles.selected,
            ]}
            onPress={() =>
              toggleSelection(item._id, selectedMentees, setSelectedMentees)
            }
          >
            <Text>{`${item.profile.firstName} ${item.profile.lastName}`}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.text, { color: "white" }]}>Book Panel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#EFF2E9",
    justifyContent: "center",
    padding: 30,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    marginBottom: 20,
  },
  subHeader: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  userItem: {
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  selected: {
    backgroundColor: colors.primaryGreen,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.primaryGreen,
    padding: 16,
    marginTop: 20,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
});
