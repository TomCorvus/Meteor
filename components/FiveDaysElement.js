import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class FiveDaysElement extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={styles.container} >
                <Text>{this.props.weekDay}</Text>
                <Text>{this.props.weather}</Text>
                <Image style={{ width: 50, height: 50 }} source={{ uri: "http://openweathermap.org/img/wn/" + this.props.icon + "@2x.png" }} />
                <Text>{this.props.averageTemp}°</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        backgroundColor: "lightgreen"
    }
});