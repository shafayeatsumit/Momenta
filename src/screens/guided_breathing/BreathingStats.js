import React from 'react';
import {FontType} from '../../helpers/theme';
import {ScreenWidth} from '../../helpers/constants';
import {View, Text, StyleSheet} from 'react-native';

const BreathingStats = ({
  calibrationInhale,
  calibrationExhale,
  finalInhaleTime,
  finalExhaleTime,
}) => {
  const totalCalibration = calibrationInhale + calibrationExhale;
  const calibrationResult = (60 / totalCalibration).toFixed(1);
  const finalResult = (60 / (finalInhaleTime + finalExhaleTime)).toFixed(1);
  const getTwoDecimalValue = (val) => (isNaN(val) ? 0 : val.toFixed(2));
  return (
    <View style={styles.resultContainer}>
      <View style={styles.resultTextHolder}>
        <Text style={styles.text}>
          {calibrationResult}
          <Text style={styles.textSm}> breaths/min</Text>
        </Text>
        <Text style={styles.text}>
          Inhale {getTwoDecimalValue(calibrationInhale)}{' '}
          <Text style={styles.textSm}>s</Text>{' '}
        </Text>
        <Text style={styles.text}>
          Exhale {getTwoDecimalValue(calibrationExhale)}
          <Text style={styles.textSm}>s</Text>
        </Text>
      </View>
      <View style={styles.resultTextHolder}>
        <Text style={styles.text}>
          {isFinite(finalResult) ? finalResult : 0}
          <Text style={styles.textSm}> breaths/min</Text>
        </Text>
        <Text style={styles.text}>
          Inhale {getTwoDecimalValue(finalInhaleTime)}
          <Text style={styles.textSm}>s</Text>
        </Text>
        <Text style={styles.text}>
          Exhale {getTwoDecimalValue(finalExhaleTime)}
          <Text style={styles.textSm}>s</Text>
        </Text>
      </View>
    </View>
  );
};
export default BreathingStats;

const styles = StyleSheet.create({
  resultContainer: {
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 30,
    // backgroundColor: 'yellow',
  },
  resultTextHolder: {
    flex: 1,
    marginLeft: 20,
  },
  text: {
    fontFamily: FontType.SemiBold,
    fontSize: 14,
    color: 'white',
  },
  textSm: {
    fontFamily: FontType.SemiBold,
    fontSize: 11,
    color: 'white',
    paddingTop: 3,
  },
});
