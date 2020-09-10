import React, {Component} from 'react';
import {
  View,
  Text,
  Easing,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import styles from './CheckInBreath.styles';
const INITIAL_MESSAGE = 'Tap and hold when ready to exhale';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import CheckinProgress from './CheckinProgress';

class CheckInBreath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      circleText: '',
      measurementType: null,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      inhaleCount: 0,
      exhaleCount: 0,
      touchDisabled: false,
      initiMessage: INITIAL_MESSAGE,
      instructionText: '',
    };
    this.pressInTime = null;
    this.pressOutTime = null;
    this.animatedText = new Animated.Value(0);
  }

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
    this.setState({
      measuring: false,
      measurementType: null,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      inhaleCount: 0,
      exhaleCount: 0,
    });
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  fadeOutText = () => {
    this.animatedText.setValue(0);
    this.fadeInText();
  };

  fadeInText = () => {
    Animated.timing(this.animatedText, {
      toValue: 1,
      delay: 500,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  measurmentCompleted = (exhaleTime, inhaleTime) => {
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.setState({
      measuring: false,
      touchDisabled: true,
      circleText: 'DONE measuring',
    });
    console.log(`exhaleTime ${exhaleTime} inhaleTime ${inhaleTime}`);
    this.props.goToBreathingGame(exhaleTime, inhaleTime);
  };

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  breathCompleted = () => {
    const {
      totalInhaleTime,
      totalExhaleTime,
      inhaleTimeRecorded,
      exhaleTimeRecorded,
    } = this.state;
    const avgInhale = inhaleTimeRecorded + totalInhaleTime;
    const avgExhale = exhaleTimeRecorded + totalExhaleTime;
    this.measurmentCompleted(avgExhale, avgInhale);
  };

  moreThanTenSec = () => {
    this.tenSecTimer = setTimeout(() => {
      const {measurementType} = this.state;
      const errorMessage = `${measurementType} for less than 10 seconds`;
      this.setState({
        measuring: false,
        circleText: '',
        instructionText: errorMessage,
      });
      this.resetTime();
      clearTimeout(this.tenSecTimer);
    }, 10000);
  };

  oneSecError = () => {
    const {measurementType} = this.state;
    const inhaleError = 'Tap and hold to inhale for at least 1 second';
    const exhaleError = 'Exhale for at least 1 second';

    const errorMessage =
      measurementType === 'inhale' ? inhaleError : exhaleError;
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.fadeOutText();
    this.setState(
      {circleText: '', instructionText: errorMessage, measuring: false},
      this.resetTime,
    );
  };

  handlePressOut = () => {
    // for reset breath
    if (!this.pressInTime) {
      return;
    }
    const {exhaleCount} = this.state;
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    this.fadeOutText();
    this.setState({
      measurementType: 'inhale',
      circleText: 'Measuring inhale time',
      measuring: true,
      instructionText: '',
    });
    const timeTakenExhale = this.measureTime(this.pressInTime);

    if (timeTakenExhale < 1) {
      this.oneSecError();
    } else {
      this.setState({
        exhaleTimeRecorded: Number(timeTakenExhale),
        exhaleCount: exhaleCount + 1,
      });
    }
    this.pressOutTime = new Date();
    this.startHapticFeedback();
  };

  handlePressIn = () => {
    this.fadeOutText();
    this.setState({
      measuring: true,
      measurementType: 'exhale',
      circleText: 'Measuring exhale time',
      startedMeasuring: true,
      instructionText: '',
    });
    this.startHapticFeedback();
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    if (this.pressInTime) {
      const timeTakenInhale = this.measureTime(this.pressOutTime);
      if (timeTakenInhale < 1) {
        this.oneSecError();
      } else {
        const {inhaleCount} = this.state;
        this.setState(
          {
            inhaleTimeRecorded: Number(timeTakenInhale),
            inhaleCount: inhaleCount + 1,
          },
          this.breathCompleted,
        );
      }
    }
    this.pressInTime = new Date();
  };

  render() {
    const {
      circleText,
      touchDisabled,
      exhaleCount,
      inhaleCount,
      startedMeasuring,
      instructionText,
    } = this.state;
    return (
      <View style={styles.container}>
        {startedMeasuring ? (
          <CheckinProgress breathCount={exhaleCount + inhaleCount} />
        ) : (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>
              Hold during your next{' '}
              <Text style={styles.initTextBold}>exhale</Text>
            </Text>
          </View>
        )}
        {!!instructionText && (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>{instructionText}</Text>
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.containerBox}>
            <Animated.Text style={[styles.text, {opacity: this.animatedText}]}>
              {circleText}
            </Animated.Text>
          </View>
        </View>
        {touchDisabled ? null : (
          <TouchableOpacity
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
            style={styles.touchableArea}
          />
        )}
      </View>
    );
  }
}
export default CheckInBreath;
