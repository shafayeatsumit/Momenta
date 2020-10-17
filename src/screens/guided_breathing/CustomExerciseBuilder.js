import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';

import {connect} from 'react-redux';

import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Svg, {Circle, G} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleCircumference = 2 * Math.PI * 160;

class CustomExerciseBuilder extends Component {
  constructor(props) {
    super(props);
    this.animatedOffSet = new Animated.Value(CircleCircumference);
    this.animatedRadius = new Animated.Value(85);
  }

  animationEnd = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    this.props.showBreathingGame();
  };

  startAnimation = (exhaleTime) => {
    Animated.parallel([
      Animated.timing(this.animatedOffSet, {
        toValue: 0,
        duration: exhaleTime,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: 158,
        duration: exhaleTime,
        useNativeDriver: true,
      }),
    ]).start(this.animationEnd);
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
        <View style={styles.svgHolder}>
          <View style={styles.textHolder}>
            <Text style={styles.text}>
              Building your{'\n'}
              exercise
            </Text>
          </View>
          <Svg height="100%" width="100%" style={styles.svg}>
            <G rotation="-90" origin={('160', '160')}>
              <AnimatedCircle
                cx="158"
                cy="162"
                r="160"
                stroke="#447d70"
                strokeWidth="2"
                fill="none"
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <AnimatedCircle
                cx="158"
                cy="162"
                r={this.animatedRadius}
                strokeWidth="0"
                fill={Colors.cornflowerBlue}
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <Circle
                cx="158"
                cy="162"
                r="85"
                strokeWidth="0"
                fill={'#1b1f37'}
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
            </G>
          </Svg>
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
  svgHolder: {
    height: 324,
    width: 324,
    marginBottom: 80,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  textHolder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 33,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
  },
});
