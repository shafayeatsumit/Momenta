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
import ProgressBar from '../../components/ProgressBar';
import BreathingStats from './BreathingStats';
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
      circleText: 'Exhale',
      finished: false,
      inhaleTimeRecorded: 0,
      exhaleTimeRecorded: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      progressCount: 0,
      finalExhaleTime: 0,
      finalInhaleTime: 0,
      timer: 0,
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
  }

  startHapticFeedback = () => {
    const feedbackType = 'impactHeavy';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  loopHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactLight' : 'clockTick';
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
    let finished = false;
    console.log(
      'animateCB',
      this.totalBreathingTime,
      this.finishBreathingTime,
      this.totalBreathingTime > this.finishBreathingTime,
    );
    if (this.totalBreathingTime > this.finishBreathingTime || this.unmount) {
      console.log('FINISHHHHHHHHH');
      this.animateCBFinish();
      finished = true;
      return;
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
      console.log('exhale end pulse +++');
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
      finished: true,
      finalInhaleTime: totalInhaleTime / progressCount,
      finalExhaleTime: totalExhaleTime / progressCount,
    });
    clearInterval(this.stopWatchId);
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
    this.setState({circleText: 'Inhale'});
    this.startHapticFeedback();
  };

  startStopWatch = () => {
    this.stopWatchId = setInterval(() => {
      if (this.state.timer >= this.finishBreathingTime) {
        clearInterval(this.stopWatchId);
        return;
      }
      this.setState({timer: this.state.timer + 0.01});
    }, 10);
  };

  componentDidMount() {
    const totalTime = this.inhaleTime + this.exhaleTime;
    this.totalBreathingTime = this.totalBreathingTime + totalTime;
    this.animate(totalTime);
    this.initExhalePulseTimer = setTimeout(() => {
      console.log('++++initExhalePulseTimer');
      this.exhaleEndPulse();
      clearTimeout(this.initExhalePulseTimer);
    }, this.exhaleTime * 1000);
    this.startStopWatch();
  }

  componentWillUnmount() {
    console.log('component will unmount');
    clearTimeout(this.exhaleEndPulseTimer);
    this.exhaleEndPulseTimer && clearTimeout(this.exhaleEndPulseTimer);
    this.initExhalePulseTimer && clearTimeout(this.initExhalePulseTimer);
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.vibrateLoopId && clearInterval(this.vibrateLoopId);

    this.unmount = true;
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
    // this.vibrateLoopId = setInterval(() => {
    //   console.log('haptics');
    //   this.loopHapticFeedback();
    // }, 100);
  };

  handleFinishQuit = () => {
    // this.props.finish();
    // this.vibrateLoopId && clearInterval(this.vibrateLoopId);
    this.totalBreathingTime = 100000000;
    this.animated.stopAnimation();
    this.props.finish();
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
      finalExhaleTime,
      finalInhaleTime,
      finished,
      timer,
    } = this.state;
    const {guidedBreathing, musicOn, handleMusic} = this.props;
    const {calibrationInhale, calibrationExhale} = guidedBreathing;
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const targetRotation =
      (360 * this.targetExhale) / (this.targetExhale + this.targetInhale);
    console.log('render breathing game');
    const transform = [{rotate: this.rotate}];
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <ProgressBar
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

        <View style={styles.targetBoxContainer}>
          <Animated.View
            style={[
              styles.box,
              {transform: [{rotate: `${targetRotation}deg`}]},
            ]}>
            <View style={[styles.targetLine]} />
          </Animated.View>
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>

        {finished ? (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.handleFinishQuit}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
            style={styles.touchableArea}
          />
        )}
        {!finished && (
          <TouchableOpacity
            style={styles.quitButton}
            onPress={this.handleFinishQuit}>
            <Text style={styles.quitButtonText}>Quit</Text>
          </TouchableOpacity>
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
