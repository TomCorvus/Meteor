import React, { Component } from 'react';
import {
    View,
    Animated,
    Image
} from 'react-native';
import { connect } from "react-redux";

class BackgroundImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: "",
            opacity: new Animated.Value(0)
        };
    }

    getSkyValue(backgroundImage) {

        switch (backgroundImage) {
            case "clear":
                backgroundImage = require(`../assets/clear.jpg`);
                break;
            case "clouds":
                backgroundImage = require(`../assets/clouds.jpg`);
                break;
            case "rain":
                backgroundImage = require(`../assets/rain.jpg`);
                break;
            case "drizzle":
                backgroundImage = require(`../assets/drizzle.jpg`);
                break;
            case "snow":
                backgroundImage = require(`../assets/snow.jpg`);
                break;
            case "thunderstorm":
                backgroundImage = require(`../assets/thunderstorm.jpg`);
                break;
            default:
                return "";
        }

        this.setState({
            imageSrc: backgroundImage
        })

    }

    _onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500
        }).start();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.skyType !== this.props.skyType) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 0
            }).start();
            this.getSkyValue(this.props.skyType);
        }
    }

    render() {

        const resizeMode = 'stretch';

        if (this.state.imageSrc !== "") {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
                delay: 600
            }).start();
        }

        return (
            <>
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
                    {this.state.imageSrc !== "" &&
                        <Animated.Image
                            style={{
                                flex: 1,
                                resizeMode,
                                opacity: this.state.opacity
                            }}
                            source={this.state.imageSrc}
                            onLoad={this._onLoad}
                            blurRadius={9}
                        />
                    }
                </View>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        skyType: state.skyType
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, null)(BackgroundImage);