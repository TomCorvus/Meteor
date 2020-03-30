import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet
} from 'react-native';
import { connect } from "react-redux";

class BackgroundImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backImageSrc: "",
            backImageOpacity: new Animated.Value(0),
            frontImageSrc: "",
            frontImageOpacity: new Animated.Value(0),
            displayedImage: 1,
            skyTypeList: []
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
            case "night":
                backgroundImage = require(`../assets/night.jpg`);
                break;
            default:
                backgroundImage = require(`../assets/default.jpg`);
        }

        return backgroundImage;

    }

    onBackImageLoad = () => {

        Animated.timing(this.state.frontImageOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.backImageOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                displayedImage: 1
            });
        });

    }

    onFrontImageLoad = () => {

        Animated.timing(this.state.backImageOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.frontImageOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                displayedImage: 2
            });
        });

    }

    componentDidUpdate(prevProps) {

        if (prevProps.skyType !== this.props.skyType) {

            let imageAlreadyExist;

            if (this.state.skyTypeList.indexOf(this.props.skyType) === -1) {
                this.state.skyTypeList.push(this.props.skyType);
                imageAlreadyExist = false;
            } else {
                imageAlreadyExist = true;
            }

            if (this.state.backImageSrc === "") {
                this.setState({
                    backImageSrc: this.getSkyValue(this.props.skyType)
                });
            } else if (this.state.frontImageSrc === "" && this.state.displayedImage === 1) {
                this.setState({
                    frontImageSrc: this.getSkyValue(this.props.skyType)
                });
            } else if (this.getSkyValue(this.props.skyType) !== this.state.backImageSrc && this.state.displayedImage === 1) {
                this.setState({
                    frontImageSrc: this.getSkyValue(this.props.skyType)
                });
                if (imageAlreadyExist === true) {
                    this.onFrontImageLoad();
                }
            } else if (this.getSkyValue(this.props.skyType) !== this.state.frontImageSrc && this.state.displayedImage === 2) {
                this.setState({
                    backImageSrc: this.getSkyValue(this.props.skyType)
                });
                if (imageAlreadyExist === true) {
                    this.onBackImageLoad();
                }
            }

        }
    }

    render() {

        return (
            <View style={backgroundStyles.backgroundsWrapper}>
                <View style={backgroundStyles.backBackgroundWrapper}>
                    {this.state.backImageSrc !== "" &&
                        <Animated.Image
                            key={1}
                            style={{
                                flex: 1,
                                opacity: this.state.backImageOpacity
                            }}
                            resizeMode='cover'
                            source={this.state.backImageSrc}
                            onLoad={this.onBackImageLoad}
                            blurRadius={9}
                        />
                    }
                </View>
                <View style={backgroundStyles.frontBackgroundWrapper}>
                    {this.state.frontImageSrc !== "" &&
                        <Animated.Image
                            key={2}
                            style={{
                                flex: 1,
                                opacity: this.state.frontImageOpacity
                            }}
                            resizeMode='cover'
                            onLoad={this.onFrontImageLoad}
                            source={this.state.frontImageSrc}
                            blurRadius={9}
                        />
                    }
                </View>
            </View>
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

const backgroundStyles = StyleSheet.create({
    backgroundsWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    backBackgroundWrapper: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    frontBackgroundWrapper: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
    },
});

export default connect(mapStateToProps, null)(BackgroundImage);