import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmitEdit.bind(this);

        this.state = {
            searchInProgress: false,
            dayInformation: undefined,
            fiveDaysInformation: undefined
        }
    }

    onSubmitEdit = (event) => {
        this.setState({
            searchInProgress: true
        })

        // this.getFiveDaysWeather(event.nativeEvent.text);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onSubmitEditing={(event) => this.onSubmitEdit(event)} autoCorrect={true} style={styles.SearchFormInput} placeholder="Adresse postale"></TextInput>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: getStatusBarHeight() + 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    SearchFormInput: {
        backgroundColor: "white",
        height: 40,
        width: "80%",
        padding: 5
    }
});
