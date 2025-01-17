import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { removeItem } from '../services/storage';

const TopNavBar = () => {
    const navigation = useNavigation();

    const handleMenuPress = () => {
        Alert.alert(
            "Menu",
            "Select an option",
            [
                {
                    text: "View Profile",
                    onPress: () => console.log("Profile pressed"),
                },
                {
                    text: "Settings",
                    onPress: () => console.log("Settings pressed"),
                },
                {
                    text: "Sign Out",
                    onPress: async () => {
                        await removeItem('accessToken');
                        await removeItem('refreshToken');
                        navigation.navigate('SignOn');
                    },
                    style: "destructive",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    return (
        <View style={styles.appBar}>
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
    );
};

const styles = StyleSheet.create({
    appBar: {
        paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) + 30 : 10,
        height: 90,
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
});

export default TopNavBar;
