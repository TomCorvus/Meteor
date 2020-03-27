import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';
import { connect } from "react-redux";

class BackgroundImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: "",
            opacity: new Animated.Value(0),
            nextImageSrc: "",
            nextImageOpacity: new Animated.Value(0)
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
            case "dust":
                backgroundImage = require(`../assets/dust.jpg`);
                break;
            case "sand":
                backgroundImage = require(`../assets/sand.jpg`);
                break;
            case "ash":
                backgroundImage = require(`../assets/ash.jpg`);
                break;
            case "smoke":
                backgroundImage = require(`../assets/smoke.jpg`);
                break;
            case "tornado":
                backgroundImage = require(`../assets/tornado.jpg`);
                break;
            case "haze":
                backgroundImage = require(`../assets/haze.jpg`);
                break;
            case "mist":
                backgroundImage = require(`../assets/mist.jpg`);
                break;
            case "fog":
                backgroundImage = require(`../assets/fog.jpg`);
                break;
            case "squall":
                backgroundImage = require(`../assets/squall.jpg`);
                break;
            default:
                return "";
        }

        return backgroundImage;

    }

    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.skyType !== this.props.skyType) {


            if (this.state.imageSrc === "" && this.state.nextImageSrc === "") {
                this.setState({
                    imageSrc: this.getSkyValue(this.props.skyType),
                    opacity: new Animated.Value(1),
                });
            }

            if (this.getSkyValue(this.props.skyType) !== this.state.imageSrc) {
                this.setState({
                    nextImageSrc: this.getSkyValue(this.props.skyType)
                });
            }

        }
    }

    render() {

        if (this.state.imageSrc !== this.state.nextImageSrc) {

            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start();

            Animated.timing(this.state.nextImageOpacity, {
                toValue: 1,
                duration: 600,
                delay: 300,
                useNativeDriver: true
            }).start(() => {
                this.setState({
                    imageSrc: this.state.nextImageSrc
                })
                Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true
                }).start(() => {
                    Animated.timing(this.state.nextImageOpacity, {
                        toValue: 0,
                        duration: 0,
                        delay: 2000,
                        useNativeDriver: true
                    }).start();
                });
            });

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
                                opacity: this.state.opacity
                            }}
                            resizeMode='cover'
                            source={this.state.imageSrc}
                            onLoad={this.onLoad}
                            blurRadius={9}
                        />
                    }
                </View>
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
                    {this.state.nextImageSrc !== "" &&
                        <Animated.Image
                            style={{
                                flex: 1,
                                opacity: this.state.nextImageOpacity
                            }}
                            resizeMode='cover'
                            source={this.state.nextImageSrc}
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