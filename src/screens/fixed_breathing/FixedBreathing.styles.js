import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  progressXoutHolder: {
    marginTop: 20,
    height: 70,
  },
  topSpacer: {
    height: 20,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  holdTimerContainer: {
    position: 'absolute',
    top: 64,
  },
  holdTime: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
  textHolder: {
    height: 80,
    width: 270,
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
    marginTop: 40,
    paddingLeft: 15,
    width: 50,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 99,
  },
  xout: {
    height: 22,
    width: 22,
    tintColor: '#554f4f',
    zIndex: 10,
  },
  finishButton: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: 100,
    right: 30,
    zIndex: 5,
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  checkmarkHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  checkmark: {
    height: 300,
    width: 300,
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
});

export default styles;
