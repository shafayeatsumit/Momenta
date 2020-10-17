import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './BreathingGame.styles';
import BreathingGameCircle from './BreathingGameCircle';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import ProgressTracker from '../../components/ProgressTracker';

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

const MIN_EXHALE_MSG = 'Exhale must be  2 second long';
const COMPLETE_EXHALE_MSG = 'Hold as you';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measurementType: 'exhale',
      instructionText: '',
      timer: 0,
      finished: false,
      timerAndQuitVisible: false,
    };
    this.holdingScreen = false;
    this.pressInTime = null;
    this.animatedCircleRadius = new Animated.Value(148);
    this.touchEnabled = true;
    this.secondTargetSetupComplete = false;
    const {
      targetExhale,
      targetInhale,
      calibrationExhale,
      calibrationInhale,
      firstThreshold,
      breathingTime,
    } = props.guidedBreathing;
    this.targetExhale = targetExhale;
    this.targetInhale = targetInhale;
    this.exhaleTime = calibrationExhale;
    this.inhaleTime = calibrationInhale;
    this.avgExhale = avgExhale(this.exhaleTime, this.targetExhale);
    this.avgInhale = avgInhale(this.inhaleTime, this.targetInhale);
    this.targetBreathCount = Math.ceil(
      firstThreshold / (this.avgInhale + this.avgExhale),
    );
    this.exhlaeIncrementValue =
      (this.targetExhale - this.exhaleTime) / this.targetBreathCount;
    this.inhaleIncrementValue =
      (this.targetInhale - this.inhaleTime) / this.targetBreathCount;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.finishBreathingTime = breathingTime * 60;
    this.fullBreathTaken = 0;
    this.breathTaken = 0;
  }

  enableTouch = () => {
    this.touchEnabled = true;
  };

  disableTouch = () => {
    this.touchEnabled = false;
  };

  setSecondTarget = () => {
    const {guidedBreathing} = this.props;
    const {calibrationExhale, secondThreshold} = guidedBreathing;
    const secondTarget = calibrationExhale;
    const targetInhale = guidedBreathing.targetInhale;
    const targetExhale = guidedBreathing.targetExhale;
    this.avgInhale = avgInhale(targetInhale, secondTarget);
    this.avgExhale = avgExhale(targetExhale, secondTarget);
    this.targetBreathCount = Math.ceil(
      secondThreshold / (this.avgInhale + this.avgExhale),
    );
    this.inhaleIncrementValue =
      (secondTarget - targetInhale) / this.targetBreathCount;
    this.exhlaeIncrementValue =
      (secondTarget - targetExhale) / this.targetBreathCount;
    this.secondTargetSetupComplete = true;
    this.fullBreathTaken = 0; // fullbreathTaken
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.startInhale();
  };

  setNotHoldingError = (showTimer = true) => {
    this.notHoldingErrorId = setTimeout(() => {
      this.setState({
        instructionText: COMPLETE_EXHALE_MSG,
        ...(showTimer && {timerAndQuitVisible: true}),
      });
    }, 2000);
  };

  circleExpandEnd = () => {
    const {finished} = this.state;
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.setState({measurementType: 'exhale'});
    this.enableTouch();
    if (!this.holdingScreen) {
      clearInterval(this.stopWatchId);
      !finished && this.setNotHoldingError();
    }
  };

  expand = (time) => {
    const duration = time || this.inhaleTime;
    Animated.timing(this.animatedCircleRadius, {
      toValue: 148,
      duration,
      useNativeDriver: true,
    }).start(this.circleExpandEnd);
  };

  shrink = () => {
    Animated.timing(this.animatedCircleRadius, {
      toValue: 75,
      duration: this.exhaleTime,
      useNativeDriver: true,
    }).start();
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

  breathCompleted = () => {
    const {guidedBreathing} = this.props;
    this.fullBreathTaken = this.fullBreathTaken + 1;
    const finished = this.fullBreathTaken === this.targetBreathCount;
    if (finished) {
      const needSecondBreathSetup =
        guidedBreathing.id === 'inner_quiet' && !this.secondTargetSetupComplete;
      if (needSecondBreathSetup) {
        this.setSecondTarget();
      } else {
        // Game is completed
        console.log('++++++++++++++this game is over++++++++++++++++++');
        console.log(
          `target exhale inhale ${this.targetExhale} ${this.targetInhale}`,
        );

        this.startInhale();
        this.finishedGame = true;
        this.stopWatchId && clearInterval(this.stopWatchId);
      }
    } else {
      this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
      this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
      this.startInhale();
    }
  };

  handlePressOut = () => {
    if (this.pressInTime === null) {
      return;
    }
    analytics().logEvent('user_release');
    this.feedbackLoopId && clearInterval(this.feedbackLoopId);
    this.holdingScreen = false;
    const exhaleTimeTaken = this.measureTime();

    if (exhaleTimeTaken < 2000) {
      this.setState({errorText: MIN_EXHALE_MSG});
      this.expand(exhaleTimeTaken / 3);
      return;
    }
    const currentCircleHeight = this.animatedCircleRadius.__getValue();
    const takenFullExhale = currentCircleHeight === 75;
    console.log('taken full exhale', currentCircleHeight);
    if (takenFullExhale) {
      this.breathCompleted();
    } else {
      this.startInhale(exhaleTimeTaken);
    }
    this.breathTaken = this.breathTaken + 1;
  };

  clearInstruction = () => {
    const {instructionText, errorText} = this.state;
    const hasInstructionText = !!instructionText;
    const hasErrorText = !!errorText;
    hasInstructionText && this.setState({instructionText: ''});
    hasErrorText && this.setState({errorText: ''});
  };

  clearError = () => {
    const willErrorMsgShowUp = this.notHoldingErrorId;
    willErrorMsgShowUp && clearTimeout(this.notHoldingErrorId);
  };

  restartStopWatch = () => {
    if (this.state.timer === 0) {
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
    this.setState({timerAndQuitVisible: false});
    this.pressInTime = new Date();
    this.holdingScreen = true;
    this.restartStopWatch();
    this.startExhale();
    this.clearError();
    this.clearInstruction();
  };

  startExhale = () => {
    this.exhaleHoldFeedack();
    this.shrink();
  };

  startInhale = (exhaleTime) => {
    this.disableTouch();
    this.expand(exhaleTime);
    this.setState({measurementType: 'inhale'});
  };

  animatedListener = ({value}) => {
    if (value === 75) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    }
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

  componentDidMount() {
    this.animatedListenerId = this.animatedCircleRadius.addListener(
      this.animatedListener,
    );
  }

  componentWillUnmount() {
    this.animatedCircleRadius.removeListener(this.animatedListenerId);
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.feedbackLoopId && clearTimeout(this.feedbackLoopId);
    this.notHoldingErrorId && clearTimeout(this.notHoldingErrorId);
  }

  render() {
    const {
      measurementType,
      instructionText,
      timer,
      timerAndQuitVisible,
      errorText,
      finished,
    } = this.state;
    const showFinish = finished && !this.holdingScreen;
    const showExhaleText = measurementType === 'exhale';
    const showInhaleText = measurementType === 'inhale';
    const showInitMsg = !this.holdingScreen && this.breathTaken === 0;
    const showErrorMsg = !!errorText;
    return (
      <>
        <View style={styles.topSpacer} />
        {timerAndQuitVisible && (
          <TouchableOpacity
            style={styles.xoutHolder}
            onPress={this.props.handleQuit}>
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

        <BreathingGameCircle animatedRadius={this.animatedCircleRadius} />
        <View style={styles.centerTextHolder}>
          {showErrorMsg ? (
            <View style={styles.errorHolder}>
              <Text style={styles.centerText}>{errorText}</Text>
            </View>
          ) : (
            <>
              {showExhaleText && <Text style={styles.centerText}>Exhale</Text>}
              {showInhaleText && <Text style={styles.centerText}>Inhale</Text>}
            </>
          )}
        </View>
        {showInitMsg && (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>
              Hold as you <Text style={styles.initTextBold}>exhale</Text>
              {'\n'}to start exercise
            </Text>
          </View>
        )}
        {!!instructionText && (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>
              {instructionText} <Text style={styles.initTextBold}>exhale</Text>
            </Text>
          </View>
        )}
        {showInitMsg || !!instructionText ? (
          <Image
            style={styles.targetIcon}
            source={require('../../../assets/icons/target.png')}
          />
        ) : null}

        {showFinish && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.props.handleFinish}>
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
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(BreathingGame);
