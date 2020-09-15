import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
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
      showBreathingTypes: true,
      showBreathingTime: false,
    };
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }

  switchTab = () => this.props.dispatch({type: 'SWITCH_BREATHING_TYPE'});

  handleStart = () => {
    const {breathing, navigation, userInfo} = this.props;
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

  handleTypeSelect = (breating) => {
    const breathingType = breating.type;
    const breathingId = breating.id;
    const {dispatch} = this.props;
    if (breathingType === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TYPE', data: breating});
    } else {
      dispatch({type: 'SELECT_FIXED_TYPE', data: breating});
    }
    this.setState({
      showBreathingTypes: false,
      ...(breathingId === 'custom'
        ? {showCutomButtonGroup: true}
        : {showCutomButtonGroup: false}),
    });
  };

  handleTimeSelect = (breathingTime) => {
    const {dispatch, breathing} = this.props;
    if (breathing.type === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TIME', breathingTime});
    } else {
      dispatch({type: 'SELECT_FIXED_TIME', breathingTime});
    }
    this.setState({showBreathingTime: false});
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
  };

  render() {
    const {breathing, userInfo, guidedBreathing, fixedBreathing} = this.props;
    // console.log('++++++++++++++++++++++');
    // console.log('breathing', breathing);
    // console.log('fixed breathing', fixedBreathing);
    // console.log('guided breathing', guidedBreathing);
    // console.log('++++++++++++++++++++++');
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
        {showCutomButtonGroup && (
          <ButtonGroup
            handlePress={this.buttonGroupPress}
            customConfigType={customConfigType}
          />
        )}
        <TouchableOpacity
          onPress={this.handleMusic}
          style={styles.musicIconHolder}>
          <Image
            style={styles.musicIcon}
            source={musicOn ? MusicIcon : NoMusicIcon}
          />
        </TouchableOpacity>
        {showCustomInterval && (
          <Options
            type={'custom_interval'}
            customConfigId={customConfigId}
            handlePress={this.buttonGroupOptionSelect}
          />
        )}
        {!hideBreathingType && (
          <ButtonBig
            title={breathing.name}
            handlePress={() => {
              this.setState({
                showBreathingTypes: true,
                showBreathingTime: false,
              });
            }}
          />
        )}

        {showBreathingTypes && (
          <Options
            type={'breathing_type'}
            handlePress={this.handleTypeSelect}
          />
        )}
        {!hideBreathingTime && (
          <ButtonBig
            title={`${breathing.breathingTime} ${minuteText}`}
            handlePress={() => this.setState({showBreathingTime: true})}
          />
        )}

        {showBreathingTime && (
          <Options
            type={'breathing_time'}
            handlePress={this.handleTimeSelect}
          />
        )}
        {!hideStart && (
          <ButtonBig
            title={'Start'}
            buttonColor={'#3c71de'}
            handlePress={this.handleStart}
          />
        )}
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
