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
import styles from './BreathingGame.styles';
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
const TARGET_INHALE = 4;
const TARGET_EXHALE = 6;
//TODO:change the totl breath count
const TOTAL_BREATHS = 5;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Inhaling',
    };

    this.animated = new Animated.Value(0);
    // hapticfeedback stuffs
    this.counter = 0;
    this.inhaleTime = props.checkin.inhaleTime;
    this.exhaleTime = props.checkin.exhaleTime;
    this.inhaleIncrementValue =
      (TARGET_INHALE - this.inhaleTime) / TOTAL_BREATHS;
    this.exhlaeIncrementValue =
      (TARGET_EXHALE - this.exhaleTime) / TOTAL_BREATHS;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  animate = (duration) => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.counter += 1;
      if (this.counter < TOTAL_BREATHS) {
        this.startHapticFeedback();
        this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
        this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
        this.setState({circleText: 'Inhaling'});
        const totalTime = this.inhaleTime + this.exhaleTime;
        setTimeout(this.inhalePulse, this.inhaleTime * 1000);
        this.animate(totalTime);
      }
    });
  };

  inhalePulse = () => {
    this.setState({circleText: 'Exhaling'});
    this.startHapticFeedback();
  };

  componentDidMount() {
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.animate(totalTime);
    this.startHapticFeedback();
    this.initAnimatorTimer = setTimeout(() => {
      this.inhalePulse();
      clearTimeout(this.initAnimatorTimer);
    }, this.inhaleTime * 1000);
  }

  render() {
    const {circleText} = this.state;
    const strokeoffset =
      (2 * Math.PI * radius * this.inhaleTime) /
      (this.inhaleTime + this.exhaleTime);
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const transform = [{rotate: this.rotate}];
    return (
      <View style={styles.container}>
        <Svg width={size} height={size} style={styles.circleContainer}>
          <Circle
            stroke="silver"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={[circumference, circumference]}
          />

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
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
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
