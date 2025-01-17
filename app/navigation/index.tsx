import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignOnScreen from '../screens/SignOnScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Profile';
import ReviewScreen from '../screens/Review';
import YourListsScreen from '../screens/YourLists';
import DiscoverScreen from '../screens/Discover';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignOn" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignOn" component={SignOnScreen} options={{ title: 'Sign In' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
                <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review' }} />
                <Stack.Screen name="YourLists" component={YourListsScreen} options={{ title: 'YourLists' }} />
                <Stack.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Discover' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
