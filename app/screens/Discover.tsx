import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/userContext';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import Background from '../components/Background';
import SearchBar from '../components/Search'; // Import the SearchBar component

const DiscoverScreen = () => {
    const { username } = useUser();

    const handleSearch = (query: string) => {
        // Handle search logic here in the future
        console.log(query);
    };

    return (
        <Background>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <TopNavBar />

                {/* Main Content */}
                <View style={{ flex: 1, width: '100%' }}>
                    {/* Search Bar with top margin */}
                    <View style={{ marginTop: 20 }}>
                        <SearchBar />
                    </View>
                </View>

                {/* Ensure BottomNavBar stays at the bottom */}
                <View style={{ zIndex: 1 }}>
                    <BottomNavBar />
                </View>
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default DiscoverScreen;
