import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Result from './IntroBreathResult';
import CommonStyles from './Onboarding.styles';
import LottieView from 'lottie-react-native';
import {FontType, Colors} from '../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';

const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
const FINISH_MESSAGE = 'Tap as you finish exhaling';

class IntroBreath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      measurementType: null,
      instructionText: INITIAL_MESSAGE,
      inhaleTimeRecorded: false,
      exhaleTimeRecorded: false,
      showCheckMark: false,
      showResult: false,
    };
    this.pressInTime = null;
    this.pressOutTime = null;
  }

  shouldShowError = (time) => {
    return time > 6 || time <= 1;
  };

  measureTime = (time) => {
    return ((new Date() - time) / 1000).toFixed(1);
  };

  resetTime = () => {
    this.pressInTime = null;
    this.pressOutTime = null;
  };

  handlePressIn = () => {
    const {measuring} = this.state;
    !measuring &&
      this.setState({
        measuring: true,
        measurementType: 'inhale',
        instructionText: null,
      });
    if (this.pressInTime) {
      const timeTakenExhale = this.measureTime(this.pressOutTime);
      console.log('timeTakenExhale', timeTakenExhale);
      const showError = this.shouldShowError(timeTakenExhale);
      if (showError) {
        const errorMessage =
          'Almost.Hold and exhale for more than 1s but less than 6s';
        this.setState(
          {instructionText: errorMessage, measuring: false},
          this.resetTime,
        );
      } else {
        this.setState({
          exhaleTimeRecorded: timeTakenExhale,
          showCheckMark: true,
        });
      }
    }
    this.pressInTime = new Date();
  };

  checkmarkAnimationFinish = () => {
    console.log('checkmark animation finish event');
    this.setState({
      showCheckMark: false,
      showResult: true,
    });
  };

  redoBreathing = () => {
    this.resetTime();
    this.setState({
      measuring: false,
      measurementType: null,
      instructionText: INITIAL_MESSAGE,
      inhaleTimeRecorded: false,
      exhaleTimeRecorded: false,
      showCheckMark: false,
      showResult: false,
    });
  };

  handlePressOut = () => {
    if (!this.pressInTime) {
      return;
    }

    this.setState({
      measurementType: 'exhale',
      instructionText: FINISH_MESSAGE,
    });

    this.pressOutTime = new Date();
    const timeTakeInhale = this.measureTime(this.pressInTime);
    console.log('time taken inhale', timeTakeInhale);
    const showError = this.shouldShowError(timeTakeInhale);
    if (showError) {
      const errorMessage =
        'Almost.Hold and inhale for more than 1s but less than 6s';
      this.setState(
        {instructionText: errorMessage, measuring: false},
        this.resetTime,
      );
    } else {
      this.setState({inhaleTimeRecorded: timeTakeInhale});
    }
  };

  render() {
    const {
      measurementType,
      measuring,
      instructionText,
      showCheckMark,
      showResult,
      inhaleTimeRecorded,
      exhaleTimeRecorded,
    } = this.state;

    if (showResult) {
      return (
        <Result
          inhaleTime={inhaleTimeRecorded}
          exhaleTime={exhaleTimeRecorded}
          redoBreathing={this.redoBreathing}
          goNext={this.props.goNext}
        />
      );
    }
    if (showCheckMark) {
      return (
        <View style={styles.checkmarkContainer}>
          <LottieView
            autoSize
            autoPlay
            loop={false}
            style={styles.checkmark}
            source={require('../../../assets/anims/check_mark.json')}
            onAnimationFinish={this.checkmarkAnimationFinish}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {measuring && (
          <View style={styles.measurementContainer}>
            <Text style={styles.bottomText}>
              Measuring {measurementType} time
            </Text>
            <LottieView
              autoSize
              autoPlay
              loop
              style={styles.wave}
              source={require('../../../assets/anims/wave.json')}
            />
          </View>
        )}

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>{instructionText}</Text>
        </View>
        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={CommonStyles.touchableArea}
        />
      </View>
    );
  }
}
export default IntroBreath;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measurementContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    height: 180,
    width: 180,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.3,
    paddingHorizontal: 20,
  },
  bottomText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  checkmarkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    height: 400,
    width: 400,
  },
});
