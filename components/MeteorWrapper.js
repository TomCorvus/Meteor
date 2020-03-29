import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { connect } from "react-redux";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getGeoCoordinates, getApiResponse } from "../actions/MeteorActions";
import SearchForm from './SearchForm';
import DayWidget from './DayWidget';
import ForecastWidget from './ForecastWidget';

class MeteorWrapper extends React.Component {

    constructor(props) {
        super(props);
    }

    getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        let geoCoordinates = { latitude: location.coords.latitude, longitude: location.coords.longitude }

        this.props.getGeoCoordinates(geoCoordinates);

    }

    componentDidUpdate(prevProps) {

        if (this.props.apiResponse === -1) {

            if (this.props.apiDayResponse === 200 && this.props.apiForecastResponse === 200) {
                this.props.getApiResponse(200);
            } else if (this.props.apiDayResponse === 404 || this.props.apiForecastResponse === 404) {
                this.props.getApiResponse(404);
            } else if (this.props.apiDayResponse === 0 || this.props.apiForecastResponse === 0) {
                this.props.getApiResponse(0);
            }

        }

    }

    componentDidMount() {
        this.getLocationAsync();
    }

    render() {
        return (
            <ScrollView style={meteorWrapperStyles.meteorContainer}>
                <StatusBar barStyle={'light-content'} />
                <SearchForm />
                <DayWidget />
                <ForecastWidget />
            </ScrollView>
        )
    }

}

function mapStateToProps(state) {
    return {
        geoLocation: state.geoLocation,
        geoCoordinates: state.geoCoordinates,
        apiResponse: state.apiResponse,
        apiDayResponse: state.apiDayResponse,
        apiForecastResponse: state.apiForecastResponse,
    }
}

function mapDispatchToProps(dispatch) {
    return {
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

const meteorWrapperStyles = StyleSheet.create({
    meteorContainer: {
        flex: 1
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeteorWrapper);