import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Easing,
  NativeModules,
  Image,
  Modal,
} from 'react-native';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import styles from './BreathingGame.styles';
import BreathingSettings from '../BreathingSettings';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import ProgressTracker from '../../components/ProgressTracker';
import ExerciseSettings from '../ExerciseSettings';
import SoundPlayer from '../../helpers/SoundPlayer';

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      initialTimer: 4,
      breathingType: 'ready',
      timeIsUp: false,
      playButtonTitle: 'start',
      showSettings: false,
    };
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

    this.breathTaken = 0;
    this.stopAnimation = false;
    this.animatedProgress = new Animated.Value(0);
    this.sound = new SoundPlayer();
    // inhlae or exhale estimated end time.
    this.breathingWillEnd = null;
    this.pauseTime = null;
    // sound & vibration settings
  }

  getSoundStatus = () => {
    const {userInfo} = this.props;
    const breathingId = this.props.guidedBreathing.id;
    const soundStatus = userInfo[`${breathingId}_sound`];
    return soundStatus;
  };

  getVibrationStatus = () => {
    const {userInfo} = this.props;
    const breathingId = this.props.guidedBreathing.id;
    const vibrationStatus = userInfo[`${breathingId}_vibration`];
    return vibrationStatus;
  };

  updateMindfulChallenge = () => {
    this.props.dispatch({
      type: 'UPDATE_MINDFUL_CHALLENGE_STREAK',
      mindfulChallengeDate: moment(),
    });
  };

  handleMindfulStreak = () => {
    const {mindfulChallengeStreak, mindfulChallengeDate} = this.props.userInfo;
    const today = moment();
    const yesterday = moment().subtract(1, 'day');
    const isSameDay = moment(mindfulChallengeDate).isSame(today, 'day');
    const isYesterday = moment(mindfulChallengeDate).isSame(yesterday, 'day');

    if (mindfulChallengeStreak) {
      if (isSameDay) {
      } else if (isYesterday) {
        this.updateMindfulChallenge();
      } else {
        // reset challenge
        this.props.dispatch({type: 'RESET_MINDFUL_CHALLENGE_STREAK'});
      }
    } else {
      this.updateMindfulChallenge();
    }
    // handle sreak count here.
  };

  startTimer = () => {
    const {
      challenge,
      breathingTime,
      id: challengeId,
    } = this.props.guidedBreathing;
    const isMindfulChallenge = challenge && challengeId === 'mindful_challenge';
    this.timerId = setInterval(() => {
      const finishDuration = breathingTime * 60;
      const {timer} = this.state;
      const timeIsUp = timer === finishDuration;
      if (timeIsUp) {
        clearInterval(this.timerId);
        isMindfulChallenge && this.handleMindfulStreak();
        this.setState({timeIsUp: true});
        return;
      }
      this.setState({timer: timer + 1});
    }, 1000);
  };

  exhaleEnd = () => {
    if (this.stopAnimation) {
      return;
    }
    this.startInhale();
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
    this.setState({breathingType: 'exhale'});
    const soundStatus = this.getSoundStatus();
    const souldPlaySound = soundStatus && !resumeDuration;
    souldPlaySound && this.startExhaleSound();
    const vibrationStatus =
      this.getVibrationStatus() && Platform.OS === 'android';
    const duration = resumeDuration || this.exhaleTime;
    this.breathingWillEnd = moment().add(duration, 'milliseconds');
    vibrationStatus &&
      NativeModules.AndroidVibration.startVibration(duration, 20);
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
    this.breathTaken = this.breathTaken + 1;

    const noIncrement = this.breathTaken >= this.targetBreathCount;
    if (noIncrement) {
      this.startExhale();
    } else {
      this.exhaleTime = this.exhaleTime + this.exhlaeIncrementValue;
      this.inhaleTime = this.inhaleTime + this.inhaleIncrementValue;
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
    const {timer} = this.state;
    const playButtonTitle = timer ? 'continue' : 'start';
    this.stopAnimation = true;
    Animated.timing(this.animatedProgress).stop();
    this.sound.muteSound();
    this.pauseTime = moment();
    this.setState({playButtonTitle});
    this.stopTimer();
    this.pauseVibration();
  };

  resumeExercise = () => {
    this.stopAnimation = false;
    const {breathingType} = this.state;
    this.setState({playButtonTitle: 'pause'});
    this.startTimer();
    this.sound.unmuteSound();
    // difference between pause and end time.
    const resumeDuration = this.breathingWillEnd.diff(this.pauseTime);
    breathingType === 'exhale'
      ? this.startExhale(resumeDuration)
      : this.startInhale(resumeDuration);
  };

  startExercise = () => {
    this.setState({playButtonTitle: 'pause'});
    this.startTimer();
    this.startExhale();
  };

  startCountDown = () => {
    this.setState({playButtonTitle: 'starting'});
    this.initialTimerId = setInterval(() => {
      if (this.state.initialTimer === 0) {
        clearInterval(this.initialTimerId);
        this.startExercise();
        return;
      }
      this.setState((prevState) => ({
        initialTimer: prevState.initialTimer - 1,
      }));
    }, 1000);
  };

  handleFinish = () => {
    this.props.handleFinish();
    analytics().logEvent('button_push', {title: 'finish'});
  };

  handleSettings = () => {
    const {showSettings} = this.state;
    if (!showSettings) {
      this.pauseExercise();
    }
    analytics().logEvent('button_push', {
      title: `show_options_${!showSettings}`,
    });
    this.setState((prevState) => ({
      showSettings: !prevState.showSettings,
    }));
  };

  handlePlayPause = () => {
    const {playButtonTitle} = this.state;
    const start = playButtonTitle === 'start';
    const play = playButtonTitle === 'continue';
    if (start) {
      // start exercise
      this.startCountDown();
      analytics().logEvent('button_push', {title: 'start'});
    } else if (play) {
      // resume/continue exercise
      analytics().logEvent('button_push', {title: 'continue'});
      this.resumeExercise();
    } else {
      // pause exercise
      this.pauseExercise();
      analytics().logEvent('button_push', {title: 'pause'});
    }
  };

  componentWillUnmount() {
    clearInterval(this.timerId);
    this.sound.muteSound();
    this.stopAnimation = true;
    this.pauseVibration();
    clearInterval(this.initialTimerId);
  }

  render() {
    const {
      timer,
      breathingType,
      playButtonTitle,
      timeIsUp,
      showSettings,
      initialTimer,
    } = this.state;
    const {guidedBreathing, goToCalibration} = this.props;
    const finishDuration = guidedBreathing.breathingTime * 60;
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

    return (
      <View style={styles.main}>
        <ProgressTracker
          currentTime={timer}
          targetTime={finishDuration}
          showTimer={true}
          title={guidedBreathing.name}
          close={this.props.handleQuit}
        />
        <View style={styles.absoluteContainer}>
          <LottieView
            source={require('../../../assets/anims/breath.json')}
            progress={this.animatedProgress}
            style={styles.lottieFile}
          />
        </View>

        <View style={styles.absoluteContainer}>
          {breathingType === 'ready' && initialTimer < 4 ? (
            <Text allowFontScaling={false} style={styles.centerText}>
              {initialTimer}
            </Text>
          ) : (
            <Text allowFontScaling={false} style={styles.centerText}>
              {centerText}
            </Text>
          )}
        </View>

        <View style={styles.bottom}>
          <ExerciseSettings
            playButtonTitle={buttonTitle}
            handlePlayPause={
              timeIsUp ? this.handleFinish : this.handlePlayPause
            }
            timeIsUp={timeIsUp}
            goToCalibration={goToCalibration}
            showSettings={this.handleSettings}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(BreathingGame);
