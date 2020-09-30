import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  circleHolder: {
    height: 220,
    width: 220,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: Colors.cornflowerBlue,
  },
  textHolder: {
    height: 50,
    width: 220,
    justifyContent: 'center',
  },
  centerText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
  progressTrackerContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  instructionTextHolder: {
    height: 80,
    width: 250,
    position: 'absolute',
    bottom: 10,
  },
  instructionText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
  },
});

export default styles;
