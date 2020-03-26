import React, { Component } from 'react';
import {
    AppRegistry,
    Image,
    View,
    Text,
} from 'react-native';

const remote = require('../assets/backgroundApp.jpg');

export default class BackgroundImage extends Component {
    render() {

        const resizeMode = 'stretch';

        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            >
                <Image
                    style={{
                        flex: 1,
                        resizeMode
                    }}
                    source={remote}
                />
            </View>

        );
    }
}
