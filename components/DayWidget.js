import React from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { connect } from "react-redux";
import { getSkyType, getApiDayResponse } from "../actions/MeteorActions";

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

                if (JSON.cod === 200) {
                    let skyType = JSON.weather[0].main.toLowerCase();

                    if (JSON.weather[0].icon.includes('n')) {
                        skyType = "night"
                    }

                    this.setState({ dayInformation: JSON });
                    this.props.getSkyType(skyType);
                }
                this.props.getApiDayResponse(JSON.cod);

            })
            .catch((error) => {
                this.props.getApiDayResponse(0);
            });

    }

    getDataByGeoCoordinates(geoCoordinates) {

        let latitude = geoCoordinates.latitude;
        let longitude = geoCoordinates.longitude;

        if (longitude !== "" && latitude !== "") {
            return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
                .then((response) => response.json())
                .then((JSON) => {

                    if (JSON.cod === 200) {

                        let skyType = JSON.weather[0].main.toLowerCase();

                        if (JSON.weather[0].icon.includes('n')) {
                            skyType = "night"
                        }

                        this.setState({ dayInformation: JSON });
                        this.props.getSkyType(skyType);
                    }
                    this.props.getApiDayResponse(JSON.cod);

                })
                .catch((error) => {
                    this.props.getApiDayResponse(0);
                });
        } else {
            this.props.getApiDayResponse(400);
            this.props.getSkyType("default");
        }

    }

    getWindOrientation(windDegree) {

        let windOrientation;

        if (windDegree > 0 && windDegree < 45) {
            windOrientation = 'N NE';
        } else if (windDegree > 45 && windDegree < 90) {
            windOrientation = 'E NE';
        } else if (windDegree > 90 && windDegree < 135) {
            windOrientation = 'E SE';
        } else if (windDegree > 135 && windDegree < 180) {
            windOrientation = 'S SE';
        } else if (windDegree > 180 && windDegree < 225) {
            windOrientation = 'S SO';
        } else if (windDegree > 225 && windDegree < 270) {
            windOrientation = 'O SO';
        } else if (windDegree > 270 && windDegree < 315) {
            windOrientation = 'O NO';
        } else if (windDegree > 315 && windDegree < 360) {
            windOrientation = 'N NO';
        } else if (windDegree === 0 || windDegree === 360) {
            windOrientation = 'N';
        } else if (windDegree === 45) {
            windOrientation = 'NE';
        } else if (windDegree === 90) {
            windOrientation = 'E';
        } else if (windDegree === 135) {
            windOrientation = 'SE';
        } else if (windDegree === 180) {
            windOrientation = 'S';
        } else if (windDegree === 225) {
            windOrientation = 'SO';
        } else if (windDegree === 270) {
            windOrientation = 'O';
        } else if (windDegree === 315) {
            windOrientation = 'NO';
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

    getFormatTimeFromUTC(timestamp) {
        let date = new Date(timestamp * 1000),
            ho = (date.getHours() < 10 ? '0' : '') + date.getHours(),
            mi = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
            formatTime = `${ho}:${mi}`;

        return formatTime;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

        if (prevProps.geoLocation !== this.props.geoLocation || prevProps.geoCoordinates !== this.props.geoCoordinates) {

            this.props.getApiDayResponse(-1);
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }).start();

        }

        if (prevProps.geoLocation !== this.props.geoLocation) {
            this.getDataByGeoLocation(this.props.geoLocation);
        } else if (prevProps.geoCoordinates !== this.props.geoCoordinates) {
            this.getDataByGeoCoordinates(this.props.geoCoordinates);
        }

    }

    render() {

        if (this.state.dayInformation !== undefined) {

            var minTemp = Math.round(this.state.dayInformation.main.temp_min);
            var maxTemp = Math.round(this.state.dayInformation.main.temp_max);
            var feelsLike = Math.round(this.state.dayInformation.main.feels_like);

            var sunriseTime = this.getFormatTimeFromUTC(this.state.dayInformation.sys.sunrise + this.state.dayInformation.timezone);
            var sunsetTime = this.getFormatTimeFromUTC(this.state.dayInformation.sys.sunset + this.state.dayInformation.timezone);

            var windSpeed = Math.round(this.getWindSpeedInKilometerPerHour(this.state.dayInformation.wind.speed));
            var windOrientation = this.getWindOrientation(this.state.dayInformation.wind.deg);

            var visibility = Math.round(this.getVisibilityInKilometer(this.state.dayInformation.visibility));

            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 400,
                delay: 500,
                useNativeDriver: true
            }).start();

        }

        return (
            <View style={dayWidgetStyles.container}>
                {this.state.dayInformation !== undefined &&
                    <Animated.View style={{ ...dayWidgetStyles.widget, opacity: this.state.opacity }}>

                        <View style={dayWidgetStyles.header}>
                            <Text style={dayWidgetStyles.city}>{this.state.dayInformation.name}</Text>
                            <Text style={dayWidgetStyles.description}>{this.state.dayInformation.weather[0].description}</Text>
                        </View>

                        <View style={dayWidgetStyles.iconWrapper}>
                            <Text style={dayWidgetStyles.temperature}>{Math.round(this.state.dayInformation.main.temp)}°</Text>
                            <Image style={dayWidgetStyles.icon} source={{ uri: "http://openweathermap.org/img/wn/" + this.state.dayInformation.weather[0].icon + "@2x.png" }} />
                        </View>

                        <View style={dayWidgetStyles.infoWrapper}>

                            <View style={dayWidgetStyles.infoRow}>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Minimum</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{minTemp}°</Text>
                                </View>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Maximum</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{maxTemp}°</Text>
                                </View>
                            </View>

                            <View style={dayWidgetStyles.infoRow}>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Visibilité</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{visibility}km</Text>
                                </View>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Ressenti</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{feelsLike}°</Text>
                                </View>
                            </View>

                            <View style={dayWidgetStyles.infoRow}>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Pression</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{this.state.dayInformation.main.pressure}hPa</Text>
                                </View>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Humidité</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{this.state.dayInformation.main.humidity}%</Text>
                                </View>
                            </View>

                            <View style={dayWidgetStyles.infoRow}>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Vent</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{windSpeed}km/h</Text>
                                </View>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Orientation</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{windOrientation} {this.state.dayInformation.wind.deg}deg</Text>
                                </View>
                            </View>

                            <View style={dayWidgetStyles.infoRow}>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Lever</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{sunriseTime}</Text>
                                </View>
                                <View style={dayWidgetStyles.infoBox}>
                                    <Text style={dayWidgetStyles.infoBoxTitle}>Coucher</Text>
                                    <Text style={dayWidgetStyles.infoBoxValue}>{sunsetTime}</Text>
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
        geoLocation: state.geoLocation,
        geoCoordinates: state.geoCoordinates
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSkyType: function (skyType) {
            let action = getSkyType(skyType);
            dispatch(action);
        },
        getApiDayResponse: function (apiDayResponse) {
            var action = getApiDayResponse(apiDayResponse);
            dispatch(action);
        }
    }
}

const dayWidgetStyles = StyleSheet.create({
    container: {},
    widget: {},
    header: {
        justifyContent: "flex-start",
        marginBottom: 10
    },
    city: {
        fontSize: 30,
        lineHeight: 30,
        marginBottom: 5,
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
        marginBottom: 10
    },
    icon: {
        width: 50,
        height: 50
    },
    temperature: {
        textAlign: "center",
        fontSize: 70,
        lineHeight: 70,
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