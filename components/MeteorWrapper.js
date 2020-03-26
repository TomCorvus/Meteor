import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import DayWidget from './DayWidget';
import FiveDaysWidget from './FiveDaysWidget';

import SearchForm from './SearchForm';
import BackgroundApp from './BackgroundApp';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class MeteorWrapper extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <BackgroundApp />
                <SearchForm />
                <DayWidget />
                <FiveDaysWidget />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        width: width,
        backgroundColor: "black"
    }
});
