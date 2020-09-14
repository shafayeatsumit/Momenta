import React, {Component} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import CheckInBreath from './CheckInBreath';
import BreathingGame from './BreathingGame';
import {connect} from 'react-redux';
import {FontType, Colors} from '../../helpers/theme';
import {ScreenHeight} from '../../helpers/constants/common';
import MusicIcon from '../../../assets/icons/music.png';
import NoMusicIcon from '../../../assets/icons/no_music.png';
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
    };
  }

  goHome = () => {
    console.log('here');
    this.setState({showBreathingGame: false});
    this.props.navigation.pop();
  };

  setFinished = () => this.setState({finished: true});

  goToBreathingGame = (avgExhaleTime, avgInhaleTime) => {
    this.props.dispatch({
      type: 'UPDATE_CALIBRATION_TIME',
      calibrationExhale: avgExhaleTime,
      calibrationInhale: avgInhaleTime,
    });
    this.setState({showCheckInBreath: false, showBreathingGame: true});
  };

  handlePressIn = () => {
    this.setState({pressIn: true, pressOut: false});
  };

  handlePressOut = () => {
    this.setState({pressIn: false, pressOut: true});
  };

  handleTap = () => {
    const {showStuffs} = this.state;
    this.setState({showStuffs: !showStuffs});
  };

  render() {
    const {
      showCheckInBreath,
      showBreathingGame,
      pressIn,
      pressOut,
      finished,
      showStuffs,
    } = this.state;
    const {userInfo} = this.props;
    const {musicOn} = userInfo;
    const {route} = this.props;
    const showQuit = !finished && showBreathingGame && showStuffs;
    const showSoundIcon =
      showCheckInBreath || (showBreathingGame && showStuffs);
    return (
      <>
        {showCheckInBreath && (
          <CheckInBreath
            goToBreathingGame={this.goToBreathingGame}
            musicOn={musicOn}
            handleMusic={route.params.handleMusic}
            pressIn={pressIn}
            pressOut={pressOut}
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
          <TouchableOpacity style={styles.finishButton} onPress={this.goHome}>
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        )}

        {showQuit && (
          <TouchableOpacity style={styles.quitButton} onPress={this.goHome}>
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
    left: 35,
    height: 30,
    width: 30,
    borderRadius: 20,
    zIndex: 4,
  },
  quitButton: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    height: 50,
    width: 60,
    justifyContent: 'center',
    zIndex: 5,
  },
  quitButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(66,72,102)',
    fontSize: 18,
    textAlign: 'center',
  },
  finishButton: {
    position: 'absolute',
    bottom: 30,
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
