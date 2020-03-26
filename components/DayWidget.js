import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class DayWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = { dayInformation: undefined }
    }

    getTodayWeather(geolocation) {

        return fetch('http://api.openweathermap.org/data/2.5/weather?q=' + geolocation + '&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ dayInformation: responseJson })
            })
            .catch((error) => {
                console.error(error);
            });

    }

    getKilometerPerHour(windSpeed) {

        windSpeed = windSpeed * 3600;
        windSpeed = windSpeed / 1000;
        return windSpeed;

    }

    getIcon() {
        const type = this.state.dayInformation.weather[0].main;
        console.log(type);

        let image;
        // switch(type) {
        //     case ''
        //     image = ""
        //      break;
        // }

    }

    getTimeWithUTC(timestamp) {
        let date = new Date(timestamp * 1000),
            ho = (date.getHours() < 10 ? '0' : '') + date.getHours(),
            mi = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
            formatTime = `${ho}:${mi}`;

        return formatTime;
    }

    componentDidMount() {
        this.getTodayWeather("Les Angles");
    }

    render() {

        if (this.state.dayInformation !== undefined) {
            var minTemp = Math.round(this.state.dayInformation.main.temp_min);
            var maxTemp = Math.round(this.state.dayInformation.main.temp_max);
            var feelsLike = Math.round(this.state.dayInformation.main.feels_like);

            var sunriseTime = this.getTimeWithUTC(this.state.dayInformation.sys.sunrise);
            var sunsetTime = this.getTimeWithUTC(this.state.dayInformation.sys.sunset);

            var windSpeed = Math.round(this.getKilometerPerHour(this.state.dayInformation.wind.speed));

            this.getIcon();
        }

        return (
            <View style={styles.container} >
                {this.state.dayInformation !== undefined &&
                    <View style={styles.widget} >

                        <Text style={styles.city}>{this.state.dayInformation.name}</Text>

                        <View style={styles.iconWrapper}>
                            <Image style={styles.icon} source={{ uri: "http://openweathermap.org/img/wn/" + this.state.dayInformation.weather[0].icon + "@2x.png" }} />
                        </View>

                        <Text style={styles.description}>{this.state.dayInformation.weather[0].description}</Text>

                        <Text>Température: {Math.round(this.state.dayInformation.main.temp)}°</Text>
                        <Text>Ressenti: {feelsLike}°</Text>
                        <Text>Minimum: {minTemp}°</Text>
                        <Text>Maximum: {maxTemp}°</Text>
                        <Text>Pression: {this.state.dayInformation.main.pressure} hPa</Text>
                        <Text>Humidité: {this.state.dayInformation.main.humidity} %</Text>
                        <Text><MaterialCommunityIcons name="weather-windy" size={16} color="black" /> Vitesse vent: {windSpeed} km/h</Text>
                        <Text>Degré vent: {this.state.dayInformation.wind.deg} deg</Text>
                        <Text><MaterialCommunityIcons name="weather-sunset-up" size={16} color="black" /> Levé de soleil: {sunriseTime}</Text>
                        <Text><MaterialCommunityIcons name="weather-sunset-down" size={16} color="black" /> Couché de soleil: {sunsetTime}</Text>

                    </View>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "red"
    },
    widget: {
        flex: 1,
        justifyContent: 'center',
    },
    city: {
        fontSize: 20,
        textAlign: "center"
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 50,
        height: 50
    },
    description: {
        textAlign: "center",
        fontSize: 14
    }
});
