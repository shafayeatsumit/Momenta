import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { BreathingState } from "../helpers/types";
import { FontType, Colors } from '../helpers/theme';

interface Props {
  breathingState: BreathingState;
}

const BreathingInstructionText: React.FC<Props> = ({ breathingState }: Props) => {
  const getBreathingStateText = () => {
    switch (breathingState !== null) {
      case (breathingState === BreathingState.Inhale):
        return "Inhale"
      case (breathingState === BreathingState.Exhale):
        return "Exhale"
      case (breathingState === BreathingState.InhaleHold):
        return "Hold"
      case (breathingState === BreathingState.ExhaleHold):
        return "Hold"
      default:
        return ""
    }
  }

  return (
    <View style={styles.absoluteContainer}>
      <Text style={styles.text}>
        {getBreathingStateText()}
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
    fontSize: 20,
    fontFamily: FontType.Bold,
    color: 'white',
  }
});

export default BreathingInstructionText;