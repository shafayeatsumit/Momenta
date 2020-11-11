import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Easing,
  Image,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';

import styles from './BreathingGame.styles';
import BreathingGameCircle from './BreathingGameCircle';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
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
      breathingType: 'exhale',
      timeIsUp: false,
      playButtonTitle: 'start',
      soundStatus: true,
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
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      const finishDuration = this.props.guidedBreathing.breathingTime * 60;
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

  exhaleEnd = () => {
    if (this.stopAnimation) {
      return;
    }
    // one full breath completed
    this.startInhale();
  };

  startExhaleSound = () => {
    const fadeOutDuration = 1000;
    console.log('inhale', this.exhaleTime);
    this.exhaleSoundId = setTimeout(() => {
      this.sound.stopExhaleSound(fadeOutDuration);
      clearTimeout(this.exhaleSoundId);
    }, this.exhaleTime - fadeOutDuration);
    this.sound.startExhaleSound();
  };

  startExhale = () => {
    this.setState({breathingType: 'exhale'});
    this.startExhaleSound();
    Animated.timing(this.animatedProgress, {
      toValue: 0.5,
      duration: this.exhaleTime,
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

  startInhaleSound = () => {
    const fadeOutDuration = 1000;
    this.inhaleSoundId = setTimeout(() => {
      this.sound.stopInhaleSound(fadeOutDuration);
      clearInterval(this.inhaleSoundId);
    }, this.inhaleTime - fadeOutDuration);
    this.sound.startInhaleSound();
  };

  startInhale = () => {
    this.setState({breathingType: 'inhale'});
    this.startInhaleSound();
    console.log('inhale', this.inhaleTime);
    Animated.timing(this.animatedProgress, {
      toValue: 1,
      duration: this.inhaleTime,
      easing: Easing.linear,
    }).start(this.inhaleEnd);
  };

  stopTimer = () => {
    clearInterval(this.timerId);
  };

  pauseExercise = () => {
    this.stopAnimation = true;
    Animated.timing(this.animatedProgress).stop();
  };

  resumeExercise = () => {
    this.stopAnimation = false;
    const {breathingType} = this.state;
    breathingType === 'exhale' ? this.startExhale() : this.startInhale();
  };

  handleFinish = () => {
    this.props.handleFinish();
  };

  handlePlayPause = () => {
    const {playButtonTitle} = this.state;
    playButtonTitle === 'start' && this.startExhale();
    if (playButtonTitle === 'start' || playButtonTitle === 'continue') {
      this.setState({playButtonTitle: 'pause'});
      this.startTimer();
      if (playButtonTitle === 'continue') {
        this.resumeExercise();
        this.handleMusicButton();
        this.sound.setVolumeToOne();
      }
    } else {
      this.setState({playButtonTitle: 'continue'});
      this.stopTimer();
      this.pauseExercise();
      this.sound.setVolumeToZero();
    }
  };

  handleMusicButton = () => {
    const {soundStatus} = this.state;
    if (soundStatus) {
      this.setState({soundStatus: false});
      this.sound.setVolumeToZero();
    } else {
      this.setState({soundStatus: true});
      this.sound.setVolumeToOne();
    }
  };

  componentWillUnmount() {
    clearInterval(this.timerId);
    this.sound.setVolumeToZero();
    this.stopAnimation = true;
  }

  render() {
    const {
      timer,
      soundStatus,
      breathingType,
      playButtonTitle,
      timeIsUp,
    } = this.state;
    const {guidedBreathing, goToCalibration} = this.props;
    const finishDuration = guidedBreathing.breathingTime * 60;
    const centerText =
      breathingType[0].toUpperCase() + breathingType.substring(1);
    let buttonTitle = timeIsUp ? 'finish' : playButtonTitle;
    buttonTitle = buttonTitle[0].toUpperCase() + buttonTitle.substring(1);
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
            ref={(animation) => {
              this.animationRef = animation;
            }}
          />
        </View>
        <View style={styles.absoluteContainer}>
          <Text style={styles.centerText}>{centerText}</Text>
        </View>
        <View style={styles.bottom}>
          <ExerciseSettings
            playButtonTitle={buttonTitle}
            handlePlayPause={
              timeIsUp ? this.handleFinish : this.handlePlayPause
            }
            soundStatus={soundStatus}
            handleMusicButton={this.handleMusicButton}
            timeIsUp={timeIsUp}
            goToCalibration={goToCalibration}
          />
        </View>
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
