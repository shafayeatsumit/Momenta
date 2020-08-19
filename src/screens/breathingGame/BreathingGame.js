import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './BreathingGame.styles';
import LottieView from 'lottie-react-native';

const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
const FINISH_MESSAGE = 'Tap as you finish exhaling';

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
    return time > 6 || time <= 1;
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(1);
  };

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
  };

  breathCompleted = () => {
    const {inhaleTimeRecorded, exhaleTimeRecorded} = this.state;
    this.props.breathCompleted(inhaleTimeRecorded, exhaleTimeRecorded);
  };

  handlePressIn = () => {
    const {measuring} = this.state;
    !measuring &&
      this.setState({
        measuring: true,
        measurementType: 'inhale',
        instructionText: null,
      });
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

  handlePressOut = () => {
    if (!this.pressInTime) {
      return;
    }

    this.setState({
      measurementType: 'exhale',
    });

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
            <Text style={styles.bottomText}>
              Measuring {measurementType} time
            </Text>
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
export default BreathingGame;
