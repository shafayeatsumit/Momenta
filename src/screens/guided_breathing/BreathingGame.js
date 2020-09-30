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
import styles from './BreathingGame.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {Colors} from '../../helpers/theme';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const CIRCLE_MAX_HEIGHT = 220;
const CIRCLE_MIN_HEIGHT = 0;

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measurementType: 'inhale',
    };
    this.holdingScreen = false;
    this.pressInTime = null;
    this.animatedHeight = new Animated.Value(0);
    this.animatedWidth = new Animated.Value(0);
    this.animatedRadius = new Animated.Value(0);
    this.touchEnabled = false;
    this.secondTargetSetupComplete = false;
    const {
      targetExhale,
      targetInhale,
      calibrationExhale,
      calibrationInhale,
      firstThreshold,
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
    this.totalBreathTaken = 0;
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
    this.totalBreathTaken = 0;
    this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
    this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    this.startInhale();
  };

  circleExpandEnd = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.setState({measurementType: 'exhale'});
    this.enableTouch();
  };

  expand = (time) => {
    const duration = time || this.inhaleTime;
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
    ]).start(this.circleExpandEnd);
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

  measureTime = () => new Date() - this.pressInTime;

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
    this.totalBreathTaken = this.totalBreathTaken + 1;
    const finished = this.totalBreathTaken === this.targetBreathCount;
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
        console.log(`exhale ${this.exhaleTime} inhale ${this.inhaleTime}`);
        this.startInhale();
        this.finishedGame = true;
      }
    } else {
      this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
      this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
      this.startInhale();
    }
  };

  handlePressOut = () => {
    this.feedbackLoopId && clearInterval(this.feedbackLoopId);
    this.holdingScreen = false;
    const exhaleTimeTaken = this.measureTime();
    if (exhaleTimeTaken < 2000) {
      this.expand(exhaleTimeTaken / 3);
      return;
    }
    const currentCircleHeight = this.animatedHeight.__getValue();
    const takenFullExhale = currentCircleHeight === 0;
    if (takenFullExhale) {
      this.breathCompleted();
    } else {
      this.startInhale(exhaleTimeTaken);
    }
  };

  handlePressIn = () => {
    if (!this.touchEnabled) {
      return;
    }
    this.pressInTime = new Date();
    this.holdingScreen = true;
    this.startExhale();
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
    if (value === 0) {
      !this.holdingScreen && this.breathCompleted();
      ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
      this.setState({measurementType: 'exhale'});
    }
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

  componentDidMount() {
    this.startInhale();
    this.animatedListenerId = this.animatedHeight.addListener(
      this.animatedListener,
    );
  }

  componentWillUnmount() {
    this.animatedHeight.removeListener(this.animatedListenerId);
  }

  render() {
    const {measurementType} = this.state;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {}}
        activeOpacity={1}>
        <View style={styles.textHolder}>
          {measurementType === 'exhale' && (
            <Text style={styles.centerText}>Exhale</Text>
          )}
        </View>

        <View style={styles.circleHolder}>
          <Animated.View
            style={[
              styles.circle,
              {
                height: this.animatedHeight,
                width: this.animatedWidth,
                borderRadius: this.animatedRadius,
              },
            ]}
          />
        </View>

        <View style={styles.textHolder}>
          {measurementType === 'inhale' && (
            <Text style={styles.centerText}>Inhale Slowly</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(BreathingGame);
