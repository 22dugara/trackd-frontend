import React from 'react';
import { View, StyleSheet } from 'react-native';

const Background = ({ children }) => {
    return <View style={styles.background}>{children}</View>;
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#000',
    },
});

export default Background;
