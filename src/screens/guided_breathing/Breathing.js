import React, {Component} from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './Breathing.styles';
import LottieView from 'lottie-react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
import {connect} from 'react-redux';

class Breathing extends Component {
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
    this.inhaleTime = props.checkin.inhaleTime;
    this.exhaleTime = props.checkin.exhaleTime;
    this.targetInhaleTime = props.courses.targetInhaleTime;
    this.targetExhaleTime = props.courses.targetExhaleTime;
    this.inhaleIncrementValue =
      (this.targetInhaleTime - this.inhaleTime) / this.totalBreaths;
    this.exhlaeIncrementValue =
      (this.targetExhaleTime - this.exhaleTime) / this.totalBreaths;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.delay = this.inhaleTime;
  }

  shouldShowError = (time) => {
    return time > 6 || time <= 1;
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

  pulse = () => {
    this.counter += 1;
    console.log('buzzzzzz', this.delay);
    this.startHapticFeedback();
    if (this.counter % 2 === 0) {
      // inhale
      this.setState({measurementType: 'Inhale'});
      this.delay = this.inhaleTime + this.inhaleIncrementValue;
      this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    } else {
      // exhale
      this.setState({measurementType: 'Exhale'});
      this.delay = this.exhaleTime + this.exhlaeIncrementValue;
      this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    }
    console.log(this.totalBreaths);

    if (this.counter !== this.totalBreaths * 2) {
      setTimeout(this.pulse, this.delay * 1000);
    } else {
      console.log('finish block', this.counter);
      this.props.finishBreathing();
    }
  };

  handlePressIn = () => {
    this.setState({
      measuring: true,
      instructionText: null,
    });

    if (this.counter === 0) {
      this.startHapticFeedback();
      this.setState({measurementType: 'Inhale'});
      setTimeout(this.pulse, this.delay * 1000);
    }

    if (this.pressInTime) {
      const timeTakenExhale = this.measureTime(this.pressOutTime);
      console.log('timeTakenExhale', timeTakenExhale);
      const showError = this.shouldShowError(timeTakenExhale);
      if (showError) {
        const errorMessage =
          'Almost.Hold and exhale for more than 1s but less than 6s';
        this.setState(
          {instructionText: errorMessage, measuring: false},
          this.resetTime,
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
  };

  handlePressOut = () => {
    if (!this.pressInTime) {
      return;
    }

    this.pressOutTime = new Date();
    const timeTakeInhale = this.measureTime(this.pressInTime);
    console.log('time taken inhale', timeTakeInhale);
    const showError = this.shouldShowError(timeTakeInhale);
    if (showError) {
      const errorMessage =
        'Almost.Hold and inhale for more than 1s but less than 6s';
      this.setState(
        {instructionText: errorMessage, measuring: false},
        this.resetTime,
      );
    } else {
      this.setState({inhaleTimeRecorded: timeTakeInhale});
    }
  };

  render() {
    const {measurementType, measuring, instructionText} = this.state;
    return (
      <View style={styles.container}>
        {measuring && (
          <View style={styles.measurementContainer}>
            <Text style={styles.bottomText}>{measurementType}</Text>
            <LottieView
              autoSize
              autoPlay
              loop
              style={styles.wave}
              source={require('../../../assets/anims/wave.json')}
            />
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

const mapStateToProps = (state, ownProps) => {
  return {
    courses: state.courses,
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(Breathing);
