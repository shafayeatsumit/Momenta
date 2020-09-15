import React, {Component} from 'react';
import {View, Text, Easing, Platform, Animated} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';

import styles from './CheckInBreath.styles';
import CheckinProgress from './CheckinProgress';
import {hapticFeedbackOptions} from '../../helpers/constants/common';

const INITIAL_MESSAGE = 'Tap and hold when ready to exhale';
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
    this.animatedView = new Animated.Value(0);
    this.animatedText = new Animated.Value(1);
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

  fadeOutView = () => {
    this.animatedView.setValue(0);
    this.fadeInView();
  };

  fadeInText = () => {
    Animated.timing(this.animatedText, {
      toValue: 1,
      delay: 0,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  fadeOutText = () => {
    this.animatedText.setValue(0);
    this.fadeInText();
  };

  fadeInView = () => {
    Animated.timing(this.animatedView, {
      toValue: 1,
      delay: 0,
      duration: 800,
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
      circleText: '',
    });

    this.props.goToBreathingGame(exhaleTime, inhaleTime);
  };

  startExhalePulse = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
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
    this.startExhalePulse();
  };

  vibrateLoop = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
    this.vibrateLoopId = setInterval(() => {
      ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    }, 900);
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
      this.vibrateLoopId && clearInterval(this.vibrateLoopId);
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
    this.fadeOutView();
    this.setState(
      {circleText: '', instructionText: errorMessage, measuring: false},
      this.resetTime,
    );
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
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
      circleText: 'inhale time',
      measuring: true,
      instructionText: 'Hold when done inhaling to start',
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
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  };

  handlePressIn = () => {
    this.fadeOutView();
    this.setState({
      measuring: true,
      measurementType: 'exhale',
      circleText: 'exhale time',
      instructionText: '',
      startedMeasuring: true,
    });
    this.vibrateLoop();
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

  componentDidUpdate(prevProps) {
    if (
      this.props.pressIn !== prevProps.pressIn ||
      this.props.pressOut !== prevProps.pressOut
    ) {
      this.props.pressIn && this.handlePressIn();
      this.props.pressOut && this.handlePressOut();
    }
  }

  componentWillUnmount() {
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  }

  render() {
    const {
      circleText,
      exhaleCount,
      inhaleCount,
      startedMeasuring,
      instructionText,
      measuring,
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
          <Animated.View
            style={[styles.containerBox, {opacity: this.animatedView}]}>
            {!!circleText && <Text style={styles.text}>Measuring </Text>}
            <Animated.Text style={[styles.text, {opacity: this.animatedText}]}>
              {circleText}
            </Animated.Text>

            {measuring && (
              <LottieView
                autoSize
                autoPlay
                loop
                style={styles.wave}
                source={require('../../../assets/anims/wave.json')}
              />
            )}
          </Animated.View>
        </View>
      </View>
    );
  }
}

export default CheckInBreath;
