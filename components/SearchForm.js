import React from 'react';
import { Text, StyleSheet, View, TextInput, Button, TouchableHighlight } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getGeoLocation, getGeoCoordinates } from "../actions/MeteorActions";
import { connect } from "react-redux";

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchInProgress: false,
            message: ""
        }
        this.onSubmitEdit.bind(this);
    }

    onSubmitEdit = (event) => {

        this.setState({
            searchInProgress: true
        });

        this.props.getGeoLocation(event.nativeEvent.text);
    }

    async onPress() {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {

            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        this.textInput.clear();

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

        this.props.getGeoCoordinates(location.coords);

    }

    componentDidUpdate(prevProps) {
        if (prevProps.apiResponse !== this.props.apiResponse) {

            let apiResponse = parseInt(this.props.apiResponse);

            if (apiResponse === 200) {
                this.setState({ message: "" })
            } else if (apiResponse === 404) {
                this.setState({ message: "Aucun résultat." })
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.SearchFormWrapper}>
                    <View style={styles.SearchFormInputWrapper}>
                        <TextInput
                        ref={input => { this.textInput = input }}
                        onSubmitEditing={(event) => this.onSubmitEdit(event)}
                        autoCorrect={false}
                        style={styles.SearchFormInput}
                        placeholder="Saisir la ville ou le code postal"
                        keyboardType= "web-search"></TextInput>
                    </View>
                    <TouchableHighlight
                    onPress={(event) => this.onPress(event)}
                    activeOpacity={0.6}
                    underlayColor="transparent">
                        <View style={styles.SearchFormButton}>
                            <MaterialIcons name="my-location" size={20} color="#4f4f4f" />
                        </View>
                    </TouchableHighlight>
                </View>
                {this.state.message !== "" &&
                    <Text style={styles.message}>{this.state.message}</Text>
                }
            </View>
        )
    }

}

function mapStateToProps(state) {
    return {
        geoLocation: state.geoLocation,
        geoCoordinates: state.geoCoordinates,
        apiResponse: state.apiResponse
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGeoLocation: function (geoLocation) {
            var action = getGeoLocation(geoLocation);
            dispatch(action);
        },
        getGeoCoordinates: function (geoCoordinates) {
            var action = getGeoCoordinates(geoCoordinates);
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingTop: getStatusBarHeight() + 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    SearchFormWrapper: {
        backgroundColor: "white",
        flex: 1,
        paddingLeft: 20,
        flexDirection: "row",
        borderRadius: 20
    },
    SearchFormInputWrapper: {
        flex: 1
    },
    SearchFormInput: {
        height: 40,
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20
    },
    SearchFormButton: {
        flex: 1,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    message: {
        marginTop: 10,
        textAlign: "left",
        color: "#EB4927",
        fontSize: 14,
        paddingLeft: 20,
        paddingRight: 20

    }
});