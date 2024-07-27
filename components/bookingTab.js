import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from "../assets/Themes/colors";

// const BookingTab = ({ activeTab, setActiveTab }) => (
//     <View style={styles.tabsContainer}>
//         {['Upcoming', 'Pending', 'Past'].map((tab) => (
//             <TouchableOpacity key={tab} onPress={() => setActiveTab(tab.toLowerCase())} style={styles.tab}>
//                 <Text style={styles.tabText}>{tab}</Text>
//             </TouchableOpacity>
//         ))}
//     </View>
// );

const BookingTab = ({ activeTab, setActiveTab }) => {
    return (
        <View style={styles.tabsContainer}>
         {/* <View style={styles.buttonPanel}> */}
            <TouchableOpacity onPress={() => setActiveTab('upcoming')}>
                <Text style={[styles.tabText,
                    { color: activeTab === 'upcoming' ? colors.black : colors.midGray }
                ]}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('pending')}>
                <Text style={[styles.tabText,
                    { color: activeTab === 'pending' ? colors.black : colors.midGray }
                ]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('past')}>
                <Text style={[styles.tabText, 
                    { color: activeTab === 'past' ? colors.black : colors.midGray }
                ]}>Past</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 30,
    },
    tabText: {
        fontFamily: "Inter-Bold",
        fontSize: 18,
    },
});

export default BookingTab;
