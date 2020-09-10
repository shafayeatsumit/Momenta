import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../helpers/theme';
import {ScreenWidth} from '../helpers/constants';

const twoDigitPadding = (num) =>
  num.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

const ProgressLine = ({currentTime, targetTime}) => {
  const currentTimeMin = Math.floor(currentTime / 60);
  const currentTimeSec = currentTime % 60;
  let currentTimePercent = (100 * currentTime) / targetTime;
  const targetTimeMin = targetTime / 60;
  currentTimePercent = currentTimePercent > 100 ? 100 : currentTimePercent;
  return (
    <View style={styles.container}>
      <View style={[styles.progressLine, {width: `${currentTimePercent}%`}]} />
      <View style={styles.timerContainer}>
        <Text style={styles.time}>
          {twoDigitPadding(currentTimeMin)}:
          {twoDigitPadding(currentTimeSec.toFixed(0))}
        </Text>
        <Text style={styles.targetTime}>/{targetTimeMin.toFixed(2)}</Text>
      </View>
    </View>
  );
};
export default ProgressLine;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
  },
  progressLine: {
    height: 5,
    backgroundColor: Colors.buttonBlue,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingRight: 5,
  },
  time: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
  targetTime: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(120,121,137)',
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 3,
  },
});
