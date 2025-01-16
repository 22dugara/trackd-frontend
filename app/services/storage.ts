import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveItem = async (key: string, value: string) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, value);
        } else {
            console.log('Saving to Secure Store:', key, value);
            await SecureStore.setItemAsync(key, value);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

export const getItem = async (key: string): Promise<string | null> => {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
};

export const removeItem = async (key: string) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error('Error removing data:', error);
    }
};
