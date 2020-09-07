import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import BreathingGameProgress from './BreathingGameProgress';
import styles from './BreathingGame.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Exhaling',
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
    this.finishBreathingTime = props.guidedBreathing.numberOfBreaths * 60; // in secs
    this.totalBreathingTime = 0;
    this.totalBreaths = props.guidedBreathing.numberOfBreaths;
    this.exhaleTime = props.guidedBreathing.calibrationExhale;
    this.inhaleTime = props.guidedBreathing.calibrationInhale;
    this.targetExhale = props.guidedBreathing.targetExhale;
    this.targetInhale = props.guidedBreathing.targetInhale;
    this.avgExhale = avgExhale(this.exhaleTime, this.targetExhale);
    this.avgInhale = avgInhale(this.inhaleTime, this.targetInhale);
    this.firstThresholdBreathCount = Math.floor(
      props.guidedBreathing.firstThreshold / (this.avgInhale + this.avgExhale),
    );
    this.exhlaeIncrementValue =
      (this.targetExhale - this.exhaleTime) / this.firstThresholdBreathCount;
    this.inhaleIncrementValue =
      (this.targetInhale - this.inhaleTime) / this.firstThresholdBreathCount;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'contextClick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  loopHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'virtualKey';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  secondThresholdSetup = () => {
    const {
      targetInhale,
      targetExhale,
      secondTargetInhale,
      secondTargetExhale,
      secondThreshold,
    } = this.props.guidedBreathing;
    this.avgInhale = avgInhale(targetInhale, secondTargetInhale);
    this.avgExhale = avgExhale(targetExhale, secondTargetExhale);
    this.secondThresholdBreathCount = Math.floor(
      secondThreshold / (this.avgInhale + this.avgExhale),
    );
    this.inhaleIncrementValue =
      (secondTargetInhale - targetInhale) / this.secondThresholdBreathCount;
    this.exhlaeIncrementValue =
      (secondTargetExhale - targetExhale) / this.secondThresholdBreathCount;
    this.counter = 0;
  };

  animateCB = (noIncrement = false) => {
    if (this.totalBreathingTime > this.finishBreathingTime) {
      this.animateCBFinish();
      return;
    }
    this.startHapticFeedback();
    this.inhaleTime = noIncrement
      ? this.inhaleTime
      : this.inhaleTime + this.inhaleIncrementValue;
    this.exhaleTime = noIncrement
      ? this.exhaleTime
      : this.exhaleTime + this.exhlaeIncrementValue;
    this.setState({circleText: 'Exhaling'});
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.totalBreathingTime = this.totalBreathingTime + totalTime;
    this.exhaleEndPulseTimer = setTimeout(() => {
      this.exhaleEndPulse();
      clearTimeout(this.exhaleEndPulseTimer);
    }, this.exhaleTime * 1000);
    this.animate(totalTime);
  };

  animateCBFinish = () => {
    const {progressCount, totalExhaleTime, totalInhaleTime} = this.state;
    this.setState({
      touchDisabled: true,
      circleText: 'Finished',
      finalInhaleTime: totalInhaleTime / progressCount,
      finalExhaleTime: totalExhaleTime / progressCount,
    });
  };

  animate = (duration) => {
    this.animated.setValue(0);
    this.vibrateLoop();
    Animated.timing(this.animated, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.counter += 1;
      const {secondThreshold} = this.props.guidedBreathing;
      if (this.counter < this.firstThresholdBreathCount) {
        this.animateCB();
      } else if (secondThreshold) {
        !this.secondThresholdBreathCount && this.secondThresholdSetup();
        this.counter < this.secondThresholdBreathCount
          ? this.animateCB()
          : this.animateCB(true);
      } else {
        this.animateCB(true);
        // continue without increment
      }
    });
  };

  exhaleEndPulse = () => {
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
    this.setState({circleText: 'Inhaling'});
    this.startHapticFeedback();
  };

  componentDidMount() {
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.totalBreathingTime = this.totalBreathingTime + totalTime;
    this.animate(totalTime);
    this.initExhalePulseTimer = setTimeout(() => {
      this.exhaleEndPulse();
      clearTimeout(this.initExhalePulseTimer);
    }, this.exhaleTime * 1000);
  }

  componentWillUnmount() {
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
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
    const timeTakenExhale = this.measureTime(this.pressInTime);
    if (timeTakenExhale < 1) {
      this.oneSecError();
    } else {
      this.setState({exhaleTimeRecorded: Number(timeTakenExhale)});
    }
    this.pressOutTime = new Date();
  };

  vibrateLoop = () => {
    this.vibrateLoopId = setInterval(this.loopHapticFeedback, 30);
  };

  handlePressIn = () => {
    if (this.pressInTime) {
      const timeTakenInhale = this.measureTime(this.pressOutTime);
      if (timeTakenInhale < 1) {
        this.oneSecError();
      } else {
        this.setState(
          {inhaleTimeRecorded: Number(timeTakenInhale)},
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
    const {guidedBreathing, musicOn, handleMusic} = this.props;
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
        <TouchableOpacity onPress={handleMusic} style={styles.musicIconHolder}>
          <Image
            style={styles.musicIcon}
            source={musicOn ? MusicIcon : NoMusicIcon}
          />
        </TouchableOpacity>
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
