import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { ScreenWidth } from '../helpers/constants';
import Svg, { Rect, Circle } from "react-native-svg";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { registerPlaybackService } from 'react-native-track-player';
const AnimatedRect = Animated.createAnimatedComponent(Rect);
interface Props {
  duration: number;
  time: number;
  color: string;
  showProgressBar?: boolean;
}

const progressbarWidth = ScreenWidth - 80;
const twoDigitPadding = (num: number) => String(num).padStart(2, '0');

const ProgressBar: React.FC<Props> = ({ duration, time, color, showProgressBar }: Props) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const totalDuration = 60 * duration;
  const currentTimeMin = Math.floor(time / 60);
  const currentTimeSec = Math.round(time % 60);
  const targetTime = totalDuration;
  const targetTimeMin = targetTime / 60;
  const targetTimeSec = targetTime % 60;


  const animateProgress = (width: number) => {
    Animated.timing(animatedWidth, {
      toValue: width,
      duration: 980,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  const getNewWidth = (time: number): number => {
    return (progressbarWidth * time) / totalDuration;
  }

  useEffect(() => {
    const width = getNewWidth(time);
    if (width <= progressbarWidth) {
      animateProgress(width);
    }

  }, [time])


  return (
    <View style={[styles.container, showProgressBar ? { opacity: 1 } : { opacity: 0 }]}>
      <Svg height="100%" width="100%">
        <AnimatedRect
          x="0"
          y="0"
          width={animatedWidth}
          height="5"
          fill={color}
        />

      </Svg>
      <Animated.View style={[styles.circle, { backgroundColor: color, transform: [{ translateX: animatedWidth }] }]} />

      <Text allowFontScaling={false} style={[styles.timeText, { left: -14 }]}> {currentTimeMin}:{twoDigitPadding(currentTimeSec)}</Text>
      <Text allowFontScaling={false} style={[styles.timeText, { right: -14 }]}> {targetTimeMin}:{twoDigitPadding(targetTimeSec)}</Text>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 5,
    marginLeft: 40,
    width: progressbarWidth,
    // alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',

  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    marginTop: -10,
    marginLeft: -4,
  },
  timeText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 22,
    fontWeight: '800',
    position: 'absolute',
    top: 16,
  }
});


export default ProgressBar;