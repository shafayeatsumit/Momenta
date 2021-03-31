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

const BreathCounter: React.FC<Props> = ({ breathCounter, breathingState, inhaleHoldTime, exhaleHoldTime }: Props) => {
  const isShowBreathCounterVisible = () => {
    const showInhaleHoldCounter = breathCounter === inhaleHoldTime || breathCounter === inhaleHoldTime - 1;
    const showExhaleHoldCounter = breathCounter === exhaleHoldTime || breathCounter === exhaleHoldTime - 1;
    if (breathingState === BreathingState.Inhale) {
      return false
    }
    if (breathingState === BreathingState.Exhale) {
      return false
    }
    if (breathingState === BreathingState.InhaleHold && showInhaleHoldCounter) {
      return false
    }
    if (breathingState === BreathingState.ExhaleHold && showExhaleHoldCounter) {
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
          <Text allowFontScaling={false} style={styles.text}>{breathCounter}</Text>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: ScreenHeight / 2 - 13 + 35,
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