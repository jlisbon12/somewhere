import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Search, ChevronDown, Calendar, Clock } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export function SearchBar() {
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchFieldContainer}>
          <Text style={styles.fieldLabel}>College, Major</Text>
          <View style={styles.searchField}>
            <Search size={24} color="black" />
            <TextInput style={styles.input} placeholder="Search" />
          </View>
        </View>
        <View style={styles.searchFieldContainer}>
          <Text style={styles.fieldLabel}>Topic</Text>
          <View style={styles.searchField}>
            <TextInput style={styles.input} placeholder="All Topics" />
            <ChevronDown size={24} color="black" />
          </View>
        </View>
      </View>
      <View style={styles.dateTime}>
        <Text style={styles.fieldLabel}>Available Date and Time</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTimeField}
          >
            <Calendar size={24} color="black" />
            <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.dateTimeField}
          >
            <Clock size={24} color="black" />
            <Text style={styles.dateTimeText}>
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>search</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 50,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchFieldContainer: {
    flex: 1,
    marginRight: 10,
  },
  fieldLabel: {
    marginBottom: 5,
    fontFamily: "Inter-Bold",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E8E8E1",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
  dateTime: {
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeField: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E8E8E1",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  dateTimeText: {
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFF",
    fontFamily: "Inter-Bold",

    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SearchBar;
