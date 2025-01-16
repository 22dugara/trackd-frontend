import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useUser } from '../context/userContext';
import { useNavigation } from '@react-navigation/native';
import { getItem, removeItem } from '../services/storage';

type HomeScreenNavigationProp = {
    navigate: (screen: string) => void;
};

const HomeScreen = () => {
    const { username } = useUser(); // Get the username from the UserContext
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleMenuPress = () => {
        Alert.alert(
            "Menu",
            "Select an option",
            [
                {
                    text: "View Profile",
                    onPress: () => console.log("Profile pressed")
                },
                {
                    text: "Settings",
                    onPress: () => console.log("Settings pressed")
                },
                {
                    text: "Sign Out",
                    onPress: async () => {
                        await removeItem('accessToken');
                        await removeItem('refreshToken');
                        navigation.navigate('SignOn');
                    },
                    style: "destructive"
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {/* Set StatusBar style */}
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Top Navigation Bar */}
            <View style={[styles.appBar]}>
                <Text style={styles.title}>trackd</Text>
                <View style={styles.appBarIcons}>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleMenuPress}>
                        <Entypo name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <MaterialIcons name="chat-bubble-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.addButtonWrapper}>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add" size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.navButton}>
                    <Entypo name="list" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="person-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background
    },
    appBar: {
        paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) + 30 : 10, // Add extra padding for iOS
        height: 90, // Reduce height to balance the extra padding
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    appBarIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomNav: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between', // Evenly space all items
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingHorizontal: 20, // Ensure spacing on edges
    },
    navButton: {
        flex: 1, // Each icon takes up equal space
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonWrapper: {
        flex: 1, // Ensures equal spacing for the green button
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30, // Adds vertical space to "lift" the button slightly
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Green
        width: 60,
        height: 60,
        borderRadius: 30, // Circle shape
        zIndex: 10,
        elevation: 5, // Adds shadow (optional, mainly for Android)
    },
});

export default HomeScreen;
