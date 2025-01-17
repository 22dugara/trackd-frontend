import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

const ProfileBlurb = ({ username, fullName, reviews, friends, profilePicture }) => {
    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                {/* Profile Picture */}
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />

                {/* User Details */}
                <View style={styles.details}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.fullName}>{fullName}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{reviews}</Text>
                            <Text style={styles.statLabel}>REVIEWS</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{friends}</Text>
                            <Text style={styles.statLabel}>FRIENDS</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        margin: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5', // Ensures shadow visibility
        ...Platform.select({
            ios: {
                shadowColor: '#CCCCCC', // Bright yellow for testing
                shadowOffset: { width: 6, height: 6 }, // Larger offset for visibility
                shadowOpacity: 1, // Fully visible shadow
                shadowRadius: 8, // Larger blur
            },
            android: {
                elevation: 10, // High elevation for Android shadow
                shadowColor: '#CCCCCC', // Bright yellow for testing
            },
        }),
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0056b3',
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align stats closer
        marginTop: 10,
    },
    stat: {
        alignItems: 'center',
        marginRight: 30, // Space between reviews and friends
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
    },
});

export default ProfileBlurb;
