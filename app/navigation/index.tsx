import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignOnScreen from '../screens/SignOnScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Profile';
import ReviewSearchScreen from '../screens/ReviewSearch';
import YourListsScreen from '../screens/YourLists';
import DiscoverScreen from '../screens/Discover';
import SignUpScreen from '../screens/SignUpScreen';
import ReviewScreen from '../screens/Review';

// Define the types for each screen's route parameters
type RootStackParamList = {
    SignOn: undefined; // No parameters
    Home: undefined;
    Profile: undefined;
    ReviewSearch: undefined;
    YourLists: undefined;
    Discover: undefined;
    SignUp: undefined;
    Review: { contentType: 'Album' | 'Track' | 'Artist' | 'Profile'; contentId: string }; // Parameters for Review screen
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignOn" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignOn" component={SignOnScreen} options={{ title: 'Sign In' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
                <Stack.Screen name="ReviewSearch" component={ReviewSearchScreen} options={{ title: 'ReviewSearch' }} />
                <Stack.Screen name="YourLists" component={YourListsScreen} options={{ title: 'YourLists' }} />
                <Stack.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Discover' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
                <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

