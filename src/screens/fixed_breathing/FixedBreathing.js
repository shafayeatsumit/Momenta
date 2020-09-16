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
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './FixedBreathing.styles';
import {Colors} from '../../helpers/theme';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import ProgressTracker from '../../components/ProgressTracker';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';
import {connect} from 'react-redux';

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: '',
      started: false,
      finished: false,
      touchDisabled: false,
      timer: 0,
      showStuffs: false,
      showAnimation: false,
    };
    this.checkmarkProgress = new Animated.Value(0);
    this.unmounted = false;
    this.animated = new Animated.Value(0);
    this.counter = 0;
    this.inhaleTime = props.fixedBreathing.inhale;
    this.inhaleHold = props.fixedBreathing.inhaleHold;
    this.exhaleTime = props.fixedBreathing.exhale;
    this.exhaleHold = props.fixedBreathing.exhaleHold;
    this.totalTime =
      this.inhaleTime + this.exhaleTime + this.inhaleHold + this.exhaleHold;
    this.finishBreathingTime = props.fixedBreathing.breathingTime * 60;
    this.totalBreaths = Math.ceil(this.finishBreathingTime / this.totalTime);
  }

  startExhalePulse = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  startInhalePulse = () => {
    const feedbackType =
      Platform.OS === 'ios' ? 'impactLight' : 'keyboardRelease';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  startExhaleHoldPulse = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactLight' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  startInhaleHoldPulse = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactLight' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  startExhaleHoldTimer = () => {
    this.inhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold'});
      this.vibrateLoopId && clearTimeout(this.vibrateLoopId);
      this.startExhaleHoldPulse();
      clearTimeout(this.inhaleHoldTimer);
    }, this.exhaleTime * 1000);
  };

  startInhaleTimer = () => {
    this.exhaleTimer = setTimeout(() => {
      this.setState({circleText: 'Inhale'});
      this.startInhalePulse();
      clearTimeout(this.exhaleTimer);
    }, (this.exhaleTime + this.exhaleHold) * 1000);
  };

  startInhaleHoldTimer = () => {
    this.exhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold'});
      this.startInhaleHoldPulse();
      clearTimeout(this.exhaleHoldTimer);
    }, (this.totalTime - this.inhaleHold) * 1000);
  };

  animatCb = () => {
    if (this.unmounted) {
      return;
    }
    this.counter += 1;
    if (this.counter === this.totalBreaths) {
      this.removeTimers();
      this.stopWatchId && clearInterval(this.stopWatchId);
      this.setState({finished: true});
    }

    this.exhaleStart();
    this.exhaleHold && this.startExhaleHoldTimer();
    this.inhaleHold && this.startInhaleHoldTimer();
    this.startInhaleTimer();
    this.animate();
  };

  animate = () => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: this.totalTime * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(this.animatCb);
  };

  exhaleStart = () => {
    this.setState({circleText: 'Exhale'});
    this.startExhalePulse();
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

  handleTap = () => {
    const {started, showStuffs} = this.state;
    if (!started) {
      this.setState({started: true, touchDisabled: true});
      this.exhaleStart();
      this.startInhaleTimer();
      this.exhaleHold && this.startExhaleHoldTimer();
      this.inhaleHold && this.startInhaleHoldTimer();
      this.animate();
      this.startStopWatch();
    } else {
      this.setState({showStuffs: !showStuffs});
    }
  };

  handleFinish = () => this.props.navigation.pop();

  finishAnimation = () => {
    Animated.timing(this.checkmarkProgress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start(this.handleFinish);
  };

  vibrateLoop = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactLight' : 'clockTick';
    this.vibrateLoopId = setInterval(() => {
      ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    }, 900);
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(2);
  };

  handlePressIn = () => {
    const {started, circleText} = this.state;
    !started && this.handleTap();
    if (circleText === 'Exhale' || !started) {
      this.vibrateLoop();
    }
    this.pressInTime = new Date();
  };

  handlePressOut = () => {
    this.vibrateLoopId && clearTimeout(this.vibrateLoopId);
    const timeTaken = this.measureTime(this.pressInTime);
    if (timeTaken < 1) {
      this.handleTap();
    }
  };

  removeTimers = () => {
    this.unmounted = true;
    this.inhaleHoldTimer && clearTimeout(this.inhaleHoldTimer);
    this.exhaleHoldTimer && clearTimeout(this.exhaleHoldTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.vibrateLoopId && clearTimeout(this.vibrateLoopId);
  };
  componentWillUnmount() {
    this.removeTimers();
  }

  getDotStyle = () => {
    const {circleText} = this.state;
    if (circleText === 'Hold') {
      return {backgroundColor: Colors.betterBlueLight};
    } else if (circleText === 'Inhale') {
      return {backgroundColor: Colors.buttonBlue};
    } else {
      return {backgroundColor: Colors.buttonBlueDeep};
    }
  };

  handlePressFinish = () => {
    this.removeTimers();
    this.setState({showAnimation: true});
  };

  render() {
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const {
      circleText,
      finished,
      started,
      touchDisabled,
      showStuffs,
      showAnimation,
      timer,
    } = this.state;
    const transform = [{rotate: this.rotate}];
    const {userInfo} = this.props;
    const {musicOn} = userInfo;
    const {route} = this.props;

    if (showAnimation) {
      return (
        <View style={styles.checkmarkHolder}>
          <LottieView
            autoSize
            autoPlay
            loop={false}
            style={styles.checkmark}
            resizeMode="cover"
            source={require('../../../assets/anims/check_mark.json')}
            onAnimationFinish={this.handleFinish}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        touchDisabled={touchDisabled}
        onPress={this.handleTap}>
        <BreathingProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
          inhaleHold={this.inhaleHold}
          exhaleHold={this.exhaleHold}
        />
        <View style={styles.progressTrackerContainer}>
          <ProgressTracker
            currentTime={timer}
            targetTime={this.finishBreathingTime}
            showTimer={showStuffs}
          />
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={[styles.dot, this.getDotStyle()]} />
          </Animated.View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>

        {started && showStuffs && (
          <TouchableOpacity
            onPress={route.params.handleMusic}
            style={styles.musicIconHolder}>
            <Image
              style={styles.musicIcon}
              source={musicOn ? MusicIcon : NoMusicIcon}
            />
          </TouchableOpacity>
        )}
        {!started && (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>Tap screen to begin</Text>
          </View>
        )}
        {!finished && started && showStuffs && (
          <TouchableOpacity
            style={styles.quitButton}
            onPress={this.handleFinish}>
            <Text style={styles.quitButtonText}>Quit</Text>
          </TouchableOpacity>
        )}
        {finished && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.handlePressFinish}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          disabled={finished}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchableArea}
        />
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    fixedBreathing: state.fixedBreathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(FixedBreathing);
