import { StyleSheet, Text, ScrollView, View } from "react-native";
import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import SearchResults from "../../components/SearchResults";
import Recommendations from "../../components/Recommendations";
import Map from "../../components/icons/Map";

export default function counselorDashboard(props) {
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    setSearchPerformed(true);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <Text style={styles.heading}>
          Connect with Trailblazers from your community
        </Text>
        <View style={styles.mainContent}>
          <View style={styles.searchBarContainer}>
            <SearchBar />
          </View>
          <View style={styles.mapContainer}>
            <Map />
          </View>
        </View>
        {searchPerformed ? <SearchResults /> : <Recommendations />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    backgroundColor: "#F9F9F9",
    paddingTop: 60,
    paddingHorizontal: 90,
  },
  heading: {
    fontFamily: "Inter-Bold",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 20,
  },
  mapContainer: {
    flex: 1,
  },
});
