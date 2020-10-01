import React from 'react';
import {View, Text, Platform, StyleSheet} from 'react-native';
import {ScreenWidth} from '../helpers/constants';
import AnimatedProgress from './AnimatedProgress';

const twoDigitPadding = (num) => String(num).padStart(2, '0');

const ProgressTracker = ({currentTime, targetTime, showTimer}) => {
  const currentTimeMin = Math.floor(currentTime / 60);
  const currentTimeSec = currentTime % 60;
  let currentTimePercent = 100 - (100 * currentTime) / targetTime;
  const targetTimeMin = targetTime / 60;
  const targetTimeSec = targetTime % 60;
  currentTimePercent = currentTimePercent > 100 ? 100 : currentTimePercent;
  return (
    <View style={styles.container}>
      <AnimatedProgress value={currentTimePercent} width={ScreenWidth * 0.9} />
      {showTimer && (
        <View style={styles.timerContainer}>
          <Text style={styles.time}>
            {currentTimeMin}:{twoDigitPadding(currentTimeSec)}
          </Text>
        </View>
      )}
    </View>
  );
};
export default ProgressTracker;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingRight: 5,
  },
  time: {
    color: 'rgb(120,121,137)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
  targetTime: {
    // fontFamily: FontType.Medium,
    color: 'rgb(120,121,137)',
    lineHeight: 20,
    fontSize: 12,
    textAlign: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 3,
  },
});
