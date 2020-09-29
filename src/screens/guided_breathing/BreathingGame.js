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
  (inhaleTime + targetInhaleTime) / 2 / 1000;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2 / 1000;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measurementType: 'inhale',
    };
    this.holdingScreen = false;
    this.pressInTime = null;
    this.pressOutTime = null;
    this.animatedHeight = new Animated.Value(0);
    this.animatedWidth = new Animated.Value(0);
    this.animatedRadius = new Animated.Value(0);
    this.touchEnabled = false;
    this.secondTargetSetupComplete = false;
    this.targetExhale = props.guidedBreathing.targetExhale * 1000;
    this.targetInhale = props.guidedBreathing.targetInhale * 1000;
    this.exhaleTime = props.guidedBreathing.calibrationExhale * 1000;
    this.inhaleTime = props.guidedBreathing.calibrationInhale * 1000;
    this.avgExhale = avgExhale(this.exhaleTime, this.targetExhale);
    this.avgInhale = avgInhale(this.inhaleTime, this.targetInhale);
    this.targetBreathCount = Math.ceil(
      props.guidedBreathing.firstThreshold / (this.avgInhale + this.avgExhale),
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

  setSecondTarget = () => {
    const {guidedBreathing} = this.props;
    const {calibrationExhale, secondThreshold} = guidedBreathing;
    const secondTarget = calibrationExhale * 1000;
    const targetInhale = guidedBreathing.targetInhale * 1000;
    const targetExhale = guidedBreathing.targetExhale * 1000;
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

  expand = () => {
    Animated.parallel([
      Animated.timing(this.animatedHeight, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration: this.inhaleTime,
      }),
      Animated.timing(this.animatedWidth, {
        toValue: CIRCLE_MAX_HEIGHT,
        duration: this.inhaleTime,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: CIRCLE_MAX_HEIGHT / 2,
        duration: this.inhaleTime,
      }),
    ]).start(this.enableTouch);
  };

  resetCircle = (duration) => {
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
    ]).start();
  };

  stop = () => {
    Animated.parallel([
      Animated.timing(this.animatedHeight),
      Animated.timing(this.animatedWidth),
      Animated.timing(this.animatedRadius),
    ]).stop();
  };

  shrink = () => {
    console.log('shrink', this.exhaleTime);
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

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
  };

  measureTime = () => new Date() - this.pressInTime;

  breathCompleted = () => {
    const {guidedBreathing} = this.props;
    this.totalBreathTaken = this.totalBreathTaken + 1;
    const finished = this.targetBreathCount >= this.totalBreathTaken;
    if (finished) {
      const needSecondBreathSetup =
        guidedBreathing.id === 'inner_quiet' && !this.secondTargetSetupComplete;
      if (needSecondBreathSetup) {
        this.setSecondTarget();
      } else {
        // Game is completed
        console.log('++++++++++++++this game is over++++++++++++++++++');
        this.startInhale();
      }
    } else {
      this.startInhale();
      this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
      this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
    }
  };

  handlePressOut = () => {
    this.holdingScreen = false;
    const exhaleTimeTaken = this.measureTime();
    if (exhaleTimeTaken < 2000) {
      this.resetCircle();
      return;
    }

    const currentCircleHeight = this.animatedHeight.__getValue();
    if (currentCircleHeight === 0) {
      this.breathCompleted();
    }
  };

  handlePressIn = () => {
    if (!this.touchEnabled) {
      console.log('inside here');
      return;
    }
    this.setState({measurementType: 'exhale'});
    this.holdingScreen = true;
    this.pressInTime = new Date();
    this.shrink();
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

  startInhale = () => {
    this.touchEnabled = false;
    this.setState({measurementType: 'inhale'});
    this.expand();
  };

  componentDidMount() {
    this.startInhale();
    this.animatedListenerId = this.animatedHeight.addListener(({value}) => {
      if (value === 0) {
        !this.holdingScreen && this.breathCompleted();
      }
    });
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
        {measurementType === 'exhale' && (
          <Text style={styles.centerText}>Exhale</Text>
        )}

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
        {measurementType === 'inhale' && (
          <Text style={styles.centerText}>Inhale Slowly</Text>
        )}
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
