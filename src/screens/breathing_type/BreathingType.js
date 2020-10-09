import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './BreathingType.styles';
import Settings from './Settings';
import BackButton from '../../../assets/icons/arrow_left.png';
import RightArrow from '../../../assets/icons/arrow_right.png';
import analytics from '@react-native-firebase/analytics';

const Sound = require('react-native-sound');
const soundFile = 'loop.mp3';
Sound.setCategory('Playback');

class BreathingType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: 'Off',
      settingsVisible: false,
      settingsType: null,
    };
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

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleSoundSelect = () => {
    const {sound} = this.state;
    const option = sound === 'On' ? 'Off' : 'On';
    option === 'On' ? this.startMusic() : this.stopMusic();
    this.setState({sound: option});
  };

  showSoundSettings = () =>
    this.setState({
      settingsVisible: true,
      settingsType: 'sound',
    });

  showDurationSettings = () =>
    this.setState({
      settingsVisible: true,
      settingsType: 'duration',
    });

  hideSettings = () => this.setState({settingsVisible: false});

  render() {
    const {settingsVisible, settingsType, sound} = this.state;
    const {breathing} = this.props;
    const {breathingType} = this.props.route.params;
    const {background} = breathingType;
    const minOrMins = breathing.breathingTime > 1 ? 'mins' : 'min';
    if (settingsVisible) {
      return (
        <Settings
          type={settingsType}
          sound={sound}
          handleSoundSelect={this.handleSoundSelect}
          goBack={this.hideSettings}
        />
      );
    }
    return (
      <ImageBackground source={background} style={styles.background}>
        <View style={styles.titleBox}>
          <Text style={styles.titleSm}>{breathing.name_line_one}</Text>
          <Text style={styles.title}>{breathing.name_line_two}</Text>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{breathing.description}</Text>
        </View>
        <TouchableOpacity style={styles.backbuttonHolder} onPress={this.goBack}>
          <Image source={BackButton} style={styles.backbutton} />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonTransparent]}
            onPress={this.showDurationSettings}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Duration</Text>
            <View>
              <Text style={styles.buttonTextRight}>
                {breathing.breathingTime} {minOrMins}
              </Text>
              {breathing.breathingTime === breathing.recommendedTime && (
                <Text style={[styles.buttonTextRight, {fontSize: 8}]}>
                  Recommended
                </Text>
              )}
            </View>
            <Image style={styles.rightButton} source={RightArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.showSoundSettings}
            style={[styles.button, styles.buttonTransparent]}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sound</Text>
            <Text style={styles.buttonTextRight}>{sound}</Text>
            <Image style={styles.rightButton} source={RightArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={this.handleStart}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    breathing: state.breathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(BreathingType);
