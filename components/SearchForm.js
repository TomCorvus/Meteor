import React from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default class SearchForm extends React.Component {


    constructor(props) {
        super(props);
        this.onSubmitEdit.bind(this);

        this.state = { searchInProgress: false, location: undefined, getFiveDaysWeather: undefined }
    }

    onSubmitEdit = (event) => {
        this.setState({
            searchInProgress: true
        })

        this.getTodayWeather(event.nativeEvent.text);
        this.getFiveDaysWeather(event.nativeEvent.text);
    }

    getTodayWeather(geolocation) {

        return fetch('http://api.openweathermap.org/data/2.5/weather?q=' + geolocation + '&appid=8e0aa08480209a1c3a435e0adad76904&units=metric')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({ location: responseJson })
            })
            .catch((error) => {
                console.error(error);
            });

    }

    getFiveDaysWeather(geolocation) {

        return fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + geolocation + '&appid=8e0aa08480209a1c3a435e0adad76904&units=metric')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                // this.setState({ location: responseJson })
            })
            .catch((error) => {
                console.error(error);
            });

    }

    render() {
        return (
            <View style={styles.container} >
                <TextInput onSubmitEditing={(event) => this.onSubmitEdit(event)} postal-code autoCorrect={true} style={styles.SearchFormInput} placeholder="Adresse postale"></TextInput>
                {this.state.location !== undefined &&
                    <>
                        <Text>{this.state.location.name}</Text>
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
                    </>
                }
            </View>
        )
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SearchFormInput: {
        backgroundColor: "red",
        width: 200,
        height: 40
    }
});
