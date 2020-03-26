import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import FiveDaysElement from './FiveDaysElement';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class FiveDaysWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fiveDaysInformation: undefined,
            fiveDaysAverageWeather: undefined
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

    getAverageWeather(list) {

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

        list.forEach((element) => {

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
                    averageTemp: 0
                }
            }

            fiveDaysAverageWeather[n]["temp"].push(
                element.main.temp
            );

            fiveDaysAverageWeather[n].averageTemp = Math.round(this.getAverageTemperature(fiveDaysAverageWeather[n].temp));

            if (formatDate !== previousDate && previousDate !== null) {

                n++;
            }

            previousDate = `${da}-${mo}-${ye}`;

        });

        return fiveDaysAverageWeather;
    }

    getFiveDaysWeather(geolocation) {

        return fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + geolocation + '&appid=8e0aa08480209a1c3a435e0adad76904&units=metric&lang=fr')
            .then((response) => response.json())
            .then((responseJson) => {
                let test = this.getAverageWeather(responseJson.list);

                this.setState({ fiveDaysInformation: responseJson, fiveDaysAverageWeather: test })

            })
            .catch((error) => {
                console.error(error);
            });

    }

    render() {

        return (
            <View style={styles.container} >
                {this.state.fiveDaysInformation !== undefined &&
                    this.state.fiveDaysAverageWeather !== undefined &&
                    this.state.fiveDaysAverageWeather.map((number) =>
                        <FiveDaysElement key={number.id} date={number.date} icon={number.icon} averageTemp={number.averageTemp} weather={number.weather} weekDay={number.weekDay} />
                    )
                }
            </View>

        )
    }

    componentDidMount() {
        this.getFiveDaysWeather("Les Angles");
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "space-around",
        flexDirection: "row",
        width: width,
        backgroundColor: "red"
    }
});
