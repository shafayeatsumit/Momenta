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
  errorTextHolder: {
    height: 160,
    width: 160,
    justifyContent: 'center',
    marginBottom: 80,
  },
  centerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    marginBottom: 80,
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
  },
  errorHolder: {
    height: 140,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  // bottom
  initTextHolder: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: 160,
    width: ScreenWidth,
    // backgroundColor: 'red',
  },
  initTextBold: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  targetIcon: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    position: 'absolute',
    bottom: -110,
  },
  initText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
