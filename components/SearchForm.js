import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getLocation } from "../actions/MeteorActions";
import { connect } from "react-redux";

class SearchForm extends React.Component {

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
        });

        this.props.getLocation(event.nativeEvent.text);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onSubmitEditing={(event) => this.onSubmitEdit(event)} autoCorrect={true} style={styles.SearchFormInput} placeholder="Adresse postale"></TextInput>
            </View>
        )
    }

}

function mapStateToProps(state) {
    return {
        geolocation: state.geolocation
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLocation: function (geolocation) {
            var action = getLocation(geolocation);
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

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
