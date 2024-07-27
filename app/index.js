import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import MainBar from "../components/mainBar";
import { colors } from "../assets/Themes/colors";
import SideBar from "../components/sideBar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import TrailblazerDashboard from "./trailblazer/trailblazerDashboard";
import CounselorDashboard from "./counselor/counselorDashboard";
import Authentication from "../components/auth/authentication";
import { auth } from "../services/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BookingDashboard from "./BookingDashboard";

const Config = require("../config/config.json");

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [onSignUp, setOnSignUp] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/Fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/Fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          const url = new URL(`${Config.apiurl}/api/users/${user.uid}`);
          fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Error connecting to the database.");
              }
            })
            .then((data) => {
              console.log("Fetched User Data: ", data); // Debugging statement
              setUser({ ...data, token });
              setIsLoggedIn(true);
              fetchAppointments(data._id, data.role, token);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
  }, []);

  const fetchAppointments = async (userId, role, token) => {
    const url = new URL(`${Config.apiurl}/api/appointments`);
    url.searchParams.append("userId", userId);
    url.searchParams.append("role", role);
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const normalizedAppointments = data.map((appointment) => ({
      ...appointment,
      counselorId: appointment.counselorId || [],
      mentorId: appointment.mentorId || [],
      menteeId: appointment.menteeId || [],
    }));
    setAppointments(normalizedAppointments);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const renderDisplay = () => {
    switch (selectedTab) {
      case "Home":
        if (user?.role === "counselor") {
          return <CounselorDashboard user={user} />;
        } else if (user?.role === "mentor") {
          return <TrailblazerDashboard user={user} />;
        }
        break;
      case "Booking":
        return <BookingDashboard user={user} appointments={appointments} />;
      default:
        return null;
    }
  };

  const toggleSignUp = (isOnSignUp) => {
    setOnSignUp(isOnSignUp);
  };

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <MainBar
        isLoggedIn={isLoggedIn}
        toggleSignUp={toggleSignUp}
        user={user}
      />
      {user ? (
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <SideBar setSelectedTab={setSelectedTab} user={user} />
          </View>
          <View style={styles.main}>{renderDisplay()} </View>
        </View>
      ) : (
        <Authentication
          handleLogin={handleLogin}
          onSignUp={onSignUp}
          toggleSignUp={toggleSignUp}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBackground,
  },
  content: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    flex: 1,
    maxWidth: 250,
    borderRightWidth: 1,
    borderRightColor: "#EEF2E9",
  },
  main: {
    flex: 4,
    flexDirection: "column",
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
  scrollView: {
    padding: 20,
  },
});
