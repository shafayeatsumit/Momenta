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
import styles from './FixedBreathing.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import ProgressTracker from '../../components/ProgressTracker';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';
import {connect} from 'react-redux';

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: '',
      finished: false,
      initialized: false,
      touchDisabled: false,
      timer: 0,
    };
    this.checkmarkProgress = new Animated.Value(0);
    this.unmounted = false;
    this.animated = new Animated.Value(0);
    this.counter = 0;
    this.inhaleTime = props.fixedBreathing.inhale;
    this.inhaleHold = props.fixedBreathing.inhaleHold;
    this.exhaleTime = props.fixedBreathing.exhale;
    this.exhaleHold = props.fixedBreathing.exhaleHold;
    this.totalTime =
      this.inhaleTime + this.exhaleTime + this.inhaleHold + this.exhaleHold;
    this.finishBreathingTime = props.fixedBreathing.numberOfBreaths * 60;
    this.totalBreaths = Math.ceil(this.finishBreathingTime / this.totalTime);
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  startExhaleHoldTimer = () => {
    this.inhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold'});
      this.startHapticFeedback();
      clearTimeout(this.inhaleHoldTimer);
    }, this.exhaleTime * 1000);
  };

  startInhaleTimer = () => {
    this.exhaleTimer = setTimeout(() => {
      this.setState({circleText: 'Inhale'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleTimer);
    }, (this.exhaleTime + this.exhaleHold) * 1000);
  };

  startInhaleHoldTimer = () => {
    this.exhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleHoldTimer);
    }, (this.totalTime - this.inhaleHold) * 1000);
  };

  animatCb = () => {
    if (this.unmounted) {
      return;
    }
    this.counter += 1;
    if (this.totalBreaths > this.counter) {
      this.exhaleStart();
      this.exhaleHold && this.startExhaleHoldTimer();
      this.inhaleHold && this.startInhaleHoldTimer();
      this.startInhaleTimer();
      this.animate();
    } else {
      this.stopWatchId && clearInterval(this.stopWatchId);
      this.setState({finished: true}, this.finishAnimation);
    }
  };

  animate = () => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: this.totalTime * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(this.animatCb);
  };

  exhaleStart = () => {
    this.setState({circleText: 'Exhale'});
    this.startHapticFeedback();
  };

  startStopWatch = () => {
    this.stopWatchId = setInterval(() => {
      if (this.state.timer >= this.finishBreathingTime) {
        clearInterval(this.stopWatchId);
        return;
      }
      this.setState({timer: this.state.timer + 1});
    }, 1000);
  };

  handlePress = () => {
    this.setState({initialized: true, touchDisabled: true});
    this.exhaleStart();
    this.startInhaleTimer();
    this.exhaleHold && this.startExhaleHoldTimer();
    this.inhaleHold && this.startInhaleHoldTimer();
    this.animate();
    this.startStopWatch();
  };

  handleFinish = () => this.props.navigation.pop();

  componentWillUnmount() {
    this.unmounted = true;
    this.inhaleHoldTimer && clearTimeout(this.inhaleHoldTimer);
    this.exhaleHoldTimer && clearTimeout(this.exhaleHoldTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.stopWatchId && clearInterval(this.stopWatchId);
  }

  finishAnimation = () => {
    Animated.timing(this.checkmarkProgress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start(this.handleFinish);
  };

  render() {
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const {
      circleText,
      finished,
      initialized,
      touchDisabled,
      timer,
    } = this.state;
    const transform = [{rotate: this.rotate}];
    const {userInfo} = this.props;
    const {musicOn} = userInfo;
    const {route} = this.props;

    if (finished) {
      return (
        <View style={styles.checkmarkHolder}>
          <LottieView
            autoSize
            autoPlay
            loop={false}
            style={styles.checkmark}
            resizeMode="cover"
            source={require('../../../assets/anims/success.json')}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        touchDisabled={touchDisabled}
        onPress={this.handlePress}>
        <BreathingProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
          inhaleHold={this.inhaleHold}
          exhaleHold={this.exhaleHold}
        />
        <View style={styles.progressTrackerContainer}>
          <ProgressTracker
            currentTime={timer}
            targetTime={this.finishBreathingTime}
          />
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>

        {initialized && (
          <TouchableOpacity
            onPress={route.params.handleMusic}
            style={styles.musicIconHolder}>
            <Image
              style={styles.musicIcon}
              source={musicOn ? MusicIcon : NoMusicIcon}
            />
          </TouchableOpacity>
        )}
        {!initialized && (
          <View style={styles.initTextHolder} pointerEvents="none">
            <Text style={styles.initText}>Tap screen to begin</Text>
          </View>
        )}
        {!finished && initialized && (
          <TouchableOpacity
            style={styles.quitButton}
            onPress={this.handleFinish}>
            <Text style={styles.quitButtonText}>Quit</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
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
