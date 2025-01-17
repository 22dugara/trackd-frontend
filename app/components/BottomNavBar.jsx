import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.bottomNav}>
            {/* Navigate to Home */}
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Home')}
            >
                <MaterialIcons name="chat-bubble-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Navigate to Discover */}
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Discover')}
            >
                <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>

            {/* Navigate to Review */}
            <View style={styles.addButtonWrapper}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Review')}
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Navigate to YourLists */}
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('YourLists')}
            >
                <Entypo name="list" size={24} color="white" />
            </TouchableOpacity>

            {/* Navigate to Profile */}
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Profile')}
            >
                <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingHorizontal: 20,
    },
    navButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        width: 60,
        height: 60,
        borderRadius: 30,
        zIndex: 10,
        elevation: 5,
    },
});

export default BottomNavBar;
