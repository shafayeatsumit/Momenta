import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import CheckInBreath from './CheckInBreath';
import BreathingGame from './BreathingGame';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';
import {setDynamicTarget} from '../../redux/actions/guidedBreathing';
import {Colors} from '../../helpers/theme';
import {ScreenHeight} from '../../helpers/constants/common';
import CustomExerciseBuilder from './CustomExerciseBuilder';
import CalibrationExplainer from './CalibrationExplainer';
import analytics from '@react-native-firebase/analytics';
import SoundOptions from '../../helpers/soundOptions';
class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckInBreath: false,
      showBreathingGame: true,
      showCalibrationExplainer: false,
      buildingCustomExercise: false,
      finished: false,
      showAnimation: false,
    };
    this.sound = new SoundOptions();
  }

  goHome = () => {
    this.setState({showBreathingGame: false, showAnimation: true});
    this.props.navigation.pop();
  };

  finishHaptics = () => {
    const feedbackType = 'impactMedium';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  showBreathingGame = () => {
    this.setState({
      buildingCustomExercise: false,
      showCheckInBreath: false,
      showBreathingGame: true,
      showCalibrationExplainer: false,
    });
  };

  showCalibration = () => {
    const {userInfo} = this.props;
    if (userInfo.showCalibrationExplainer) {
      this.setState({showBreathingGame: false, showCalibrationExplainer: true});
    } else {
      this.setState({
        showBreathingGame: false,
        showCalibrationExplainer: false,
        showCheckInBreath: true,
      });
    }
  };

  goToCalibration = () => {
    this.setState({
      showBreathingGame: false,
      showCalibrationExplainer: false,
      showCheckInBreath: true,
    });
  };

  buildCustomExercise = (exhaleTime, inhaleTime) => {
    const {dispatch, guidedBreathing} = this.props;
    dispatch({
      type: 'UPDATE_CALIBRATION_TIME',
      calibrationExhale: exhaleTime,
      calibrationInhale: inhaleTime,
    });
    if (guidedBreathing.dynamicTarget) {
      dispatch(setDynamicTarget(exhaleTime, inhaleTime)).then(() => {
        this.setState({showCheckInBreath: false, buildingCustomExercise: true});
      });
    } else {
      this.setState({showCheckInBreath: false, buildingCustomExercise: true});
    }
  };

  handleQuit = () => {
    const {buildingCustomExercise} = this.state;
    if (!buildingCustomExercise) {
      analytics().logEvent('button_push', {title: 'quit'});
    }
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

  componentWillUnmount() {
    this.sound.stopMusic();
  }

  render() {
    const {
      showCheckInBreath,
      showBreathingGame,
      showAnimation,
      buildingCustomExercise,
      showCalibrationExplainer,
    } = this.state;
    const {guidedBreathing} = this.props;
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
            buildCustomExercise={this.buildCustomExercise}
            breathId={guidedBreathing.id}
            goBack={this.showBreathingGame}
          />
        )}
        {showCalibrationExplainer && (
          <CalibrationExplainer
            goToCalibration={this.goToCalibration}
            goBack={this.showBreathingGame}
          />
        )}
        {buildingCustomExercise && (
          <CustomExerciseBuilder showBreathingGame={this.showBreathingGame} />
        )}
        {showBreathingGame && (
          <BreathingGame
            handleQuit={this.handleQuit}
            handleFinish={this.handleFinish}
            goToCalibration={this.showCalibration}
          />
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
