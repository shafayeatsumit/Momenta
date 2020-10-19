import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {Colors, FontType} from '../../helpers/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CircleCircumference = 2 * Math.PI * 160;

const BreathingGameCircle = ({animatedRadius, animatedOffSet}) => (
  <View style={styles.container}>
    <View style={styles.svgHolder}>
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
            strokeDashoffset={animatedOffSet}
          />
          <AnimatedCircle
            cx="158"
            cy="162"
            r={animatedRadius}
            strokeWidth="0"
            fill={Colors.cornflowerBlue}
            strokeDasharray={CircleCircumference}
          />
          <Circle
            cx="158"
            cy="162"
            r="85"
            strokeWidth="0"
            fill={'#1b1f37'}
            strokeDasharray={CircleCircumference}
          />
        </G>
      </Svg>
    </View>
  </View>
);

export default BreathingGameCircle;

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
  },
  svg: {
    // marginBottom: 20,
  },
});
