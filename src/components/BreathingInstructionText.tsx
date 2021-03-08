import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { BreathingState } from "../helpers/types";
import { FontType, Colors } from '../helpers/theme';

interface Props {
  breathingState: BreathingState;
  exerciseNotStarted: boolean;

  breathCounter?: number;
  inhaleHoldTime?: number;
  exhaleHoldTime?: number;
}

const BreathingInstructionText: React.FC<Props> = ({ breathCounter, inhaleHoldTime, exhaleHoldTime, breathingState, exerciseNotStarted }: Props) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const getBreathingStateText = () => {


    const showInhaleHold = inhaleHoldTime ? breathCounter === inhaleHoldTime || breathCounter === inhaleHoldTime - 1 : false;
    const showExhaleHold = exhaleHoldTime ? breathCounter === exhaleHoldTime || breathCounter === exhaleHoldTime - 1 : false;


    switch (breathingState !== null) {
      case (breathingState === BreathingState.Inhale):
        return "Breath in"
      case (breathingState === BreathingState.Exhale):
        return "Breath out"
      case (breathingState === BreathingState.InhaleHold && showInhaleHold):
        return "Hold"
      case (breathingState === BreathingState.ExhaleHold && showExhaleHold):
        return "Hold"
      default:
        return ""
    }
  }
  useEffect(() => {
    if (!exerciseNotStarted) {
      Animated.timing(animatedProgress, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [exerciseNotStarted])
  return (
    <View style={styles.absoluteContainer}>
      <Animated.Text style={[styles.text, { opacity: animatedProgress }]}>
        {getBreathingStateText()}
      </Animated.Text>
    </View>
  );
}


const styles = StyleSheet.create({

  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  text: {
    fontSize: 20,
    fontFamily: FontType.Bold,
    color: 'white',
  }
});

export default BreathingInstructionText;