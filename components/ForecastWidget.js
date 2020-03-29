import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from "react-redux";
import { getApiForecastResponse } from "../actions/MeteorActions";

import ForecastElement from './ForecastElement';

class ForecastWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            forecastInformation: undefined,
            forecastInformationPerDay: undefined,
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

        let forecastInformationPerDay = [];

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

            if (!forecastInformationPerDay[n]) {
                forecastInformationPerDay[n] = {
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

            forecastInformationPerDay[n]["temp"].push(
                element.main.temp
            );

            forecastInformationPerDay[n].averageTemp = Math.round(this.getAverageTemperature(forecastInformationPerDay[n].temp));
            forecastInformationPerDay[n].minTemp = Math.round(this.getMinimumTemperature(forecastInformationPerDay[n].temp));
            forecastInformationPerDay[n].maxTemp = Math.round(this.getMaximumTemperature(forecastInformationPerDay[n].temp));

            if (formatDate !== previousDate && previousDate !== null) {
                n++;
            }

            previousDate = `${da}-${mo}-${ye}`;

        });

        return forecastInformationPerDay;

    }

    getForecastWeatherByGeoLocation(geoLocation) {

        return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${geoLocation}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
            .then((response) => response.json())
            .then((JSON) => {
                if (parseInt(JSON.cod) === 200) {
                    let daysList = this.getAverageWeather(JSON.list);

                    this.setState({
                        forecastInformation: JSON,
                        forecastInformationPerDay: daysList
                    })
                }
                this.props.getApiForecastResponse(parseInt(JSON.cod));

            })
            .catch((error) => {
                this.props.getApiForecastResponse(0);
            });

    }

    getForecastWeatherByGeoCoordinates(geoCoordinates) {

        let latitude = geoCoordinates.latitude;
        let longitude = geoCoordinates.longitude;

        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr`)
            .then((response) => response.json())
            .then((JSON) => {

                if (parseInt(JSON.cod) === 200) {

                    let daysList = this.getAverageWeather(JSON.list);
                    this.setState({ forecastInformation: JSON, forecastInformationPerDay: daysList })

                }
                this.props.getApiForecastResponse(parseInt(JSON.cod));

            })
            .catch((error) => {
                this.props.getApiForecastResponse(0);
            });

    }

    componentDidUpdate(prevProps) {

        if (prevProps.geoLocation !== this.props.geoLocation || prevProps.geoCoordinates !== this.props.geoCoordinates) {
            this.props.getApiForecastResponse(-1);

            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }).start();
        }

        if (prevProps.geoLocation !== this.props.geoLocation) {
            this.getForecastWeatherByGeoLocation(this.props.geoLocation);
        } else if (prevProps.geoCoordinates !== this.props.geoCoordinates) {
            this.getForecastWeatherByGeoCoordinates(this.props.geoCoordinates);
        }

    }

    componentDidMount() {
    }

    render() {

        if (this.state.forecastInformation !== undefined) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 400,
                delay: 500,
                useNativeDriver: true
            }).start();
        }

        return (
            <View style={forecastWidgetStyles.container}>
                {this.state.forecastInformation !== undefined &&
                    this.state.forecastInformationPerDay !== undefined &&
                    <Animated.View style={{ ...forecastWidgetStyles.widget, opacity: this.state.opacity }} >
                        {this.state.forecastInformationPerDay.map((DayAverageWeather) =>
                            <ForecastElement key={DayAverageWeather.id}
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

}

function mapStateToProps(state) {
    return {
        geoLocation: state.geoLocation,
        geoCoordinates: state.geoCoordinates
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getApiForecastResponse: function (apiForecastResponse) {
            var action = getApiForecastResponse(apiForecastResponse);
            dispatch(action);
        }
    }
}

const forecastWidgetStyles = StyleSheet.create({
    container: {
        justifyContent: "space-around",
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1
    },
    widget: {
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ForecastWidget);