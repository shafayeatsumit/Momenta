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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './FixedBreathing.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';
import {connect} from 'react-redux';

const Sound = require('react-native-sound');
const soundFile = 'loop.mp3';
Sound.setCategory('Playback');

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Tap Anywhere To Start',
      finished: false,
      musicOn: true,
    };
    this.animated = new Animated.Value(0);
    this.counter = 0;
    this.totalBreaths = props.fixedBreathing.numberOfBreaths;
    this.inhaleTime = props.fixedBreathing.inhale;
    this.inhaleHold = props.fixedBreathing.inhaleHold;
    this.exhaleTime = props.fixedBreathing.exhale;
    this.exhaleHold = props.fixedBreathing.exhaleHold;
    this.totalTime =
      this.inhaleTime + this.exhaleTime + this.inhaleHold + this.exhaleHold;
    // sound files.
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  handleMusic = () => {
    const {musicOn} = this.state;
    musicOn ? this.stopSound() : this.playSoundFileOne();
    this.setState({musicOn: !musicOn});
  };

  startInhaleHoldTimer = () => {
    this.inhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold!'});
      this.startHapticFeedback();
      clearTimeout(this.inhaleHoldTimer);
    }, this.inhaleTime * 1000);
  };

  startExhaleTimer = () => {
    this.exhaleTimer = setTimeout(() => {
      this.setState({circleText: 'Exhale'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleTimer);
    }, (this.inhaleTime + this.inhaleHold) * 1000);
  };

  startExhaleHoldTimer = () => {
    this.exhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold!'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleHoldTimer);
    }, (this.totalTime - this.exhaleHold) * 1000);
  };

  animatCb = () => {
    this.counter += 1;
    console.log('total breaths', this.totalBreaths, this.counter);
    if (this.totalBreaths > this.counter) {
      this.inhaleStart();
      this.startExhaleTimer();
      this.inhaleHold && this.startInhaleHoldTimer();
      this.exhaleHold && this.startExhaleHoldTimer();
      this.animate();
    } else {
      this.setState({finished: true});
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

  inhaleStart = () => {
    this.setState({circleText: 'Inhale'});
    this.startHapticFeedback();
  };

  completedPlayingSoundFile1 = () => {
    this.playingFile1 = false;
    // this.soundFile1.setCurrentTime(0);
    this.soundTimerOne && clearInterval(this.soundTimerOne);
  };

  completedPlayingSoundFile2 = () => {
    this.playingFile2 = false;
    // this.soundFile2.setCurrentTime(0);
    this.soundTimerTwo && clearInterval(this.soundTimerTwo);
  };

  stopSound = () => {
    this.setState({musicOn: false});
    this.playingFile1 && this.soundFile1.stop();
    this.playingFile2 && this.soundFile2.stop();
    this.soundTimerOne && clearInterval(this.soundTimerOne);
    this.soundTimerOne && clearInterval(this.soundTimerTwo);
  };

  playSoundFileTwo = () => {
    this.soundFile2.play(this.completedPlayingSoundFile2);
    this.playingFile2 = true;
    this.soundTimerTwo = setInterval(() => {
      this.soundFile2.getCurrentTime((seconds, isPlaying) => {
        if (seconds > 29 && this.playingFile1 === false) {
          this.playSoundFileOne();
        }
      });
    }, 500);
  };

  playSoundFileOne = () => {
    this.soundFile1.play(this.completedPlayingSoundFile1);
    this.playingFile1 = true;
    this.soundTimerOne = setInterval(() => {
      this.soundFile1.getCurrentTime((seconds, isPlaying) => {
        console.log('sound timer one', seconds);
        if (seconds > 29 && this.playingFile2 === false) {
          this.playSoundFileTwo();
        }
      });
    }, 500);
  };

  handlePress = () => {
    this.inhaleStart();
    this.startExhaleTimer();
    this.exhaleHold && this.startExhaleHoldTimer();
    this.inhaleHold && this.startInhaleHoldTimer();
    this.animate();
    this.playSoundFileOne();
  };

  componentWillUnmount() {
    this.inhaleHoldTimer && clearTimeout(this.inhaleHoldTimer);
    this.exhaleHoldTimer && clearTimeout(this.exhaleHoldTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
    this.stopSound();
  }

  render() {
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const {circleText, finished, musicOn} = this.state;
    const transform = [{rotate: this.rotate}];
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={this.handlePress}>
        <BreathingProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
          inhaleHold={this.inhaleHold}
          exhaleHold={this.exhaleHold}
        />
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>

        {finished && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={() => this.props.navigation.replace('Home')}>
            <Text style={styles.text}>Finish</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={this.handleMusic}
          style={styles.musicIconHolder}>
          <Image
            style={styles.musicIcon}
            source={musicOn ? MusicIcon : NoMusicIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    fixedBreathing: state.fixedBreathing,
  };
};

export default connect(mapStateToProps)(FixedBreathing);
