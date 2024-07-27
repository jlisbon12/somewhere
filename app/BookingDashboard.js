import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import BookingCard from "../components/BookingCard";
import BookingTab from "../components/bookingTab";
import { colors } from "../assets/Themes/colors";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons

export default function BookingDashboard({ user, appointments }) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    if (appointments.length > 0) {
      fetchUserProfiles();
    }
  }, [appointments]);

  const fetchUserProfiles = async () => {
    try {
      const userIds = appointments.flatMap((appointment) => [
        ...appointment.counselorId,
        ...appointment.mentorId,
        ...appointment.menteeId,
      ]);

      const uniqueUserIds = [...new Set(userIds)];
      console.log("Unique User IDs:", uniqueUserIds);

      const fetchedProfiles = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const url = `/api/users/${userId}`;
            console.log("Fetching profile for URL:", url);

            const response = await fetch(url);
            if (response.ok) {
              const profile = await response.json();
              console.log("Fetched Profile:", profile);
              return profile;
            } else {
              console.error(
                `Error fetching profile for user ID ${userId}:`,
                response.statusText
              );
              return null;
            }
          } catch (error) {
            console.error(
              `Error fetching profile for user ID ${userId}:`,
              error
            );
            return null;
          }
        })
      );

      setUserProfiles(fetchedProfiles.filter((profile) => profile));
      console.log("Fetched Profiles:", fetchedProfiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  const filterAppointments = (status) => {
    return appointments.filter((appointment) => {
      const matchUserId =
        appointment.counselorId.includes(user._id) ||
        appointment.mentorId.includes(user._id) ||
        appointment.menteeId.includes(user._id);

      return appointment.status === status && matchUserId;
    });
  };

  const getAttendees = (ids) => {
    return ids
      .map((id) => userProfiles.find((profile) => profile._id === id))
      .filter((user) => user);
  };

  const renderNoBookings = () => (
    <View style={styles.noBookingContainer}>
      <Ionicons name="calendar-outline" size={50} color={colors.midGray} />
      <Text style={styles.noBookingText}>No bookings found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BookingTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {activeTab === "upcoming" &&
          (filterAppointments("confirmed").length > 0
            ? filterAppointments("confirmed").map((appointment) => (
                <BookingCard
                  key={appointment._id}
                  appointment={appointment}
                  attendees={[
                    ...getAttendees(appointment.counselorId),
                    ...getAttendees(appointment.mentorId),
                    ...getAttendees(appointment.menteeId),
                  ]}
                />
              ))
            : renderNoBookings())}
        {activeTab === "pending" &&
          (filterAppointments("requested").length > 0
            ? filterAppointments("requested").map((appointment) => (
                <BookingCard
                  key={appointment._id}
                  appointment={appointment}
                  attendees={[
                    ...getAttendees(appointment.counselorId),
                    ...getAttendees(appointment.mentorId),
                    ...getAttendees(appointment.menteeId),
                  ]}
                />
              ))
            : renderNoBookings())}
        {activeTab === "past" &&
          (filterAppointments("completed").length > 0
            ? filterAppointments("completed").map((appointment) => (
                <BookingCard
                  key={appointment._id}
                  appointment={appointment}
                  attendees={[
                    ...getAttendees(appointment.counselorId),
                    ...getAttendees(appointment.mentorId),
                    ...getAttendees(appointment.menteeId),
                  ]}
                />
              ))
            : renderNoBookings())}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBackground,
  },
  scrollView: {
    padding: 20,
  },
  noBookingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noBookingText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: colors.midGray,
    marginTop: 10,
  },
});
