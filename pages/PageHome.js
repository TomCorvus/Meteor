import React from 'react';
import { StyleSheet, View } from 'react-native';
import MeteorWrapper from '../components/MeteorWrapper';
import BackgroundApp from '../components/BackgroundApp';

export default function Home() {
    return (
        <View style={styles.container}>
            <BackgroundApp />
            <MeteorWrapper />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#26272c"
    }
});
