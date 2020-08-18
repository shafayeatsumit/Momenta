import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import styles from './CheckIn.styles';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const MORE_THAN_SIX = 'Hold and inhale for less than 6 seconds';

import {hapticFeedbackOptions} from '../../helpers/constants/common';

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenMessage: 'Tap and hold to start checkin',
      showErrorAnim: false,
      progress: 0,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  resetTimeCount = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
  };

  pressInHandler = () => {
    this.pressInTime = new Date();
    this.startHapticFeedback();
    this.setState({screenMessage: 'Inhaling', showErrorAnim: false});
    if (this.pressOutTime) {
      const timeTakenExhale = ((new Date() - this.pressOutTime) / 1000).toFixed(
        1,
      );
      if (timeTakenExhale > 1 && timeTakenExhale < 6) {
        this.setState({progress: this.state.progress + 1});
      }
    }
  };

  setExhale = () => {
    this.exhaleTimerId = setTimeout(() => {
      this.setState({
        screenMessage: 'Exhaling',
      });
      clearTimeout(this.exhaleTimerId);
    }, 500);
  };

  pressOutHandler = () => {
    this.setState({screenMessage: ''});
    this.pressOutTime = new Date();
    const timeTakeInhale = ((new Date() - this.pressInTime) / 1000).toFixed(1);
    console.log('time taken inhale', timeTakeInhale);
    if (timeTakeInhale <= 1) {
      this.setState({showErrorAnim: true, screenMessage: ''});
    } else if (timeTakeInhale > 6) {
      this.setState({screenMessage: MORE_THAN_SIX});
    } else {
      this.setExhale();
    }
  };

  render() {
    const {screenMessage, showErrorAnim, progress} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Text style={[styles.progressText, styles.progressTextBig]}>
            {progress}
            <Text style={styles.progressText}>/{3}</Text>
          </Text>
        </View>

        {showErrorAnim ? (
          <LottieView
            autoPlay
            loop
            autoSize={false}
            source={require('../../../assets/anims/inale_error.json')}
            style={{height: 500, width: 400}}
          />
        ) : (
          <Text allowFontScaling={false} style={styles.message}>
            {screenMessage}
          </Text>
        )}

        <TouchableOpacity
          onPressIn={this.pressInHandler}
          onPressOut={this.pressOutHandler}
          style={styles.touchHandler}
        />
      </View>
    );
  }
}
export default CheckIn;
