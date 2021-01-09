import React, { useRef, useEffect } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { ScreenHeight, ScreenWidth } from "../helpers/constants";
import CenterContainer from "../components/CenterContainer";
import Svg, { Defs, Circle } from "react-native-svg";
import { ExerciseState } from "../helpers/types";

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
  progress: {
    type: AnimationType | null;
    duration: number;
  }
  exerciseState: ExerciseState;
  exhaleEnd?: () => void;
  inhaleEnd?: () => void;
}

const AnimatedProgress: React.FC<Props> = ({ primaryColor, progress, exerciseState, exhaleEnd, inhaleEnd }: Props) => {
  const radius = ExpandRadius;
  const circumference = Math.round(radius * 2 * Math.PI);

  const progressAnim = useRef(new Animated.Value(circumference)).current;
  const radiusAnim = useRef(new Animated.Value(ShrinkRadius)).current;
  const strokeWidthAnim = useRef(new Animated.Value(ShrinkStrokeWidth)).current;

  const expandCircle = () => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: progress.duration * 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(radiusAnim, {
        toValue: ExpandRadius,
        duration: progress.duration * 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(strokeWidthAnim, {
        toValue: ExpandStrokeWidth,
        duration: progress.duration * 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start((resp) => {
      if (resp.finished && inhaleEnd) {
        inhaleEnd();
      }
    });
  }

  const shrinkCircle = () => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: -circumference / 2,
        duration: progress.duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(radiusAnim, {
        toValue: ShrinkRadius,
        duration: progress.duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(strokeWidthAnim, {
        toValue: ShrinkStrokeWidth,
        duration: progress.duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start((resp) => {
      if (resp.finished && exhaleEnd) {
        exhaleEnd();
      }
      progressAnim.setValue(circumference)

    });
  }

  useEffect(() => {
    if (progress.type === AnimationType.ExpandCircle) {
      expandCircle()
      return;
    }
    if (progress.type === AnimationType.ShrinkCircle) {
      shrinkCircle();
      return;
    }
  }, [progress])

  const resetAnimation = () => {
    Animated.timing(progressAnim).stop()
    Animated.timing(radiusAnim).stop()
    Animated.timing(strokeWidthAnim).stop()

    progressAnim.setValue(circumference);
    radiusAnim.setValue(ShrinkRadius)
    strokeWidthAnim.setValue(ShrinkStrokeWidth)
  }

  useEffect(() => {
    if (exerciseState === ExerciseState.Paused) {
      resetAnimation();
    }

  }, [exerciseState])

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
            strokeDasharray={`${circumference} ${circumference}`}
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
