import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import { colors } from "../assets/Themes/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;

const getButtonProps = (status) => {
  switch (status) {
    case "confirmed":
      return {
        text: "start session",
        style: styles.button,
        disabled: false,
      };
    case "requested":
      return {
        text: "approve",
        style: styles.button,
        disabled: false,
      };
    case "completed":
      return {
        text: "completed",
        style: styles.buttonDisabled,
        disabled: true,
      };
    case "cancelled":
      return {
        text: "cancelled",
        style: styles.buttonDisabled,
        disabled: true,
      };
    default:
      return {
        text: "unknown",
        style: styles.buttonDisabled,
        disabled: true,
      };
  }
};

const BookingCard = ({ appointment, attendees = [] }) => {
  const buttonProps = getButtonProps(appointment.status);

  // Extract high school name from counselor or mentee profile
  const highSchoolName = attendees.find(
    (attendee) =>
      attendee.profile.highSchool &&
      (appointment.counselorId.includes(attendee._id) ||
        appointment.menteeId.includes(attendee._id))
  )?.profile.highSchool;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.contents}>
          <Text style={styles.header}>
            Upcoming session with {highSchoolName || "Unknown High School"}
          </Text>
          <View style={styles.details}>
            <Text style={styles.text}>Topic: {appointment.topicName}</Text>
            <Text style={styles.text}>
              Attendees:{" "}
              {attendees
                .map(
                  (attendee) =>
                    `${attendee.profile.firstName} ${attendee.profile.lastName}`
                )
                .join(", ")}
            </Text>
          </View>
          <View style={[styles.row, { width: "30%" }]}>
            <Ionicons name="calendar-outline" size={24}></Ionicons>
            <Text style={styles.h5}>
              {new Date(appointment.scheduledTime).toLocaleDateString()}
            </Text>
            <Ionicons name="time-outline" size={24}></Ionicons>
            <Text style={styles.h5}>
              {new Date(appointment.scheduledTime).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={buttonProps.style} disabled={buttonProps.disabled}>
            <Text style={styles.buttonText}>{buttonProps.text}</Text>
          </Pressable>
          <View style={styles.row}>
            <Pressable style={styles.buttonSecondary}>
              <View style={styles.row}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.primaryGreen}
                ></Ionicons>
                <Text style={[styles.buttonTextSecondary, { paddingLeft: 8 }]}>
                  reschedule
                </Text>
              </View>
            </Pressable>
            <Pressable style={styles.buttonSecondary}>
              <Ionicons
                name="chatbox-outline"
                size={16}
                color={colors.primaryGreen}
              ></Ionicons>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.75,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    flexDirection: "row",
  },
  contents: {
    flex: 4,
    padding: 16,
  },
  actions: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: colors.black,
  },
  details: {
    flexDirection: "column",
    paddingTop: 8,
    paddingBottom: 8,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: colors.darkGray,
    paddingBottom: 4,
  },
  h5: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: colors.black,
    paddingTop: 2,
    paddingBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primaryGreen,
  },
  buttonDisabled: {
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: colors.white,
  },
  buttonSecondary: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  buttonTextSecondary: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: colors.primaryGreen,
  },
});
