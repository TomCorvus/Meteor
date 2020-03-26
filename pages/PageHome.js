import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import MeteorWrapper from '../components/MeteorWrapper';

export default function Home() {
    return (
        <View style={styles.container}>
            <MeteorWrapper />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
