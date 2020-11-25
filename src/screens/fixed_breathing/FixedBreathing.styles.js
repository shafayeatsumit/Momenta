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
  lottieFile: {
    alignSelf: 'center',
    height: 300,
    width: 300,
    marginBottom: 100,
  },
  centerText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    marginBottom: 100,
  },
  readyTextHolder: {
    alignItems: 'center',
  },
  readyToStart: {
    position: 'absolute',
    bottom: 30,
  },
  holdTimer: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: FontType.SemiBold,
    marginBottom: 100,
  },
  checkmark: {
    height: 300,
    width: 300,
  },
});

export default styles;
