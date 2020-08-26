import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Dimensions,
  Platform,
  Easing,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './Breathing.styles';
import LottieView from 'lottie-react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
import {connect} from 'react-redux';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';

const {width} = Dimensions.get('window');
const size = width - 50;
const strokeWidth = 20;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

class BreathingGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      measuring: false,
      measurementType: null,
      instructionText: INITIAL_MESSAGE,
      inhaleTimeRecorded: false,
      exhaleTimeRecorded: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
    this.counter = 0;
    // hapticfeedback stuffs
    this.totalBreaths = props.courses.totalBreaths;
    this.inhaleTime = 3;
    this.exhaleTime = 2.8;
    this.targetInhaleTime = 4;
    this.targetExhaleTime = 8;
    this.inhaleIncrementValue =
      (this.targetInhaleTime - this.inhaleTime) / this.totalBreaths;
    this.exhlaeIncrementValue =
      (this.targetExhaleTime - this.exhaleTime) / this.totalBreaths;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;

    this.animated = new Animated.Value(0);
  }

  animate = (d) => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: d * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      if (this.counter < 4) {
        this.counter += 1;
        this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
        this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
        this.setState({showOtherHalf: true});
        this.total = this.inhaleTime + this.exhaleTime;
        console.log('exhale+++', this.inhaleTime);
        setTimeout(this.inhalePulse, this.inhaleTime * 1000);
        this.animate(this.total);
      }
    });
  };

  inhalePulse = () => {
    this.setState({showOtherHalf: true});
    console.log('<<<<<inhale pulse', this.exhaleTime);
  };

  componentDidMount() {
    console.log('start pulse', this.inhaleTime);
    this.total = this.inhaleTime + this.exhaleTime;
    this.animate(this.total);
    setTimeout(this.inhalePulse, this.inhaleTime * 1000);
  }

  render() {
    const strokeoffset =
      (2 * Math.PI * radius * this.inhaleTime) /
      (this.inhaleTime + this.exhaleTime);
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const inhaleOffset = 2 * Math.PI * radius * this.inhaleTime - strokeoffset;
    const transform = [{rotate: this.rotate}];
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{rotateZ: '270deg'}],
          }}>
          <Svg width={size} height={size}>
            <Circle
              stroke="silver"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={[circumference, circumference]}
              strokeDashoffset={this.state.showOtherHalf ? 0 : inhaleOffset}
            />
            {this.state.showOtherHalf && (
              <Circle
                stroke="#2162cc"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={[circumference, circumference]}
                strokeDashoffset={-strokeoffset}
              />
            )}
          </Svg>
          <View style={styles.boxContainer}>
            <Animated.View style={[styles.box, {transform: transform}]}>
              <View style={styles.dot} />
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    courses: state.courses,
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(BreathingGame);
