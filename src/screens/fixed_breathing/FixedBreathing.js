import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Image,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';
import styles from './FixedBreathing.styles';
import BreathingGameCircle from '../../components/BreathingGameCircle';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ProgressTracker from '../../components/ProgressTracker';
import {connect} from 'react-redux';
import SoundOptions from '../../helpers/soundOptions';
import InteractiveSound from '../../helpers/SoundPlayer';

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      holdTime: 0,
      showAnimation: false,
      finished: false,
      measurementType: 'exhale',
      timerAndQuitVisible: false,
    };
    this.sound = new InteractiveSound('flute.mp3', 'flute.mp3');
    this.animatedOffSet = new Animated.Value(0);
    this.animatedCircleRadius = new Animated.Value(158);
    this.breathTaken = 0;
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

  startExhale = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);

    this.setState({measurementType: 'exhale'});
    this.shrink();
    this.exhaleFluteId = setTimeout(() => {
      this.sound.stopExhaleSound();
      clearTimeout(this.exhaleFluteId);
    }, this.exhaleTime - 250);
    this.sound.startExhaleSound();
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

    Animated.timing(this.animatedCircleRadius, {
      toValue: 158,
      duration,
      useNativeDriver: true,
    }).start(this.inhaleEnd);
  };

  shrinkEnd = () => {
    if (this.exhaleHold) {
      this.setState({
        holdTime: this.exhaleHold / 1000,
        measurementType: '',
        showHoldTime: false,
      });

      this.exhaleHoldTimerId = setTimeout(() => {
        this.setState({measurementType: 'exhale_hold'}, this.holdTimer);
        clearTimeout(this.exhaleHoldTimerId);
      }, 1000);
    } else {
      this.startInhale();
    }
  };

  shrink = () => {
    Animated.timing(this.animatedCircleRadius, {
      toValue: 85,
      duration: this.exhaleTime,
      useNativeDriver: true,
    }).start(this.shrinkEnd);
  };

  measureTime = () => {};

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

  handlePressIn = () => {
    this.shrink();
  };

  startInhale = () => {
    this.expand();
    this.setState({measurementType: 'inhale'});

    this.inhaleFluteId = setTimeout(() => {
      this.sound.stopInhaleSound();
      clearInterval(this.inhaleFluteId);
    }, this.inhaleTime - 250);
    this.sound.startInhaleSound();
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
    this.animatedCircleRadius.removeListener(this.animatedListenerId);
    clearTimeout(this.exhaleFluteId);
    clearInterval(this.inhaleFluteId);
  }

  componentDidMount() {
    this.animatedListenerId = this.animatedCircleRadius.addListener(
      this.animatedListener,
    );
    this.startStopWatch();
    setTimeout(this.startExhale, 1000);
  }

  render() {
    const {
      measurementType,
      showAnimation,
      timer,
      finished,
      holdTime,
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
        {true && (
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
          showTimer={true}
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
        </View>
        {finished && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.handleFinish}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}
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
