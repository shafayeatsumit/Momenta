import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeight } from "../helpers/constants";
import { FontType } from "../helpers/theme";
import { BreathingState } from "../helpers/types";

interface Props {
  breathCounter: number;
  breathingState: BreathingState;
  inhaleTime: number;
  exhaleTime: number;
  inhaleHoldTime: number;
  exhaleHoldTime: number;
}

const BreathCounter: React.FC<Props> = ({ breathCounter, breathingState, inhaleTime, exhaleTime, inhaleHoldTime, exhaleHoldTime }: Props) => {
  const isShowBreathCounterVisible = () => {
    if (breathingState === BreathingState.Inhale && breathCounter === inhaleTime) {
      return false
    }
    if (breathingState === BreathingState.Exhale && breathCounter === exhaleTime) {
      return false
    }
    if (breathingState === BreathingState.InhaleHold && breathCounter === inhaleHoldTime) {
      return false
    }
    if (breathingState === BreathingState.ExhaleHold && breathCounter === exhaleHoldTime) {
      return false;
    }
    if (breathingState === BreathingState.NotStarted) {
      return false;
    }
    if (breathCounter === 0) {
      return false
    }
    return true;
  }

  const breathCounterVisible = isShowBreathCounterVisible();

  return (
    <>
      {breathCounterVisible &&
        <View style={styles.container}>
          <Text style={styles.text}>{breathCounter}</Text>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: ScreenHeight / 2 + 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontFamily: FontType.Bold,
    color: 'white',
    zIndex: 5,
  }

});


export default BreathCounter;