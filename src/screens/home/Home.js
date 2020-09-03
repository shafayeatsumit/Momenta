import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import styles from './Home.styles';
import GuidedBreathing from './GuidedBreathingTypes';
import BreathCounter from './BreathCounter';
import FixedBreathing from './FixedBreathing';

import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';

const Sound = require('react-native-sound');
const soundFile = 'loop.mp3';
Sound.setCategory('Playback');

class Home extends Component {
  constructor(props) {
    super(props);
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }

  switchTab = () => this.props.dispatch({type: 'SWITCH_BREATHING_TYPE'});

  handleStart = () => {
    const {breathing, navigation} = this.props;
    breathing.type === 'fixed'
      ? navigation.navigate('FixedBreathing', {handleMusic: this.handleMusic})
      : navigation.navigate('GuidedBreathing', {handleMusic: this.handleMusic});
  };

  // Music realted
  stopMusic = () => {
    this.playingFile1 && this.soundFile1.stop();
    this.playingFile2 && this.soundFile2.stop();
    this.soundTimerOne && clearInterval(this.soundTimerOne);
    this.soundTimerOne && clearInterval(this.soundTimerTwo);
  };

  startMusic = () => this.playSoundFileOne();

  handleMusic = () => {
    const {userInfo} = this.props;
    this.props.dispatch({type: 'TOGGLE_MUSIC'});
    userInfo.musicOn ? this.stopMusic() : this.startMusic();
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
        console.log('sound timer two', seconds);
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
        console.log('sound timer one', seconds);
        if (seconds > 170 && this.playingFile2 === false) {
          this.playSoundFileTwo();
        }
      });
    }, 500);
  };

  componentDidMount() {
    const {userInfo} = this.props;
    if (userInfo.musicOn) {
      this.startTimer = setTimeout(() => {
        this.startMusic();
        clearTimeout(this.startTimer);
      }, 2000);
    }
  }

  render() {
    const {breathing, userInfo} = this.props;
    const {musicOn} = userInfo;
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={this.switchTab}
              style={[
                styles.tab,
                breathing.type === 'guided' && styles.tabHighlight,
              ]}>
              <Text style={styles.tabText}>Guided</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.switchTab}
              style={[
                styles.tab,
                breathing.type === 'fixed' && styles.tabHighlight,
              ]}>
              <Text style={styles.tabText}>Fixed</Text>
            </TouchableOpacity>
          </View>
          {breathing.type === 'guided' ? (
            <GuidedBreathing />
          ) : (
            <FixedBreathing />
          )}

          <BreathCounter />
        </View>
        <TouchableOpacity style={styles.startButton} onPress={this.handleStart}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleMusic}
          style={styles.musicIconHolder}>
          <Image
            style={styles.musicIcon}
            source={musicOn ? MusicIcon : NoMusicIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    breathing: state.breathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(Home);
