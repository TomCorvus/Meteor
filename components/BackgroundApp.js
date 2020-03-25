import React, { Component } from 'react';
import {
    AppRegistry,
    Image,
    View,
    Text,
} from 'react-native';

const remote = 'https://angularscript.com/wp-content/uploads/2018/06/Progressively-Loading-Images-With-Blur-Effect-min.png';

export default class BackgroundImage extends Component {
    render() {
        const resizeMode = 'cover';

        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
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
                    source={{ uri: remote }}
                />
            </View>

        );
    }
}
