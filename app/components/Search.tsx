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
import { fetchRecentSearches, search, SearchItem, addSearch } from '../services/api';

const { width } = Dimensions.get('window');

interface SearchBarProps {
    onSelection: (type: 'Album' | 'Track' | 'Artist' | 'Profile', id: string) => void;
}

type SearchCategory = 'albums' | 'artists' | 'profiles' | 'tracks';

const SearchBar: React.FC<SearchBarProps> = ({ onSelection }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
    const [searchResults, setSearchResults] = useState<{
        profiles: SearchItem[];
        albums: SearchItem[];
        artists: SearchItem[];
        tracks: SearchItem[];
    }>({
        profiles: [],
        albums: [],
        artists: [],
        tracks: []
    });
    const [showResults, setShowResults] = useState<boolean>(false);
    const [activeCategory, setActiveCategory] = useState<SearchCategory>('albums');

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
                // Map the results to rename 'content-id' to 'id'
                const formattedSearches = searches.map((searchItem: any) => ({
                    ...searchItem,
                    id: searchItem['object_id'] || 'unknown',  // Keep 'object_uri' as 'id'
                    uri: searchItem['object_uri'] || 'unknown',  // Keep 'object_uri' as 'id'
                }));
                console.log('Formatted searches:', formattedSearches);
                setRecentSearches(formattedSearches);
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

    const onSearch = async (query: string) => {
        try {
            console.log('Starting search for query:', query);
            const results = await search(query);
            setSearchResults(results);
            setShowResults(true);
            console.log('Search results:', results.tracks);
        } catch (error: any) {
            console.error('Search failed with error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
            });
        }
    };

    const handleSearch = () => {
        onSearch(searchText);
        Keyboard.dismiss();
    };

    const handleClearSearch = () => {
        setSearchText('');
        setShowResults(false);
    };

    const handleSearchItemPress = async (item: SearchItem) => {
        try {
            const response = await addSearch(item.type, item.uri);
            console.log('Add Search Response:', response);

            onSelection(item.type, response.id);
            console.log('Added to recent searches:', item);
        } catch (error) {
            console.error('Failed to add to recent searches:', error);
        }
    };

    const renderSearchItem = ({ item }: { item: SearchItem }) => {
        return (
            <TouchableOpacity 
                style={styles.recentSearchItem}
                onPress={() => handleSearchItemPress(item)}
            >
                <Image 
                    source={{ uri: item.image }} 
                    style={styles.searchItemImage} 
                />
                <View style={styles.searchItemContent}>
                    <Text style={styles.searchItemTitle}>{item.title}</Text>
                    <Text style={styles.searchItemType}>{item.type}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <View style={[
                styles.container, 
                isExpanded && styles.expandedContainer,
                isExpanded && { 
                    height: Dimensions.get('window').height - keyboardHeight - 70
                }
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

                    <TouchableOpacity onPress={searchText !== '' ? handleClearSearch : handleSearch}>
                        {searchText !== '' ? (
                            <MaterialIcons name="close" size={24} color="black" style={styles.icon} />
                        ) : (
                            <MaterialIcons name="search" size={24} color="black" style={styles.icon} />
                        )}
                    </TouchableOpacity>
                </View>

                {isExpanded && (
                    <View style={styles.recentSearchesPanel}>
                        {showResults && (
                            <View style={styles.categoryButtons}>
                                <TouchableOpacity 
                                    style={[
                                        styles.categoryButton,
                                        activeCategory === 'albums' && styles.activeCategoryButton
                                    ]}
                                    onPress={() => setActiveCategory('albums')}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        activeCategory === 'albums' && styles.activeCategoryButtonText
                                    ]}>Albums</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.categoryButton,
                                        activeCategory === 'artists' && styles.activeCategoryButton
                                    ]}
                                    onPress={() => setActiveCategory('artists')}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        activeCategory === 'artists' && styles.activeCategoryButtonText
                                    ]}>Artists</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.categoryButton,
                                        activeCategory === 'tracks' && styles.activeCategoryButton
                                    ]}
                                    onPress={() => setActiveCategory('tracks')}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        activeCategory === 'tracks' && styles.activeCategoryButtonText
                                    ]}>Tracks</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.categoryButton,
                                        activeCategory === 'profiles' && styles.activeCategoryButton
                                    ]}
                                    onPress={() => setActiveCategory('profiles')}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        activeCategory === 'profiles' && styles.activeCategoryButtonText
                                    ]}>Profiles</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <Text style={styles.panelTitle}>
                            {showResults ? 'Results' : 'Recent Searches'}
                        </Text>
                        <FlatList
                            data={showResults ? searchResults[activeCategory] : recentSearches}
                            keyExtractor={(item) => item.uri.toString()}
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
        height: '100%',
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
        maxHeight: '100%',
    },
    expandedContainer: {
        width: '100%',
        marginHorizontal: 0,
        borderRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: Dimensions.get('window').height - 215
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
        maxHeight: '100%',
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
    categoryButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    categoryButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        backgroundColor: '#eee',
        marginHorizontal: 4,
    },
    activeCategoryButton: {
        backgroundColor: '#000',
    },
    categoryButtonText: {
        fontSize: 12,
        color: '#666',
    },
    activeCategoryButtonText: {
        color: '#fff',
    },
});

export default SearchBar;
