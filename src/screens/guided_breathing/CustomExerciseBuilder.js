import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';

import {connect} from 'react-redux';

import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Svg, {Circle, G} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleCircumference = 2 * Math.PI * 150;

class CustomExerciseBuilder extends Component {
  constructor(props) {
    super(props);
    this.animatedOffSet = new Animated.Value(CircleCircumference);
    this.animatedRadius = new Animated.Value(75);
  }

  startAnimation = (exhaleTime) => {
    Animated.parallel([
      Animated.timing(this.animatedOffSet, {
        toValue: 0,
        duration: exhaleTime,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: 148,
        duration: exhaleTime,
        useNativeDriver: true,
      }),
    ]).start(this.props.showBreathingGame);
  };

  componentDidMount() {
    const {calibrationExhale} = this.props.guidedBreathing;
    this.startAnimation(calibrationExhale);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const circleCircumference = 2 * Math.PI * 150;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Building your{'\n'}
          exercise
        </Text>

        <View style={styles.svgHolder}>
          <Svg height="100%" width="100%" style={styles.svg}>
            <G rotation="-90" origin={('150', '150')}>
              <AnimatedCircle
                cx="145"
                cy="155"
                r="150"
                stroke="#447d70"
                strokeWidth="2"
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <AnimatedCircle
                cx="145"
                cy="155"
                r={this.animatedRadius}
                strokeWidth="0"
                fill={Colors.cornflowerBlue}
                strokeDasharray={circleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <Circle
                cx="145"
                cy="155"
                r="75"
                strokeWidth="0"
                fill={'#13172f'}
                strokeDasharray={circleCircumference}
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
    height: 310,
    width: 310,
    marginBottom: 20,
    alignItems: 'center',
  },
  svg: {
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FontType.Medium,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
    paddingBottom: 12,
  },
});
