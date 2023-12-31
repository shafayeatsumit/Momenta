import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { BreathingState } from "../helpers/types";
import { FontType, Colors } from '../helpers/theme';
import BreathCounter from './BreathCounter';

interface Props {
  instructionText: string,
  count: number,
  totalBreathCount: number,
}

const BreathingInstructionText: React.FC<Props> = ({ instructionText, count, totalBreathCount }: Props) => {
  const showCount = (instructionText === "Hold" && count > 0)
  const showInstructionText = totalBreathCount < 3 && !showCount;

  return (
    <View style={styles.absoluteContainer}>
      <Text style={[styles.text]}>
        {/* {showCount ? count : instructionText} */}
        {showCount && count}
        {showInstructionText && instructionText}

      </Text>

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
    fontSize: 23,
    fontFamily: FontType.SemiBold,
    color: 'white',
  }
});

export default BreathingInstructionText;