import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';

const remote = require('../assets/backgroundApp.jpg');

class ImageLoader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0)
        }
    }

    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500
        }).start();
    }

    render() {
        return (
            <Animated.Image
                onLoad={this.onLoad}
                {...this.props}
                style={[
                    {
                        opacity: this.state.opacity
                    },
                    this.props.style
                ]}
                blurRadius={5}
            />
        )

    }

}


export default class BackgroundImage extends Component {

    constructor(props) {
        super(props);
        this.state = { imageStatus: "loading" };
    }

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
                <ImageLoader
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
