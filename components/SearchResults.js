import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import MentorCard from "./MentorCard";

const searchResults = [
  {
    image: "https://via.placeholder.com/60",
    name: "Alex Sanchez",
    detail1: "Sophomore at Stanford University",
    detail2: "Chemical Engineering",
    detail3: "Hometown at El Cajon, CA",
  },
];

export default function SearchResults() {
  const scrollViewRef = React.useRef(null);

  const scrollLeft = () => {
    scrollViewRef.current.scrollTo({ x: -250, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current.scrollTo({ x: 250, animated: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Results</Text>
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={scrollLeft} style={styles.arrow}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          {searchResults.map((student, index) => (
            <MentorCard key={index} student={student} />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={scrollRight} style={styles.arrow}>
          <ChevronRight size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    alignItems: "center",
  },
});
