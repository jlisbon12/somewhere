import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import BookingTab from "../../components/bookingTab";
import MentorshipCard from "../../components/mentorshipCard";
import BookingCard from "../../components/BookingCard";
import { colors } from "../../assets/Themes/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Config = require("../../config/config.json");
const statusMapping = {
  upcoming: "confirmed",
  pending: "requested",
  completed: "completed",
  cancelled: "cancelled",
};

export default function TrailblazerDashboard(props) {
  const user = props.user;
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const userId = user._id;
      const role = user.role;
      const url = new URL(`${Config.apiurl}/api/appointments`);
      url.searchParams.append("userId", userId);
      url.searchParams.append("role", role);
      const status = statusMapping[activeTab];
      if (status) {
        url.searchParams.append("status", status);
      }
      const response = await fetch(url.toString());
      const data = await response.json();

      const normalizedAppointments = data.map((appointment) => ({
        ...appointment,
        counselorId: appointment.counselorId || [],
        mentorId: appointment.mentorId || [],
        menteeId: appointment.menteeId || [],
      }));

      setAppointments(normalizedAppointments);
      fetchUserProfiles(normalizedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  const fetchUserProfiles = async (appointments) => {
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
            const url = `${Config.apiurl}/api/users/${userId}`;
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <MentorshipCard />
        <View style={styles.booking}>
          <Text style={styles.title}>Your Booking</Text>
          <View>
            <BookingTab activeTab={activeTab} setActiveTab={setActiveTab} />
            {filterAppointments(statusMapping[activeTab]).length > 0 ? (
              filterAppointments(statusMapping[activeTab]).map(
                (appointment) => (
                  <BookingCard
                    key={appointment._id}
                    appointment={appointment}
                    attendees={[
                      ...getAttendees(appointment.counselorId),
                      ...getAttendees(appointment.mentorId),
                      ...getAttendees(appointment.menteeId),
                    ]}
                  />
                )
              )
            ) : (
              <View style={styles.noBookingContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={50}
                  color={colors.midGray}
                />
                <Text style={styles.noBookingText}>No bookings found</Text>
              </View>
            )}
          </View>
          {user.role === "counselor" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/bookingForm")}
            >
              <Text style={styles.buttonText}>Book a Panel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: colors.mainBackground,
  },
  booking: {
    flexDirection: "column",
    gap: 20,
    margin: 20,
    marginLeft: 50,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
  },
  placeholder: {},
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "white",
  },
});
