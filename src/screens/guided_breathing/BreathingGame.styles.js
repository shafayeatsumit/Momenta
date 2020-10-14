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
    height: 240,
    width: 240,
    borderRadius: 120,
    borderWidth: 0.8,
    borderColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#1b1f37',
    zIndex: 55,
  },
  circle: {
    backgroundColor: Colors.cornflowerBlue,
    height: 240,
    width: 240,
    borderRadius: 120,
  },
  textHolder: {
    height: 90,
    width: 270,
    justifyContent: 'center',
  },
  centerText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
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
    alignSelf: 'center',
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
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.35,
    // backgroundColor: 'yellow',
  },
});

export default styles;
