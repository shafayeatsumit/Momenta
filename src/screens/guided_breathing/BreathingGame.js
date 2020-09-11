import React, {Component} from 'react';
import {View, Animated, Text, Platform, Easing} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProgressTracker from '../../components/ProgressTracker';
import BreathingStats from './BreathingStats';
import BreathingGameProgress from './BreathingGameProgress';
import styles from './BreathingGame.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Exhale',
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      progressCount: 0,
      finalExhaleTime: 0,
      finalInhaleTime: 0,
      timer: 0,
      touchDisabled: false,
      targetVisible: false,
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
    this.firstThresholdBreathCount = Math.ceil(
      props.guidedBreathing.firstThreshold / (this.avgInhale + this.avgExhale),
    );
    this.exhlaeIncrementValue =
      (this.targetExhale - this.exhaleTime) / this.firstThresholdBreathCount;
    this.inhaleIncrementValue =
      (this.targetInhale - this.inhaleTime) / this.firstThresholdBreathCount;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.unmount = false;

    // press in
    props.pressIn && this.handlePressIn();
  }

  startHapticFeedback = () => {
    const feedbackType = 'impactHeavy';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  vibrateLoop = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactLight' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    this.vibrateLoopId = setInterval(() => {
      ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    }, 1000);
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
    this.secondThresholdBreathCount = Math.ceil(
      secondThreshold / (this.avgInhale + this.avgExhale),
    );
    this.inhaleIncrementValue =
      (secondTargetInhale - targetInhale) / this.secondThresholdBreathCount;
    this.exhlaeIncrementValue =
      (secondTargetExhale - targetExhale) / this.secondThresholdBreathCount;
    this.counter = 0;
  };

  animateCB = (noIncrement = false) => {
    console.log('+++animateCB+++');
    let finished = false;
    if (this.unmount) {
      return;
    }
    if (this.totalBreathingTime > this.finishBreathingTime) {
      this.animateCBFinish();
      finished = true;
    }
    this.startHapticFeedback();
    this.inhaleTime =
      noIncrement || finished
        ? this.inhaleTime
        : this.inhaleTime + this.inhaleIncrementValue;
    this.exhaleTime =
      noIncrement || finished
        ? this.exhaleTime
        : this.exhaleTime + this.exhlaeIncrementValue;
    this.setState({circleText: 'Exhale'});

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
    this.props.setFinished();
    this.setState({
      touchDisabled: true,
      circleText: 'Finished',
      finalInhaleTime: totalInhaleTime / progressCount,
      finalExhaleTime: totalExhaleTime / progressCount,
    });
    clearInterval(this.stopWatchId);
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
      const {secondThreshold} = this.props.guidedBreathing;
      const {targetVisible} = this.state;
      if (this.counter < this.firstThresholdBreathCount) {
        this.animateCB();
      } else if (secondThreshold) {
        targetVisible && this.setState({targetVisible: false});
        !this.secondThresholdBreathCount && this.secondThresholdSetup();
        this.counter < this.secondThresholdBreathCount
          ? this.animateCB()
          : this.animateCB(true);
      } else {
        targetVisible && this.setState({targetVisible: false});
        this.animateCB(true);
        // continue without increment
      }
    });
  };

  exhaleEndPulse = () => {
    this.setState({circleText: 'Inhale'});
    this.startHapticFeedback();
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
  };

  startStopWatch = () => {
    this.stopWatchId = setInterval(() => {
      if (this.state.timer >= this.finishBreathingTime) {
        clearInterval(this.stopWatchId);
        return;
      }
      this.setState({timer: this.state.timer + 1});
    }, 1000);
  };

  showTarget = (totalTime) => {
    this.showTargetTimerId = setTimeout(() => {
      this.setState({targetVisible: true});
      clearTimeout(this.showTargetTimerId);
    }, totalTime * 1000 - 500);
  };

  componentDidMount() {
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.totalBreathingTime = this.totalBreathingTime + totalTime;
    this.animate(totalTime);
    this.showTarget(totalTime);
    this.initExhalePulseTimer = setTimeout(() => {
      this.exhaleEndPulse();
      clearTimeout(this.initExhalePulseTimer);
    }, this.exhaleTime * 1000);
    this.startStopWatch();
  }

  componentWillUnmount() {
    console.log('component will unmount');
    this.unmount = true;
    this.exhaleEndPulseTimer && clearTimeout(this.exhaleEndPulseTimer);
    this.initExhalePulseTimer && clearTimeout(this.initExhalePulseTimer);
    this.stopWatchId && clearInterval(this.stopWatchId);
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
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);
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

  handlePressIn = () => {
    this.pressIn = true;
    const {circleText} = this.state;
    circleText === 'Exhale' && this.vibrateLoop();

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

  componentDidUpdate(prevProps) {
    if (
      this.props.pressIn !== prevProps.pressIn ||
      this.props.pressOut !== prevProps.pressOut
    ) {
      this.props.pressIn && this.handlePressIn();
      this.props.pressOut && this.handlePressOut();
    }
  }

  render() {
    const {
      circleText,
      finalExhaleTime,
      finalInhaleTime,
      timer,
      targetVisible,
    } = this.state;
    const {guidedBreathing, finished} = this.props;
    const {calibrationInhale, calibrationExhale} = guidedBreathing;
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const targetRotation =
      (360 * this.targetExhale) / (this.targetExhale + this.targetInhale);
    const transform = [{rotate: this.rotate}];
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <ProgressTracker
            currentTime={timer}
            targetTime={this.finishBreathingTime}
          />
          {finished && (
            <BreathingStats
              calibrationExhale={calibrationExhale}
              calibrationInhale={calibrationInhale}
              finalInhaleTime={finalInhaleTime}
              finalExhaleTime={finalExhaleTime}
            />
          )}
        </View>
        <BreathingGameProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>
        {targetVisible && (
          <View style={styles.targetBoxContainer}>
            <Animated.View
              style={[
                styles.box,
                {transform: [{rotate: `${targetRotation}deg`}]},
              ]}>
              <View style={[styles.targetLine]} />
            </Animated.View>
          </View>
        )}

        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
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
