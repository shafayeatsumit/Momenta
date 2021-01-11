import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { ScreenWidth } from '../helpers/constants';
import Svg, { Rect, Circle } from "react-native-svg";
const AnimatedRect = Animated.createAnimatedComponent(Rect);
interface Props {
  duration: number;
  time: number;
  color: string;
}

const ProgressBar: React.FC<Props> = ({ duration, time, color }: Props) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const totalDuration = 60 * duration;

  const animateProgress = (value: number) => {
    Animated.timing(animatedWidth, {
      toValue: value,
      duration: 980,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  const gerPrecentage = (time: number): number => {
    return (ScreenWidth * time) / totalDuration;
  }

  useEffect(() => {
    const percentage = gerPrecentage(time);
    animateProgress(percentage);
  }, [time])


  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <AnimatedRect
          x="0"
          y="0"
          width={animatedWidth}
          height="3"
          fill={color}
        />
      </Svg>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    width: ScreenWidth,
  },

});


export default ProgressBar;