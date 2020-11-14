import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';
import LottieView from 'lottie-react-native';

import {connect} from 'react-redux';

import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Svg, {Circle, G} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleCircumference = 2 * Math.PI * 160;

class CustomExerciseBuilder extends Component {
  constructor(props) {
    super(props);
    this.animatedProgress = new Animated.Value(0);
  }

  animationEnd = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.props.showBreathingGame();
  };

  startAnimation = (exhaleTime) => {
    Animated.timing(this.animatedProgress, {
      toValue: 1,
      duration: 4000,
    }).start(this.animationEnd);
  };

  componentDidMount() {
    const {calibrationExhale} = this.props.guidedBreathing;
    this.startAnimation(calibrationExhale);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.absoluteContainer}>
          <LottieView
            source={require('../../../assets/anims/building_exercise.json')}
            progress={this.animatedProgress}
            style={styles.lottieFile}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(CustomExerciseBuilder);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieFile: {
    alignSelf: 'center',
    height: 300,
    width: 300,
    marginBottom: 100,
  },
});
