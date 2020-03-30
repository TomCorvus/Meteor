import React from 'react';
import { Text, StyleSheet, View, TextInput, ActivityIndicator, TouchableHighlight, Animated } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getGeoLocation, getGeoCoordinates, getApiResponse } from "../actions/MeteorActions";
import { connect } from "react-redux";

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaderOpacity: new Animated.Value(0),
            searchInProgress: true,
            message: ""
        }
        this.onSubmitEdit.bind(this);

    }

    onSubmitEdit(event) {

        if (event.nativeEvent.text !== "") {
            this.props.getGeoLocation(event.nativeEvent.text);
        } else {
            this.setState({ message: "Veuillez saisir une ville ou code postal" })
        }

    }

    handlerOnPress(event) {

        let pressedButton = true;

        this.textInput.clear();

        this.setState({
            searchInProgress: true
        });

        this.getGeoCoordinates(pressedButton);

    }

    async getGeoCoordinates(pressedButton) {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {

            if (pressedButton) {
                this.setState({
                    searchInProgress: false,
                    message: "Vous n'avez pas autorisé l'application à accéder à vos coordonnées géographiques"
                });
            } else {
                this.setState({
                    searchInProgress: false
                });
            }
            this.props.getGeoCoordinates({ longitude: "", latitude: "" });
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

        this.props.getGeoCoordinates(location.coords);

    }

    componentDidMount() {
        this.getGeoCoordinates();
    }

    componentDidUpdate(prevProps) {

        if (prevProps.geoCoordinates !== this.props.geoCoordinates && this.props.geoCoordinates.latitude !== "" && this.props.geoCoordinates.longitude !== "" || prevProps.geoLocation !== this.props.geoLocation) {
            this.props.getApiResponse(-1);
            this.setState({
                searchInProgress: true
            });
        }

        if (prevProps.apiResponse !== this.props.apiResponse) {

            let apiResponse = this.props.apiResponse;

            if (apiResponse === 200) {
                this.setState({ message: "" });
                this.textInput.clear();
            } else if (apiResponse === 404) {
                this.setState({ message: "Aucun résultat." })
            } else if (apiResponse === 0) {
                this.setState({ message: "Une erreur s'est produite, vérifiez votre connection." })
            }

            if (apiResponse !== -1) {
                this.setState({
                    searchInProgress: false
                });
            }

        }

    }

    render() {

        if (this.state.searchInProgress) {
            Animated.timing(this.state.loaderOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(this.state.loaderOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true
            }).start();
        }

        return (
            <View style={searchFormStyles.container}>
                <View style={searchFormStyles.SearchFormWrapper}>
                    <View style={searchFormStyles.SearchFormInputWrapper}>
                        <TextInput
                            ref={input => { this.textInput = input }}
                            onSubmitEditing={(event) => this.onSubmitEdit(event)}
                            autoCorrect={false}
                            style={searchFormStyles.SearchFormInput}
                            placeholder="Saisir la ville ou le code postal"
                            keyboardType="web-search"></TextInput>
                    </View>
                    <View>
                        <View style={searchFormStyles.SearchFormLoader}>
                            <Animated.View style={{ opacity: this.state.loaderOpacity }}>
                                <ActivityIndicator size={20} color="#EC6E4C" />
                            </Animated.View>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={(event) => this.handlerOnPress(event)}
                        activeOpacity={0.6}
                        underlayColor="transparent">
                        <View style={searchFormStyles.SearchFormButton}>
                            <MaterialIcons name="my-location" size={20} color="#4f4f4f" />
                        </View>
                    </TouchableHighlight>
                </View>
                {this.state.message !== "" &&
                    <Text style={searchFormStyles.message}>{this.state.message}</Text>
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
        },
        getApiResponse: function (apiResponse) {
            var action = getApiResponse(apiResponse);
            dispatch(action);
        }
    }
}

const searchFormStyles = StyleSheet.create({
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
    SearchFormLoader: {
        flex: 1,
        height: 40,
        width: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);