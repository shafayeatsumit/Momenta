import React, {Component} from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
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
      instructionText: INITIAL_MESSAGE,
      measurementType: null,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      inhaleCount: 0,
      exhaleCount: 0,
      touchDisabled: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
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

  measurmentCompleted = (exhaleTime, inhaleTime) => {
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.setState({
      measuring: false,
      touchDisabled: true,
      instructionText: 'DONE measuring',
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
    console.log(`inhale ${inhaleTimeRecorded} exhale ${exhaleTimeRecorded}`);
    console.log('breath completed ***END***');
    const avgInhale = inhaleTimeRecorded + totalInhaleTime;
    const avgExhale = exhaleTimeRecorded + totalExhaleTime;
    this.measurmentCompleted(avgInhale, avgExhale);
  };

  moreThanTenSec = () => {
    this.tenSecTimer = setTimeout(() => {
      const {measurementType} = this.state;
      const instructionText = `You still there?\n${measurementType} for less than 10 seconds`;
      this.setState({measuring: false, instructionText});
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
    this.setState(
      {instructionText: errorMessage, measuring: false},
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
    this.setState({measurementType: 'inhale', measuring: true});
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
    this.setState({
      measuring: true,
      measurementType: 'exhale',
      instructionText: null,
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
      measurementType,
      measuring,
      instructionText,
      touchDisabled,
      exhaleCount,
      inhaleCount,
    } = this.state;
    return (
      <View style={styles.container}>
        <CheckinProgress
          measuring={measuring}
          measurementType={measurementType}
          instructionText={instructionText}
          breathCount={exhaleCount + inhaleCount}
        />
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
