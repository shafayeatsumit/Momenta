import React, {Component} from 'react';
import {View, Text, BackHandler, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import styles from './Home.styles';

const Sound = require('react-native-sound');
const soundFile = 'loop.mp3';
Sound.setCategory('Playback');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {sound: 'Off'};
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }
  handleStart = () => {
    const {breathing, navigation, userInfo} = this.props;
    analytics().logEvent('button_push', {title: 'Start'});
    if (!userInfo.onboarded) {
      const breathingType =
        breathing.type === 'fixed' ? 'FixedBreathing' : 'GuidedBreathing';
      navigation.navigate('CheckinTutorial', {
        navRoute: breathingType,
      });
      return;
    }
    breathing.type === 'fixed'
      ? navigation.navigate('FixedBreathing')
      : navigation.navigate('GuidedBreathing');
  };

  // Music realted
  stopMusic = () => {
    // this.playingFile1 && this.soundFile1.stop();
    // this.playingFile2 && this.soundFile2.stop();
    this.playingFile1 && this.soundFile1.setVolume(0);
    this.playingFile2 && this.soundFile2.setVolume(0);
    this.soundTimerOne && clearInterval(this.soundTimerOne);
    this.soundTimerOne && clearInterval(this.soundTimerTwo);
    this.playingFile1 && this.soundFile1.stop();
    this.playingFile2 && this.soundFile2.stop();
    analytics().logEvent('button_push', {title: 'stop_music'});
  };

  startMusic = () => {
    this.playSoundFileOne();
    this.soundFile1.setVolume(1);
    analytics().logEvent('button_push', {title: 'start_music'});
  };

  completedPlayingSoundFile1 = () => {
    this.playingFile1 = false;
    this.soundTimerOne && clearInterval(this.soundTimerOne);
  };

  completedPlayingSoundFile2 = () => {
    this.playingFile2 = false;
    this.soundTimerTwo && clearInterval(this.soundTimerTwo);
  };

  playSoundFileTwo = () => {
    this.soundFile2.play(this.completedPlayingSoundFile2);
    this.playingFile2 = true;
    this.soundTimerTwo = setInterval(() => {
      this.soundFile2.getCurrentTime((seconds, isPlaying) => {
        if (seconds > 170 && this.playingFile1 === false) {
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
        if (seconds > 170 && this.playingFile2 === false) {
          this.playSoundFileTwo();
          this.soundFile2.setVolume(1);
        }
      });
    }, 500);
  };

  handleTypeSelect = (breathing) => {
    const breathingType = breathing.type;
    const breathingId = breathing.id;
    const {dispatch} = this.props;
    if (breathingType === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TYPE', data: breathing});
    } else {
      dispatch({type: 'SELECT_FIXED_TYPE', data: breathing});
    }
    this.setState({
      showBreathingTypes: false,
      ...(breathingId === 'custom'
        ? {showCutomButtonGroup: true}
        : {showCutomButtonGroup: false}),
    });
    analytics().logEvent('button_push', {title: `${breathing.id}`});
  };

  handleTimeSelect = (breathingTime) => {
    const {dispatch, breathing} = this.props;
    if (breathing.type === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TIME', breathingTime});
    } else {
      dispatch({type: 'SELECT_FIXED_TIME', breathingTime});
    }
    this.setState({showBreathingTime: false});
    analytics().logEvent('button_push', {title: `duration_${breathingTime}`});
  };

  handleSoundSelect = (optons) => {
    this.setState({sound: optons, showSoundOptions: false});
    optons === 'On' ? this.startMusic() : this.stopMusic();
  };

  render() {
    return <View />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    breathing: state.breathing,
    guidedBreathing: state.guidedBreathing,
    fixedBreathing: state.fixedBreathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(Home);
