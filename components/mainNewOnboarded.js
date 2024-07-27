import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import images from "../assets/Images/images";
import { colors } from "../assets/Themes/colors";

export default function MainNewOnboarded() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={images.mentor}></Image>
            <Text style={styles.header}>No upcoming bookings</Text>
            <Text style={styles.header}>Join the community of Trailblazers</Text>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Join</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },
    image: {
        resizeMode: "contain",
    },
    header: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: colors.black,
        padding: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        width: 110,
        height: 45,
        borderRadius: 10,
        backgroundColor: colors.primaryGreen,
    },
    buttonText: {
        fontFamily: "Inter-Regular",
        fontSize: 20,
        color: colors.white,
    },
});
  
