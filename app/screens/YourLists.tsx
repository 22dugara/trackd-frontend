import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/userContext';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import Background from '../components/Background';

const HomeScreen = () => {
    const { username } = useUser();

    return (
        <Background>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <TopNavBar />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                        Your Lists
                    </Text>
                </View>
                <BottomNavBar />
            </SafeAreaView>
        </Background>
    );
};

export default HomeScreen;
