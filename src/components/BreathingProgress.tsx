import React, { useRef, useEffect } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { ScreenHeight, ScreenWidth } from "../helpers/constants";
import CenterContainer from "../components/CenterContainer";
import Svg, { Defs, Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);


const ShrinkRadius = ScreenWidth * .20;
const ExpandRadius = ScreenWidth * 0.40;
const ShrinkStrokeWidth = 2;
const ExpandStrokeWidth = 4;

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

interface Props {
  primaryColor: string;
  animationType: AnimationType | null;
  duration: number;
}

const AnimatedProgress: React.FC<Props> = ({ primaryColor, animationType, duration }: Props) => {
  const radius = ExpandRadius;
  const circunference = radius * 2 * Math.PI;

  const progressAnim = useRef(new Animated.Value(circunference)).current;
  const radiusAnim = useRef(new Animated.Value(ShrinkRadius)).current;
  const strokeWidthAnim = useRef(new Animated.Value(ShrinkStrokeWidth)).current;
  console.log('duration', duration);
  const expandCircle = () => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(radiusAnim, {
        toValue: ExpandRadius,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(strokeWidthAnim, {
        toValue: ExpandStrokeWidth,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();
  }
  console.log('circunference', circunference);
  const shrinkCircle = () => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: -circunference,
        duration: 4 * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(radiusAnim, {
        toValue: ShrinkRadius,
        duration: 4 * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(strokeWidthAnim, {
        toValue: ShrinkStrokeWidth,
        duration: 4 * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start(() => {
      progressAnim.setValue(circunference)
    });
  }

  useEffect(() => {
    if (animationType === AnimationType.ExpandCircle) {
      expandCircle()
      return;
    }
    if (animationType === AnimationType.ShrinkCircle) {
      shrinkCircle();
      return;
    }
  }, [animationType])


  return (

    <CenterContainer>

      <View
        style={{
          transform: [{ rotate: '-90deg' }],
          height: ScreenWidth * .8 + 10,
          width: ScreenWidth * .8 + 10,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'pink',
        }}
      >

        <Svg width={"100%"} height={'100%'}
          style={{
            flex: 1,
            // backgroundColor: 'yellow'
          }}
        >

          <AnimatedCircle
            stroke={primaryColor}
            fill="none"
            cy={'50%'}
            cx={'50%'}
            strokeWidth={strokeWidthAnim}
            r={radiusAnim}
            strokeDasharray={`${circunference} ${circunference}`}
            strokeDashoffset={progressAnim}
            strokeLinecap="round"
          />
        </Svg>

      </View>
    </CenterContainer>
  );
}

export default AnimatedProgress;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieFile: {
    height: ScreenWidth * .8,
    width: ScreenWidth * .8,
  },
});
