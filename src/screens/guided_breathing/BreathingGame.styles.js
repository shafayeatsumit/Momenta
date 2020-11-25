import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
  },
  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: -10,
  },
  readyTextHolder: {
    alignItems: 'center',
  },
  readyToStart: {
    position: 'absolute',
    bottom: 30,
    fontSize: 20,
  },
  holdTimer: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: FontType.SemiBold,
    marginBottom: 100,
  },
  lottieFile: {
    alignSelf: 'center',
    height: 300,
    width: 300,
    marginBottom: 100,
  },
  centerText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    marginBottom: 100,
  },
  countDownTimer: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: FontType.SemiBold,
    marginBottom: 100,
  },
});

export default styles;
