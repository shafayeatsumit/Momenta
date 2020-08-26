import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import styles from './CheckInBreath.styles';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';

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
      progressCount: 0,
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
      progressCount: 0,
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

  breathCompleted = () => {
    const {
      progressCount,
      totalInhaleTime,
      totalExhaleTime,
      inhaleTimeRecorded,
      exhaleTimeRecorded,
    } = this.state;
    console.log(`inhale ${inhaleTimeRecorded} exhale ${exhaleTimeRecorded}`);
    if (progressCount === 2) {
      const avgInhale = (inhaleTimeRecorded + totalInhaleTime) / 3;
      const avgExhale = (exhaleTimeRecorded + totalExhaleTime) / 3;
      this.measurmentCompleted(avgInhale, avgExhale);
    } else {
      this.setState({
        progressCount: progressCount + 1,
        totalInhaleTime: inhaleTimeRecorded + totalInhaleTime,
        totalExhaleTime: exhaleTimeRecorded + totalExhaleTime,
      });
    }
  };

  moreThanTenSec = () => {
    this.tenSecTimer = setTimeout(() => {
      console.log('more than 5 sec');
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

  goToGuidedBreathTimer = (avgTime) => {
    this.exhaleTimer = setTimeout(() => {
      console.log('Later then expected');
      this.setState(
        {exhaleTimeRecorded: Number(avgTime)},
        this.breathCompleted,
      );
    }, avgTime * 1000);
  };

  handlePressOut = () => {
    // for reset breath
    if (!this.pressInTime) {
      return;
    }
    const {progressCount, totalExhaleTime} = this.state;
    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    this.setState({measurementType: 'exhale', measuring: true});
    const timeTakenInhale = this.measureTime(this.pressInTime);
    // logic for last exhale time
    if (progressCount === 2) {
      const avgOfTwoExhales = totalExhaleTime / 2;
      this.goToGuidedBreathTimer(avgOfTwoExhales);
    }
    if (timeTakenInhale < 1) {
      this.oneSecError();
    } else {
      this.setState({inhaleTimeRecorded: Number(timeTakenInhale)});
    }

    this.pressOutTime = new Date();
  };

  handlePressIn = () => {
    this.setState({
      measuring: true,
      measurementType: 'inhale',
      instructionText: null,
    });

    this.tenSecTimer && clearTimeout(this.tenSecTimer);
    this.moreThanTenSec();
    if (this.pressInTime) {
      const timeTakenExhale = this.measureTime(this.pressOutTime);
      if (timeTakenExhale < 1) {
        this.oneSecError();
      } else {
        this.setState(
          {exhaleTimeRecorded: Number(timeTakenExhale)},
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
    } = this.state;

    return (
      <View style={styles.container}>
        {measuring && (
          <View style={styles.textContainer}>
            <Text style={styles.text}>Measuring {measurementType}</Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.text}>{instructionText}</Text>
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
