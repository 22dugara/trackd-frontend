import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Keyboard,
    FlatList,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    KeyboardEvent,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { fetchRecentSearches } from '../services/api';

const { width } = Dimensions.get('window');

interface RecentSearch {
    id: number;
    title: string;
    image: string;
    description: string;
    type: string;
    searched_at: string;
}

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e: KeyboardEvent) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                const searches = await fetchRecentSearches();
                setRecentSearches(searches);
            } catch (error) {
                console.error('Failed to load recent searches:', error);
            }
        };

        loadRecentSearches();
    }, []);

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setSearchText('');
        Keyboard.dismiss();
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchText);
        }
        Keyboard.dismiss();
    };

    const renderSearchItem = ({ item }: { item: RecentSearch }) => (
        <TouchableOpacity style={styles.recentSearchItem}>
            <Image 
                source={{ 
                    uri: item.image.startsWith('http') 
                        ? item.image 
                        : `http://192.168.1.209:8000${item.image}`
                }} 
                style={styles.searchItemImage} 
            />
            <View style={styles.searchItemContent}>
                <Text style={styles.searchItemTitle}>{item.title}</Text>
                <Text style={styles.searchItemType}>{item.type}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <View style={[
                styles.container, 
                isExpanded && styles.expandedContainer,
                isExpanded && { height: Dimensions.get('window').height - keyboardHeight }
            ]}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={isExpanded ? handleCollapse : undefined}>
                        {isExpanded ? (
                            <Feather name="arrow-left" size={24} color="black" style={styles.icon} />
                        ) : (
                            <Feather name="menu" size={24} color="black" style={styles.icon} />
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={[styles.input, isExpanded && styles.expandedInput]}
                        placeholder="Search"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={handleExpand}
                        onSubmitEditing={handleSearch}
                        autoFocus={isExpanded}
                    />

                    <TouchableOpacity onPress={searchText !== '' ? () => setSearchText('') : handleSearch}>
                        {searchText !== '' ? (
                            <MaterialIcons name="close" size={24} color="black" style={styles.icon} />
                        ) : (
                            <MaterialIcons name="search" size={24} color="black" style={styles.icon} />
                        )}
                    </TouchableOpacity>
                </View>

                {isExpanded && (
                    <View style={styles.recentSearchesPanel}>
                        <Text style={styles.panelTitle}>Recent Searches</Text>
                        <FlatList
                            data={recentSearches}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderSearchItem}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        width: '100%',
    },
    container: {
        width: width * 0.95,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        marginHorizontal: width * 0.025,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    expandedContainer: {
        width: '100%',
        marginHorizontal: 0,
        borderRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        color: 'black',
        fontSize: 16,
    },
    expandedInput: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        paddingHorizontal: 5,
    },
    recentSearchesPanel: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    panelTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    searchItemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    searchItemContent: {
        flex: 1,
    },
    searchItemTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    searchItemType: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default SearchBar;
