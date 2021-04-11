import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { ScreenWidth } from '../../helpers/constants';
import Svg, { Rect, Circle } from "react-native-svg";
import moment from 'moment';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { registerPlaybackService } from 'react-native-track-player';
const AnimatedRect = Animated.createAnimatedComponent(Rect);
interface Props {
  duration: number;
  time: number;
  color: string;
  // showProgressBar?: boolean;
  progressOpacity?: any;
}

const progressbarWidth = ScreenWidth - 80;



const formatted = (secs: number) => moment.utc(secs * 1000).format('mm:ss');


const ProgressBar: React.FC<Props> = ({ duration, time, color, progressOpacity }: Props) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animateProgress = (width: number) => {
    Animated.timing(animatedWidth, {
      toValue: width,
      duration: 980,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  const getNewWidth = (time: number): number => {
    return (progressbarWidth * time) / duration;
  }

  useEffect(() => {
    const width = getNewWidth(time);
    if (width <= progressbarWidth) {
      animateProgress(width);
    }
  }, [time])
  const totalDuration = formatted(duration);
  const currentTime = formatted(time);
  const inProgress = totalDuration !== "00:00";
  return (
    <Animated.View style={[styles.container, progressOpacity ? { opacity: progressOpacity } : { opacity: 1 }]}>
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
      {inProgress &&
        <>
          <Text allowFontScaling={false} style={[styles.timeText, { left: -14 }]}> {currentTime}</Text>
          <Text allowFontScaling={false} style={[styles.timeText, { right: -14 }]}>{totalDuration}</Text>
        </>
      }


    </Animated.View>

  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
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
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
    fontWeight: '700',
    position: 'absolute',
    bottom: -35,
  }
});


export default ProgressBar;