import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from "react-redux";
import { getApiResponse } from "../actions/MeteorActions";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import FiveDaysElement from './FiveDaysElement';

class FiveDaysWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fiveDaysInformation: undefined,
            fiveDaysAverageWeather: undefined,
            opacity: new Animated.Value(0)
        }
    }


    getAverageTemperature(data) {

        let average = 0;
        let i = 0;

        data.forEach((el) => {
            average = average + el;
            i++;
        });

        average = average / i;

        return average;
    }


    getMinimumTemperature(data) {

        return Math.min.apply(null, data);

    }

    getMaximumTemperature(data) {

        return Math.max.apply(null, data);

    }

    getAverageWeather(daysList) {

        let fiveDaysAverageWeather = [];

        let n = 0;
        let previousDate = null;

        var weekday = new Array(7);
        weekday[0] = "Dimanche";
        weekday[1] = "Lundi";
        weekday[2] = "Mardi";
        weekday[3] = "Mercredi";
        weekday[4] = "Jeudi";
        weekday[5] = "Vendredi";
        weekday[6] = "Samedi";

        daysList.forEach((element) => {

            let timestamp = element.dt,
                date = new Date(timestamp * 1000),
                wd = weekday[date.getDay()],
                ye = date.getFullYear(),
                mo = date.getMonth() + 1,
                da = date.getDate(),
                formatDate = `${da}-${mo}-${ye}`,
                weather = element.weather[0].description,
                icon = element.weather[0].icon;

            if (!fiveDaysAverageWeather[n]) {
                fiveDaysAverageWeather[n] = {
                    id: n,
                    date: formatDate,
                    weekDay: wd,
                    weather: weather,
                    icon: icon,
                    temp: [],
                    averageTemp: 0,
                    minTemp: 0,
                    maxTemp: 0
                }
            }

            fiveDaysAverageWeather[n]["temp"].push(
                element.main.temp
            );

            fiveDaysAverageWeather[n].averageTemp = Math.round(this.getAverageTemperature(fiveDaysAverageWeather[n].temp));
            fiveDaysAverageWeather[n].minTemp = Math.round(this.getMinimumTemperature(fiveDaysAverageWeather[n].temp));
            fiveDaysAverageWeather[n].maxTemp = Math.round(this.getMaximumTemperature(fiveDaysAverageWeather[n].temp));

            if (formatDate !== previousDate && previousDate !== null) {
                n++;
            }

            previousDate = `${da}-${mo}-${ye}`;

        });

        return fiveDaysAverageWeather;
    }

    getFiveDaysWeather(geolocation) {

        return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${geolocation}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
            .then((response) => response.json())
            .then((JSON) => {
                if (JSON.cod === "200") {
                    let daysList = this.getAverageWeather(JSON.list);

                    this.setState({
                        fiveDaysInformation: JSON,
                        fiveDaysAverageWeather: daysList
                    })
                }
                this.props.getApiResponse(JSON.cod);

            })
            .catch((error) => {
                console.error(error);
            });

    }

    getFiveDaysWeatherByCoordinate(location) {

        let latitude = location.latitude;
        let longitude = location.longitude;

        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
            .then((response) => response.json())
            .then((JSON) => {

                if (JSON.cod === "200") {

                    let daysList = this.getAverageWeather(JSON.list);
                    this.setState({ fiveDaysInformation: JSON, fiveDaysAverageWeather: daysList })

                }
                this.props.getApiResponse(JSON.cod);

            })
            .catch((error) => {
                console.error(error);
            });

    }

    render() {

        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            delay: 600,
            useNativeDriver: true
        }).start();

        return (
            <View style={styles.container}>
                {this.state.fiveDaysInformation !== undefined &&
                    this.state.fiveDaysAverageWeather !== undefined &&
                    <Animated.View style={{ ...styles.widget, opacity: this.state.opacity }} >
                        {this.state.fiveDaysAverageWeather.map((DayAverageWeather) =>
                            <FiveDaysElement key={DayAverageWeather.id}
                            date={DayAverageWeather.date}
                            icon={DayAverageWeather.icon}
                            averageTemp={DayAverageWeather.averageTemp}
                            minTemp={DayAverageWeather.minTemp}
                            maxTemp={DayAverageWeather.maxTemp}
                            weather={DayAverageWeather.weather}
                            weekDay={DayAverageWeather.weekDay} />
                        )}
                    </Animated.View>
                }
            </View>

        )
    }

    getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

        this.getFiveDaysWeatherByCoordinate(location.coords);

    };

    componentDidUpdate(prevProps) {
        if (prevProps.geoLocation !== this.props.geoLocation) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }).start();
            this.getFiveDaysWeather(this.props.geoLocation);
        } else if (prevProps.geoCoordinates !== this.props.geoCoordinates) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }).start();
            this.getFiveDaysWeatherByCoordinate(this.props.geoCoordinates);
        }
    }

    async componentDidMount() {
        this.getLocationAsync()
    }

}

function mapStateToProps(state) {
    return {
        geoLocation: state.geoLocation,
        geoCoordinates: state.geoCoordinates,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getApiResponse: function (apiResponse) {
            var action = getApiResponse(apiResponse);
            dispatch(action);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-around",
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1
    },
    widget: {
        // opacity: 0
        // backgroundColor: "#87BDFF"
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FiveDaysWidget);