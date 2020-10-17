import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {Colors, FontType} from '../../helpers/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CircleCircumference = 2 * Math.PI * 150;

const BreathingGameCircle = ({animatedRadius}) => (
  <View style={styles.container}>
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
          />
          <AnimatedCircle
            cx="145"
            cy="155"
            r={animatedRadius}
            strokeWidth="0"
            fill={Colors.cornflowerBlue}
            strokeDasharray={CircleCircumference}
            strokeDashoffset={this.animatedOffSet}
          />
          <Circle cx="145" cy="155" r="75" strokeWidth="0" fill={'#1b1f37'} />
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
    height: 310,
    width: 310,
    marginBottom: 20,
    alignItems: 'center',
  },
  svg: {
    marginBottom: 20,
  },
});
