import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Alert, 
    StyleSheet, 
    StatusBar, 
    TouchableOpacity, 
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    bio: string;
    display_picture?: string;
}

type SignUpScreenNavigationProp = {
    navigate: (screen: string) => void;
    goBack: () => void;
};

const SignUpScreen = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
    });
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Pick the image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSignUp = async () => {
        // Basic validation
        if (!formData.username || !formData.email || !formData.password) {
            if (Platform.OS === 'web') {
                window.alert('Please fill in all required fields.');
            } else {
                Alert.alert('Error', 'Please fill in all required fields.');
            }
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            if (Platform.OS === 'web') {
                window.alert('Passwords do not match.');
            } else {
                Alert.alert('Error', 'Passwords do not match.');
            }
            return;
        }

        setLoading(true);
        try {
            // Create form data with image if selected
            const registerData: any = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                bio: formData.bio || undefined,
            };

            if (imageUri) {
                // Get file extension
                const ext = imageUri.split('.').pop();
                const filename = `photo.${ext}`;
                
                // Create file object for the image
                const file = {
                    uri: imageUri,
                    name: filename,
                    type: `image/${ext}`
                };
                
                registerData.display_picture = file;
            }

            await registerUser(registerData);
            if (Platform.OS === 'web') {
                window.alert('Account created successfully! Please sign in.');
                navigation.goBack();
            } else {
                Alert.alert('Success', 'Account created successfully! Please sign in.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred during registration.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.logo}>Create Account</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    {/* Profile Picture Picker */}
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Feather name="camera" size={24} color="#666" />
                                <Text style={styles.placeholderText}>Add Profile Picture</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Username*"
                        placeholderTextColor="#666"
                        value={formData.username}
                        onChangeText={(text) => setFormData({...formData, username: text})}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email*"
                        placeholderTextColor="#666"
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password*"
                        placeholderTextColor="#666"
                        value={formData.password}
                        onChangeText={(text) => setFormData({...formData, password: text})}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password*"
                        placeholderTextColor="#666"
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                        secureTextEntry
                    />
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Bio (optional)"
                        placeholderTextColor="#666"
                        value={formData.bio}
                        onChangeText={(text) => setFormData({...formData, bio: text})}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity 
                        style={styles.signUpButton} 
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        <Text style={styles.signUpButtonText}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        bottom: 20,
    },
    backButtonText: {
        color: '#4CAF50',
        fontSize: 16,
    },
    logo: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingVertical: 20,
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
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    signUpButton: {
        width: '100%',
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePickerButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        marginTop: 8,
        fontSize: 12,
    },
});

export default SignUpScreen;


