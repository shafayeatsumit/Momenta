import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { useTimer } from 'react-timer-hook';
import { FontType, Colors } from '../../helpers/theme';

interface Props {
  expiryTimestamp: any;
  onExpire: () => void;
}

const SleepTimer = ({ expiryTimestamp, onExpire }: Props) => {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => onExpire() });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{minutes}:{seconds}</Text>
    </View>
  )
}

export default SleepTimer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
  }
})