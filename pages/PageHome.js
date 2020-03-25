import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import SearchForm from '../components/SearchForm';

import BackgroundApp from '../components/BackgroundApp';

export default function Home() {
    return (
        <View style={styles.container}>
            <BackgroundApp />
            <SearchForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
