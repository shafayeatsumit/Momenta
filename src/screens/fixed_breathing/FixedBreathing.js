import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  Modal,
  NativeModules,
} from 'react-native';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';
import styles from './FixedBreathing.styles';
import BreathingSettings from '../BreathingSettings';
import ExerciseSettings from '../ExerciseSettings';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ProgressTracker from '../../components/ProgressTracker';
import {connect} from 'react-redux';
import SoundPlayer from '../../helpers/SoundPlayer';

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      initialTimer: 4,
      holdTime: 0,
      showAnimation: false,
      breathingType: 'ready',
      timeIsUp: false,
      playButtonTitle: 'start',
      showSettings: false,
    };
    const {inhale, inhaleHold, exhale, exhaleHold} = props.fixedBreathing;
    this.inhaleTime = inhale * 1000;
    this.inhaleHold = inhaleHold * 1000;
    this.exhaleTime = exhale * 1000;
    this.exhaleHold = exhaleHold * 1000;

    this.stopAnimation = false;
    this.animatedProgress = new Animated.Value(0);
    this.sound = new SoundPlayer();
    // inhlae or exhale estimated end time.
    this.breathingWillEnd = null;
    this.pauseTime = null;
  }

  getSoundStatus = () => {
    const {userInfo} = this.props;
    const breathingId = this.props.fixedBreathing.id;
    const soundStatus = userInfo[`${breathingId}_sound`];
    return soundStatus;
  };

  getVibrationStatus = () => {
    const {userInfo} = this.props;
    const breathingId = this.props.fixedBreathing.id;
    const vibrationStatus = userInfo[`${breathingId}_vibration`];
    return vibrationStatus;
  };

  startTimer = () => {
    this.timerId = setInterval(() => {
      const finishDuration = this.props.fixedBreathing.breathingTime * 60;
      const {timer} = this.state;
      const timeIsUp = timer === finishDuration;
      if (timeIsUp) {
        clearInterval(this.timerId);
        this.setState({timeIsUp: true});
        return;
      }
      this.setState({timer: timer + 1});
    }, 1000);
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

  holdTimer = () => {
    const {holdTime, holdType} = this.state;

    if (holdTime === 0) {
      // ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
      holdType === 'exhale_hold' ? this.startInhale() : this.startExhale();
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

  exhaleEnd = () => {
    if (this.stopAnimation) {
      return;
    }

    if (this.exhaleHold) {
      this.setState(
        {
          holdTime: this.exhaleHold / 1000,
          breathingType: 'hold',
          showHoldTime: false,
          holdType: 'exhale_hold',
        },
        this.holdTimer,
      );
    } else {
      this.startInhale();
    }
  };

  startExhaleSound = () => {
    const fadeOutDuration = 1250;
    this.exhaleSoundId = setTimeout(() => {
      this.sound.stopExhaleSound(fadeOutDuration);
      clearTimeout(this.exhaleSoundId);
    }, this.exhaleTime - fadeOutDuration);
    this.sound.startExhaleSound();
  };

  startInhaleSound = () => {
    const fadeOutDuration = 1250;
    this.inhaleSoundId = setTimeout(() => {
      this.sound.stopInhaleSound(fadeOutDuration);
      clearInterval(this.inhaleSoundId);
    }, this.inhaleTime - fadeOutDuration);
    this.sound.startInhaleSound();
  };

  pauseVibration = () => {
    const vibrationStatus =
      this.getVibrationStatus() && Platform.OS === 'android';
    vibrationStatus && NativeModules.AndroidVibration.cancelVibration();
  };

  startExhale = (resumeDuration) => {
    console.log('resume duration =====>', resumeDuration);
    this.setState({breathingType: 'exhale'});
    const soundStatus = this.getSoundStatus();
    const souldPlaySound = soundStatus && !resumeDuration;
    souldPlaySound && this.startExhaleSound();
    const vibrationStatus =
      this.getVibrationStatus() && Platform.OS === 'android';
    const duration = resumeDuration || this.exhaleTime;
    const vibrationDuration = duration > 0 ? duration : 0;
    this.breathingWillEnd = moment().add(duration, 'milliseconds');
    vibrationStatus &&
      NativeModules.AndroidVibration.startVibration(vibrationDuration, 20);
    Animated.timing(this.animatedProgress, {
      toValue: 0.5,
      duration,
      easing: Easing.linear,
    }).start(this.exhaleEnd);
  };

  inhaleEnd = () => {
    if (this.stopAnimation) {
      return;
    }
    if (this.inhaleHold) {
      this.setState(
        {
          holdTime: this.inhaleHold / 1000,
          breathingType: 'hold',
          showHoldTime: false,
          holdType: 'inhale_hold',
        },
        this.holdTimer,
      );
    } else {
      this.startExhale();
    }
  };

  startInhale = (resumeDuration) => {
    this.setState({breathingType: 'inhale'});
    const soundStatus = this.getSoundStatus();
    // sound enbled and not resumed.
    const shouldPlaySound = soundStatus && !resumeDuration;
    shouldPlaySound && this.startInhaleSound();
    const duration = resumeDuration || this.inhaleTime;

    this.breathingWillEnd = moment().add(this.inhaleTime, 'milliseconds');
    Animated.timing(this.animatedProgress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
    }).start(this.inhaleEnd);
  };

  stopTimer = () => {
    clearInterval(this.timerId);
  };

  pauseExercise = () => {
    this.stopAnimation = true;
    Animated.timing(this.animatedProgress).stop();
    this.sound.muteSound();
    this.pauseTime = moment();
    this.setState({playButtonTitle: 'continue'});
    this.stopTimer();
    clearInterval(this.holdTimerId);
    this.pauseVibration();
  };

  resumeExercise = () => {
    this.stopAnimation = false;
    const {breathingType, holdTime, holdType} = this.state;
    this.setState({playButtonTitle: 'pause'});
    this.startTimer();
    this.sound.unmuteSound();
    // difference between pause and end time.
    const resumeDuration = this.breathingWillEnd.diff(this.pauseTime);
    console.log('resume duration =========>', resumeDuration);
    if (holdTime) {
      this.setState({holdTime: 0});
      holdType === 'exhale_hold' ? this.startInhale() : this.startExhale();
      return;
    }
    breathingType === 'exhale'
      ? this.startExhale(resumeDuration)
      : this.startInhale(resumeDuration);
  };

  startExercise = () => {
    this.setState({playButtonTitle: 'pause'});
    this.startTimer();
    this.startExhale();
  };

  handleSettings = () => {
    const {showSettings} = this.state;
    if (!showSettings) {
      this.pauseExercise();
    }
    this.setState((prevState) => ({
      showSettings: !prevState.showSettings,
    }));
  };

  startCountDown = () => {
    this.setState({playButtonTitle: 'starting'});
    this.initialTimerId = setInterval(() => {
      if (this.state.initialTimer === 1) {
        clearInterval(this.initialTimerId);
        this.startExercise();
        return;
      }
      this.setState((prevState) => ({
        initialTimer: prevState.initialTimer - 1,
      }));
    }, 1000);
  };

  handlePlayPause = () => {
    const {playButtonTitle} = this.state;
    const start = playButtonTitle === 'start';
    const play = playButtonTitle === 'continue';
    if (start) {
      // start exercise
      this.startCountDown();
    } else if (play) {
      // resume/continue exercise
      this.resumeExercise();
    } else {
      // pause exercise
      this.pauseExercise();
    }
  };

  handleClose = () => {
    this.props.navigation.goBack();
    analytics().logEvent('button_push', {title: 'quit'});
  };
  handleAnimationFinish = () => {
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    clearInterval(this.timerId);
    this.sound.muteSound();
    this.stopAnimation = true;
    this.pauseVibration();
    clearInterval(this.initialTimerId);
  }

  componentDidMount() {}

  render() {
    const {
      timer,
      breathingType,
      playButtonTitle,
      showAnimation,
      timeIsUp,
      showSettings,
      holdTime,
      initialTimer,
    } = this.state;
    const {fixedBreathing} = this.props;
    const finishDuration = fixedBreathing.breathingTime * 60;
    const centerText =
      breathingType[0].toUpperCase() + breathingType.substring(1);
    let buttonTitle = timeIsUp ? 'finish' : playButtonTitle;
    buttonTitle = buttonTitle[0].toUpperCase() + buttonTitle.substring(1);
    if (showSettings) {
      return (
        <Modal animationType="slide" transparent={true} visible={showSettings}>
          <BreathingSettings close={this.handleSettings} />
        </Modal>
      );
    }

    if (showAnimation) {
      return (
        <View style={styles.absoluteContainer}>
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

    return (
      <View style={styles.main}>
        <ProgressTracker
          currentTime={timer}
          targetTime={finishDuration}
          showTimer={true}
          title={fixedBreathing.name}
          close={this.handleClose}
        />
        <View style={styles.absoluteContainer}>
          <LottieView
            source={require('../../../assets/anims/breath.json')}
            progress={this.animatedProgress}
            style={styles.lottieFile}
            ref={(animation) => {
              this.animationRef = animation;
            }}
          />
        </View>
        <View style={styles.absoluteContainer}>
          {breathingType === 'ready' && initialTimer < 4 ? (
            <Text allowFontScaling={false} style={styles.centerText}>
              Ready{'\n'}
              {initialTimer}
            </Text>
          ) : (
            <Text allowFontScaling={false} style={styles.centerText}>
              {centerText}
            </Text>
          )}
        </View>
        {breathingType === 'hold' && (
          <View style={styles.absoluteContainer}>
            <Text allowFontScaling={false} style={styles.holdTimer}>
              {holdTime}
            </Text>
          </View>
        )}

        <View style={styles.bottom}>
          <ExerciseSettings
            playButtonTitle={buttonTitle}
            handlePlayPause={
              timeIsUp ? this.handleFinish : this.handlePlayPause
            }
            timeIsUp={timeIsUp}
            showSettings={this.handleSettings}
          />
        </View>
      </View>
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
