import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import DayWidget from './DayWidget';

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

    componentWillMount() {
        this.getTodayWeather("Les Angles");
        //this.getFiveDaysWeather(event.nativeEvent.text);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onSubmitEditing={(event) => this.onSubmitEdit(event)} autoCorrect={true} style={styles.SearchFormInput} placeholder="Adresse postale"></TextInput>
                {this.state.location !== undefined &&
                    <DayWidget location={this.state.location} />
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',

    },
    SearchFormInput: {
        backgroundColor: "white",
        height: 40,
        padding: 5
    }
});
