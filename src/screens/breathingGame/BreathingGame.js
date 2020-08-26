import React, {Component} from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './BreathingGame.styles';
import LottieView from 'lottie-react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      measurementType: null,
      instructionText: INITIAL_MESSAGE,
      inhaleTimeRecorded: false,
      exhaleTimeRecorded: false,
      showCheckMark: false,
      showResult: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
  }

  shouldShowError = (time) => {
    return time <= 1;
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
  };

  breathCompleted = () => {
    const {inhaleTimeRecorded, exhaleTimeRecorded} = this.state;
    this.props.breathCompleted(inhaleTimeRecorded, exhaleTimeRecorded);
  };

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  resetBreathing = () => {
    this.props.redoBreathing();
    this.resetTime();
  };

  pressInTimeOut = () => {
    this.pressInTimer = setTimeout(() => {
      this.setState(
        {
          instructionText: 'Hold and Inhale for less than 10s',
          measuring: false,
        },
        this.resetBreathing,
      );

      clearTimeout(this.pressInTimer);
    }, 10000);
  };

  pressOutTimeOut = () => {
    this.pressOutTimer = setTimeout(() => {
      this.setState(
        {
          instructionText: 'Hold and Exhale for less than 10s',
          measuring: false,
        },
        this.resetBreathing,
      );

      clearTimeout(this.pressOutTimer);
    }, 10000);
  };
  componentWillUnmount() {
    console.log('component is unmounted');
  }
  handlePressIn = () => {
    this.setState({
      measuring: true,
      measurementType: 'inhale',
      instructionText: null,
    });
    this.pressOutTimer && clearTimeout(this.pressOutTimer);
    this.guidedBreathingTimer && clearTimeout(this.goToGuidedBreathingTimer);

    this.pressInTimeOut();
    if (this.pressInTime) {
      const timeTakenExhale = this.measureTime(this.pressOutTime);
      console.log('timeTakenExhale', timeTakenExhale);
      const showError = this.shouldShowError(timeTakenExhale);
      if (showError) {
        const errorMessage = 'Almost.Hold and exhale for more than 1s';
        this.setState(
          {instructionText: errorMessage, measuring: false},
          this.resetBreathing,
        );
      } else {
        this.setState(
          {
            exhaleTimeRecorded: timeTakenExhale,
          },
          this.breathCompleted,
        );
      }
    }
    this.pressInTime = new Date();
    this.startHapticFeedback();
  };

  redoBreathing = () => {
    this.resetTime();
    this.setState({
      measuring: false,
      measurementType: null,
      instructionText: INITIAL_MESSAGE,
      inhaleTimeRecorded: false,
      exhaleTimeRecorded: false,
      showResult: false,
    });
  };

  goToGuidedBreathing = () => {
    const {progressCount, totalExhaleTime, goToGuidedBreathing} = this.props;
    if (progressCount === 2) {
      const avgExhaleTime = totalExhaleTime / 2;
      this.goToGuidedBreathingTimer = setTimeout(() => {
        goToGuidedBreathing();
      }, avgExhaleTime * 1000);
    }
  };

  handlePressOut = () => {
    if (!this.pressInTime) {
      return;
    }
    this.setState({measurementType: 'exhale'});

    this.pressInTimer && clearTimeout(this.pressInTimer);
    this.pressOutTimeOut();
    this.pressOutTime = new Date();
    const timeTakenInhale = this.measureTime(this.pressInTime);
    console.log('time taken inhale', timeTakenInhale);
    const showError = this.shouldShowError(timeTakenInhale);
    if (showError) {
      const errorMessage = 'Almost.Hold and inhale for more than 1s';
      this.setState(
        {instructionText: errorMessage, measuring: false},
        this.resetBreathing,
      );
    } else {
      this.setState({inhaleTimeRecorded: timeTakenInhale});
    }
    this.goToGuidedBreathing();
    this.startHapticFeedback();
  };

  render() {
    const {measurementType, measuring, instructionText} = this.state;
    return (
      <View style={styles.container}>
        {measuring && (
          <View style={styles.measurementContainer}>
            <Text style={styles.bottomText}>
              Measuring {measurementType} time
            </Text>
          </View>
        )}

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>{instructionText}</Text>
        </View>
        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchableArea}
        />
      </View>
    );
  }
}
export default BreathingGame;
