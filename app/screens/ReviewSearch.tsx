import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/userContext';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import Background from '../components/Background';
import SearchBar from '../components/Search';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

// Define the navigation prop type
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewSearch'>;


const ReviewSearchScreen = () => {
    const navigation = useNavigation<SearchScreenNavigationProp>();

    const handleSearchSelection = (type: 'Album' | 'Track' | 'Artist' | 'Profile', id: string) => {
        if (type !== 'Profile') {
            navigation.navigate('Review', { contentType: type, contentId: id });
        }
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
                        <SearchBar onSelection={handleSearchSelection} />
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

export default ReviewSearchScreen;
