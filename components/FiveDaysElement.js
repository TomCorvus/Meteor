import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class FiveDaysElement extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={styles.container} >
                <Text style={styles.weekDay}>{this.props.weekDay}</Text>
                <View style={styles.iconWrapper}>
                    <Image style={styles.icon} source={{ uri: "http://openweathermap.org/img/wn/" + this.props.icon + "@2x.png" }} />
                </View>
                <Text style={styles.temperature}>{this.props.averageTemp}°</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5
    },
    weekDay: {
        flex: 1,
        textAlign: 'left',
        color: '#FFF',
        fontSize: 14,
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24
    },
    temperature: {
        flex: 1,
        textAlign: 'right',
        color: '#FFF',
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    }
});