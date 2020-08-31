import React, {Component} from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import styles from './CheckInBreath.styles';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
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

  measurmentCompleted = (avgInhale, avgExhale) => {
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.setState({
      measuring: false,
      touchDisabled: true,
      instructionText: 'DONE measuring',
    });
    this.props.goToBreathingGame(avgInhale, avgExhale);
  };

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  breathCompleted = () => {
    const {
      inhaleCount,
      exhaleCount,
      totalInhaleTime,
      totalExhaleTime,
      inhaleTimeRecorded,
      exhaleTimeRecorded,
    } = this.state;
    // console.log(`inhale ${inhaleTimeRecorded} exhale ${exhaleTimeRecorded}`);
    const totalBreath = inhaleCount + exhaleCount;
    if (totalBreath === 6) {
      const avgInhale = (inhaleTimeRecorded + totalInhaleTime) / 3;
      const avgExhale = (exhaleTimeRecorded + totalExhaleTime) / 3;
      this.measurmentCompleted(avgInhale, avgExhale);
    } else {
      this.setState({
        totalInhaleTime: inhaleTimeRecorded + totalInhaleTime,
        totalExhaleTime: exhaleTimeRecorded + totalExhaleTime,
      });
    }
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
    const {inhaleCount} = this.state;
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    this.setState({measurementType: 'exhale', measuring: true});
    const timeTakenInhale = this.measureTime(this.pressInTime);

    if (timeTakenInhale < 1) {
      this.oneSecError();
    } else {
      this.setState({
        inhaleTimeRecorded: Number(timeTakenInhale),
        inhaleCount: inhaleCount + 1,
      });
    }

    this.pressOutTime = new Date();
    this.startHapticFeedback();
  };

  handlePressIn = () => {
    this.setState({
      measuring: true,
      measurementType: 'inhale',
      instructionText: null,
    });
    this.startHapticFeedback();
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    if (this.pressInTime) {
      const timeTakenExhale = this.measureTime(this.pressOutTime);
      if (timeTakenExhale < 1) {
        this.oneSecError();
      } else {
        const {exhaleCount} = this.state;
        this.setState(
          {
            exhaleTimeRecorded: Number(timeTakenExhale),
            exhaleCount: exhaleCount + 1,
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
      inhaleCount,
      exhaleCount,
    } = this.state;
    return (
      <View style={styles.container}>
        <CheckinProgress
          measuring={measuring}
          measurementType={measurementType}
          instructionText={instructionText}
          breathCount={inhaleCount + exhaleCount}
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
