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
import BreathingGameCircle from '../../components/BreathingGameCircle';
import {Colors} from '../../helpers/theme';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import ProgressTracker from '../../components/ProgressTracker';
import {connect} from 'react-redux';
import SoundOptions from '../../helpers/soundOptions';

const COMPLETE_EXHALE_MSG = 'Hold as you exhale';
const MIN_EXHALE_MSG = 'Exhale must be  2 second long';
const CircleCircumference = 2 * Math.PI * 160;

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
      bullsEyeVisible: false,
    };
    this.sound = new SoundOptions();
    this.holdingScreen = false;
    this.pressInTime = null;
    this.animatedOffSet = new Animated.Value(0);
    this.animatedCircleRadius = new Animated.Value(158);
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
      this.showBullsEye();
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
      showHoldTime: false,
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
      Animated.timing(this.animatedCircleRadius, {
        toValue: 158,
        duration,
        useNativeDriver: true,
      }),
      // Animated.timing(this.animatedOffSet, {
      //   toValue: 0,
      //   duration,
      //   useNativeDriver: true,
      // }),
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
      Animated.timing(this.animatedCircleRadius, {
        toValue: 158,
        duration,
        useNativeDriver: true,
      }),
      // Animated.timing(this.animatedOffSet, {
      //   toValue: 0,
      //   duration,
      //   useNativeDriver: true,
      // }),
    ]).start(this.resetEnd);
  };

  shrink = () => {
    Animated.parallel([
      Animated.timing(this.animatedCircleRadius, {
        toValue: 85,
        duration: this.exhaleTime,
        useNativeDriver: true,
      }),
      // Animated.timing(this.animatedOffSet, {
      //   toValue: CircleCircumference,
      //   duration: this.exhaleTime,
      //   useNativeDriver: true,
      // }),
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
      // ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
      measurementType === 'exhale_hold'
        ? this.startInhale()
        : this.startExhale();
      clearTimeout(this.holdTimerId);
      return;
    }
    this.holdTimerId = setTimeout(() => {
      const updatedHoldTime = holdTime - 1;
      this.setState({showHoldTime: true, holdTime: updatedHoldTime});
      clearTimeout(this.holdTimerId);
      this.holdTimer();
    }, 1000);
  };

  handlePressOut = () => {
    if (this.pressInTime === null) {
      return;
    }
    analytics().logEvent('user_release');
    this.feedbackLoopId && clearInterval(this.feedbackLoopId);
    this.holdingScreen = false;
    const exhaleTimeTaken = this.measureTime();
    const oneSecond = 1000;
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
      this.disableTouch();
      this.setState({
        holdTime: this.exhaleHold / 1000,
        measurementType: '',
        showHoldTime: false,
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
    if (!this.touchEnabled) {
      this.pressInTime = null;
      return;
    }
    analytics().logEvent('user_hold');
    this.setState({timerAndQuitVisible: false, bullsEyeVisible: false});
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

  finishHaptics = () => {
    const feedbackType = 'impactMedium';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  handleFinish = () => {
    this.setState({showAnimation: true});
    analytics().logEvent('button_push', {title: 'finish'});
    this.hapticsFinisherId = setTimeout(() => {
      this.finishHaptics();
      clearTimeout(this.hapticsFinisherId);
    }, 1500);
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

  animatedListener = ({value}) => {
    if (value === 85 && this.holdingScreen) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    }
  };

  componentWillUnmount() {
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.notHoldingErrorId && clearTimeout(this.notHoldingErrorId);
    this.inhaleHoldTimerId && clearTimeout(this.inhaleHoldTimerId);
    this.exhaleHoldTimerId && clearTimeout(this.exhaleHoldTimerId);
    this.feedbackLoopId && clearTimeout(this.feedbackLoopId);
    this.holdTimerId && clearTimeout(this.holdTimerId);
    this.showBullsEyeId && clearTimeout(this.showBullsEyeId);
    this.animatedCircleRadius.removeListener(this.animatedListenerId);
    this.sound.stopMusic();
  }

  playMusic = () => {
    const {userInfo} = this.props;
    if (userInfo.soundOn) {
      this.startTimer = setTimeout(() => {
        this.sound.startMusic();
        clearTimeout(this.startTimer);
      }, 2000);
    }
  };

  showBullsEye = () => {
    this.showBullsEyeId = setTimeout(() => {
      const notHoldingScreen = !this.holdingScreen;
      notHoldingScreen && this.setState({bullsEyeVisible: true});
      clearTimeout(this.showBullsEyeId);
    }, 2500);
  };

  componentDidMount() {
    this.animatedListenerId = this.animatedCircleRadius.addListener(
      this.animatedListener,
    );
    this.setNotHoldingError(false);
    this.playMusic();
    this.showBullsEye();
  }

  render() {
    const {
      measurementType,
      showAnimation,
      instructionText,
      timer,
      finished,
      holdTime,
      bullsEyeVisible,
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

    const showFinish = finished && this.holdingScreen === false;
    const showInitMsg = !this.holdingScreen && this.breathTaken === 0;
    const showInhaleText = measurementType === 'inhale';
    const showExhaleText = measurementType === 'exhale';
    const showInhaleHoldText = measurementType === 'inhale_hold';
    const showExhaleHoldText = measurementType === 'exhale_hold';
    const showHoldText = showInhaleHoldText || showExhaleHoldText;
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
          <BreathingGameCircle
            animatedRadius={this.animatedCircleRadius}
            animatedOffSet={this.animatedOffSet}
          />
          <View style={styles.container}>
            <View style={styles.centerTextHolder}>
              {showExhaleText && <Text style={styles.centerText}>Exhale</Text>}
              {showInhaleText && <Text style={styles.centerText}>Inhale</Text>}
              {showHoldText && <Text style={styles.centerText}>Hold</Text>}
              {holdTimerVisible && (
                <Text style={styles.holdTimer}>{holdTime}</Text>
              )}
            </View>
          </View>
          {!!instructionText && !showInitMsg && (
            <View
              style={[styles.initTextHolder, {paddingTop: 30}]}
              pointerEvents="none">
              <Text style={styles.initText}>
                {instructionText}{' '}
                <Text style={styles.initTextBold}>exhale</Text>
              </Text>
            </View>
          )}
          {showInitMsg && (
            <View style={styles.initTextHolder} pointerEvents="none">
              <Text style={styles.initText}>
                Hold as you <Text style={styles.initTextBold}>exhale</Text>
                {'\n'}to start exercise
              </Text>
            </View>
          )}
          {bullsEyeVisible ? (
            <Image
              style={styles.targetIcon}
              source={require('../../../assets/icons/target.png')}
            />
          ) : null}
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
