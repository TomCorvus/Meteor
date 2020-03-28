import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import SearchForm from './SearchForm';
import DayWidget from './DayWidget';
import FiveDaysWidget from './FiveDaysWidget';

export default class MeteorWrapper extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.meteorContainer}>
                <StatusBar barStyle={'light-content'} />
                <SearchForm />
                <DayWidget />
                <FiveDaysWidget />
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    meteorContainer: {
        flex: 1
    }
});
