import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import CheckInBreath from './CheckInBreath';
import BreathingGame from './BreathingGame';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';
import {setDynamicTarget} from '../../redux/actions/guidedBreathing';
import {FontType, Colors} from '../../helpers/theme';
import {ScreenHeight} from '../../helpers/constants/common';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';
import analytics from '@react-native-firebase/analytics';
class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckInBreath: true,
      showBreathingGame: false,
      pressIn: false,
      pressOut: false,
      finished: false,
      showStuffs: false,
      showAnimation: false,
    };
  }

  goHome = () => {
    this.setState({showBreathingGame: false, showAnimation: true});
    this.props.navigation.pop();
  };

  finishHaptics = () => {
    const feedbackType = Platform.OS === 'ios' ? 'impactMedium' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  setFinished = () => this.setState({finished: true});

  goToBreathingGame = (exhaleTime, inhaleTime) => {
    const {dispatch, guidedBreathing} = this.props;
    dispatch({
      type: 'UPDATE_CALIBRATION_TIME',
      calibrationExhale: exhaleTime,
      calibrationInhale: inhaleTime,
    });
    if (guidedBreathing.dynamicTarget) {
      dispatch(setDynamicTarget(exhaleTime, inhaleTime)).then(() => {
        this.setState({showCheckInBreath: false, showBreathingGame: true});
      });
    } else {
      this.setState({showCheckInBreath: false, showBreathingGame: true});
    }
  };

  handlePressIn = () => {
    analytics().logEvent('user_hold');
    this.setState({pressIn: true, pressOut: false, showStuffs: false});
  };

  handlePressOut = () => {
    analytics().logEvent('user_release');
    this.setState({pressIn: false, pressOut: true});
  };

  handleTap = () => {
    const {showStuffs} = this.state;
    this.setState({showStuffs: !showStuffs});
  };

  handleQuit = () => {
    analytics().logEvent('button_push', {title: 'quit'});
    this.goHome();
  };

  handleFinish = () => {
    this.setState({showAnimation: true});
    this.hapticsFinisherId = setTimeout(() => {
      this.finishHaptics();
      clearTimeout(this.hapticsFinisherId);
    }, 1500);

    analytics().logEvent('button_push', {title: 'finish'});
  };

  render() {
    const {
      showCheckInBreath,
      showBreathingGame,
      pressIn,
      pressOut,
      finished,
      showStuffs,
      showAnimation,
    } = this.state;
    const {userInfo, guidedBreathing} = this.props;
    const {musicOn} = userInfo;
    const {route} = this.props;
    const showQuit = !finished && showBreathingGame && showStuffs;
    const showSoundIcon =
      showCheckInBreath || (showBreathingGame && showStuffs);

    if (showAnimation) {
      return (
        <View style={styles.checkmarkHolder}>
          <LottieView
            autoSize
            autoPlay
            loop={false}
            style={styles.checkmark}
            resizeMode="cover"
            source={require('../../../assets/anims/check_mark.json')}
            onAnimationFinish={this.goHome}
          />
        </View>
      );
    }
    return (
      <>
        {showCheckInBreath && (
          <CheckInBreath
            goToBreathingGame={this.goToBreathingGame}
            musicOn={musicOn}
            handleMusic={route.params.handleMusic}
            pressIn={pressIn}
            pressOut={pressOut}
            breathId={guidedBreathing.id}
          />
        )}
        {showBreathingGame && (
          <BreathingGame
            pressIn={pressIn}
            pressOut={pressOut}
            finished={finished}
            showStuffs={showStuffs}
            setFinished={this.setFinished}
            handleTap={this.handleTap}
          />
        )}
        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchableArea}
        />
        {showSoundIcon && (
          <TouchableOpacity
            onPress={route.params.handleMusic}
            style={styles.musicIconHolder}>
            <Image
              style={styles.musicIcon}
              source={musicOn ? MusicIcon : NoMusicIcon}
            />
          </TouchableOpacity>
        )}
        {finished && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.handleFinish}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}

        {showQuit && (
          <TouchableOpacity style={styles.quitButton} onPress={this.handleQuit}>
            <Text style={styles.quitButtonText}>Quit</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(GuidedBreathing);

const styles = StyleSheet.create({
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  musicIcon: {
    height: 30,
    width: 30,
    borderRadius: 20,
    tintColor: '#F5F5F5',
    resizeMode: 'contain',
  },
  musicIconHolder: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    height: 60,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  quitButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  quitButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(66,72,102)',
    fontSize: 16,
    textAlign: 'center',
  },
  finishButton: {
    position: 'absolute',
    bottom: 30,
    height: 60,
    width: 120,
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 5,
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  checkmarkHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  checkmark: {
    height: 300,
    width: 300,
  },
});
