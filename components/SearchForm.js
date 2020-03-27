import React from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getGeoLocation } from "../actions/MeteorActions";
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
                <TextInput
                onSubmitEditing={(event) => this.onSubmitEdit(event)}
                autoCorrect={false}
                style={styles.SearchFormInput}
                placeholder="Saisir la ville ou le code postal"
                keyboardType= "web-search"></TextInput>

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
        apiResponse: state.apiResponse
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGeoLocation: function (geoLocation) {
            var action = getGeoLocation(geoLocation);
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
    SearchFormInput: {
        backgroundColor: "white",
        height: 40,
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20
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