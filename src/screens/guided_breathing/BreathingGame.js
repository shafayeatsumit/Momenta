import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import BreathingGameProgress from './BreathingGameProgress';
import styles from './BreathingGame.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Inhaling',
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      progressCount: 0,
      finalExhaleTime: 0,
      finalInhaleTime: 0,
      touchDisabled: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
    this.animated = new Animated.Value(0);
    // hapticfeedback stuffs

    this.counter = 0;
    this.totalBreaths = props.guidedBreathing.numberOfBreaths;
    this.inhaleTime = props.guidedBreathing.calibrationInhale;
    this.exhaleTime = props.guidedBreathing.calibrationExhale;
    this.targetInhale = props.guidedBreathing.targetInhale;
    this.targetExhale = props.guidedBreathing.targetExhale;
    this.inhaleIncrementValue =
      (this.targetInhale - this.inhaleTime) / this.totalBreaths;
    this.exhlaeIncrementValue =
      (this.targetExhale - this.exhaleTime) / this.totalBreaths;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  animate = (duration) => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.counter += 1;
      if (this.counter < this.totalBreaths) {
        this.startHapticFeedback();
        this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
        this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
        this.setState({circleText: 'Inhaling'});
        const totalTime = this.inhaleTime + this.exhaleTime;
        setTimeout(this.inhalePulse, this.inhaleTime * 1000);
        this.animate(totalTime);
      } else {
        const {progressCount, totalExhaleTime, totalInhaleTime} = this.state;
        this.setState({
          touchDisabled: true,
          circleText: 'Finished',
          finalInhaleTime: totalInhaleTime / progressCount,
          finalExhaleTime: totalExhaleTime / progressCount,
        });
      }
    });
  };

  inhalePulse = () => {
    this.setState({circleText: 'Exhaling'});
    this.startHapticFeedback();
  };

  componentDidMount() {
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.animate(totalTime);
    this.startHapticFeedback();
    this.initAnimatorTimer = setTimeout(() => {
      this.inhalePulse();
      clearTimeout(this.initAnimatorTimer);
    }, this.inhaleTime * 1000);
  }

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
    this.setState({
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
    });
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  breathCompleted = () => {
    const {
      progressCount,
      totalInhaleTime,
      totalExhaleTime,
      inhaleTimeRecorded,
      exhaleTimeRecorded,
    } = this.state;

    this.setState({
      progressCount: progressCount + 1,
      totalInhaleTime: inhaleTimeRecorded + totalInhaleTime,
      totalExhaleTime: exhaleTimeRecorded + totalExhaleTime,
    });
  };

  oneSecError = () => {
    this.resetTime();
  };

  handlePressOut = () => {
    // for reset breath
    if (!this.pressInTime) {
      return;
    }
    const timeTakenInhale = this.measureTime(this.pressInTime);
    if (timeTakenInhale < 1) {
      this.oneSecError();
    } else {
      this.setState({inhaleTimeRecorded: Number(timeTakenInhale)});
    }
    this.pressOutTime = new Date();
  };

  handlePressIn = () => {
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
      circleText,
      touchDisabled,
      finalInhaleTime,
      finalExhaleTime,
    } = this.state;
    const {guidedBreathing} = this.props;
    const {calibrationInhale, calibrationExhale} = guidedBreathing;
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const transform = [{rotate: this.rotate}];
    return (
      <View style={styles.container}>
        {touchDisabled && (
          <View style={styles.resultContainer}>
            <View style={styles.resultTextHolder}>
              <Text style={styles.textSm}>Start Average</Text>
              <Text style={styles.textSm}>
                Inhale: {calibrationInhale.toFixed(2)}
              </Text>
              <Text style={styles.textSm}>
                Exhale: {calibrationExhale.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultTextHolder}>
              <Text style={styles.textSm}>End Average</Text>
              <Text style={styles.textSm}>
                Inhale: {finalInhaleTime.toFixed(2)}
              </Text>
              <Text style={styles.textSm}>
                Exhale: {finalExhaleTime.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        <BreathingGameProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
        {touchDisabled ? (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.props.finish}>
            <Text style={styles.text}>Finish</Text>
          </TouchableOpacity>
        ) : (
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

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(BreathingGame);
