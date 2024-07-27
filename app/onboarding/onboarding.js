// onboarding.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../assets/Themes/colors";
import { Images } from "../../assets/Themes";
import EmptyBar from "../../components/emptyBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebaseConfig";
const Config = require("../../config/config.json");

export default function Onboarding() {
  const { role, type } = useLocalSearchParams();
  const router = useRouter();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCollegeType, setSelectedCollegeType] = useState([]);
  const [universityQuery, setUniversityQuery] = useState("");
  const [otherInterest, setOtherInterest] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUri, setProfilePictureUri] = useState(null);

  const professionalInterests = [
    "Tech",
    "Finance",
    "Entrepreneurship",
    "Consulting",
    "Government/Nonprofit",
    "Arts, Media & Entertainment",
    "Law/Policy",
    "Medicine/Health Sciences",
  ];

  const collegeTypes = [
    "Public College",
    "Private College",
    "Historically Black College and University (HBCU)",
    "Hispanic-Serving Institution (HSI)",
    "Tribal College and University (TCU)",
    "Liberal Arts",
    "Ivy League",
    "Single-Sex",
    "Military Academies",
    "Faith-Based",
    "Community College",
    "Technical and Vocational Schools",
  ];

  useEffect(() => {
    if (role === "counselor" && type === "highSchool") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        highSchool: "",
        district: "",
      }));
    } else if (role === "counselor" && type === "nonProfit") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        organization: "",
      }));
    } else if (role === "mentor") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        highSchool: "",
        university: "",
        major: "",
        interests: [],
        collegeType: [],
        connections: 0,
        numStudents: 0,
        hours: 0,
      }));
    }
  }, [role, type]);

  const handleInputChange = (key, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const fetchCityState = async (zipCode) => {
    setLoading(true);
    try {
      const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        setProfile((prevProfile) => ({
          ...prevProfile,
          city: place["place name"],
          state: place["state abbreviation"],
        }));
      }
    } catch (error) {
      console.log("Error fetching city and state:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async (query) => {
    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${query}`
      );
      const data = await response.json();
      setUniversities(
        data.map((uni) => ({ name: uni.name, domain: uni.domains[0] }))
      );
    } catch (error) {
      console.log("Error fetching universities:", error);
    }
  };

  const handleZipCodeChange = (text) => {
    handleInputChange("zipCode", text);
    if (text.length === 5) {
      fetchCityState(text);
    }
  };

  const handleUniversityChange = (text) => {
    setUniversityQuery(text);
    if (text.length >= 3) {
      fetchUniversities(text);
    } else {
      setUniversities([]);
    }
  };

  const toggleInterestSelection = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prevSelectedInterests) =>
        prevSelectedInterests.filter((t) => t !== interest)
      );
    } else if (selectedInterests.length < 3) {
      setSelectedInterests((prevSelectedInterests) => [
        ...prevSelectedInterests,
        interest,
      ]);
    } else {
      Alert.alert(
        "Limit Reached",
        "You can select up to 3 professional interests."
      );
    }
  };

  const handleAddOtherInterest = () => {
    if (otherInterest && !selectedInterests.includes(otherInterest)) {
      if (selectedInterests.length < 3) {
        setSelectedInterests((prevSelectedInterests) => [
          ...prevSelectedInterests,
          otherInterest,
        ]);
        setOtherInterest("");
      } else {
        Alert.alert(
          "Limit Reached",
          "You can select up to 3 professional interests."
        );
      }
    }
  };

  const toggleCollegeTypeSelection = (collegeType) => {
    setSelectedCollegeType((prevSelectedCollegeType) => {
      if (prevSelectedCollegeType.includes(collegeType)) {
        return prevSelectedCollegeType.filter((t) => t !== collegeType);
      } else {
        return [...prevSelectedCollegeType, collegeType];
      }
    });
  };

  const handleProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize / (1024 * 1024); // convert to MB
      if (fileSize < 5) {
        Alert.alert("File too small", "Profile picture must be at least 5MB.");
        return;
      }
      setProfilePicture(result.assets[0]);
      setProfilePictureUri(result.assets[0].uri);
    }
  };

  const uploadProfilePictureToFirebase = async () => {
    if (!profilePicture) return null;
    try {
      const response = await fetch(profilePicture.uri);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `profilePictures/${profilePicture.uri.split("/").pop()}`
      );
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture to Firebase", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const token = await AsyncStorage.getItem("token");
      if (!uid) {
        console.log("uid not found");
        return;
      }

      const profilePictureURL = await uploadProfilePictureToFirebase();
      const profileData = {
        ...profile,
        interests: selectedInterests,
        collegeType: selectedCollegeType,
        profilePicture: profilePictureURL,
      };
      const url = new URL(`${Config.apiurl}/api/users/updateUser`);
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, profile: profileData }),
      });
      if (response.ok) {
        router.push("/onboarding/availability");
      } else {
        const errorData = await response.json();
        console.error("Failed to store user data:", errorData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <EmptyBar />
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Tell us more about you...</Text>
          <View style={styles.pictureAndNamesContainer}>
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity onPress={handleProfilePicture}>
                {profilePictureUri ? (
                  <Image
                    source={{ uri: profilePictureUri }}
                    style={styles.profilePicture}
                  />
                ) : (
                  <View style={styles.profilePicturePlaceholder}>
                    <Ionicons name="image" size={62} color={colors.midGray} />
                    <Text style={styles.profilePicturePlaceholderText}>
                      Upload Profile Picture
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.namesContainer}>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={colors.midGray}
                  value={profile.firstName || ""}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={colors.midGray}
                  value={profile.lastName || ""}
                  onChangeText={(text) => handleInputChange("lastName", text)}
                />
              </View>
              {role === "mentor" && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    High School <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="High School Name"
                    placeholderTextColor={colors.midGray}
                    value={profile.highSchool || ""}
                    onChangeText={(text) =>
                      handleInputChange("highSchool", text)
                    }
                  />
                </View>
              )}

              <View style={styles.cityAndState}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Zip Code <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="#####"
                    placeholderTextColor={colors.midGray}
                    keyboardType="numeric"
                    maxLength={5}
                    value={profile.zipCode || ""}
                    onChangeText={handleZipCodeChange}
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.city || ""}
                    placeholderTextColor={colors.midGray}
                    editable={false}
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.state || ""}
                    placeholderTextColor={colors.midGray}
                    editable={false}
                  />
                </View>
              </View>
            </View>
          </View>

          {role === "mentor" && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>University</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter the university you attend"
                  placeholderTextColor={colors.midGray}
                  value={universityQuery}
                  onChangeText={handleUniversityChange}
                />
                {universities.length > 0 && universityQuery.length >= 3 && (
                  <FlatList
                    data={universities}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleInputChange("university", item.name);
                          setUniversityQuery(item.name);
                          setUniversities([]);
                        }}
                      >
                        <Text style={styles.autocompleteText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.autocompleteContainer}
                  />
                )}
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Major</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your major"
                  placeholderTextColor={colors.midGray}
                  value={profile.major || ""}
                  onChangeText={(text) => handleInputChange("major", text)}
                />
              </View>
            </>
          )}
          {role === "counselor" && type === "highSchool" && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>School District/System</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your school district/system"
                  placeholderTextColor={colors.midGray}
                  value={profile.district || ""}
                  onChangeText={(text) => handleInputChange("district", text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>High School (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your high school name"
                  placeholderTextColor={colors.midGray}
                  value={profile.highSchool || ""}
                  onChangeText={(text) => handleInputChange("highSchool", text)}
                />
              </View>
            </>
          )}
          {role === "counselor" && type === "nonProfit" && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Organization</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your organization name"
                placeholderTextColor={colors.midGray}
                value={profile.organization || ""}
                onChangeText={(text) => handleInputChange("organization", text)}
              />
            </View>
          )}
          {role === "mentor" && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Professional Interests (Select up to 3)
                </Text>
                <FlatList
                  data={professionalInterests.concat(
                    selectedInterests.filter(
                      (interest) => !professionalInterests.includes(interest)
                    )
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.interestItem,
                        selectedInterests.includes(item)
                          ? styles.selectedInterest
                          : {},
                      ]}
                      onPress={() => toggleInterestSelection(item)}
                    >
                      <Text
                        style={[
                          styles.interestText,
                          selectedInterests.includes(item)
                            ? styles.selectedInterestText
                            : {},
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedInterests.includes(item) && (
                        <Ionicons
                          name="close"
                          size={22}
                          color="white"
                          onPress={() => toggleInterestSelection(item)}
                          style={styles.deselectIcon}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  numColumns={2}
                  style={styles.interestContainer}
                  contentContainerStyle={styles.interestContentContainer}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Other (please specify)"
                  placeholderTextColor={colors.midGray}
                  value={otherInterest}
                  onChangeText={setOtherInterest}
                  onSubmitEditing={handleAddOtherInterest}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  What's special about your college?
                </Text>
                <FlatList
                  data={collegeTypes}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.interestItem,
                        selectedCollegeType.includes(item)
                          ? styles.selectedInterest
                          : {},
                      ]}
                      onPress={() => toggleCollegeTypeSelection(item)}
                    >
                      <Text
                        style={[
                          styles.interestText,
                          selectedCollegeType.includes(item)
                            ? styles.selectedInterestText
                            : {},
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedCollegeType.includes(item) && (
                        <Ionicons
                          name="close"
                          size={16}
                          color="white"
                          onPress={() => toggleCollegeTypeSelection(item)}
                          style={styles.deselectIcon}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  numColumns={2}
                  style={styles.interestContainer}
                  contentContainerStyle={styles.interestContentContainer}
                />
              </View>
            </>
          )}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={[styles.buttonText, { color: "white" }]}>Next</Text>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/onboarding/role")}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
              <Text style={[styles.buttonText, { color: "white" }]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageDisplay}>
          <Image source={Images.mentor} style={styles.image} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF2E9",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 2,
    marginRight: 20,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 36,
    marginBottom: 20,
  },
  cityAndState: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pictureAndNamesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePictureContainer: {
    marginRight: 20,
  },
  profilePicture: {
    width: 300,
    height: 300,
    borderRadius: 990,
  },
  profilePicturePlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 990,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
  },
  profilePicturePlaceholderText: {
    color: colors.midGray,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 22,
  },
  namesContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    marginBottom: 5,
  },
  required: {
    color: "red",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    fontSize: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  button: {
    flexDirection: "row",
    backgroundColor: colors.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: "row",
    backgroundColor: colors.midGray,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    fontWeight: 600,
    color: "white",
  },
  autocompleteContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.midGray,
    marginTop: 5,
    maxHeight: 150,
  },
  autocompleteText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  interestContainer: {
    marginVertical: 10,
  },
  interestContentContainer: {
    paddingHorizontal: 10,
  },
  interestItem: {
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  selectedInterest: {
    backgroundColor: colors.primaryGreen,
  },
  interestText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  selectedInterestText: {
    color: "white",
  },
  deselectIcon: {
    marginLeft: 5,
  },
  imageDisplay: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  buttons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
});
