import React from 'react';
import { StyleSheet, View } from 'react-native';

import DayWidget from './DayWidget';
import FiveDaysWidget from './FiveDaysWidget';

import SearchForm from './SearchForm';
import BackgroundApp from './BackgroundApp';
import LoaderApp from './LoaderApp';

export default class MeteorWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 3000);
    }

    render() {
        return (
            <>
                {!this.state.spinner ? (
                    < LoaderApp
                        visible={this.state.spinner}
                    />
                ) : (
                        <View style={styles.container}>
                            <BackgroundApp />
                            <SearchForm />
                            <DayWidget />
                            <FiveDaysWidget />
                        </View>
                    )}
            </>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
