import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {FontType} from '../helpers/theme';
import {RFValue} from '../helpers/responsiveFont';
const {interpolate, multiply} = Animated;
const {width} = Dimensions.get('window');
const size = width * 0.12;
const strokeWidth = RFValue(3);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const {PI} = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const FontSize = RFValue(12);
import {getProgress} from '../helpers/common';

const ProgressCircle = ({allContents, activeIndex}) => {
  const circumference = r * 2 * PI;
  const progressObject = getProgress(activeIndex, allContents);
  const progress = progressObject
    ? 1 - progressObject.currentIndex / progressObject.totalInTheSet
    : 1;
  const α = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, PI * 2],
  });
  const strokeDashoffset = multiply(α, r);
  const currentIndex = progressObject ? progressObject.currentIndex : 0;
  const totalInTheSet = progressObject ? progressObject.totalInTheSet : 0;
  return (
    <View style={styles.main}>
      <Svg width={size} height={size} style={styles.container}>
        <Circle
          stroke="rgba(255, 255, 255, 0.2)"
          fill="none"
          cx={cx}
          cy={cy}
          r={r}
          {...{strokeWidth}}
        />
        <AnimatedCircle
          stroke="white"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          cx={cx}
          cy={cy}
          r={r}
          {...{
            strokeDashoffset,
            strokeWidth,
          }}
        />
      </Svg>
      <Text style={styles.text}>
        {currentIndex}/{totalInTheSet}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
  },
  container: {
    transform: [{rotateZ: '270deg'}],
  },
  text: {
    position: 'absolute',
    top: size / 2 - FontSize / 1.5,
    color: 'white',
    fontSize: FontSize,
    fontFamily: FontType.Regular,
  },
});

export default ProgressCircle;
