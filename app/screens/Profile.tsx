import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import Background from '../components/Background';
import ProfileBlurb from '../components/ProfileBlurb';
import { fetchUserProfile } from '../services/api';

type ProfileData = {
    username: string;
    first_name: string;
    last_name: string;
    reviews: number;
    friends: number;
    display_picture: string;
};

const Profile = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setProfileData(data);
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    return (
        <Background>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <TopNavBar />

                <View style={{ flex: 1 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4CAF50" />
                    ) : (
                        profileData && (
                            <ProfileBlurb
                                username={`@${profileData.username}`}
                                fullName={`${profileData.first_name} ${profileData.last_name}`}
                                reviews={profileData.reviews}
                                friends={profileData.friends}
                                profilePicture={profileData.display_picture}
                            />
                        )
                    )}
                </View>

                <BottomNavBar />
            </SafeAreaView>
        </Background>
    );
};

export default Profile;
