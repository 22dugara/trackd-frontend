import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../services/api';
import { useUser } from '../context/userContext';
import { saveItem, getItem } from '../services/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignOnScreenNavigationProp = {
    navigate: (screen: string) => void;
};

const SignOnScreen = () => {
    const navigation = useNavigation<SignOnScreenNavigationProp>();
    const { setUsername } = useUser();
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/token/', { username, password });
            const { access, refresh } = response.data; // Process token as needed
            // Save tokens securely
            await saveItem('accessToken', access);
            await saveItem('refreshToken', refresh);
            setUsername(username); // Save username to global state
            Alert.alert('Sign-In Successful');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            
            <View style={styles.header}>
                <Text style={styles.logo}>trackd</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={setLocalUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity 
                    style={styles.signInButton} 
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    <Text style={styles.signInButtonText}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Button */}
                <TouchableOpacity 
                    style={styles.signUpButton}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.signUpButtonText}>
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>

                {/* Debug button */}
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity 
                        style={styles.debugButton}
                        onPress={async () => {
                            const accessToken = await getItem('accessToken');
                            const refreshToken = await getItem('refreshToken');
                            console.log('Access Token:', accessToken);
                            console.log('Refresh Token:', refreshToken);
                        }}
                    >
                        <Text style={styles.debugButtonText}>Show Stored Tokens</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) + 30 : 10,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 16,
        backgroundColor: '#111',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        color: 'white',
        fontSize: 16,
    },
    signInButton: {
        width: '100%',
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    debugButton: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    debugButtonText: {
        color: '#999',
    },
    signUpButton: {
        width: '100%',
        padding: 15,
        marginTop: 10,
        alignItems: 'center',
    },
    signUpButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SignOnScreen;
