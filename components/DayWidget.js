import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import BackgroundApp from './BackgroundApp';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class DayWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = { location: this.props.location }
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.widget} >
                    <Text style={styles.city}>{this.state.location.name}</Text>
                    <Text><Image style={{ width: 50, height: 50 }} source={{ uri: "http://openweathermap.org/img/w/" + this.state.location.weather[0].icon + ".png" }} /> {this.state.location.weather[0].description}</Text>
                    <Text>Température: {Math.round(this.state.location.main.temp)} °</Text>
                    <Text>Ressenti: {this.state.location.main.feels_like} °</Text>
                    <Text>Minimum: {this.state.location.main.temp_min} °</Text>
                    <Text>Maximum: {this.state.location.main.temp_max}°</Text>
                    <Text>Pression: {this.state.location.main.pressure} hPa</Text>
                    <Text>Humidité: {this.state.location.main.humidity} %</Text>
                    <Text><MaterialCommunityIcons name="weather-windy" size={16} color="black" /> Vitesse vent: {this.state.location.wind.speed} m/s</Text>
                    <Text>Degré vent: {this.state.location.wind.deg} deg</Text>
                    <Text><MaterialCommunityIcons name="weather-sunset-up" size={16} color="black" /> Levé de soleil: {this.state.location.sys.sunrise} UTC</Text>
                    <Text><MaterialCommunityIcons name="weather-sunset-down" size={16} color="black" /> Couché de soleil: {this.state.location.sys.sunset} UTC</Text>
                </View>
            </View>
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({ location: this.props.location });
        }
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        alignItems: 'center'
    },
    widget: {
        flex: 1,
        zIndex: 1
    },
    city: {
        fontSize: 20
    }
});
