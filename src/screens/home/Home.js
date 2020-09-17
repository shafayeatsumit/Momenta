import React, {Component} from 'react';
import {View, Text, BackHandler, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import styles from './Home.styles';
import ButtonBig from './ButtonBig';
import ButtonGroup from './ButtonGroup';
import Options from './Options';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';

const Sound = require('react-native-sound');
const soundFile = 'loop.mp3';
Sound.setCategory('Playback');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCutomButtonGroup: false,
      customConfigType: '',
      showCustomInterval: false,
      showBreathingTypes: false,
      showBreathingTime: false,
    };
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }

  switchTab = () => this.props.dispatch({type: 'SWITCH_BREATHING_TYPE'});

  exitApp = () => {
    if (!this.props.userInfo.onboarded) {
      return;
    }
  };

  handleStart = () => {
    const {breathing, navigation, userInfo} = this.props;
    analytics().logEvent('button_push', {title: 'Start'});
    if (!userInfo.onboarded) {
      const breathingType =
        breathing.type === 'fixed' ? 'FixedBreathing' : 'GuidedBreathing';
      navigation.navigate('CheckinTutorial', {
        handleMusic: this.handleMusic,
        navRoute: breathingType,
      });
      return;
    }
    breathing.type === 'fixed'
      ? navigation.navigate('FixedBreathing', {handleMusic: this.handleMusic})
      : navigation.navigate('GuidedBreathing', {handleMusic: this.handleMusic});
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

  componentDidMount() {
    const {userInfo} = this.props;
    if (userInfo.musicOn) {
      this.startTimer = setTimeout(() => {
        this.startMusic();
        clearTimeout(this.startTimer);
      }, 2000);
    }
  }

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

  buttonGroupPress = (breathingId, breathingType) => {
    this.setState({
      customConfigId: breathingId,
      customConfigType: breathingType,
      showCustomInterval: true,
      showBreathingTypes: false,
      showBreathingTime: false,
    });
  };

  closeOptions = () => {
    this.setState({
      showCustomInterval: false,
      showBreathingTypes: false,
      showBreathingTime: false,
      customConfigType: '',
      customConfigId: null,
    });
  };

  buttonGroupOptionSelect = (breathingTime) => {
    const {customConfigType} = this.state;
    this.setState({
      customConfigType: '',
      customConfigId: null,
      showCustomInterval: false,
    });
    this.props.dispatch({
      type: 'SELECT_CUSTOM_TIME',
      customType: customConfigType,
      customTime: breathingTime,
    });
    analytics().logEvent('button_push', {
      title: `custom_${customConfigType}_${breathingTime}`,
    });
  };

  render() {
    const {breathing, userInfo} = this.props;
    const {musicOn} = userInfo;
    const {
      showCutomButtonGroup,
      showCustomInterval,
      showBreathingTypes,
      showBreathingTime,
      customConfigType,
      customConfigId,
    } = this.state;
    const hideBreathingType = showCustomInterval;
    const hideBreathingTime = showCustomInterval || showBreathingTypes;
    const hideStart =
      showCustomInterval || showBreathingTypes || showBreathingTime;
    const minuteText = breathing.breathingTime > 1 ? 'minutes' : 'minute';
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={this.closeOptions}>
        <TouchableOpacity
          onPress={this.handleMusic}
          style={styles.musicIconHolder}>
          <Image
            style={styles.musicIcon}
            source={musicOn ? MusicIcon : NoMusicIcon}
          />
        </TouchableOpacity>
        <View style={styles.insideContainer}>
          {showCutomButtonGroup ? (
            <ButtonGroup
              handlePress={this.buttonGroupPress}
              customConfigType={customConfigType}
            />
          ) : (
            <View style={{height: 95}} />
          )}

          {!hideBreathingType && (
            <ButtonBig
              title={breathing.name}
              hasIcon={true}
              isOpen={showBreathingTypes}
              handlePress={() => {
                this.setState({
                  showBreathingTypes: true,
                  showBreathingTime: false,
                });
              }}
            />
          )}

          {!hideBreathingTime && (
            <ButtonBig
              hasIcon={true}
              isOpen={showBreathingTime}
              title={`${breathing.breathingTime} ${minuteText}`}
              handlePress={() => this.setState({showBreathingTime: true})}
            />
          )}
          {!hideStart && (
            <ButtonBig
              title={'Start'}
              buttonColor={'#3c71de'}
              handlePress={this.handleStart}
            />
          )}

          {showCustomInterval && (
            <Options
              type={'custom_interval'}
              customConfigId={customConfigId}
              handlePress={this.buttonGroupOptionSelect}
            />
          )}
          {showBreathingTypes && (
            <Options
              type={'breathing_type'}
              handlePress={this.handleTypeSelect}
            />
          )}
          {showBreathingTime && (
            <Options
              type={'breathing_time'}
              handlePress={this.handleTimeSelect}
            />
          )}
        </View>
      </TouchableOpacity>
    );
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
