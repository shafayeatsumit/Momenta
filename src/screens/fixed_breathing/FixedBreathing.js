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
import analytics from '@react-native-firebase/analytics';
import styles from './FixedBreathing.styles';
import {Colors} from '../../helpers/theme';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import ProgressTracker from '../../components/ProgressTracker';
import {connect} from 'react-redux';

const COMPLETE_EXHALE_MSG = 'Hold screen as you exhale';
const CIRCLE_MAX_HEIGHT = 150;
const CIRCLE_MIN_HEIGHT = 0;

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      holdTime: 0,
      showAnimation: false,
      instructionText: '',
      finished: false,
      measurementType: 'exhale',
      timerAndQuitVisible: false,
    };
    this.holdingScreen = false;
    this.pressInTime = null;
    this.animatedHeight = new Animated.Value(CIRCLE_MAX_HEIGHT);
    this.animatedWidth = new Animated.Value(CIRCLE_MAX_HEIGHT);
    this.animatedRadius = new Animated.Value(CIRCLE_MAX_HEIGHT / 2);
    this.breathTaken = 0;
    this.touchEnabled = true;
    const {
      inhale,
      inhaleHold,
      exhale,
      exhaleHold,
      breathingTime,
    } = props.fixedBreathing;
    this.inhaleTime = inhale * 1000;
    this.inhaleHold = inhaleHold * 1000;
    this.exhaleTime = exhale * 1000;
    this.exhaleHold = exhaleHold * 1000;
    this.finishBreathingTime = breathingTime * 60;
  }

  enableTouch = () => {
    this.touchEnabled = true;
  };

  disableTouch = () => {
    this.touchEnabled = false;
  };

  setNotHoldingError = (showTimer = true) => {
    this.notHoldingErrorId = setTimeout(() => {
      this.setState({
        instructionText: COMPLETE_EXHALE_MSG,
        ...(showTimer && {timerAndQuitVisible: true}),
      });
    }, 2000);
  };

  startExhale = () => {
    const {finished} = this.state;
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.setState({measurementType: 'exhale'});
    this.enableTouch();
    if (!this.holdingScreen) {
      clearInterval(this.stopWatchId);
      !finished && this.setNotHoldingError();
    }
  };

  inhaleHoldStart = () => {
    this.setState({
      holdTime: this.inhaleHold / 1000,
      measurementType: '',
    });
    this.inhaleHoldTimerId = setTimeout(() => {
      this.setState(
        {
          measurementType: 'inhale_hold',
        },
        this.holdTimer,
      );
      clearTimeout(this.inhaleHoldTimerId);
    }, 1000);
  };

  inhaleEnd = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.inhaleHold ? this.inhaleHoldStart() : this.startExhale();
  };

  expand = () => {
    const duration = this.inhaleTime;
    Animated.parallel([
      Animated.timing(this.animatedHeight, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration,
      }),
      Animated.timing(this.animatedWidth, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: CIRCLE_MAX_HEIGHT / 2,
        duration,
      }),
    ]).start(this.inhaleEnd);
  };

  resetEnd = () => {
    const {finished} = this.state;
    this.enableTouch();
    if (!this.holdingScreen) {
      clearInterval(this.stopWatchId);
      !finished && this.setNotHoldingError();
    }
  };

  reset = (duration) => {
    Animated.parallel([
      Animated.timing(this.animatedHeight, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration,
      }),
      Animated.timing(this.animatedWidth, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: CIRCLE_MAX_HEIGHT / 2,
        duration,
      }),
    ]).start(this.resetEnd);
  };

  shrink = () => {
    Animated.parallel([
      Animated.timing(this.animatedHeight, {
        toValue: CIRCLE_MIN_HEIGHT,
        duration: this.exhaleTime,
      }),
      Animated.timing(this.animatedWidth, {
        toValue: CIRCLE_MIN_HEIGHT,
        duration: this.exhaleTime,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: CIRCLE_MIN_HEIGHT / 2,
        duration: this.exhaleTime,
      }),
    ]).start();
  };

  measureTime = () => {
    return new Date() - this.pressInTime;
  };

  feedbackLoop = (pulse) => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
    const exhalePulseCount = pulse - 1;
    this.feedbackLoopId = setTimeout(() => {
      ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
      if (!exhalePulseCount) {
        clearTimeout(this.feedbackLoopId);
      } else {
        this.feedbackLoop(exhalePulseCount);
      }
    }, 900);
  };

  exhaleHoldFeedack = () => {
    const exhalePulseCount = Math.floor(this.exhaleTime / 900) - 1;
    const minimumDiff = 1800; // Timediff
    if (this.exhaleTime < minimumDiff && this.finishedGame) {
      return;
    }
    this.feedbackLoop(exhalePulseCount);
  };

  holdTimer = () => {
    const {holdTime, measurementType} = this.state;

    if (holdTime === 0) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
      measurementType === 'exhale_hold'
        ? this.startInhale()
        : this.startExhale();
      clearTimeout(this.holdTimerId);
      return;
    }
    this.holdTimerId = setTimeout(() => {
      this.setState({holdTime: holdTime - 1, showHoldTime: true});
      clearTimeout(this.holdTimerId);
      this.holdTimer();
    }, 1000);
  };

  handlePressOut = () => {
    analytics().logEvent('user_release');
    if (this.pressInTime === null) {
      return;
    }
    this.feedbackLoopId && clearInterval(this.feedbackLoopId);
    this.holdingScreen = false;
    const exhaleTimeTaken = this.measureTime();
    const oneSecond = 1000;
    const {gameStarted} = this.state;
    !gameStarted && this.setState({gameStarted: true});
    //TODO: we might need to change it later
    if (this.exhaleHold === 0 && exhaleTimeTaken > oneSecond) {
      this.startInhale();
      this.breathTaken = this.breathTaken + 1;
      return;
    }

    if (exhaleTimeTaken < this.exhaleTime) {
      this.setState({instructionText: COMPLETE_EXHALE_MSG});
      this.reset(exhaleTimeTaken / 3);
      return;
    }
    if (this.exhaleHold) {
      this.setState({
        holdTime: this.exhaleHold / 1000,
        measurementType: '',
      });

      this.exhaleHoldTimerId = setTimeout(() => {
        this.setState(
          {
            measurementType: 'exhale_hold',
          },
          this.holdTimer,
        );
        clearTimeout(this.exhaleHoldTimerId);
      }, 1000);
    } else {
      this.startInhale();
    }
    this.breathTaken = this.breathTaken + 1;
  };

  clearInstruction = () => {
    const {instructionText} = this.state;
    const hasInstructionText = !!instructionText;
    hasInstructionText && this.setState({instructionText: ''});
  };

  clearError = () => {
    const willErrorMsgShowUp = this.notHoldingErrorId;
    willErrorMsgShowUp && clearTimeout(this.notHoldingErrorId);
  };

  restartStopWatch = () => {
    const {timer} = this.state;
    if (timer === 0) {
      this.startStopWatch();
      return;
    }
    const timerOff = !!this.stopWatchId;
    timerOff && this.startStopWatch();
  };

  handlePressIn = () => {
    analytics().logEvent('user_hold');
    if (!this.touchEnabled) {
      this.pressInTime = null;
      return;
    }

    this.setState({timerAndQuitVisible: false});
    this.pressInTime = new Date();
    this.holdingScreen = true;
    this.restartStopWatch();
    this.exhaleHoldFeedack();
    this.shrink();
    this.clearError();
    this.clearInstruction();
  };

  startInhale = () => {
    this.disableTouch();
    this.expand();
    this.setState({measurementType: 'inhale'});
  };

  animatedListener = ({value}) => {
    if (value === 0) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    }
  };

  handleFinish = () => {
    this.setState({showAnimation: true});
    analytics().logEvent('button_push', {title: 'finish'});
  };

  handleAnimationFinish = () => {
    this.props.navigation.goBack();
  };

  handleClose = () => {
    this.props.navigation.goBack();
    analytics().logEvent('button_push', {title: 'quit'});
  };

  startStopWatch = () => {
    this.stopWatchId = setInterval(() => {
      const {timer} = this.state;
      if (timer === this.finishBreathingTime) {
        clearInterval(this.stopWatchId);
        this.setState({finished: true});
        return;
      }
      this.setState({timer: timer + 1});
    }, 1000);
  };

  componentWillUnmount() {
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.notHoldingErrorId && clearTimeout(this.notHoldingErrorId);
    this.inhaleHoldTimerId && clearTimeout(this.inhaleHoldTimerId);
    this.exhaleHoldTimerId && clearTimeout(this.exhaleHoldTimerId);
    this.feedbackLoopId && clearTimeout(this.feedbackLoopId);
    this.holdTimerId && clearTimeout(this.holdTimerId);
  }

  componentDidMount() {
    this.animatedListenerId = this.animatedHeight.addListener(
      this.animatedListener,
    );
    this.setNotHoldingError(false);
  }

  render() {
    const {
      measurementType,
      showAnimation,
      instructionText,
      timer,
      finished,
      holdTime,
      gameStarted,
      timerAndQuitVisible,
      showHoldTime,
    } = this.state;
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
            onAnimationFinish={this.handleAnimationFinish}
          />
        </View>
      );
    }

    const circleStyle = {
      height: this.animatedHeight,
      width: this.animatedWidth,
      borderRadius: this.animatedRadius,
    };
    const showFinish = finished && this.holdingScreen === false;
    const showInhaleText = measurementType === 'inhale';
    const showExhaleText = measurementType === 'exhale';
    const showInhaleHoldText = measurementType === 'inhale_hold';
    const showExhaleHoldText = measurementType === 'exhale_hold';
    const holdTimerVisible =
      (measurementType === 'inhale_hold' ||
        measurementType === 'exhale_hold') &&
      holdTime > 0 &&
      showHoldTime;
    return (
      <>
        <View style={styles.topSpacer} />
        {timerAndQuitVisible && (
          <TouchableOpacity
            style={styles.xoutHolder}
            onPress={this.handleClose}>
            <Image
              source={require('../../../assets/icons/close.png')}
              style={styles.xout}
            />
          </TouchableOpacity>
        )}
        <ProgressTracker
          currentTime={timer}
          targetTime={this.finishBreathingTime}
          showTimer={timerAndQuitVisible}
        />

        <View style={styles.container}>
          <View style={styles.textHolder}>
            {showExhaleText && (
              <Text style={styles.centerText}>
                {gameStarted ? 'Exhale' : 'Exhale to Start Exercise'}
              </Text>
            )}
            {showExhaleHoldText && <Text style={styles.centerText}>Hold</Text>}
          </View>

          <View style={styles.circleHolder}>
            <Animated.View style={[styles.circle, {...circleStyle}]} />
            {holdTimerVisible && (
              <View style={styles.holdTimerContainer}>
                <Text style={styles.holdTime}>{holdTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.textHolder}>
            {showInhaleText && (
              <Text style={styles.centerText}>Inhale Slowly</Text>
            )}
            {showInhaleHoldText && <Text style={styles.centerText}>Hold</Text>}
          </View>
          {!!instructionText && (
            <View style={styles.instructionTextHolder} pointerEvents="none">
              <Text style={styles.instructionText}>{instructionText}</Text>
            </View>
          )}
        </View>
        {showFinish && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.handleFinish}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchableArea}
        />
      </>
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
