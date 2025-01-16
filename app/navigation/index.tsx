import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignOnScreen from '../screens/SignOnScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignOn" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignOn" component={SignOnScreen} options={{ title: 'Sign In' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
