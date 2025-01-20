import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import Background from '../components/Background';

const ReviewScreen = () => {
    const route = useRoute();
    const { contentType, contentId } = route.params as {
        contentType: 'Album' | 'Track' | 'Artist' | 'Profile';
        contentId: string;
    };

    return (
        <Background>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                {/* Top Navigation Bar */}
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <TopNavBar />

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={styles.title}>Review {contentType}</Text>
                    <Text style={styles.contentId}>ID: {contentId}</Text>
                    {/* Add your review form or content here */}
                </View>

                {/* Bottom Navigation Bar */}
                <BottomNavBar />
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    contentId: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
    },
});

export default ReviewScreen;
