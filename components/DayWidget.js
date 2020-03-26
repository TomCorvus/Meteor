import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Geolocation from '@react-native-community/geolocation';

class DayWidget extends React.Component {

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

    getVisibilityInKilometer(visibility) {

        visibility = visibility / 1000;
        return visibility;

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

    componentDidUpdate(prevProps) {
        if (prevProps.geolocation !== this.props.geolocation) this.getTodayWeather(this.props.geolocation);
    }

    async componentDidMount() {

        await Geolocation.getCurrentPosition((info) => {

            let latitude = info.coords.latitude;
            let longitude = info.coords.longitude;

            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ dayInformation: responseJson })
                })
                .catch((error) => {
                    console.error(error);
                });
        });

    }

    render() {

        if (this.state.dayInformation !== undefined) {
            var minTemp = Math.round(this.state.dayInformation.main.temp_min);
            var maxTemp = Math.round(this.state.dayInformation.main.temp_max);
            var feelsLike = Math.round(this.state.dayInformation.main.feels_like);

            var sunriseTime = this.getTimeWithUTC(this.state.dayInformation.sys.sunrise);
            var sunsetTime = this.getTimeWithUTC(this.state.dayInformation.sys.sunset);

            var windSpeed = Math.round(this.getKilometerPerHour(this.state.dayInformation.wind.speed));

            var visibility = Math.round(this.getVisibilityInKilometer(this.state.dayInformation.visibility));
        }

        return (
            <View style={styles.container}>
                {this.state.dayInformation !== undefined &&
                    <View style={styles.widget}>

                        <View style={styles.header}>
                            <Text style={styles.city}>{this.state.dayInformation.name}</Text>
                            <Text style={styles.description}>{this.state.dayInformation.weather[0].description}</Text>
                        </View>

                        <View style={styles.iconWrapper}>
                            <Text style={styles.temperature}>{Math.round(this.state.dayInformation.main.temp)}°</Text>
                            <Image style={styles.icon} source={{ uri: "http://openweathermap.org/img/wn/" + this.state.dayInformation.weather[0].icon + "@2x.png" }} />
                        </View>

                        <View style={styles.infoWrapper}>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Minimum</Text>
                                    <Text style={styles.infoBoxValue}>{minTemp}°</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Maximum</Text>
                                    <Text style={styles.infoBoxValue}>{maxTemp}°</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Visibilité</Text>
                                    <Text style={styles.infoBoxValue}>{visibility} km</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Ressenti</Text>
                                    <Text style={styles.infoBoxValue}>{feelsLike}°</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Pression</Text>
                                    <Text style={styles.infoBoxValue}>{this.state.dayInformation.main.pressure} hPa</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Humidité</Text>
                                    <Text style={styles.infoBoxValue}>{this.state.dayInformation.main.humidity} %</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}><MaterialCommunityIcons name="weather-windy" size={16} color="#FFF" /> Vitesse vent</Text>
                                    <Text style={styles.infoBoxValue}>{windSpeed} km/h</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Degré vent</Text>
                                    <Text style={styles.infoBoxValue}>{this.state.dayInformation.wind.deg} deg</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}><MaterialCommunityIcons name="weather-sunset-up" size={16} color="#FFF" /> Levé de soleil</Text>
                                    <Text style={styles.infoBoxValue}>{sunriseTime}</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}><MaterialCommunityIcons name="weather-sunset-down" size={16} color="#FFF" /> Couché de soleil</Text>
                                    <Text style={styles.infoBoxValue}>{sunsetTime}</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                }
            </View>
        )
    }

}

function mapStateToProps(state) {
    return {
        geolocation: state.geolocation
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

const styles = StyleSheet.create({
    container: {
        // flex: 1
        // backgroundColor: "#7B8FE8",
    },
    widget: {
        // opacity: 0
        // backgroundColor: "#87BDFF"
    },
    header: {
        // backgroundColor: "red",
        justifyContent: "flex-start",
        paddingTop: 10,
        paddingBottom: 10
    },
    city: {
        fontSize: 40,
        textAlign: 'center',
        color: '#FFF',
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    },
    description: {
        textAlign: 'center',
        fontSize: 14,
        textTransform: "capitalize",
        color: "#FFF",
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    },
    iconWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#A27BE8'
    },
    icon: {
        width: 50,
        height: 50
    },
    temperature: {
        textAlign: "center",
        fontSize: 70,
        color: "#FFF",
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    },
    infoWrapper: {
        flex: 2,
        justifyContent: 'center'
        // backgroundColor: "red",
    },
    infoRow: {
        flexDirection: "row",
        // backgroundColor: "blue",
        borderBottomWidth: 1,
        borderBottomColor: "#FFF"
    },
    infoBox: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    },
    infoBoxTitle: {
        color: "#FFF",
        textTransform: 'uppercase',
        fontSize: 12,
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    },
    infoBoxValue: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
        textShadowColor: "#404040",
        textShadowOffset: {
            width: .1,
            height: .1
        },
        textShadowRadius: 3
    }
});

export default connect(mapStateToProps, null)(DayWidget);