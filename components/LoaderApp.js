import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';

export default class LoaderApp extends Component {

    constructor(props) {
        super(props);
        this.state = { imageStatus: "loading" };
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 3,
                    backgroundColor: "#000"
                }}
            >
            </View>
        );
    }
}
