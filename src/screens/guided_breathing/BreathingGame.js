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
import InteractiveSound from '../../helpers/interactiveSound';
import LoopSound from '../../helpers/loopSound';

const avgInhale = (inhaleTime, targetInhaleTime) =>
  (inhaleTime + targetInhaleTime) / 2;

const avgExhale = (exhaleTime, targetExhaleTime) =>
  (exhaleTime + targetExhaleTime) / 2;

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
    const {sound} = props;
    this.sound =
      sound.soundType === 'background_music'
        ? new LoopSound(sound.backgroundMusic)
        : new InteractiveSound(sound.inhaleFile, sound.exhaleFile);

    this.holdingScreen = false;
    this.pressInTime = null;
    this.animatedOffSet = new Animated.Value(0);
    this.animatedCircleRadius = new Animated.Value(158);
    this.touchEnabled = true;
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
    this.unmounted = false;
  }

  circleExpandEnd = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.startExhale();
    this.setState({measurementType: 'exhale'});
  };

  expand = () => {
    Animated.timing(this.animatedCircleRadius, {
      toValue: 158,
      duration: this.inhaleTime,
      useNativeDriver: true,
    }).start(this.circleExpandEnd);
  };

  exhaleCompleted = () => {
    this.breathCompleted();
    this.breathTaken = this.breathTaken + 1;
  };

  shrink = () => {
    Animated.timing(this.animatedCircleRadius, {
      toValue: 85,
      duration: this.exhaleTime,
      useNativeDriver: true,
    }).start(this.exhaleCompleted);
  };

  measureTime = () => {
    return new Date() - this.pressInTime;
  };

  startInhaleSound = () => {
    this.inhaleSoundId = setTimeout(() => {
      this.sound.stopInhaleSound();
      clearInterval(this.inhaleSoundId);
    }, this.inhaleTime - 250);
    this.sound.startInhaleSound();
  };

  startExhaleSound = () => {
    this.exhaleSoundId = setTimeout(() => {
      this.sound.stopExhaleSound();
      clearTimeout(this.exhaleSoundId);
    }, this.exhaleTime - 250);
    this.sound.startExhaleSound();
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

  clearInstruction = () => {
    const {instructionText, errorText} = this.state;
    const hasInstructionText = !!instructionText;
    const hasErrorText = !!errorText;
    hasInstructionText && this.setState({instructionText: ''});
    hasErrorText && this.setState({errorText: ''});
  };

  restartStopWatch = () => {
    if (this.state.timer === 0) {
      this.startStopWatch();
      return;
    }
    const timerOff = !!this.stopWatchId;
    timerOff && this.startStopWatch();
  };

  startExhale = () => {
    if (this.unmounted) {
      return;
    }
    this.shrink();
    const {sound} = this.props;
    sound.soundType !== 'background_music' && this.startExhaleSound();
  };

  startInhale = (exhaleTime) => {
    console.log('start INhlae');
    if (this.unmounted) {
      return;
    }
    this.expand(exhaleTime);

    this.setState({measurementType: 'inhale'});
    const {sound} = this.props;
    sound.soundType !== 'background_music' && this.startInhaleSound();
  };

  animatedListener = ({value}) => {
    if (value === 85 && this.holdingScreen) {
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

  playSound = () => {
    const {sound} = this.props;
    sound.soundType === 'background_music' ? this.sound.start() : null;
  };

  componentDidMount() {
    this.animatedListenerId = this.animatedCircleRadius.addListener(
      this.animatedListener,
    );
    setTimeout(this.startExhale, 1000);
    setTimeout(this.playSound, 1000);
  }

  componentWillUnmount() {
    const {sound} = this.props;
    this.unmounted = true;
    this.animatedCircleRadius.removeListener(this.animatedListenerId);
    this.stopWatchId && clearInterval(this.stopWatchId);
    this.feedbackLoopId && clearTimeout(this.feedbackLoopId);
    this.notHoldingErrorId && clearTimeout(this.notHoldingErrorId);
    if (sound.soundType === 'background_music') {
      this.sound.stop();
    } else {
      this.sound.stopAllSound();
    }
    clearTimeout(this.exhaleSoundId);
    clearInterval(this.inhaleSoundId);
  }

  render() {
    const {
      measurementType,
      timer,
      timerAndQuitVisible,
      errorText,
      finished,
    } = this.state;
    console.log('render');
    const showFinish = finished && !this.holdingScreen;
    const showExhaleText = measurementType === 'exhale';
    const showInhaleText = measurementType === 'inhale';
    const showErrorMsg = !!errorText;
    return (
      <>
        <View style={styles.topSpacer} />

        <TouchableOpacity
          style={styles.xoutHolder}
          onPress={this.props.handleQuit}>
          <Image
            source={require('../../../assets/icons/close.png')}
            style={styles.xout}
          />
        </TouchableOpacity>

        <ProgressTracker
          currentTime={timer}
          targetTime={this.finishBreathingTime}
          showTimer={true}
        />

        <BreathingGameCircle
          animatedRadius={this.animatedCircleRadius}
          animatedOffSet={this.animatedOffSet}
        />
        <View style={styles.container}>
          {showErrorMsg ? (
            <View style={styles.errorTextHolder}>
              <Text style={styles.errorText}>{errorText}</Text>
            </View>
          ) : (
            <>
              {showExhaleText && <Text style={styles.centerText}>Exhale</Text>}
              {showInhaleText && <Text style={styles.centerText}>Inhale</Text>}
            </>
          )}
        </View>

        {showFinish && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.props.handleFinish}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
    sound: state.sound,
  };
};

export default connect(mapStateToProps)(BreathingGame);
