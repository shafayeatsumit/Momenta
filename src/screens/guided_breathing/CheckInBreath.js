import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import BullsEye from '../../components/BullsEye';
import styles from './CheckInBreath.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import CheckinError from './CheckinError';
import CheckinResult from './CheckinResult';

const INITIAL_MESSAGE = 'Hold below during your\n next';

class CheckInBreath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      touchDisabled: false,
      centerText: INITIAL_MESSAGE,
      error: '',
      showResult: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
  }

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
    this.setState({
      measuring: false,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
    });
  };

  resetCalibration = () => {
    analytics().logEvent('button_push', {title: 'redo'});
    this.pressInTime = null;
    this.pressOutTime = null;
    this.setState({
      measuring: false,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      touchDisabled: false,
      centerText: INITIAL_MESSAGE,
      error: '',
      showResult: false,
    });
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  startExhalePulse = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  vibrateLoop = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
    this.vibrateLoopId = setInterval(() => {
      ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    }, 900);
  };

  moreThanTenSec = (breathingType) => {
    this.tenSecTimer = setTimeout(() => {
      const errorMessage = `${breathingType} must\nbe less than 8 seconds`;
      this.setState({
        measuring: false,
        circleText: '',
        error: errorMessage,
        centerText: INITIAL_MESSAGE,
      });
      this.resetTime();
      clearTimeout(this.tenSecTimer);
      this.vibrateLoopId && clearInterval(this.vibrateLoopId);
    }, 10000);
  };

  twoSecsError = (breathingType) => {
    const errorMessage = `${breathingType} must be\nat least 2 seconds long`;
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.setState(
      {
        error: errorMessage,
        measuring: false,
        centerText: INITIAL_MESSAGE,
      },
      this.resetTime,
    );
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  };

  handlePressOut = () => {
    analytics().logEvent('calibration_release');
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec('Inhale');
    const timeTakenExhale = Number(this.measureTime(this.pressInTime));
    // here I have to work
    if (timeTakenExhale < 2) {
      this.twoSecsError('Exhale');
      return;
    }
    if (timeTakenExhale > 8) {
      return;
    }
    this.pressOutTime = new Date();
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
    this.setState({
      exhaleTimeRecorded: timeTakenExhale,
    });
  };

  buildExercise = () => {
    analytics().logEvent('button_push', {title: 'use_calibration'});
    const {exhaleTimeRecorded} = this.state;
    const inhaleTime = Math.max(exhaleTimeRecorded, 3);
    this.props.buildCustomExercise(exhaleTimeRecorded, inhaleTime);
  };

  measureInhaleTime = () => {
    const timeTakenInhale = Number(this.measureTime(this.pressOutTime));

    if (timeTakenInhale < 2) {
      this.twoSecsError('Inhale');
      return;
    }
    if (timeTakenInhale > 8) {
      return;
    }
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.setState({
      inhaleTimeRecorded: timeTakenInhale,
      showResult: true,
      measuring: false,
    });
    // clear timers;
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
  };

  handlePressIn = () => {
    this.setState({
      measuring: true,
      error: '',
      centerText: '',
    });
    this.animation.play();
    const playVibrationLoop = !this.pressOutTime;
    playVibrationLoop && this.vibrateLoop();
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec('Exhale');
    this.pressInTime = new Date();
    analytics().logEvent('calibration_hold');
    if (this.pressOutTime) {
      this.measureInhaleTime();
    }
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

  handleXout = () => {
    this.props.goBack();
    analytics().logEvent('button_push', {title: 'quit'});
  };

  handleSkipCalibration = () => {
    this.props.goBack();
    analytics().logEvent('button_push', {title: 'skip_calibration'});
  };

  render() {
    const {
      error,
      measuring,
      centerText,
      exhaleTimeRecorded,
      inhaleTimeRecorded,
      showResult,
    } = this.state;
    const hasError = !!error;
    const showInhaleInstruction = measuring && exhaleTimeRecorded;
    const showExhaleInsturction = measuring && !exhaleTimeRecorded;

    if (hasError) {
      return (
        <CheckinError
          error={error}
          handleRedo={this.resetCalibration}
          handleSkip={this.handleSkipCalibration}
        />
      );
    }

    if (showResult) {
      return (
        <CheckinResult
          inhaleTime={inhaleTimeRecorded}
          exhaleTime={exhaleTimeRecorded}
          handleRedo={this.resetCalibration}
          handleUse={this.buildExercise}
        />
      );
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backbuttonHolder}
          onPress={this.handleXout}>
          <Image
            source={require('../../../assets/icons/arrow_left.png')}
            style={styles.backbutton}
          />
        </TouchableOpacity>

        {showInhaleInstruction ? (
          <Text allowFontScaling={false} style={styles.text}>
            Tap when done inhaling
          </Text>
        ) : null}
        {showExhaleInsturction ? (
          <Text style={styles.text}>
            Release when done{' '}
            <Text allowFontScaling={false} style={styles.boldText}>
              exhaling
            </Text>
          </Text>
        ) : null}
        <LottieView
          source={require('../../../assets/anims/measuring.json')}
          autoPlay={false}
          loop
          style={styles.animation}
          ref={(animation) => {
            this.animation = animation;
          }}
        />
        <View style={styles.absolutePosition}>
          {!measuring && <View style={styles.animationHide} />}
        </View>
        <View style={styles.absolutePosition}>
          {centerText ? (
            <Text allowFontScaling={false} style={styles.text}>
              Hold below during your {'\n'}next
              <Text allowFontScaling={false} style={styles.boldText}>
                {' '}
                exhale
              </Text>
            </Text>
          ) : null}
        </View>

        <BullsEye />

        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchableArea}
        />
      </View>
    );
  }
}

export default CheckInBreath;
