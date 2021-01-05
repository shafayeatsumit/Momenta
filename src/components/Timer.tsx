import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";

interface Props {
  time: number;
  exerciseDuration: number;
}

const twoDigitPadding = (num: number) => String(num).padStart(2, '0');

const Timer: React.FC<Props> = ({ time, exerciseDuration }) => {
  const currentTimeMin = Math.floor(time / 60);
  const currentTimeSec = time % 60;
  const targetTime = exerciseDuration * 60;
  const targetTimeMin = targetTime / 60;
  const targetTimeSec = targetTime % 60;
  return (
    <View style={styles.timer}>
      <Text style={styles.timeText}> {currentTimeMin}:{twoDigitPadding(currentTimeSec)} / {targetTimeMin}:{twoDigitPadding(targetTimeSec)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timer: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    height: 30,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  }

});

export default Timer;