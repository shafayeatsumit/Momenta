import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ScreenWidth} from '../helpers/constants';
import {FontType} from '../helpers/theme';
import AnimatedProgress from './AnimatedProgress';

const twoDigitPadding = (num) => String(num).padStart(2, '0');

const ProgressTracker = ({
  currentTime,
  targetTime,
  showTimer,
  close,
  title,
}) => {
  const currentTimeMin = Math.floor(currentTime / 60);
  const currentTimeSec = currentTime % 60;
  let currentTimePercent = (100 * currentTime) / targetTime;
  const targetTimeMin = targetTime / 60;
  const targetTimeSec = targetTime % 60;
  currentTimePercent = currentTimePercent > 100 ? 100 : currentTimePercent;
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.closeHolder} onPress={close}>
          <Image
            source={require('../../assets/icons/close.png')}
            style={styles.close}
          />
        </TouchableOpacity>
        <View style={styles.titleHolder}>
          <Text allowFontScaling={false} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Text allowFontScaling={false} style={styles.time}>
            {currentTimeMin}:{twoDigitPadding(currentTimeSec)}
          </Text>
          <Text allowFontScaling={false} style={styles.time}>
            /{targetTimeMin}:{twoDigitPadding(targetTimeSec)}
          </Text>
        </View>
      </View>

      <AnimatedProgress value={currentTimePercent} width={ScreenWidth * 0.9} />
    </View>
  );
};
export default ProgressTracker;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
  },
  top: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  titleHolder: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  title: {
    color: 'white',
    fontSize: 15,
    fontFamily: FontType.Regular,
    width: '100%',
    textAlign: 'center',
    paddingRight: 5,
  },
  time: {
    color: 'rgb(120,121,137)',
    lineHeight: 20,
    fontSize: 14,
    fontFamily: FontType.Regular,
    textAlign: 'center',
  },
  closeHolder: {
    height: 60,
    width: 60,
    marginTop: -15,
    marginLeft: -10,
    zIndex: 10,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  close: {
    marginTop: -3,
    marginLeft: 13,
    height: 12,
    width: 12,
  },
});
