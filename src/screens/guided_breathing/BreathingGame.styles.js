import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  progressXoutHolder: {
    height: 120,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
  },
  circleHolder: {
    height: 150,
    width: 150,
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
    fontSize: 20,
    textAlign: 'center',
  },
  progressTrackerContainer: {
    position: 'absolute',
    top: 70,
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
  xoutHolder: {
    top: 0,
    paddingLeft: 10,
    width: 50,
    height: 60,
    justifyContent: 'center',
  },
  xout: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
});

export default styles;
