import React from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getSkyType } from "../actions/MeteorActions";

class DayWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dayInformation: undefined,
            location: Object,
            opacity: new Animated.Value(0)
        }
    }

    getDataByGeoLocation(geoLocation) {

        return fetch('http://api.openweathermap.org/data/2.5/weather?q=' + geoLocation + '&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr')
            .then((response) => response.json())
            .then((JSON) => {
                let skyType = JSON.weather[0].main.toLowerCase();

                this.setState({ dayInformation: JSON });
                this.props.getSkyType(skyType);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    getDataByGeoCoordinates(geoCoordinates) {

        let latitude = geoCoordinates.latitude;
        let longitude = geoCoordinates.longitude;

        return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
            .then((response) => response.json())
            .then((JSON) => {

                let skyType = JSON.weather[0].main.toLowerCase();

                this.setState({ dayInformation: JSON });
                this.props.getSkyType(skyType);

            })
            .catch((error) => {
                console.error(error);
            });

    }

    getWindOrientation(windDegree) {

        let windOrientation;

        if (windDegree >= 0 && windDegree < 22.5) {
            windOrientation = 'N';
        } else if (windDegree >= 22.5 && windDegree < 67.5) {
            windOrientation = 'NE';
        } else if (windDegree >= 67.5 && windDegree < 112.5) {
            windOrientation = 'E';
        } else if (windDegree >= 112.5 && windDegree < 157.5) {
            windOrientation = 'SE';
        } else if (windDegree >= 157.5 && windDegree < 202.5) {
            windOrientation = 'S';
        } else if (windDegree >= 202.5 && windDegree < 247.5) {
            windOrientation = 'SO';
        } else if (windDegree >= 247.5 && windDegree < 292.5) {
            windOrientation = 'O';
        } else if (windDegree >= 292.5 && windDegree < 337.5) {
            windOrientation = 'NO';
        } else if (windDegree >= 337.5 && windDegree <= 360) {
            windOrientation = 'N';
        }

        return windOrientation;


    }

    getWindSpeedInKilometerPerHour(windSpeed) {

        windSpeed = windSpeed * 3600;
        windSpeed = windSpeed / 1000;
        return windSpeed;

    }

    getVisibilityInKilometer(visibility) {

        visibility = visibility / 1000;
        return visibility;

    }

    getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

        this.getDataByGeoCoordinates(location.coords);

    };

    getFormatTimeFromUTC(timestamp) {
        let date = new Date(timestamp * 1000),
            ho = (date.getHours() < 10 ? '0' : '') + date.getHours(),
            mi = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
            formatTime = `${ho}:${mi}`;

        return formatTime;
    }

    componentDidMount() {
        this.getLocationAsync();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoLocation !== this.props.geoLocation) {

            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0
            }).start();

            this.getDataByGeoLocation(this.props.geoLocation);
        }
    }

    render() {

        if (this.state.dayInformation !== undefined) {

            var minTemp = Math.round(this.state.dayInformation.main.temp_min);
            var maxTemp = Math.round(this.state.dayInformation.main.temp_max);
            var feelsLike = Math.round(this.state.dayInformation.main.feels_like);

            var sunriseTime = this.getFormatTimeFromUTC(this.state.dayInformation.sys.sunrise);
            var sunsetTime = this.getFormatTimeFromUTC(this.state.dayInformation.sys.sunset);

            var windSpeed = Math.round(this.getWindSpeedInKilometerPerHour(this.state.dayInformation.wind.speed));
            var windOrientation = this.getWindOrientation(this.state.dayInformation.wind.deg);

            var visibility = Math.round(this.getVisibilityInKilometer(this.state.dayInformation.visibility));

            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
                delay: 600
            }).start();

        }

        return (
            <View style={styles.container}>
                {this.state.dayInformation !== undefined &&
                    <Animated.View style={{ ...styles.widget, opacity: this.state.opacity }}>

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
                                    <Text style={styles.infoBoxValue}>{visibility}km</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Ressenti</Text>
                                    <Text style={styles.infoBoxValue}>{feelsLike}°</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Pression</Text>
                                    <Text style={styles.infoBoxValue}>{this.state.dayInformation.main.pressure}hPa</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Humidité</Text>
                                    <Text style={styles.infoBoxValue}>{this.state.dayInformation.main.humidity}%</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}><MaterialCommunityIcons name="weather-windy" size={16} color="#FFF" /> Vitesse vent</Text>
                                    <Text style={styles.infoBoxValue}>{windSpeed}km/h</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoBoxTitle}>Degré vent</Text>
                                    <Text style={styles.infoBoxValue}>{windOrientation} {this.state.dayInformation.wind.deg}deg</Text>
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

                    </Animated.View>
                }
            </View>
        )
    }

}

function mapStateToProps(state) {
    return {
        geoLocation: state.geoLocation
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSkyType: function (skyType) {
            let action = getSkyType(skyType);
            dispatch(action);
        }
    }
}

const styles = StyleSheet.create({
    container: {},
    widget: {},
    header: {
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
        alignItems: 'center'
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
    },
    infoRow: {
        flexDirection: "row",
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

export default connect(mapStateToProps, mapDispatchToProps)(DayWidget);