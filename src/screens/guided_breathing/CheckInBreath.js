import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';

import styles from './CheckInBreath.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {
  inhaleCalm,
  inhaleRelax,
  inhalePrepForSleep,
  inhaleInnterQuiet,
} from '../../helpers/checkinInhale';

const INITIAL_MESSAGE = 'Hold below during your\n next';

class CheckInBreath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      touchDisabled: false,
      initialMessage: INITIAL_MESSAGE,
      instructionText: '',
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

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  measurmentCompleted = (exhaleTime, inhaleTime) => {
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.setState({
      measuring: false,
      touchDisabled: true,
    });
    this.props.buildCustomExercise(exhaleTime, inhaleTime);
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

  moreThanTenSec = () => {
    this.tenSecTimer = setTimeout(() => {
      const errorMessage = 'Exhale must\nbe less than 10 seconds';
      this.setState({
        measuring: false,
        circleText: '',
        instructionText: errorMessage,
        initialMessage: INITIAL_MESSAGE,
      });
      this.resetTime();
      clearTimeout(this.tenSecTimer);
      this.vibrateLoopId && clearInterval(this.vibrateLoopId);
    }, 10000);
  };

  threeSecsError = () => {
    const errorMessage = 'Exhale must be\nat least 3 seconds long';

    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.setState(
      {
        instructionText: errorMessage,
        measuring: false,
        initialMessage: INITIAL_MESSAGE,
      },
      this.resetTime,
    );
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  };

  getCalibratoinInhale = (exhaleTime) => {
    const {breathingId} = this.props;
    if (breathingId === 'calm') {
      return inhaleCalm(exhaleTime);
    } else if (breathingId === 'relax') {
      return inhaleRelax(exhaleTime);
    } else if (breathingId === 'inner_quiet') {
      return inhaleInnterQuiet(exhaleTime);
    } else {
      return inhalePrepForSleep(exhaleTime);
    }
  };

  handlePressOut = () => {
    analytics().logEvent('calibration_release');
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    const timeTakenExhale = Number(this.measureTime(this.pressInTime));
    // here I have to work
    if (timeTakenExhale < 3) {
      this.threeSecsError();
      return;
    }
    if (timeTakenExhale > 10) {
      return;
    }
    const calibrationInhale = this.getCalibratoinInhale(timeTakenExhale);
    this.measurmentCompleted(timeTakenExhale, calibrationInhale);
    this.pressOutTime = new Date();
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  };

  handlePressIn = () => {
    analytics().logEvent('calibration_hold');
    this.setState({
      measuring: true,
      instructionText: '',
      initialMessage: '',
    });
    this.animation.play();
    this.vibrateLoop();
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
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
    const {instructionText, measuring, initialMessage} = this.state;
    const hasInstruction = !!instructionText;
    return (
      <View style={styles.container}>
        <View style={styles.circleHolder}>
          <View style={styles.circle}>
            {hasInstruction ? (
              <View style={styles.instructionTextHolder}>
                <Text style={styles.instructionText}>{instructionText}</Text>
              </View>
            ) : (
              <>
                {measuring ? (
                  <Text style={styles.text}>
                    Measuring{'\n'}your exhale time
                  </Text>
                ) : (
                  <Text style={styles.text}>Ready</Text>
                )}
              </>
            )}
            <LottieView
              source={require('../../../assets/anims/measuring.json')}
              autoPlay={false}
              loop
              style={styles.animation}
              ref={(animation) => {
                this.animation = animation;
              }}
            />
          </View>
        </View>
        {!!initialMessage && (
          <View style={styles.bottomTextHolder} pointerEvents="none">
            <Text style={styles.bottomText}>
              {initialMessage} <Text style={styles.bottomTextBold}>exhale</Text>
            </Text>
            <Image
              style={styles.targetIcon}
              source={require('../../../assets/icons/target.png')}
            />
          </View>
        )}
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
