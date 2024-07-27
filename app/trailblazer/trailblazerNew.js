import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MentorshipCard from "../../components/mentorshipCard";
import BookingCard from "../../components/BookingCard";
import { colors } from "../../assets/Themes/colors";

export default function TrailblazerNew() {
  return (
    <View>
      <ScrollView style={{ paddingBottom: 100 }}>
        <MentorshipCard></MentorshipCard>
        <View style={styles.booking}>
          <Text style={styles.title}>Wee</Text>
          <View style={styles.buttonPanel}>
            <TouchableOpacity>
              <Text style={styles.buttonText}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.buttonText, { color: colors.midGray }]}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.buttonText, { color: colors.midGray }]}>
                Past
              </Text>
            </TouchableOpacity>
          </View>
          <BookingCard></BookingCard>
          <BookingCard></BookingCard>
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
  buttonText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
  },
  buttonPanel: {
    flexDirection: "row",
    gap: 20,
    marginLeft: 20,
  },
  placeholder: {},
  scrollView: {
    padding: 20,
  },
});
